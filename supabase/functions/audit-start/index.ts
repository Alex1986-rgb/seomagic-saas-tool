import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditStartRequest {
  url: string;
  options?: {
    maxPages?: number;
    type?: 'quick' | 'deep';
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
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

    const { url, options }: AuditStartRequest = await req.json();

    // Validate URL
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid URL provided');
    }

    const taskType = options?.type || 'quick';
    const maxPages = options?.maxPages || (taskType === 'quick' ? 10 : 100);

    console.log(`Starting ${taskType} audit for ${url}, max pages: ${maxPages}`);

    // Create audit task
    const { data: task, error: taskError } = await supabaseClient
      .from('audit_tasks')
      .insert({
        user_id: user.id,
        url: url,
        status: 'queued',
        task_type: taskType,
        estimated_pages: maxPages,
        stage: 'initialization',
        progress: 0,
      })
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      throw taskError;
    }

    // Log API call
    await supabaseClient.from('api_logs').insert({
      user_id: user.id,
      function_name: 'audit-start',
      request_data: { url, options },
      response_data: { task_id: task.id },
      status_code: 200,
      duration_ms: Date.now() - startTime,
    });

    return new Response(
      JSON.stringify({
        success: true,
        task_id: task.id,
        status: task.status,
        message: 'Audit started successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in audit-start:', error);
    
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
