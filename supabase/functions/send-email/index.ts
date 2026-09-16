import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { describeResendError, resendApiKey, resendSender } from "../_shared/resend.ts";
import { isAdminUser } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  task_id?: string;
}

/** Ошибка запроса с кодом ответа. */
class RequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Письмо собирается только из отчёта по своей задаче. Раньше функция
    // принимала готовый html и любой адрес: пока отправитель был тестовым,
    // письма никуда не доходили, но с настоящим доменом (RESEND_FROM) любой
    // зарегистрированный мог бы рассылать что угодно от имени сервиса.
    const { to, subject, task_id }: EmailRequest = await req.json();

    if (!to || !subject) {
      throw new RequestError('Email and subject are required', 400);
    }

    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(String(to))) {
      throw new RequestError('Invalid recipient email', 400);
    }

    // Адресат — только почта самого пользователя. Даже письмо из готового
    // шаблона с чужим адресом в поле «кому» — это рассылка от имени сервиса
    // на любые адреса: так портится репутация домена отправителя. Другим
    // адресатам пишет только администратор.
    const isAdmin = await isAdminUser(user.id);
    const ownEmail = (user.email ?? '').trim().toLowerCase();
    const recipient = String(to).trim().toLowerCase();
    if (!isAdmin && (!ownEmail || recipient !== ownEmail)) {
      throw new RequestError('Письмо можно отправить только на адрес вашего аккаунта', 403);
    }

    // Проверка отправки из админки (/admin/system/email) приходит без задачи.
    // После того как функция перестала принимать готовый html, эта проверка
    // падала на «task_id is required». Теперь без задачи уходит фиксированное
    // тестовое письмо — и только по запросу администратора.
    if (!task_id && !isAdmin) {
      throw new RequestError('Email, subject and task_id are required', 400);
    }

    // Отправитель — из секрета RESEND_FROM: тестовый onboarding@resend.dev
    // доставляет письма только владельцу аккаунта Resend.
    const RESEND_API_KEY = resendApiKey();
    const from = resendSender();

    console.log(`Sending email to ${to} with subject: ${subject}`);

    if (!task_id) {
      const testText = 'Это тестовое письмо из админки SeoMarket. Если оно пришло, отправка писем работает.';
      return await sendViaResend(RESEND_API_KEY, {
        from,
        to: String(to).trim(),
        subject: String(subject).slice(0, 200),
        html: `<p>${escapeHtml(testText)}</p>`,
        text: testText,
      });
    }

    // Задача и результаты читаются ключом пользователя: чужой отчёт RLS не отдаст.
    const { data: task } = await supabaseClient
      .from('audit_tasks')
      .select('url, user_id')
      .eq('id', task_id)
      .maybeSingle();

    if (!task || (task.user_id !== user.id && !isAdmin)) {
      throw new RequestError('Task not found', 404);
    }

    const { data: result } = await supabaseClient
      .from('audit_results')
      .select('score, page_count, issues_by_severity')
      .eq('task_id', task_id)
      .maybeSingle();

    if (!result) {
      throw new RequestError('Audit results not found', 404);
    }

    // Раньше число замечаний бралось из issues_count.critical — такого поля
    // нет, и в письме всегда стоял ноль. Счётчики по важности лежат в
    // issues_by_severity.
    const severity = (result.issues_by_severity ?? {}) as Record<string, unknown>;
    const critical = Number(severity.critical) || 0;
    const important = Number(severity.important) || 0;
    const score = result.score ?? 'N/A';
    const pageCount = Number(result.page_count) || 0;

    const emailHtml = `
        <h1>SEO Audit Report</h1>
        <p>Your SEO audit for <strong>${escapeHtml(task.url)}</strong> is complete!</p>
        <h2>Results Summary:</h2>
        <ul>
          <li>Overall Score: ${escapeHtml(score)}/100</li>
          <li>Pages Analyzed: ${pageCount}</li>
          <li>Critical Issues: ${critical}</li>
          <li>Important Issues: ${important}</li>
        </ul>
        <p>Log in to your account to view the full report and recommendations.</p>
      `;

    const emailText = `SEO Audit Report\n\nYour SEO audit for ${task.url} is complete!\n\nOverall Score: ${score}/100\nPages Analyzed: ${pageCount}\nCritical Issues: ${critical}\nImportant Issues: ${important}`;

    return await sendViaResend(RESEND_API_KEY, {
      from,
      to: String(to).trim(),
      subject: String(subject).slice(0, 200),
      html: emailHtml,
      text: emailText,
    });
  } catch (error) {
    console.error('Error in send-email:', error);
    const message = error instanceof Error ? error.message : String(error);
    const status = error instanceof RequestError
      ? error.status
      : message === 'Unauthorized' ? 401 : 500;
    
    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    );
  }
});

/** Отправка через Resend; успех — только по ответу Resend. */
async function sendViaResend(
  apiKey: string,
  email: { from: string; to: string; subject: string; html: string; text: string },
): Promise<Response> {
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: email.from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!emailResponse.ok) {
    const errorData = await emailResponse.text();
    console.error('Resend API error:', emailResponse.status, errorData);
    throw new Error(describeResendError(emailResponse.status, errorData));
  }

  const emailData = await emailResponse.json();

  return new Response(
    JSON.stringify({
      success: true,
      message_id: emailData.id,
      message: 'Email sent successfully',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}
