import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CleanupStats {
  crawled_pages: number;
  url_queue: number;
  page_analysis: number;
  audit_results: number;
  audit_tasks: number;
  notifications: number;
  api_logs: number;
  total: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Starting cleanup of old audit data...');

    const stats: CleanupStats = {
      crawled_pages: 0,
      url_queue: 0,
      page_analysis: 0,
      audit_results: 0,
      audit_tasks: 0,
      notifications: 0,
      api_logs: 0,
      total: 0,
    };

    // Delete crawled pages older than 30 days (raw HTML data)
    console.log('Cleaning crawled_pages...');
    const { error: crawledError, count: crawledCount } = await supabaseClient
      .from('crawled_pages')
      .delete({ count: 'exact' })
      .lt('crawled_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (crawledError) {
      console.error('Error cleaning crawled_pages:', crawledError);
    } else {
      stats.crawled_pages = crawledCount || 0;
      console.log(`Deleted ${crawledCount} old crawled pages`);
    }

    // Delete URL queue entries older than 90 days
    console.log('Cleaning url_queue...');
    const { error: queueError, count: queueCount } = await supabaseClient
      .from('url_queue')
      .delete({ count: 'exact' })
      .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (queueError) {
      console.error('Error cleaning url_queue:', queueError);
    } else {
      stats.url_queue = queueCount || 0;
      console.log(`Deleted ${queueCount} old URL queue entries`);
    }

    // Delete notifications older than 90 days
    console.log('Cleaning notifications...');
    const { error: notifError, count: notifCount } = await supabaseClient
      .from('notifications')
      .delete({ count: 'exact' })
      .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (notifError) {
      console.error('Error cleaning notifications:', notifError);
    } else {
      stats.notifications = notifCount || 0;
      console.log(`Deleted ${notifCount} old notifications`);
    }

    // Delete API logs older than 30 days
    console.log('Cleaning api_logs...');
    const { error: logsError, count: logsCount } = await supabaseClient
      .from('api_logs')
      .delete({ count: 'exact' })
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (logsError) {
      console.error('Error cleaning api_logs:', logsError);
    } else {
      stats.api_logs = logsCount || 0;
      console.log(`Deleted ${logsCount} old API logs`);
    }

    // Get old task IDs (older than 90 days) for cascading deletes
    console.log('Finding old audit tasks...');
    const { data: oldTasks, error: tasksSelectError } = await supabaseClient
      .from('audit_tasks')
      .select('id')
      .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (tasksSelectError) {
      console.error('Error finding old tasks:', tasksSelectError);
    } else if (oldTasks && oldTasks.length > 0) {
      const taskIds = oldTasks.map(t => t.id);
      console.log(`Found ${taskIds.length} old tasks to delete`);

      // Delete page_analysis for old tasks
      console.log('Cleaning page_analysis...');
      const { error: analysisError, count: analysisCount } = await supabaseClient
        .from('page_analysis')
        .delete({ count: 'exact' })
        .in('task_id', taskIds);

      if (analysisError) {
        console.error('Error cleaning page_analysis:', analysisError);
      } else {
        stats.page_analysis = analysisCount || 0;
        console.log(`Deleted ${analysisCount} page analysis records`);
      }

      // Delete audit_results for old tasks
      console.log('Cleaning audit_results...');
      const { error: resultsError, count: resultsCount } = await supabaseClient
        .from('audit_results')
        .delete({ count: 'exact' })
        .in('task_id', taskIds);

      if (resultsError) {
        console.error('Error cleaning audit_results:', resultsError);
      } else {
        stats.audit_results = resultsCount || 0;
        console.log(`Deleted ${resultsCount} audit results`);
      }

      // Finally, delete the old tasks themselves
      console.log('Cleaning audit_tasks...');
      const { error: tasksError, count: tasksCount } = await supabaseClient
        .from('audit_tasks')
        .delete({ count: 'exact' })
        .in('id', taskIds);

      if (tasksError) {
        console.error('Error cleaning audit_tasks:', tasksError);
      } else {
        stats.audit_tasks = tasksCount || 0;
        console.log(`Deleted ${tasksCount} audit tasks`);
      }
    }

    // Clean old PDF reports using the existing DB function
    console.log('Cleaning old PDF reports...');
    const { error: pdfError } = await supabaseClient.rpc('clean_old_pdf_reports');
    if (pdfError) {
      console.error('Error cleaning PDF reports:', pdfError);
    } else {
      console.log('PDF reports cleanup completed');
    }

    stats.total = Object.values(stats).reduce((sum, val) => sum + val, 0);

    console.log('Cleanup completed:', stats);

    return new Response(
      JSON.stringify({
        success: true,
        stats,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
