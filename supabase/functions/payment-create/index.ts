import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Рыночные цены (₽/страница). Сумма считается ЗДЕСЬ, на сервере — клиент её не задаёт.
const OPT_PER_PAGE = Number(Deno.env.get('PRICE_OPT_PER_PAGE') ?? 120);
const TEXT_PER_PAGE = Number(Deno.env.get('PRICE_TEXT_PER_PAGE') ?? 250);

function calcAmount(service: string, pages: number): number {
  const p = Math.max(0, Math.floor(pages || 0));
  if (service === 'fix') return OPT_PER_PAGE * p;
  if (service === 'seo-text') return TEXT_PER_PAGE * p;
  return (OPT_PER_PAGE + TEXT_PER_PAGE) * p; // full — под ключ
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const url = String(body.url || '').trim();
    const service = ['full', 'fix', 'seo-text'].includes(body.service) ? body.service : 'full';
    const pages = Math.max(1, Math.min(1_000_000, Math.floor(Number(body.pages) || 0)));
    const email = (body.email ? String(body.email).trim() : null);
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'Не указан URL сайта' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }
    const amount = calcAmount(service, pages);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const provider = (Deno.env.get('PAYMENT_PROVIDER') || 'none').toLowerCase();

    // 1) создаём заказ (pending)
    const { data: order, error } = await supabase.from('orders').insert({
      url, service, pages, amount, status: 'pending', provider,
      customer_email: email, audit_id: body.audit_id ?? null, score_before: body.score_before ?? null,
      meta: body.task_id ? { task_id: body.task_id } : {},
    }).select('id, amount, currency').single();
    if (error) throw error;

    const returnUrl = (Deno.env.get('PUBLIC_BASE_URL') || '') + `/checkout?order=${order.id}`;

    // 2) если подключён провайдер — создаём платёж и отдаём ссылку на оплату
    if (provider === 'yookassa') {
      const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
      const secret = Deno.env.get('YOOKASSA_SECRET_KEY');
      if (shopId && secret) {
        const auth = btoa(`${shopId}:${secret}`);
        const r = await fetch('https://api.yookassa.ru/v3/payments', {
          method: 'POST',
          headers: { 'Authorization': `Basic ${auth}`, 'Idempotence-Key': order.id, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: { value: `${amount}.00`, currency: 'RUB' },
            capture: true,
            confirmation: { type: 'redirect', return_url: returnUrl },
            description: `SeoMarket: оптимизация ${url} (${pages} стр.)`,
            metadata: { order_id: order.id },
          }),
        });
        const pay = await r.json();
        if (!r.ok) throw new Error('YooKassa: ' + (pay.description || r.status));
        await supabase.from('orders').update({
          provider_payment_id: pay.id, confirmation_url: pay.confirmation?.confirmation_url,
        }).eq('id', order.id);
        return new Response(JSON.stringify({ success: true, orderId: order.id, amount, confirmationUrl: pay.confirmation?.confirmation_url }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      }
    }

    // 3) провайдер не настроен — демо-режим: заказ создан, оплату подключат отдельно
    return new Response(JSON.stringify({ success: true, orderId: order.id, amount, demo: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('payment-create error:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
