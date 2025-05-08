
import { apiClient } from '../client/apiClient';
import { formatApiError } from '../client/errorHandler';
import { ScanDetails } from '@/types/api';

/**
 * SEO API service for handling all SEO-related API calls
 */
class SeoApiService {
  private taskStorage: Record<string, string> = {};

  /**
   * Start a new website crawl
   */
  async startCrawl(url: string, maxPages: number = 10000): Promise<{task_id: string}> {
    try {
      const response = await apiClient.post('/api/crawl', {
        url,
        options: {
          maxPages,
          followExternalLinks: false,
          checkBrokenLinks: true
        }
      });
      
      // Store task ID for the URL
      this.saveTaskIdForUrl(url, response.task_id);
      
      return response;
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error starting crawl:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Get the status of an ongoing crawl
   */
  async getStatus(taskId: string): Promise<any> {
    try {
      return await apiClient.get(`/api/crawl/${taskId}/status`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error getting crawl status:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Get audit information from a completed crawl
   */
  async getAuditInfo(taskId: string): Promise<{pageCount: number; url: string; status: string}> {
    try {
      // Get status with page count information
      const status = await this.getStatus(taskId);
      
      return {
        pageCount: status.total_pages || status.pages_scanned || 0,
        url: status.url,
        status: status.status
      };
    } catch (error) {
      console.error('Error getting audit info:', error);
      return {
        pageCount: 0,
        url: '',
        status: 'error'
      };
    }
  }

  /**
   * Cancel an ongoing crawl
   */
  async cancelCrawl(taskId: string): Promise<{success: boolean}> {
    try {
      return await apiClient.post(`/api/crawl/${taskId}/cancel`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error canceling crawl:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Download sitemap from a completed crawl
   */
  async downloadSitemap(taskId: string): Promise<void> {
    try {
      const response = await apiClient.get(`/api/crawl/${taskId}/sitemap`, {
        responseType: 'blob'
      });
      
      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sitemap-${taskId}.xml`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error downloading sitemap:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Download a report from a completed crawl
   */
  async downloadReport(taskId: string, reportType: 'full' | 'errors' | 'detailed' = 'full'): Promise<void> {
    try {
      const response = await apiClient.get(`/api/crawl/${taskId}/report/${reportType}`, {
        responseType: 'blob'
      });
      
      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `seo-report-${reportType}-${taskId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error downloading report:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Get cached task ID for a URL
   */
  getTaskIdForUrl(url: string): string | null {
    // First try from in-memory cache
    if (this.taskStorage[url]) {
      return this.taskStorage[url];
    }
    
    // Then try from localStorage
    const taskId = localStorage.getItem(`task_id_${url}`);
    if (taskId) {
      // Update in-memory cache
      this.taskStorage[url] = taskId;
      return taskId;
    }
    
    return null;
  }

  /**
   * Save task ID for a URL
   */
  saveTaskIdForUrl(url: string, taskId: string): void {
    // Store in both in-memory cache and localStorage
    this.taskStorage[url] = taskId;
    localStorage.setItem(`task_id_${url}`, taskId);
  }

  /**
   * Export audit data as JSON
   */
  async exportJSON(taskId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/crawl/${taskId}/export/json`, {
        responseType: 'blob'
      });
      
      return new Blob([response], { type: 'application/json' });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error exporting JSON:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Download optimized site from a completed crawl
   */
  async downloadOptimizedSite(taskId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/crawl/${taskId}/optimized-site`, {
        responseType: 'blob'
      });
      
      return new Blob([response], { type: 'application/zip' });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error downloading optimized site:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Optimize site content using AI
   */
  async optimizeSiteContent(taskId: string, contentPrompt: string): Promise<{success: boolean; message?: string}> {
    try {
      return await apiClient.post(`/api/crawl/${taskId}/optimize`, {
        prompt: contentPrompt
      });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error optimizing site content:', formattedError);
      return {
        success: false,
        message: formattedError.message
      };
    }
  }
}

export const seoApiService = new SeoApiService();
