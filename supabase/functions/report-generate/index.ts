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

    const { task_id, format } = await req.json();

    if (!task_id || !format) {
      throw new Error('task_id and format are required');
    }

    console.log(`Generating ${format} report for task: ${task_id}`);

    // Get audit results
    const { data: auditResult, error: auditError } = await supabaseClient
      .from('audit_results')
      .select('*')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error('Audit results not found');
    }

    // Get task info
    const { data: task, error: taskError } = await supabaseClient
      .from('audit_tasks')
      .select('url')
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      throw new Error('Task not found');
    }

    // Generate report content based on format
    let reportContent: string;
    let contentType: string;
    let filename: string;

    if (format === 'json') {
      reportContent = JSON.stringify({
        task_id,
        url: task.url,
        score: auditResult.score,
        page_count: auditResult.page_count,
        issues_count: auditResult.issues_count,
        audit_data: auditResult.audit_data,
        created_at: auditResult.created_at,
      }, null, 2);
      contentType = 'application/json';
      filename = `seo-report-${task_id}.json`;
    } else if (format === 'xml') {
      reportContent = `<?xml version="1.0" encoding="UTF-8"?>
<seo_report>
  <task_id>${task_id}</task_id>
  <url>${task.url}</url>
  <score>${auditResult.score}</score>
  <page_count>${auditResult.page_count}</page_count>
  <created_at>${auditResult.created_at}</created_at>
</seo_report>`;
      contentType = 'application/xml';
      filename = `seo-report-${task_id}.xml`;
    } else {
      throw new Error('Unsupported format. Use json or xml');
    }

    // Save to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('reports')
      .upload(filename, reportContent, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to save report');
    }

    // Create report record
    const { data: report, error: reportError } = await supabaseClient
      .from('reports')
      .insert({
        task_id,
        format,
        storage_path: uploadData.path,
      })
      .select()
      .single();

    if (reportError) {
      throw reportError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        storage_path: uploadData.path,
        message: 'Report generated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in report-generate:', error);
    
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
