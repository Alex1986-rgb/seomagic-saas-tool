import { supabase } from '@/integrations/supabase/client';
import type { OptimizationJob, OptimizationOptions } from '../types';

export class OptimizationService {
  /**
   * Запускает процесс оптимизации через Edge Function
   */
  async startOptimization(taskId: string, options: OptimizationOptions = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('optimization-start', {
        body: { task_id: taskId, options }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting optimization:', error);
      throw error;
    }
  }

  /**
   * Получает статус оптимизации через Edge Function
   */
  async getOptimizationStatus(optimizationId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('optimization-status', {
        body: { optimization_id: optimizationId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting optimization status:', error);
      throw error;
    }
  }

  /**
   * Получает задачи оптимизации пользователя
   */
  async getUserOptimizations(): Promise<OptimizationJob[]> {
    try {
      const { data, error } = await supabase
        .from('optimization_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as OptimizationJob[];
    } catch (error) {
      console.error('Error fetching user optimizations:', error);
      throw error;
    }
  }

  /**
   * Получает оптимизацию по task_id
   */
  async getOptimizationByTaskId(taskId: string): Promise<OptimizationJob | null> {
    try {
      const { data, error } = await supabase
        .from('optimization_jobs')
        .select('*')
        .eq('task_id', taskId)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as OptimizationJob | null;
    } catch (error) {
      console.error('Error fetching optimization by task ID:', error);
      return null;
    }
  }

  /**
   * Удаляет задачу оптимизации
   */
  async deleteOptimization(optimizationId: string) {
    try {
      const { error } = await supabase
        .from('optimization_jobs')
        .delete()
        .eq('id', optimizationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting optimization:', error);
      throw error;
    }
  }
}

export const optimizationService = new OptimizationService();
