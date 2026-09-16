import { supabase } from '@/integrations/supabase/client';
import { OptimizationItem } from '@/services/audit/optimization/types';

/** Текст ошибки из ответа функции полезнее общего «Edge Function returned a non-2xx». */
async function readFunctionError(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
}

/**
 * Service for handling optimization-related API calls using Supabase Edge Functions
 */
class OptimizationService {
  /**
   * Get optimization cost for a task
   *
   * Функция сметы проверяет доступ к задаче. Раньше сюда шёл голый fetch без
   * токена: для задачи вошедшего пользователя функция отвечала 403, ошибка
   * глоталась, и человек видел «Расчетная стоимость оптимизации: 0 ₽».
   * `functions.invoke` передаёт токен сессии (у гостя — ключ anon). Ошибка
   * теперь пробрасывается: вызывающий хук повторяет запрос, пока результаты
   * аудита готовятся, а не показывает выдуманный ноль.
   */
  async getOptimizationCost(taskId: string): Promise<{
    totalCost: number;
    items: OptimizationItem[];
  }> {
    const { data, error } = await supabase.functions.invoke('optimization-calculate', {
      body: { task_id: taskId }
    });

    if (error) {
      const message = await readFunctionError(error);
      console.error('Error getting optimization cost:', message ?? error);
      throw new Error(message ?? error.message ?? 'Не удалось рассчитать стоимость оптимизации');
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Не удалось рассчитать стоимость оптимизации');
    }

    return {
      totalCost: Number(data.totalCost) || 0,
      items: data.items || []
    };
  }

  /**
   * Optimize site content using AI
   */
  async optimizeContent(taskId: string, contentPrompt: string): Promise<{
    success: boolean;
    message?: string;
    optimized_content?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('optimization-content', {
        body: { 
          task_id: taskId,
          prompt: contentPrompt
        }
      });

      if (error) {
        console.error('Error optimizing content:', error);
        return {
          success: false,
          message: error.message || 'Failed to optimize content'
        };
      }

      return {
        success: data.success || false,
        message: data.message,
        optimized_content: data.optimized_content
      };
    } catch (error: any) {
      console.error('Error optimizing content:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Start a full site optimization
   */
  async startOptimization(taskId: string, options: {
    fixMeta: boolean;
    fixHeadings: boolean;
    fixImages: boolean;
    generateSitemap: boolean;
    optimizeContentSeo: boolean;
  }): Promise<{
    success: boolean;
    optimizationId?: string;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('optimization-start', {
        body: { 
          task_id: taskId,
          options
        }
      });

      if (error) {
        console.error('Error starting optimization:', error);
        return {
          success: false,
          message: error.message || 'Failed to start optimization'
        };
      }

      return {
        success: data.success || false,
        optimizationId: data.optimization_id,
        message: data.message
      };
    } catch (error: any) {
      console.error('Error starting optimization:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Get optimization status
   */
  async getOptimizationStatus(optimizationId: string): Promise<{
    status: string;
    progress: number;
    message: string;
    result_data?: any;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('optimization-status', {
        body: { optimization_id: optimizationId }
      });

      if (error) {
        console.error('Error getting optimization status:', error);
        throw error;
      }

      return {
        status: data.status || 'unknown',
        progress: data.progress || 0,
        message: data.message || '',
        result_data: data.result_data
      };
    } catch (error) {
      console.error('Error getting optimization status:', error);
      return {
        status: 'error',
        progress: 0,
        message: 'Failed to get status'
      };
    }
  }
}

export const optimizationService = new OptimizationService();
