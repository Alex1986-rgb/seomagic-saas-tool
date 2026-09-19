import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';
import { AuthError, authErrorResponse, resolveCaller } from '../_shared/auth.ts';
import { describeResendError, EmailConfigError, resendApiKey, resendSender } from '../_shared/resend.ts';

/** Ограничение на письмо: рассылка со сметой — не список рассылки. */
const MAX_RECIPIENTS = 5;
/** Сколько писем со сметой пользователь может отправить за час. */
const MAX_SENDS_PER_HOUR = 10;
/** Больше строк в смете не бывает; всё сверх — не смета, а попытка забить письмо. */
const MAX_ESTIMATE_ROWS = 500;

/**
 * Адрес сайта для ссылки на смету.
 *
 * Раньше адрес брался из заголовка Origin — его подставляет кто угодно, и
 * кнопка «Просмотреть смету» в письме от нашего имени могла вести на чужой
 * сайт. Кроме того, сайт живёт на подпути /seomagic-saas-tool/, и ссылка от
 * корня домена давала 404. Теперь адрес задаёт секрет SITE_URL.
 */
const DEFAULT_SITE_URL = 'https://alex1986-rgb.github.io/seomagic-saas-tool';

/** Всё, что пришло от пользователя, попадает в письмо как текст, не как разметка. */
const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

class BadRequestError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

interface EmailEstimateRequest {
  to_emails: string[];
  estimate_data: any[];
  totals: {
    subtotal: number;
    discount: number;
    final: number;
  };
  url: string;
  message?: string;
  attach_pdf?: boolean;
  attach_excel?: boolean;
  create_public_link?: boolean;
}

/**
 * Число из запроса. Пусто — `null`; что-то, что числом не является, — ошибка
 * запроса. Раньше строка вида «<a href=…>» проходила в письмо как есть:
 * `toLocaleString` у строки возвращает её саму, а `+=` склеивал строки.
 */
function readNumber(value: unknown, field: string): number | null {
  if (value === undefined || value === null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (typeof value === 'boolean' || !Number.isFinite(n) || n < 0) {
    throw new BadRequestError(`Неверное значение в смете: ${field}`);
  }
  return n;
}

function formatRub(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

function siteBaseUrl(): string {
  const raw = (Deno.env.get('SITE_URL') ?? '').trim() || DEFAULT_SITE_URL;
  // Базовый адрес со слэшем на конце, иначе подпуть съедается при сборке ссылки.
  return raw.endsWith('/') ? raw : `${raw}/`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();

  try {
    console.log('Sending estimate email...');

    // Функция отправляет письма нашим ключом Resend. Без входа она была
    // открытым ретранслятором: любой мог слать что угодно куда угодно от имени
    // сервиса.
    const caller = await resolveCaller(req);
    if (!caller.isService && !caller.userId) {
      throw new AuthError('Отправка сметы доступна после входа', 401);
    }

    const {
      to_emails,
      estimate_data,
      totals,
      url,
      message,
      create_public_link
    } = await req.json() as EmailEstimateRequest;

    // Validate inputs
    if (!Array.isArray(to_emails) || to_emails.length === 0) {
      throw new BadRequestError('No recipient emails provided');
    }

    if (to_emails.length > MAX_RECIPIENTS) {
      throw new BadRequestError(`За раз смету можно отправить не более чем на ${MAX_RECIPIENTS} адресов`);
    }

    const badAddress = to_emails.find((address) => !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(String(address)));
    if (badAddress) {
      throw new BadRequestError(`Неверный адрес получателя: ${badAddress}`);
    }

    if (!Array.isArray(estimate_data) || estimate_data.length > MAX_ESTIMATE_ROWS) {
      throw new BadRequestError('Неверные данные сметы');
    }

    const finalTotal = readNumber(totals?.final, 'итог');
    if (finalTotal === null) {
      throw new BadRequestError('В смете нет итоговой суммы');
    }

    // Настройку почты проверяем до того, как создавать публичную ссылку:
    // иначе при неотправленном письме оставалась бы лишняя ссылка на смету.
    const from = resendSender();
    const apiKey = resendApiKey();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Лимит на пользователя: пять адресов за раз не мешали слать письмо за
    // письмом. Считаем по журналу вызовов.
    if (caller.userId) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count, error: countError } = await supabase
        .from('api_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', caller.userId)
        .eq('function_name', 'send-estimate-email')
        .gte('created_at', hourAgo);

      if (countError) {
        console.error('Не удалось проверить лимит отправки:', countError.message);
      } else if ((count ?? 0) >= MAX_SENDS_PER_HOUR) {
        throw new BadRequestError('Слишком много писем со сметой за час. Попробуйте позже', 429);
      }
    }

    // Сводка по категориям — только из чисел, прошедших проверку.
    const categoryTotals: Record<string, { count: number; cost: number }> = {};
    estimate_data.forEach((item: any, index: number) => {
      const category = String(item?.category ?? 'Другое').slice(0, 200);
      const count = readNumber(item?.count, `строка ${index + 1}, количество`) ?? 0;
      const totalPrice = readNumber(item?.totalPrice, `строка ${index + 1}, сумма`);
      const unitCost = readNumber(item?.cost, `строка ${index + 1}, цена`);
      const cost = totalPrice ?? (unitCost ?? 0) * count;

      if (!categoryTotals[category]) {
        categoryTotals[category] = { count: 0, cost: 0 };
      }
      categoryTotals[category].count += count;
      categoryTotals[category].cost += cost;
    });

    // Create public link if requested
    let publicLink = '';
    if (create_public_link && caller.userId) {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: shareData, error: shareError } = await supabase
        .from('shared_estimates')
        .insert({
          user_id: caller.userId,
          estimate_data,
          totals,
          url,
          expires_at: expiresAt
        })
        .select('share_token')
        .single();

      if (shareError) {
        console.error('Не удалось создать публичную ссылку на смету:', shareError.message);
      }

      if (shareData?.share_token) {
        publicLink = new URL(
          `shared-estimate/${encodeURIComponent(String(shareData.share_token))}`,
          siteBaseUrl(),
        ).toString();
      }
    }

    // Build HTML email
    const categoryRows = Object.entries(categoryTotals)
      .map(([category, data]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(category)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${escapeHtml(data.count.toLocaleString('ru-RU'))}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${escapeHtml(formatRub(data.cost))}
          </td>
        </tr>
      `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .total-row { background: #f9fafb; font-weight: bold; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Смета на SEO-оптимизацию</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Сайт: ${escapeHtml(url)}</p>
            </div>

            <div class="content">
              ${message ? `<p style="margin-bottom: 20px;">${escapeHtml(message)}</p>` : ''}

              <h2 style="margin: 20px 0 10px 0;">Работы по категориям</h2>
              <table>
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Категория</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Работ</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Стоимость</th>
                  </tr>
                </thead>
                <tbody>
                  ${categoryRows}
                  <tr class="total-row">
                    <td colspan="2" style="padding: 12px;">Итого:</td>
                    <td style="padding: 12px; text-align: right; font-size: 18px; color: #667eea;">
                      ${escapeHtml(formatRub(finalTotal))}
                    </td>
                  </tr>
                </tbody>
              </table>

              ${publicLink ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${escapeHtml(publicLink)}" class="button">
                    📊 Просмотреть детальную смету онлайн
                  </a>
                </div>
              ` : ''}

              <div class="footer">
                <p>Создано в SEO Audit Tool</p>
                <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the estimate to every recipient via Resend.
    const subject = `Смета на SEO-продвижение — ${String(url ?? '').slice(0, 120)}`;
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to_emails,
        subject,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', emailResponse.status, errorData);
      throw new Error(describeResendError(emailResponse.status, errorData));
    }

    const emailData = await emailResponse.json();
    console.log('Estimate email sent:', emailData?.id, 'recipients:', to_emails.length);

    if (caller.userId) {
      const { error: logError } = await supabase.from('api_logs').insert({
        user_id: caller.userId,
        function_name: 'send-estimate-email',
        request_data: { recipients: to_emails.length, public_link: !!publicLink },
        response_data: { email_id: emailData?.id ?? null },
        status_code: 200,
        duration_ms: Date.now() - startedAt,
      });
      if (logError) {
        console.error('Не удалось записать отправку в журнал:', logError.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        recipients: to_emails.length,
        email_id: emailData?.id ?? null,
        public_link: publicLink || null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error sending estimate email:', error);
    const denied = authErrorResponse(error, corsHeaders);
    if (denied) return denied;

    const status = error instanceof BadRequestError
      ? error.status
      : error instanceof EmailConfigError ? 503 : 500;

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
      }
    );
  }
});
