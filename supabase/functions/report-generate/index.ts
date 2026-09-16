import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { assertTaskAccess, AuthError } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Отчёт по аудиту в JSON или XML.
 *
 * Что было не так:
 *   * файл загружался в бакет 'reports' и запись в pdf_reports вставлялась
 *     клиентом пользователя (ключ anon), а политик на запись у бакета и таблицы
 *     нет — отчёт не создавался, функция падала с 500;
 *   * доступ к задаче не проверялся: чей аудит, решали только политики чтения;
 *   * адрес сайта вставлялся в XML без экранирования — «&» в адресе ломал файл.
 * Теперь доступ к задаче проверяет assertTaskAccess (своя задача, гостевая или
 * любая для администратора — как в RLS), а читает, пишет файл и запись служебный
 * клиент. Хозяин записи — хозяин задачи (у гостевой задачи его нет).
 */

/** Ошибка запроса с кодом ответа. */
class RequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const escapeXml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

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

    // Скачать отчёт (report-download) можно только после входа — без входа
    // создавать файл, который потом не забрать, незачем.
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { task_id, format } = await req.json();

    if (!task_id || !format) {
      throw new RequestError('task_id and format are required', 400);
    }

    if (format !== 'json' && format !== 'xml') {
      throw new RequestError('Unsupported format. Use json or xml', 400);
    }

    // Своя задача, гостевая или любая для администратора.
    await assertTaskAccess(req, task_id);

    console.log(`Generating ${format} report for task: ${task_id}`);

    // Доступ проверен — дальше служебным ключом: записывать в бакет и в
    // pdf_reports пользователю напрямую нельзя.
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: task, error: taskError } = await serviceClient
      .from('audit_tasks')
      .select('url, user_id')
      .eq('id', task_id)
      .maybeSingle();

    if (taskError || !task) {
      throw new RequestError('Task not found', 404);
    }

    const { data: auditResult, error: auditError } = await serviceClient
      .from('audit_results')
      .select('score, page_count, issues_count, audit_data, created_at')
      .eq('task_id', task_id)
      .maybeSingle();

    if (auditError || !auditResult) {
      throw new RequestError('Audit results not found', 404);
    }

    let reportContent: string;
    let contentType: string;
    let filename: string;

    if (format === 'json') {
      reportContent = JSON.stringify({
        task_id,
        url: task.url,
        score: auditResult.score,
        page_count: auditResult.page_count,
        issues_count: auditResult.issues_count,
        audit_data: auditResult.audit_data,
        created_at: auditResult.created_at,
      }, null, 2);
      contentType = 'application/json';
      filename = `seo-report-${task_id}.json`;
    } else {
      reportContent = `<?xml version="1.0" encoding="UTF-8"?>
<seo_report>
  <task_id>${escapeXml(task_id)}</task_id>
  <url>${escapeXml(task.url)}</url>
  <score>${escapeXml(auditResult.score)}</score>
  <page_count>${escapeXml(auditResult.page_count)}</page_count>
  <created_at>${escapeXml(auditResult.created_at)}</created_at>
</seo_report>`;
      contentType = 'application/xml';
      filename = `seo-report-${task_id}.xml`;
    }

    const { data: uploadData, error: uploadError } = await serviceClient.storage
      .from('reports')
      .upload(filename, reportContent, {
        contentType,
        upsert: true,
      });

    if (uploadError || !uploadData) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to save report');
    }

    const { data: report, error: reportError } = await serviceClient
      .from('pdf_reports')
      .insert({
        task_id,
        url: task.url,
        file_path: uploadData.path,
        // Размер в байтах, а не в символах: кириллица занимает по два байта.
        file_size: new TextEncoder().encode(reportContent).length,
        user_id: task.user_id,
      })
      .select('id')
      .single();

    if (reportError || !report) {
      console.error('pdf_reports insert error:', reportError);
      throw new Error('Failed to record report');
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        storage_path: uploadData.path,
        message: 'Report generated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in report-generate:', error);
    const message = error instanceof Error ? error.message : String(error);
    const status = error instanceof AuthError || error instanceof RequestError
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
