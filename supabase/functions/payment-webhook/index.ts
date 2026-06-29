import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Колбэк провайдера оплаты → помечаем заказ оплаченным.
// ЮKassa: уведомление {event, object:{id,status,metadata}}.
// Тестовый путь (без провайдера): {orderId, secret} === PAYMENT_TEST_SECRET — чтобы прогнать воронку до подключения провайдера.
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const body = await req.json();

    // 1) Тестовая отметка оплаты (только при заданном секрете и совпадении)
    const testSecret = Deno.env.get('PAYMENT_TEST_SECRET');
    if (body.orderId && body.secret && testSecret && body.secret === testSecret) {
      const { error } = await supabase.from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', body.orderId).eq('status', 'pending');
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, marked: body.orderId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    // 2) ЮKassa-уведомление
    const obj = body.object;
    if (obj && obj.id) {
      const ok = body.event === 'payment.succeeded' || obj.status === 'succeeded';
      const newStatus = ok ? 'paid' : (obj.status === 'canceled' ? 'canceled' : 'failed');
      const patch: Record<string, unknown> = { status: newStatus };
      if (ok) patch.paid_at = new Date().toISOString();
      // ищем заказ по provider_payment_id или metadata.order_id
      const orderId = obj.metadata?.order_id;
      const q = supabase.from('orders').update(patch);
      const { error } = orderId ? await q.eq('id', orderId) : await q.eq('provider_payment_id', obj.id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    return new Response(JSON.stringify({ success: false, error: 'Неизвестный формат уведомления' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
  } catch (error) {
    console.error('payment-webhook error:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
