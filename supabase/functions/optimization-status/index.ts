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
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const optimization_id = url.searchParams.get('optimization_id');

    if (!optimization_id) {
      throw new Error('optimization_id is required');
    }

    console.log(`Getting status for optimization: ${optimization_id}`);

    const { data: optimizationJob, error: jobError } = await supabaseClient
      .from('optimization_jobs')
      .select('*')
      .eq('id', optimization_id)
      .eq('user_id', user.id)
      .single();

    if (jobError || !optimizationJob) {
      throw new Error('Optimization job not found');
    }

    return new Response(
      JSON.stringify({
        optimization_id: optimizationJob.id,
        status: optimizationJob.status,
        progress: optimizationJob.status === 'completed' ? 100 : 50,
        message: optimizationJob.status === 'completed' ? 'Optimization completed' : 'Optimization in progress',
        result_data: optimizationJob.result_data,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in optimization-status:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500,
      }
    );
  }
});
