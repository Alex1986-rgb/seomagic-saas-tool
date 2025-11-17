import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const timestamp = new Date().toISOString();
    
    // Check database connection
    const { error: dbError } = await supabaseClient
      .from('audit_tasks')
      .select('id')
      .limit(1);

    // Check storage connection
    const { error: storageError } = await supabaseClient.storage
      .from('reports')
      .list('', { limit: 1 });

    const services = {
      database: !dbError ? 'ok' : 'error',
      storage: !storageError ? 'ok' : 'error',
      openai: Deno.env.get('OPENAI_API_KEY') ? 'configured' : 'not configured',
      resend: Deno.env.get('RESEND_API_KEY') ? 'configured' : 'not configured',
    };

    const status = Object.values(services).every(s => s === 'ok' || s === 'configured') 
      ? 'ok' 
      : 'degraded';

    return new Response(
      JSON.stringify({
        status,
        timestamp,
        services,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in health-check:', error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
