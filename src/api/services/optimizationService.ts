
import { apiClient } from '../client/apiClient';
import { formatApiError } from '../client/errorHandler';
import { OptimizationItem } from '@/services/audit/optimization/types';

/**
 * Service for handling optimization-related API calls
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
      return await apiClient.get(`/api/optimization/${taskId}/cost`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error getting optimization cost:', formattedError);
      
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
  }> {
    try {
      return await apiClient.post(`/api/optimization/${taskId}/content`, {
        prompt: contentPrompt
      });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error optimizing content:', formattedError);
      return {
        success: false,
        message: formattedError.message
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
  }> {
    try {
      return await apiClient.post(`/api/optimization/${taskId}/start`, options);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error starting optimization:', formattedError);
      return {
        success: false
      };
    }
  }
}

export const optimizationService = new OptimizationService();
