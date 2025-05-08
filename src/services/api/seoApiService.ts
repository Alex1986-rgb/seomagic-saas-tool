
import { apiService } from './apiService';

/**
 * Service for interacting with SEO-related API endpoints
 */
class SeoApiService {
  /**
   * Start crawling a website
   */
  async startCrawl(url: string, maxPages: number = 500000) {
    try {
      return await apiService.post('/api/seo/crawl', { url, maxPages });
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw error;
    }
  }

  /**
   * Get status of a crawl task
   */
  async getStatus(taskId: string) {
    try {
      const response = await apiService.get(`/api/seo/status/${taskId}`);
      return response;
    } catch (error) {
      console.error('Error fetching status:', error);
      throw error;
    }
  }

  /**
   * Cancel a crawl task
   */
  async cancelScan(taskId: string) {
    try {
      return await apiService.post(`/api/seo/cancel/${taskId}`);
    } catch (error) {
      console.error('Error canceling scan:', error);
      throw error;
    }
  }

  /**
   * Get page analysis for an audit
   */
  async getPageAnalysis(auditId: string) {
    try {
      return await apiService.get(`/api/seo/page-analysis/${auditId}`);
    } catch (error) {
      console.error('Error fetching page analysis:', error);
      throw error;
    }
  }

  /**
   * Get audit information
   */
  async getAuditInfo(taskId: string) {
    try {
      // Get status first to extract basic information
      const status = await this.getStatus(taskId);
      
      return {
        pageCount: status.pages_scanned || 0,
        url: status.url,
        status: status.status
      };
    } catch (error) {
      console.error('Error getting audit info:', error);
      return {
        pageCount: 0,
        status: 'error'
      };
    }
  }

  /**
   * Download optimized site
   */
  async downloadOptimizedSite(taskId: string) {
    try {
      const response = await apiService.get(`/api/seo/download/${taskId}`, { responseType: 'blob' });
      return response;
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw error;
    }
  }

  /**
   * Optimize site content
   */
  async optimizeSiteContent(taskId: string, prompt: string) {
    try {
      const response = await apiService.post(`/api/seo/optimize/${taskId}`, { prompt });
      return response;
    } catch (error) {
      console.error('Error optimizing site content:', error);
      throw error;
    }
  }

  /**
   * Get task ID for a URL
   */
  getTaskIdForUrl(url: string): string | null {
    // This is a placeholder, in a real implementation this would fetch from storage
    return null;
  }
}

export const seoApiService = new SeoApiService();
