import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { generateText } from '../_shared/llm.ts';
import { assertServiceRole, authErrorResponse } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  user_id: string;
  task_id: string;
  type: 'audit_completed' | 'optimization_completed' | 'marketing' | 'system';
  audit_data?: {
    url: string;
    score?: number;
    seo_score?: number;
    pages_scanned?: number;
    issues_count?: number;
  };
}

/**
 * JSON из ответа модели. Модели любят обрамлять ответ пояснениями или блоком
 * ```json — вытаскиваем сам объект, чтобы уведомление не срывалось из-за оформления.
 */
export function parseNotificationJson(text: string): { title: string; message: string } {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  const candidate = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;

  const parsed = JSON.parse(candidate);
  if (typeof parsed?.title !== 'string' || typeof parsed?.message !== 'string') {
    throw new Error('в ответе модели нет полей title и message');
  }
  return { title: parsed.title, message: parsed.message };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Called server-to-server by scoring-processor; also uses the AI gateway.
  // Restrict to service-role callers so it can't be abused to spam users or
  // burn AI credits.
  try {
    assertServiceRole(req);
  } catch (err) {
    const resp = authErrorResponse(err, corsHeaders);
    if (resp) return resp;
    throw err;
  }

  try {
    const { user_id, task_id, type, audit_data }: NotificationRequest = await req.json();

    if (!user_id || !task_id || !type) {
      throw new Error('Missing required fields: user_id, task_id, type');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Настройки уведомлений пользователя
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('notify_audit_completed, notify_optimization, notify_marketing')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Запись в кабинете решают только флаги по типу события. Раньше её ещё
    // отключал флаг email_notifications, хотя писем функция не отправляет
    // (email_sent: false): человек выключал «письма» и терял уведомления в
    // кабинете. Пока письма не отправляются, флаг писем в решении не участвует.
    // Пустое значение флага считаем включённым — как значение по умолчанию в
    // таблице и в настройках кабинета.
    const notificationEnabled =
      (type === 'audit_completed' && profile?.notify_audit_completed !== false) ||
      (type === 'optimization_completed' && profile?.notify_optimization !== false) ||
      (type === 'marketing' && profile?.notify_marketing === true) ||
      (type === 'system');

    if (!notificationEnabled) {
      console.log(`Notifications disabled for user ${user_id}, type ${type}`);
      return new Response(
        JSON.stringify({ success: true, notification_created: false, reason: 'disabled' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate notification content using the Anthropic API (Claude)
    console.log('Generating notification with Claude...');

    const aiPrompt = type === 'audit_completed' 
      ? `Создай краткое SEO-уведомление о завершении аудита сайта ${audit_data?.url || 'неизвестен'}. 
         Общий балл: ${audit_data?.score || 'N/A'}/100, SEO балл: ${audit_data?.seo_score || 'N/A'}/100.
         Проверено страниц: ${audit_data?.pages_scanned || 0}. Найдено проблем: ${audit_data?.issues_count || 0}.
         
         Верни JSON в формате:
         {
           "title": "краткий заголовок до 50 символов",
           "message": "дружелюбное сообщение до 200 символов с основными результатами"
         }
         
         Тон: профессиональный, позитивный, мотивирующий.`
      : `Создай уведомление о событии типа ${type}`;

    let notificationContent: { title: string; message: string };
    try {
      // Формат задаём словами: единого способа требовать JSON у разных
      // поставщиков нет, а ответ всё равно разбирается ниже с запасом.
      const { text } = await generateText({
        system: 'Ты — помощник для создания SEO-уведомлений. Отвечай строго объектом JSON '
          + 'с полями "title" и "message", без пояснений и без markdown.',
        prompt: aiPrompt,
        maxTokens: 1024,
      });
      notificationContent = parseNotificationJson(text);
    } catch (aiError) {
      // Notification delivery must not fail because of the AI call — fall back to a template.
      console.error('AI notification generation failed:', aiError);
      notificationContent = {
        title: `Аудит завершен: ${audit_data?.url || 'сайт'}`,
        message: `Проверка завершена! Общий балл: ${audit_data?.score || 'N/A'}/100. Проверено страниц: ${audit_data?.pages_scanned || 0}.`,
      };
    }

    console.log('Generated notification:', notificationContent);

    // Create notification in database
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        task_id,
        type,
        title: notificationContent.title,
        message: notificationContent.message,
        data: audit_data,
        read: false,
        email_sent: false,
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      throw notificationError;
    }

    console.log('Notification created:', notification.id);

    return new Response(
      JSON.stringify({
        success: true,
        notification_created: true,
        notification_id: notification.id,
        content: notificationContent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Create notification error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
