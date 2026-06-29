import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Список заказов для админ-панели. verify_jwt=true → доступ только авторизованным (см. config.toml).
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const u = new URL(req.url);
    const limit = Math.min(500, Math.max(1, Number(u.searchParams.get('limit')) || 200));
    const { data, error } = await supabase.from('orders')
      .select('id, url, service, pages, amount, currency, status, provider, customer_email, created_at, paid_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, orders: data ?? [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('orders-list error:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message, orders: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
