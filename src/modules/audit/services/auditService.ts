import { supabase } from '@/integrations/supabase/client';
import type { Audit, AuditTask, AuditResult, StartAuditOptions, AuditStatusResponse } from '../types';

export class AuditService {
  /**
   * Запускает новый аудит через Edge Function
   */
  async startAudit(url: string, options: StartAuditOptions = {}) {
    try {
      console.log('🚀 Starting audit:', { url, options });
      
      const { data, error } = await supabase.functions.invoke('audit-start', {
        body: { url, options }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message || 'Failed to start audit');
      }
      
      if (!data?.task_id) {
        throw new Error('No task_id returned from audit service');
      }
      
      console.log('✅ Audit started successfully, task_id:', data.task_id);
      return data;
    } catch (error) {
      console.error('❌ Error starting audit:', error);
      throw error;
    }
  }

  /**
   * Получает статус аудита через Edge Function
   */
  async getAuditStatus(taskId: string): Promise<AuditStatusResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('audit-status', {
        body: { task_id: taskId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting audit status:', error);
      throw error;
    }
  }

  /**
   * Отменяет аудит через Edge Function
   */
  async cancelAudit(taskId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('audit-cancel', {
        body: { task_id: taskId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling audit:', error);
      throw error;
    }
  }

  /**
   * Получает список аудитов пользователя
   */
  async getUserAudits(): Promise<Audit[]> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Audit[];
    } catch (error) {
      console.error('Error fetching user audits:', error);
      throw error;
    }
  }

  /**
   * Получает конкретный аудит по ID
   */
  async getAudit(auditId: string): Promise<Audit | null> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', auditId)
        .single();

      if (error) throw error;
      return data as unknown as Audit;
    } catch (error) {
      console.error('Error fetching audit:', error);
      return null;
    }
  }

  /**
   * Получает результаты аудита
   */
  async getAuditResults(auditId: string): Promise<AuditResult | null> {
    try {
      const { data, error } = await supabase
        .from('audit_results')
        .select('*')
        .eq('audit_id', auditId)
        .single();

      if (error) throw error;
      
      // Cast Json types to proper types
      if (data) {
        return {
          ...data,
          pages_by_type: data.pages_by_type as Record<string, number> | undefined,
          pages_by_depth: data.pages_by_depth as Record<string, number> | undefined,
          issues_by_severity: data.issues_by_severity as Record<string, number> | undefined
        } as AuditResult;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching audit results:', error);
      return null;
    }
  }

  /**
   * Получает анализ страниц для аудита
   */
  async getPageAnalysis(auditId: string) {
    try {
      const { data, error } = await supabase
        .from('page_analysis')
        .select('*')
        .eq('audit_id', auditId)
        .order('depth', { ascending: true })
        .order('load_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching page analysis:', error);
      return [];
    }
  }

  /**
   * Получает метрики производительности для задачи аудита
   */
  async getAuditTaskMetrics(taskId: string) {
    try {
      const { data, error } = await supabase
        .from('audit_tasks')
        .select('avg_load_time_ms, success_rate, redirect_pages_count, error_pages_count, pages_scanned, total_urls')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task metrics:', error);
      return null;
    }
  }

  /**
   * Удаляет аудит
   */
  async deleteAudit(auditId: string) {
    try {
      const { error } = await supabase
        .from('audits')
        .delete()
        .eq('id', auditId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting audit:', error);
      throw error;
    }
  }
}

export const auditService = new AuditService();
