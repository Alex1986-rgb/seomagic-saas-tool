import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    // Check user notification preferences
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, email_notifications, notify_audit_completed, notify_optimization, notify_marketing')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Check if notifications are enabled for this type
    const notificationEnabled = profile?.email_notifications && (
      (type === 'audit_completed' && profile.notify_audit_completed) ||
      (type === 'optimization_completed' && profile.notify_optimization) ||
      (type === 'marketing' && profile.notify_marketing) ||
      (type === 'system')
    );

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

    // Generate notification content using Lovable AI
    console.log('Generating notification with Lovable AI...');
    
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

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Ты - помощник для создания SEO-уведомлений. Отвечай только валидным JSON без markdown.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_notification',
              description: 'Create notification text',
              parameters: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  message: { type: 'string' }
                },
                required: ['title', 'message'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'create_notification' } }
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      throw new Error(`AI API failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const notificationContent = toolCall 
      ? JSON.parse(toolCall.function.arguments)
      : {
          title: `Аудит завершен: ${audit_data?.url || 'сайт'}`,
          message: `Проверка завершена! Общий балл: ${audit_data?.score || 'N/A'}/100. Проверено страниц: ${audit_data?.pages_scanned || 0}.`
        };

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
