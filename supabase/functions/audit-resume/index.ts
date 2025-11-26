import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== AUDIT RESUME CALLED ===');
  console.log('Method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { task_id } = body;

    if (!task_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'task_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[RESUME] Resuming audit task: ${task_id}`);

    // 1. Get the task and verify it's in a resumable state
    const { data: task, error: taskError } = await supabase
      .from('audit_tasks')
      .select('*')
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      console.error('[RESUME] Task not found:', taskError);
      return new Response(
        JSON.stringify({ success: false, message: 'Task not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only allow resuming failed or stuck tasks
    const resumableStatuses = ['failed', 'error', 'cancelled'];
    if (!resumableStatuses.includes(task.status)) {
      console.log(`[RESUME] Task status ${task.status} is not resumable`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Task cannot be resumed (status: ${task.status}). Only failed, error, or cancelled tasks can be resumed.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Get stats before resuming
    const { data: queueStats } = await supabase
      .from('url_queue')
      .select('status')
      .eq('task_id', task_id);

    const pendingCount = queueStats?.filter(q => q.status === 'pending').length || 0;
    const processingCount = queueStats?.filter(q => q.status === 'processing').length || 0;
    const completedCount = queueStats?.filter(q => q.status === 'completed').length || 0;

    console.log(`[RESUME] Queue stats - Pending: ${pendingCount}, Processing: ${processingCount}, Completed: ${completedCount}`);

    // 3. Reset any 'processing' URLs back to 'pending' (these were stuck)
    if (processingCount > 0) {
      const { error: resetError } = await supabase
        .from('url_queue')
        .update({ status: 'pending', retry_count: 0 })
        .eq('task_id', task_id)
        .eq('status', 'processing');

      if (resetError) {
        console.error('[RESUME] Failed to reset processing URLs:', resetError);
      } else {
        console.log(`[RESUME] Reset ${processingCount} processing URLs to pending`);
      }
    }

    // 4. Update task status to 'processing'
    const { error: updateError } = await supabase
      .from('audit_tasks')
      .update({
        status: 'processing',
        stage: 'crawling',
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', task_id);

    if (updateError) {
      console.error('[RESUME] Failed to update task status:', updateError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to update task status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Also update the audits table
    if (task.audit_id) {
      await supabase
        .from('audits')
        .update({
          status: 'scanning',
          error_message: null
        })
        .eq('id', task.audit_id);
    }

    console.log('[RESUME] Task status updated to processing');

    // 6. Trigger audit-processor to continue
    console.log('[RESUME] Triggering audit-processor...');
    const processorResponse = await supabase.functions.invoke('audit-processor', {
      body: { task_id }
    });

    if (processorResponse.error) {
      console.error('[RESUME] Failed to trigger processor:', processorResponse.error);
      // Revert status on failure
      await supabase
        .from('audit_tasks')
        .update({ status: 'failed', error_message: 'Failed to resume processor' })
        .eq('id', task_id);

      return new Response(
        JSON.stringify({ success: false, message: 'Failed to trigger processor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[RESUME] ✅ Audit resumed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        task_id,
        message: 'Audit resumed successfully',
        stats: {
          pending_urls: pendingCount + processingCount,
          completed_urls: completedCount,
          progress: task.progress || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[RESUME] Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
