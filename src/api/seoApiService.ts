
import { firecrawlService } from '../services/api/firecrawl';
import { v4 as uuidv4 } from 'uuid';

export type ScanDetails = {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
};

class SeoApiService {
  async startCrawl(url: string, maxPages: number = 10000) {
    try {
      const task = await firecrawlService.startCrawl(url);
      return {
        success: true,
        task_id: task.id,
        url: task.url,
        start_time: task.start_time
      };
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw error;
    }
  }

  async getStatus(taskId: string) {
    try {
      const task = await firecrawlService.getStatus(taskId);
      return {
        task_id: task.id,
        url: task.url,
        status: task.status,
        pages_scanned: task.pages_scanned,
        total_pages: task.estimated_total_pages,
        progress: task.progress,
        error: task.error
      };
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  }

  async downloadSitemap(taskId: string, format: 'xml' | 'html' | 'package' = 'xml') {
    try {
      await firecrawlService.downloadSitemap(taskId);
      return { success: true };
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      throw error;
    }
  }

  async downloadReport(taskId: string, reportType: 'full' | 'errors' = 'full') {
    try {
      await firecrawlService.downloadReport(taskId, reportType);
      return { success: true };
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  getTaskIdForUrl(url: string): string | null {
    return firecrawlService.getTaskIdForUrl(url);
  }
}

export const seoApiService = new SeoApiService();
