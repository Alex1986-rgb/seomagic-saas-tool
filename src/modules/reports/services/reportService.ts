import { supabase } from '@/integrations/supabase/client';
import type { Report, ReportGenerationOptions } from '../types';

export class ReportService {
  /**
   * Генерирует отчет через Edge Function
   */
  async generateReport(auditId: string, options: ReportGenerationOptions = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { audit_id: auditId, options }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Получает список отчетов пользователя
   */
  async getUserReports(): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('pdf_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Report[];
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
  }

  /**
   * Скачивает отчет
   */
  async downloadReport(reportId: string, filePath: string) {
    try {
      // Скачиваем файл из Storage
      const { data, error } = await supabase.storage
        .from('pdf-reports')
        .download(filePath);

      if (error) throw error;

      // Обновляем счетчик скачиваний
      const { data: report } = await supabase
        .from('pdf_reports')
        .select('downloaded_count')
        .eq('id', reportId)
        .single();

      if (report) {
        await supabase
          .from('pdf_reports')
          .update({
            downloaded_count: (report.downloaded_count || 0) + 1,
            last_downloaded_at: new Date().toISOString()
          })
          .eq('id', reportId);
      }

      return data;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  /**
   * Удаляет отчет
   */
  async deleteReport(reportId: string, filePath: string) {
    try {
      // Удаляем файл из Storage
      const { error: storageError } = await supabase.storage
        .from('pdf-reports')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Удаляем запись из БД
      const { error: dbError } = await supabase
        .from('pdf_reports')
        .delete()
        .eq('id', reportId);

      if (dbError) throw dbError;

      return { success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
