import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { assertTaskAccess, authErrorResponse } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task_id } = await req.json();

    if (!task_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'task_id parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Доступ — по тем же правилам, что и RLS на audit_tasks: своя задача,
    // гостевая (user_id IS NULL) или любая для администратора. Раньше вошедшему
    // искали только задачи с его user_id: гостевой аудит, запущенный до входа
    // или открытый по ссылке, давал «Task not found», и опрос останавливался.
    try {
      await assertTaskAccess(req, task_id);
    } catch (err) {
      const denied = authErrorResponse(err, corsHeaders);
      if (denied) return denied;
      throw err;
    }

    // Доступ проверен — читаем служебным ключом. У url_queue нет политик для
    // пользователей, и клиент пользователя всегда видел очередь пустой.
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: task, error: taskError } = await serviceClient
      .from('audit_tasks')
      .select('*')
      .eq('id', task_id)
      .maybeSingle();

    if (taskError || !task) {
      throw new Error('Task not found');
    }

    // Check for pending URLs and trigger next batch if needed
    if (task.status === 'scanning') {
      // Check if queue needs initialization (batch_count === 0)
      if (task.batch_count === 0) {
        console.log(`Initializing queue for task ${task_id}`);
        // Trigger processor to initialize queue
        serviceClient.functions.invoke('audit-processor', {
          body: { task_id }
        }).catch(err => console.error('Failed to initialize queue:', err));
      } else {
        // Check for pending URLs in existing queue
        const { data: pendingUrls } = await serviceClient
          .from('url_queue')
          .select('id')
          .eq('task_id', task_id)
          .eq('status', 'pending')
          .limit(1);
        
        if (pendingUrls && pendingUrls.length > 0) {
          // Trigger next batch asynchronously (non-blocking)
          serviceClient.functions.invoke('audit-processor', {
            body: { task_id }
          }).catch(err => console.error('Failed to trigger batch:', err));
        }
      }
    }

    // Get audit results if completed
    let auditData = null;
    if (task.status === 'completed' && task.audit_id) {
      const { data: result } = await serviceClient
        .from('audit_results')
        .select('audit_data, score, page_count, issues_count')
        .eq('task_id', task_id)
        .maybeSingle();
      
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
        // Real-time discovery fields
        discovered_urls_count: task.discovered_urls_count || 0,
        last_discovered_url: task.last_discovered_url || null,
        discovery_source: task.discovery_source || null,
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
