
import { apiService } from './apiService';

/**
 * Service for interacting with SEO-related API endpoints
 */
class SeoApiService {
  /**
   * Start crawling a website
   */
  async startCrawl(url: string) {
    try {
      return await apiService.post('/api/seo/crawl', { url });
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
      return await apiService.get(`/api/seo/status/${taskId}`);
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
}

export const seoApiService = new SeoApiService();
