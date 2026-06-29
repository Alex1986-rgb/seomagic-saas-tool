import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    // Базовая валидация на сервере
    const errors: string[] = [];
    if (!name || name.trim().length < 2) errors.push('Некорректное имя');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('Некорректный email');
    if (!subject || subject.trim().length < 5) errors.push('Слишком короткая тема');
    if (!message || message.trim().length < 10) errors.push('Слишком короткое сообщение');
    if (errors.length) {
      return new Response(JSON.stringify({ success: false, error: errors.join('; ') }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    // service_role для записи независимо от RLS-чтения
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })
      .select('id')
      .single();

    if (error) throw error;

    // Опционально: уведомление на почту владельца, если настроен Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const NOTIFY_TO = Deno.env.get('CONTACT_NOTIFY_EMAIL');
    if (RESEND_API_KEY && NOTIFY_TO) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'SeoMarket <onboarding@resend.dev>',
            to: [NOTIFY_TO],
            subject: `Новое обращение: ${subject}`,
            html: `<p><b>${name}</b> (${email})</p><p><b>Тема:</b> ${subject}</p><p>${message}</p>`,
          }),
        });
      } catch (_) { /* не валим обращение, если письмо не ушло */ }
    }

    return new Response(JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('contact-submit error:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
