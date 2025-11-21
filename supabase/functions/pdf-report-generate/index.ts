import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import PDFDocument from "https://cdn.skypack.dev/pdfkit@0.13.0";

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
      .single();

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

    console.log('[PDF-GENERATE] Creating PDF document...');

    // Создаём PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Uint8Array[] = [];

    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    
    const pdfBuffer = await new Promise<Uint8Array>((resolve, reject) => {
      doc.on('end', () => {
        const result = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        resolve(result);
      });
      doc.on('error', reject);

      // Генерируем содержимое PDF
      doc.fontSize(24).text('SEO Audit Report', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Website: ${url}`, { align: 'center' });
      doc.text(`Date: ${new Date().toLocaleDateString('ru-RU')}`, { align: 'center' });
      doc.moveDown(2);

      // Общая оценка
      doc.fontSize(18).text('Overall Score', { underline: true });
      doc.moveDown();
      doc.fontSize(14).text(`Global Score: ${auditResult.global_score || 0}/100`);
      doc.text(`SEO Score: ${auditResult.seo_score || 0}/100`);
      doc.text(`Technical Score: ${auditResult.technical_score || 0}/100`);
      doc.text(`Content Score: ${auditResult.content_score || 0}/100`);
      doc.text(`Performance Score: ${auditResult.performance_score || 0}/100`);
      doc.moveDown(2);

      // Проблемы
      if (auditResult.issues_by_severity) {
        const issues = auditResult.issues_by_severity as any;
        doc.fontSize(18).text('Issues Found', { underline: true });
        doc.moveDown();
        doc.fontSize(14).text(`Critical: ${issues.critical || 0}`);
        doc.text(`Important: ${issues.important || 0}`);
        doc.text(`Minor: ${issues.minor || 0}`);
        doc.moveDown(2);
      }

      // Смета оптимизации
      if (optimizationJob?.result_data) {
        const resultData = optimizationJob.result_data as any;
        doc.fontSize(18).text('Optimization Estimate', { underline: true });
        doc.moveDown();
        doc.fontSize(14).text(`Total Cost: $${optimizationJob.cost?.toFixed(2) || '0.00'}`);
        doc.text(`Pages to optimize: ${resultData.pageCount || 0}`);
        doc.moveDown();

        if (resultData.items && Array.isArray(resultData.items)) {
          doc.fontSize(12).text('Optimization Items:');
          doc.moveDown(0.5);
          resultData.items.forEach((item: any) => {
            doc.fontSize(10).text(`• ${item.name}: ${item.count} items × $${item.pricePerUnit} = $${item.totalPrice.toFixed(2)}`);
          });
          doc.moveDown(2);
        }
      }

      // Статистика страниц
      doc.fontSize(18).text('Page Statistics', { underline: true });
      doc.moveDown();
      doc.fontSize(14).text(`Total Pages Scanned: ${auditResult.page_count || 0}`);
      
      if (auditResult.pages_by_type) {
        const pageTypes = auditResult.pages_by_type as any;
        doc.fontSize(12).text('Pages by Type:');
        doc.moveDown(0.5);
        Object.entries(pageTypes).forEach(([type, count]) => {
          doc.fontSize(10).text(`• ${type}: ${count}`);
        });
      }

      doc.end();
    });

    console.log('[PDF-GENERATE] PDF created, size:', pdfBuffer.length);

    // Сохраняем PDF в Storage
    const fileName = `audit-${task_id}-${Date.now()}.pdf`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('pdf-reports')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('[PDF-GENERATE] PDF uploaded to storage:', filePath);

    // Записываем в таблицу pdf_reports
    const { error: insertError } = await supabaseClient
      .from('pdf_reports')
      .insert({
        task_id: task_id,
        user_id: userId,
        url: url,
        file_path: filePath,
        file_size: pdfBuffer.length,
        report_title: `SEO Audit - ${url}`,
      });

    if (insertError) {
      console.error('[PDF-GENERATE] Failed to insert to pdf_reports:', insertError);
      // Don't throw - PDF is already created
    }

    console.log('[PDF-GENERATE] ✅ PDF generation complete');

    return new Response(
      JSON.stringify({
        success: true,
        file_path: filePath,
        file_size: pdfBuffer.length,
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
