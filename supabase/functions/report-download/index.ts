import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Бакеты, где лежат отчёты, в порядке проверки.
 *
 * Отчёты пишут две функции, и в разные места:
 *   * pdf-report-generate — в бакет 'pdf-reports', путь 'reports/audit-<задача>-<время>.html';
 *   * report-generate — в бакет 'reports', путь 'seo-report-<задача>.json|xml' без папки.
 * Раньше файл всегда искали в 'reports', и HTML-отчёты из pdf-report-generate
 * не скачивались. Бакет выбираем по пути, а если там файла нет — пробуем второй:
 * так скачаются и записи, сделанные до разделения.
 */
function bucketsForPath(filePath: string): string[] {
  return filePath.startsWith('reports/')
    ? ['pdf-reports', 'reports']
    : ['reports', 'pdf-reports'];
}

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

    // report_id may arrive via query string (GET) or the JSON body, since
    // supabase.functions.invoke sends a POST body rather than query params.
    const url = new URL(req.url);
    let report_id = url.searchParams.get('report_id');
    if (!report_id && req.method === 'POST') {
      try {
        const body = await req.json();
        report_id = body?.report_id ?? null;
      } catch {
        /* no body */
      }
    }

    if (!report_id) {
      throw new Error('report_id is required');
    }

    console.log(`Downloading report: ${report_id}`);

    // Ownership check via the user-scoped client so RLS ensures the report
    // belongs to the caller. Reports are recorded in `pdf_reports`.
    const { data: report, error: reportError } = await supabaseClient
      .from('pdf_reports')
      .select('id, task_id, file_path, user_id')
      .eq('id', report_id)
      .maybeSingle();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Fetch the file with the service role (the report buckets are private).
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let fileData: Blob | null = null;
    for (const bucket of bucketsForPath(report.file_path)) {
      const { data, error: downloadError } = await serviceClient.storage
        .from(bucket)
        .download(report.file_path);
      if (!downloadError && data) {
        fileData = data;
        break;
      }
      console.warn(`Report ${report.id}: нет файла в бакете ${bucket}:`, downloadError?.message);
    }

    if (!fileData) {
      throw new Error('Failed to download report');
    }

    // Derive format from the stored file extension.
    const format = (report.file_path.split('.').pop() || 'json').toLowerCase();
    const contentType = format === 'json'
      ? 'application/json'
      : format === 'xml'
      ? 'application/xml'
      : format === 'html'
      ? 'text/html'
      : 'application/pdf';

    const filename = `seo-report-${report.task_id}.${format}`;

    // Best-effort: record the last download time (ignore failures).
    await serviceClient
      .from('pdf_reports')
      .update({ last_downloaded_at: new Date().toISOString() })
      .eq('id', report.id);

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
