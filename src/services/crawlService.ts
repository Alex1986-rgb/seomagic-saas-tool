
import axios from 'axios';

interface CrawlTask {
  id: string;
  status: string;
  progress: number;
  url: string;
  currentUrl: string;
  pagesScanned: number;
  pagesTotal: number;
  createdAt: string;
  updatedAt: string;
}

interface CrawlResult {
  urls: string[];
  metadata?: {
    sitemap?: string;
    keywords?: string[];
    links?: {
      internal: number;
      external: number;
      broken: number;
    };
  };
  brokenLinks?: string[];
}

export class CrawlService {
  private static API_URL = process.env.REACT_APP_API_URL || '/api';
  
  static async startCrawl(url: string, options?: {
    depth?: number;
    maxPages?: number;
    includeImages?: boolean;
    followExternalLinks?: boolean;
    maxDepth?: number;
    checkBrokenLinks?: boolean;
    findDuplicates?: boolean;
    analyzeStructure?: boolean;
    checkContent?: boolean;
    generateSitemap?: boolean;
  }, progressCallback?: (progress: any) => void): Promise<CrawlResult> {
    try {
      const response = await axios.post(`${this.API_URL}/crawl`, {
        url,
        options
      });
      
      return { urls: response.data.urls || [], brokenLinks: response.data.brokenLinks || [] };
    } catch (error) {
      console.error('Error starting crawl task:', error);
      throw new Error('Failed to start crawl task');
    }
  }
  
  static async getCrawlStatus(taskId: string): Promise<CrawlTask> {
    try {
      const response = await axios.get(`${this.API_URL}/crawl/${taskId}/status`);
      
      // Return data with proper camelCase property naming
      const data = response.data;
      if (data.current_url && !data.currentUrl) {
        data.currentUrl = data.current_url;
        delete data.current_url;
      }
      
      return data as CrawlTask;
    } catch (error) {
      console.error('Error getting crawl status:', error);
      throw new Error('Failed to get crawl status');
    }
  }
  
  static async getCrawlResults(taskId: string): Promise<CrawlResult> {
    try {
      const response = await axios.get(`${this.API_URL}/crawl/${taskId}/results`);
      return response.data;
    } catch (error) {
      console.error('Error getting crawl results:', error);
      throw new Error('Failed to get crawl results');
    }
  }
  
  static async cancelCrawl(taskId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(`${this.API_URL}/crawl/${taskId}/cancel`);
      return { success: response.data.success };
    } catch (error) {
      console.error('Error canceling crawl task:', error);
      throw new Error('Failed to cancel crawl task');
    }
  }
  
  // Handle crawl task scheduling
  static async scheduleCrawl(url: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    startDate?: string;
    time?: string;
  }): Promise<{ taskId: string; scheduleId: string }> {
    try {
      const response = await axios.post(`${this.API_URL}/crawl/schedule`, {
        url,
        schedule
      });
      
      return {
        taskId: response.data.taskId,
        scheduleId: response.data.scheduleId
      };
    } catch (error) {
      console.error('Error scheduling crawl task:', error);
      throw new Error('Failed to schedule crawl task');
    }
  }

  static async generateReport(data: any): Promise<Blob> {
    // This is a stub implementation - in a real app, you would generate an actual report
    return new Blob(['Report content would go here'], { type: 'text/html' });
  }
}
