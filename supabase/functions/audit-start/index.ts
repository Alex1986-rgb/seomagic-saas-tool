import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { assertPublicUrl, UnsafeUrlError } from "../_shared/url-guard.ts";

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
  console.log('=== AUDIT START CALLED ===');
  console.log('Method:', req.method);
  
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

    const { url, options }: AuditStartRequest = await req.json();
    console.log('Request body:', { url, options });

    // Проверять можно только настоящий сайт в интернете. Раньше сюда проходил
    // любой адрес, и нашим сервером можно было постучаться во внутреннюю сеть.
    if (!url) {
      throw new Error('Invalid URL provided');
    }
    try {
      assertPublicUrl(url);
    } catch (err) {
      if (err instanceof UnsafeUrlError) {
        return new Response(
          JSON.stringify({ success: false, error: err.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      throw err;
    }

    const taskType = options?.type || 'quick';
    const maxPages = options?.maxPages || (taskType === 'quick' ? 10 : 100);

    console.log('Task type:', taskType, 'Max pages:', maxPages);

    // Get user if authenticated
    const { data: { user } } = await supabaseClient.auth.getUser();
    console.log('User:', user?.id || 'anonymous');
    
    // For deep audit, require authentication
    if (taskType === 'deep' && !user) {
      throw new Error('Authentication required for deep audit');
    }
    
    const userId = user?.id || null;

    console.log(`Starting ${taskType} audit for ${url}, max pages: ${maxPages}`);

    // Create audit record first
    const auditData: any = {
      url: url,
      status: 'pending',
      total_pages: maxPages,
    };
    
    if (userId) {
      auditData.user_id = userId;
    }
    
    const { data: audit, error: auditError } = await supabaseClient
      .from('audits')
      .insert(auditData)
      .select()
      .single();

    if (auditError) {
      console.error('Error creating audit:', auditError);
      throw auditError;
    }

    // Create audit task linked to audit
    const taskData: any = {
      audit_id: audit.id,
      url: url,
      status: 'queued',
      task_type: taskType,
      estimated_pages: maxPages,
      stage: 'queued',
      progress: 0,
    };
    
    if (userId) {
      taskData.user_id = userId;
    }
    
    const { data: task, error: taskError } = await supabaseClient
      .from('audit_tasks')
      .insert(taskData)
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      throw taskError;
    }

    console.log('✅ Task created with ID:', task.id);

    // Trigger audit processor with error handling
    try {
      console.log('🚀 Triggering audit processor...');
      const processorResponse = await supabaseClient.functions.invoke('audit-processor', {
        body: { task_id: task.id }
      });
      
      if (processorResponse.error) {
        console.error('❌ Failed to trigger processor:', processorResponse.error);
        throw new Error(`Processor invocation failed: ${processorResponse.error.message}`);
      }
      
      console.log('✅ Processor triggered successfully');
    } catch (procError) {
      console.error('❌ Exception triggering processor:', procError);
      
      // Update task to failed state
      await supabaseClient
        .from('audit_tasks')
        .update({ 
          status: 'failed', 
          error_message: `Failed to start processor: ${procError.message}` 
        })
        .eq('id', task.id);
      
      // Update audit to failed as well
      await supabaseClient
        .from('audits')
        .update({ 
          status: 'failed', 
          error_message: `Failed to start processor: ${procError.message}` 
        })
        .eq('id', audit.id);
      
      throw new Error(`Failed to start audit processor: ${procError.message}`);
    }

    // Log API call (only if user is authenticated)
    if (userId) {
      await supabaseClient.from('api_logs').insert({
        user_id: userId,
        function_name: 'audit-start',
        request_data: { url, options },
        response_data: { task_id: task.id },
        status_code: 200,
        duration_ms: Date.now() - startTime,
      });
    }

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
