import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🧹 Starting cleanup of stuck tasks...');

    // Find and update stuck tasks (processing for more than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: stuckTasks, error: findError } = await supabase
      .from('audit_tasks')
      .select('id, url, created_at')
      .eq('status', 'processing')
      .lt('updated_at', oneHourAgo);

    if (findError) {
      console.error('❌ Error finding stuck tasks:', findError);
      throw findError;
    }

    if (!stuckTasks || stuckTasks.length === 0) {
      console.log('✅ No stuck tasks found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No stuck tasks found',
          cleaned: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`⚠️  Found ${stuckTasks.length} stuck tasks`);

    // Update stuck tasks to failed status
    const { error: updateError } = await supabase
      .from('audit_tasks')
      .update({
        status: 'failed',
        error_message: 'Task automatically cleaned up - stuck in processing for over 1 hour',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'processing')
      .lt('updated_at', oneHourAgo);

    if (updateError) {
      console.error('❌ Error updating stuck tasks:', updateError);
      throw updateError;
    }

    console.log(`✅ Successfully cleaned up ${stuckTasks.length} stuck tasks`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleaned up ${stuckTasks.length} stuck tasks`,
        cleaned: stuckTasks.length,
        tasks: stuckTasks.map(t => ({ id: t.id, url: t.url, created_at: t.created_at }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
