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

    // Получаем запись отчёта (реальная таблица — pdf_reports, путь в file_path)
    const { data: report, error: reportError } = await supabaseClient
      .from('pdf_reports')
      .select('*')
      .eq('id', report_id)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Скачиваем из бакета pdf-reports (куда пишет pdf-report-generate)
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('pdf-reports')
      .download(report.file_path);

    if (downloadError || !fileData) {
      throw new Error('Failed to download report');
    }

    // Тип содержимого по расширению файла (отчёты сейчас в HTML)
    const ext = (String(report.file_path).split('.').pop() || 'html').toLowerCase();
    const contentType = ext === 'json' ? 'application/json'
      : ext === 'xml' ? 'application/xml'
      : ext === 'pdf' ? 'application/pdf'
      : 'text/html';

    const filename = `seo-report-${report.task_id || report.id}.${ext}`;

    // Счётчик скачиваний (не критично при ошибке)
    await supabaseClient.from('pdf_reports')
      .update({ downloaded_count: (report.downloaded_count || 0) + 1, last_downloaded_at: new Date().toISOString() })
      .eq('id', report_id);

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
