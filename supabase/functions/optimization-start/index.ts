import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationOptions {
  fixMeta: boolean;
  fixHeadings: boolean;
  fixImages: boolean;
  generateSitemap: boolean;
  optimizeContentSeo: boolean;
}

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

    const { task_id, options }: { task_id: string; options: OptimizationOptions } = await req.json();

    if (!task_id || !options) {
      throw new Error('task_id and options are required');
    }

    console.log(`Starting optimization for task: ${task_id}`);

    // Get audit results
    const { data: auditResult, error: auditError } = await supabaseClient
      .from('audit_results')
      .select('audit_data')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error('Audit results not found');
    }

    // Create optimization job
    const { data: optimizationJob, error: jobError } = await supabaseClient
      .from('optimization_jobs')
      .insert({
        task_id,
        user_id: user.id,
        status: 'running',
        options,
        result_data: {},
        cost: 0,
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    // Start background optimization process
    // This would be async - for now we'll mark it as completed
    const optimizationResults: any = {};

    if (options.fixMeta) {
      optimizationResults.meta_fixed = true;
    }

    if (options.fixHeadings) {
      optimizationResults.headings_fixed = true;
    }

    if (options.fixImages) {
      optimizationResults.images_fixed = true;
    }

    if (options.generateSitemap) {
      optimizationResults.sitemap_generated = true;
    }

    if (options.optimizeContentSeo) {
      optimizationResults.content_optimized = true;
    }

    // Update job with results
    await supabaseClient
      .from('optimization_jobs')
      .update({
        status: 'completed',
        result_data: optimizationResults,
      })
      .eq('id', optimizationJob.id);

    // Log API call
    await supabaseClient.from('api_logs').insert({
      user_id: user.id,
      function_name: 'optimization-start',
      request_data: { task_id, options },
      response_data: { success: true, optimization_id: optimizationJob.id },
      status_code: 200,
      duration_ms: 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        optimization_id: optimizationJob.id,
        message: 'Optimization started successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in optimization-start:', error);
    
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
