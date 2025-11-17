import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationOptions {
  fixMetaTags?: boolean;
  improveContent?: boolean;
  fixLinks?: boolean;
  improveStructure?: boolean;
  optimizeSpeed?: boolean;
  contentQuality?: 'standard' | 'premium' | 'ultimate';
  language?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { task_id, options = {} } = await req.json();

    if (!task_id) {
      throw new Error('task_id is required');
    }

    console.log('Starting optimization for task:', task_id);

    // Verify audit exists and is completed
    const { data: auditResult, error: auditError } = await supabase
      .from('audit_results')
      .select('id, page_count')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error('Audit not found or not completed');
    }

    // Create optimization job
    const { data: optimizationJob, error: createError } = await supabase
      .from('optimization_jobs')
      .insert({
        user_id: user.id,
        task_id,
        status: 'queued',
        options,
        cost: 0,
      })
      .select()
      .single();

    if (createError || !optimizationJob) {
      throw new Error('Failed to create optimization job');
    }

    console.log('Created optimization job:', optimizationJob.id);

    // Invoke optimization processor asynchronously
    const processorUrl = `${supabaseUrl}/functions/v1/optimization-processor`;
    
    fetch(processorUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optimization_id: optimizationJob.id,
        task_id,
        options
      })
    }).catch(error => {
      console.error('Failed to invoke optimization processor:', error);
    });

    // Log API usage
    await supabase.from('api_logs').insert({
      function_name: 'optimization-start',
      user_id: user.id,
      request_data: { task_id, options },
      response_data: { optimization_id: optimizationJob.id },
      status_code: 200,
      duration_ms: 0
    });

    return new Response(
      JSON.stringify({
        success: true,
        optimization_id: optimizationJob.id,
        status: 'queued',
        message: 'Optimization started'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Optimization start error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
