import { supabase } from '@/integrations/supabase/client';
import { OptimizationItem } from '@/services/audit/optimization/types';

/**
 * Service for handling optimization-related API calls using Supabase Edge Functions
 */
class OptimizationService {
  /**
   * Get optimization cost for a task
   */
  async getOptimizationCost(taskId: string): Promise<{
    totalCost: number;
    items: OptimizationItem[];
  }> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/optimization-calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: taskId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();

      return {
        totalCost: data.totalCost || 0,
        items: data.items || []
      };
    } catch (error) {
      console.error('Error getting optimization cost:', error);
      
      // Return fallback data
      return {
        totalCost: 0,
        items: []
      };
    }
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
