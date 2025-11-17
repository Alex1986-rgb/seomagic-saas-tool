import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling report generation and downloads using Supabase Edge Functions
 */
class ReportService {
  /**
   * Generate a report for an audit task
   */
  async generateReport(taskId: string, format: 'pdf' | 'json' | 'xml'): Promise<{
    success: boolean;
    report_id?: string;
    storage_path?: string;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('report-generate', {
        body: { 
          task_id: taskId,
          format
        }
      });

      if (error) {
        console.error('Error generating report:', error);
        return {
          success: false,
          message: error.message || 'Failed to generate report'
        };
      }

      return {
        success: data.success || false,
        report_id: data.report_id,
        storage_path: data.storage_path,
        message: data.message
      };
    } catch (error: any) {
      console.error('Error generating report:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Download a generated report
   */
  async downloadReport(reportId: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.functions.invoke('report-download', {
        body: { report_id: reportId }
      });

      if (error) {
        console.error('Error downloading report:', error);
        return null;
      }

      // Convert response to Blob if it's not already
      if (data instanceof Blob) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error downloading report:', error);
      return null;
    }
  }

  /**
   * Export sitemap for an audit task
   */
  async exportSitemap(taskId: string, format: 'xml' | 'html'): Promise<{
    success: boolean;
    url?: string;
    storage_path?: string;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('sitemap-export', {
        body: { 
          task_id: taskId,
          format
        }
      });

      if (error) {
        console.error('Error exporting sitemap:', error);
        return {
          success: false,
          message: error.message || 'Failed to export sitemap'
        };
      }

      return {
        success: data.success || false,
        url: data.url,
        storage_path: data.storage_path,
        message: data.message
      };
    } catch (error: any) {
      console.error('Error exporting sitemap:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Send report via email
   */
  async sendReportEmail(to: string, subject: string, taskId: string): Promise<{
    success: boolean;
    message_id?: string;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          to,
          subject,
          task_id: taskId
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        return {
          success: false,
          message: error.message || 'Failed to send email'
        };
      }

      return {
        success: data.success || false,
        message_id: data.message_id,
        message: data.message
      };
    } catch (error: any) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }
}

export const reportService = new ReportService();
