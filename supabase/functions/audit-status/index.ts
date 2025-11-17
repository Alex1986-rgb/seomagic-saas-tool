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

    const { task_id } = await req.json();

    if (!task_id) {
      throw new Error('task_id parameter is required');
    }

    // Get task status
    const { data: task, error: taskError } = await supabaseClient
      .from('audit_tasks')
      .select('*')
      .eq('id', task_id)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) {
      throw new Error('Task not found');
    }

    // Get audit results if completed
    let auditData = null;
    if (task.status === 'completed' && task.audit_id) {
      const { data: result } = await supabaseClient
        .from('audit_results')
        .select('audit_data, score, page_count, issues_count')
        .eq('task_id', task_id)
        .single();
      
      auditData = result;
    }

    return new Response(
      JSON.stringify({
        success: true,
        task_id: task.id,
        url: task.url,
        status: task.status,
        task_type: task.task_type,
        pages_scanned: task.pages_scanned || 0,
        total_pages: task.estimated_pages || 0,
        estimated_pages: task.estimated_pages,
        current_url: task.current_url || '',
        stage: task.stage || task.status,
        progress: task.progress || 0,
        error: task.error_message || null,
        error_message: task.error_message,
        created_at: task.created_at,
        audit_data: auditData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in audit-status:', error);
    
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
