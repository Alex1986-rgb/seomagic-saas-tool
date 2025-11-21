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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('[PDF-GENERATE] Starting PDF generation');
    
    const supabaseClient = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    );

    const { task_id } = await req.json();

    if (!task_id) {
      throw new Error('task_id is required');
    }

    console.log('[PDF-GENERATE] Generating PDF for task:', task_id);

    // Получаем данные аудита
    const { data: auditResult, error: auditError } = await supabaseClient
      .from('audit_results')
      .select('*')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error(`Failed to fetch audit results: ${auditError?.message}`);
    }

    // Получаем данные оптимизации
    const { data: optimizationJob, error: optError } = await supabaseClient
      .from('optimization_jobs')
      .select('*')
      .eq('task_id', task_id)
      .maybeSingle();

    if (optError) {
      console.warn('[PDF-GENERATE] No optimization data found:', optError.message);
    }

    // Получаем URL из audit_tasks
    const { data: task } = await supabaseClient
      .from('audit_tasks')
      .select('url, user_id')
      .eq('id', task_id)
      .single();

    const url = task?.url || 'Неизвестный URL';
    const userId = task?.user_id || null;

    console.log('[PDF-GENERATE] Creating PDF report data...');

    // Создаем простой HTML отчет который можно конвертировать в PDF на клиенте
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SEO Audit Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .score-card { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .score-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
    .score-value { font-weight: bold; font-size: 18px; color: #4CAF50; }
    .issues { margin: 20px 0; }
    .issue-item { padding: 10px; margin: 5px 0; background: #fff3cd; border-left: 4px solid #ffc107; }
    .critical { background: #f8d7da; border-left-color: #dc3545; }
    .important { background: #fff3cd; border-left-color: #ffc107; }
    .minor { background: #d1ecf1; border-left-color: #17a2b8; }
    .opt-item { padding: 10px; margin: 5px 0; background: #d4edda; border-left: 4px solid #28a745; }
    .date { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <h1>SEO Audit Report</h1>
  <p class="date">Website: ${url}</p>
  <p class="date">Date: ${new Date().toLocaleDateString('ru-RU')}</p>
  
  <div class="score-card">
    <h2>Overall Score</h2>
    <div class="score-item">
      <span>Global Score</span>
      <span class="score-value">${auditResult.global_score || 0}/100</span>
    </div>
    <div class="score-item">
      <span>SEO Score</span>
      <span class="score-value">${auditResult.seo_score || 0}/100</span>
    </div>
    <div class="score-item">
      <span>Technical Score</span>
      <span class="score-value">${auditResult.technical_score || 0}/100</span>
    </div>
    <div class="score-item">
      <span>Content Score</span>
      <span class="score-value">${auditResult.content_score || 0}/100</span>
    </div>
    <div class="score-item">
      <span>Performance Score</span>
      <span class="score-value">${auditResult.performance_score || 0}/100</span>
    </div>
  </div>

  ${auditResult.issues_by_severity ? `
  <h2>Issues Found</h2>
  <div class="issues">
    <div class="issue-item critical">
      <strong>Critical Issues:</strong> ${(auditResult.issues_by_severity as any).critical || 0}
    </div>
    <div class="issue-item important">
      <strong>Important Issues:</strong> ${(auditResult.issues_by_severity as any).important || 0}
    </div>
    <div class="issue-item minor">
      <strong>Minor Issues:</strong> ${(auditResult.issues_by_severity as any).minor || 0}
    </div>
  </div>
  ` : ''}

  ${optimizationJob ? `
  <h2>Optimization Estimate</h2>
  <div class="score-card">
    <div class="score-item">
      <span><strong>Total Cost</strong></span>
      <span class="score-value">$${(optimizationJob.cost || 0).toFixed(2)}</span>
    </div>
    <div class="score-item">
      <span>Pages to optimize</span>
      <span>${(optimizationJob.result_data as any)?.pageCount || 0}</span>
    </div>
  </div>
  
  ${(optimizationJob.result_data as any)?.items ? `
  <h3>Optimization Items:</h3>
  ${((optimizationJob.result_data as any).items as any[]).map((item: any) => `
    <div class="opt-item">
      <strong>${item.name}</strong><br/>
      ${item.description}<br/>
      ${item.count} items × $${item.pricePerUnit} = <strong>$${item.totalPrice.toFixed(2)}</strong>
    </div>
  `).join('')}
  ` : ''}
  ` : ''}

  <h2>Page Statistics</h2>
  <div class="score-card">
    <p><strong>Total Pages Scanned:</strong> ${auditResult.page_count || 0}</p>
    ${auditResult.pages_by_type ? `
    <h3>Pages by Type:</h3>
    <ul>
      ${Object.entries(auditResult.pages_by_type as any).map(([type, count]) => `
        <li>${type}: ${count}</li>
      `).join('')}
    </ul>
    ` : ''}
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666;">
    <p>Generated by SEO Audit Tool</p>
  </div>
</body>
</html>
    `;

    // Конвертируем HTML в base64 для хранения
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(reportHtml);

    console.log('[PDF-GENERATE] HTML report created, size:', htmlBytes.length);

    // Сохраняем HTML как файл (клиент может конвертировать в PDF)
    const fileName = `audit-${task_id}-${Date.now()}.html`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('pdf-reports')
      .upload(filePath, htmlBytes, {
        contentType: 'text/html',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload report: ${uploadError.message}`);
    }

    console.log('[PDF-GENERATE] Report uploaded to storage:', filePath);

    // Записываем в таблицу pdf_reports
    const { error: insertError } = await supabaseClient
      .from('pdf_reports')
      .insert({
        task_id: task_id,
        user_id: userId,
        url: url,
        file_path: filePath,
        file_size: htmlBytes.length,
        report_title: `SEO Audit - ${url}`,
      });

    if (insertError) {
      console.error('[PDF-GENERATE] Failed to insert to pdf_reports:', insertError);
      // Don't throw - report is already created
    }

    console.log('[PDF-GENERATE] ✅ Report generation complete');

    return new Response(
      JSON.stringify({
        success: true,
        file_path: filePath,
        file_size: htmlBytes.length,
        format: 'html'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[PDF-GENERATE] Error occurred:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
