import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling audit-related API calls using Supabase Edge Functions
 */
class AuditService {
  /**
   * Start a new audit task
   */
  async startAudit(url: string, options: { maxPages: number; type: 'quick' | 'deep' }): Promise<{
    success: boolean;
    task_id?: string;
    message?: string;
  }> {
    console.log('🔧 auditService.startAudit called with:', { url, options });
    
    try {
      console.log('📡 Invoking audit-start edge function...');
      const { data, error } = await supabase.functions.invoke('audit-start', {
        body: { 
          url,
          options
        }
      });

      console.log('📥 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Error from edge function:', error);
        return {
          success: false,
          message: error.message || 'Failed to start audit'
        };
      }

      if (!data || !data.task_id) {
        console.error('❌ No task_id in response data:', data);
        return {
          success: false,
          message: 'No task ID returned from server'
        };
      }

      console.log('✅ Audit started successfully, task_id:', data.task_id);

      return {
        success: true,
        task_id: data.task_id,
        message: data.message
      };
    } catch (error: any) {
      console.error('❌ Exception in startAudit:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Get audit status
   */
  async getAuditStatus(taskId: string): Promise<{
    task_id: string;
    url: string;
    status: string;
    pages_scanned: number;
    total_pages: number;
    progress: number;
    stage?: string;
    current_url?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('audit-status', {
        body: { task_id: taskId }
      });

      if (error) {
        console.error('Error getting audit status:', error);
        throw error;
      }

      return {
        task_id: data.task_id || taskId,
        url: data.url || '',
        status: data.status || 'unknown',
        pages_scanned: data.pages_scanned || 0,
        total_pages: data.total_pages || 0,
        progress: data.progress || 0,
        stage: data.stage,
        current_url: data.current_url
      };
    } catch (error) {
      console.error('Error getting audit status:', error);
      throw error;
    }
  }

  /**
   * Cancel an audit task
   */
  async cancelAudit(taskId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('audit-cancel', {
        body: { task_id: taskId }
      });

      if (error) {
        console.error('Error cancelling audit:', error);
        return {
          success: false,
          message: error.message || 'Failed to cancel audit'
        };
      }

      return {
        success: data.success || false,
        message: data.message
      };
    } catch (error: any) {
      console.error('Error cancelling audit:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }
}

export const auditService = new AuditService();
