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

    const url = new URL(req.url);
    const report_id = url.searchParams.get('report_id');

    if (!report_id) {
      throw new Error('report_id is required');
    }

    console.log(`Downloading report: ${report_id}`);

    // Get report info
    const { data: report, error: reportError } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('id', report_id)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Download from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('reports')
      .download(report.storage_path);

    if (downloadError || !fileData) {
      throw new Error('Failed to download report');
    }

    // Determine content type based on format
    const contentType = report.format === 'json' 
      ? 'application/json' 
      : report.format === 'xml' 
      ? 'application/xml' 
      : 'application/pdf';

    const filename = `seo-report-${report.task_id}.${report.format}`;

    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error in report-download:', error);
    
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
