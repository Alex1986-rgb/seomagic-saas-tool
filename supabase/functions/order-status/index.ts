import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Статус заказа по id (для опроса на странице оплаты и гейтинга оптимизации/отчёта).
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const u = new URL(req.url);
    const id = u.searchParams.get('order') || (req.method === 'POST' ? (await req.json()).orderId : null);
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Не указан order' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const { data, error } = await supabase.from('orders')
      .select('id, url, service, pages, amount, currency, status, provider, confirmation_url, score_before, created_at, paid_at')
      .eq('id', id).single();
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, order: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('order-status error:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 });
  }
});
