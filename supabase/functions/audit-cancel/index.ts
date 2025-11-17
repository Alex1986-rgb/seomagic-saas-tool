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
      throw new Error('task_id is required');
    }

    console.log(`Cancelling audit task: ${task_id}`);

    // Get task to find audit_id
    const { data: task, error: getError } = await supabaseClient
      .from('audit_tasks')
      .select('audit_id')
      .eq('id', task_id)
      .eq('user_id', user.id)
      .single();

    if (getError) {
      throw getError;
    }

    // Update task status to cancelled
    const { error: updateError } = await supabaseClient
      .from('audit_tasks')
      .update({
        status: 'cancelled',
        stage: 'cancelled',
        error_message: 'Cancelled by user'
      })
      .eq('id', task_id)
      .eq('user_id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Update audit status if exists
    if (task?.audit_id) {
      await supabaseClient
        .from('audits')
        .update({ status: 'failed' })
        .eq('id', task.audit_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Audit cancelled successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in audit-cancel:', error);
    
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
