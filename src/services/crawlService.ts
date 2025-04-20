
import axios from 'axios';

interface CrawlTask {
  id: string;
  status: string;
  progress: number;
  url: string;
  currentUrl: string; // Fixed property name from current_url to currentUrl
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
}

export class CrawlService {
  private static API_URL = process.env.REACT_APP_API_URL || '/api';
  
  static async startCrawl(url: string, options?: {
    depth?: number;
    maxPages?: number;
    includeImages?: boolean;
    followExternalLinks?: boolean;
  }): Promise<{ taskId: string }> {
    try {
      const response = await axios.post(`${this.API_URL}/crawl`, {
        url,
        options
      });
      
      return { taskId: response.data.taskId };
    } catch (error) {
      console.error('Error starting crawl task:', error);
      throw new Error('Failed to start crawl task');
    }
  }
  
  static async getCrawlStatus(taskId: string): Promise<CrawlTask> {
    try {
      const response = await axios.get(`${this.API_URL}/crawl/${taskId}/status`);
      
      // Convert API property from snake_case to camelCase if needed
      const data = response.data;
      if (data.current_url && !data.currentUrl) {
        data.currentUrl = data.current_url;
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
}
