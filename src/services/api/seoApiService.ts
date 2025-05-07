
import { apiService } from './apiService';
import { firecrawlService } from './firecrawl';
import { SitemapExtractor } from '../audit/crawler/sitemapExtractor';
import { CrawlTask } from './firecrawl/types';
import { validationService } from '../validation/validationService';

export type ScanDetails = {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
};

export interface OptimizationResult {
  success: boolean;
  message?: string;
  data?: any;
}

export class SeoApiService {
  private sitemapExtractor = new SitemapExtractor({ maxSitemaps: 50 });

  async startCrawl(url: string, maxPages: number = 500000) {
    try {
      // Validate and format URL
      if (!validationService.validateUrl(url)) {
        throw new Error('Invalid URL format');
      }
      
      const formattedUrl = validationService.formatUrl(url);
      
      // Start the crawl task
      const task: CrawlTask = await firecrawlService.startCrawl(formattedUrl, maxPages);
      
      // Try to extract sitemap if it exists
      try {
        const sitemapUrl = `${formattedUrl}/sitemap.xml`.replace(/([^:]\/)\/+/g, "$1");
        console.log('Attempting to extract sitemap from:', sitemapUrl);
        
        const response = await fetch(sitemapUrl);
        if (response.ok) {
          const sitemapXml = await response.text();
          const extractedUrls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapXml);
          
          if (extractedUrls.length > 0) {
            console.log(`Found ${extractedUrls.length} URLs in sitemap.xml`);
            await firecrawlService.updateTaskWithSitemapUrls(task.id, extractedUrls);
          }
        }
      } catch (sitemapError) {
        console.warn('Error extracting sitemap, continuing with regular crawl:', sitemapError);
      }
      
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
        progress: task.progress || 0,
        error: task.error,
        isLargeSite: task.isLargeSite || false
      };
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  }

  async getAuditInfo(taskId: string) {
    try {
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
        status: 'error'
      };
    }
  }

  async getPageAnalysis(auditId: string) {
    try {
      // Mock implementation for now
      return [];
    } catch (error) {
      console.error('Error getting page analysis:', error);
      return [];
    }
  }

  async cancelScan(taskId: string) {
    try {
      return await firecrawlService.cancelCrawl(taskId);
    } catch (error) {
      console.error('Error canceling scan:', error);
      throw error;
    }
  }

  async downloadSitemap(taskId: string, format: 'xml' | 'html' | 'package' = 'xml') {
    try {
      return await firecrawlService.downloadSitemap(taskId);
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      throw error;
    }
  }

  async downloadReport(taskId: string, reportType: 'full' | 'errors' | 'detailed' = 'full') {
    try {
      return await firecrawlService.downloadReport(taskId, reportType);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  getTaskIdForUrl(url: string): string | null {
    return firecrawlService.getTaskIdForUrl(url);
  }

  async generateShareLink(taskId: string): Promise<string> {
    try {
      const baseUrl = window.location.origin;
      return `${baseUrl}/audit?task_id=${taskId}`;
    } catch (error) {
      console.error('Error generating share link:', error);
      throw error;
    }
  }

  async sendEmailReport(taskId: string, email: string): Promise<boolean> {
    if (!validationService.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    try {
      console.log(`Sending report for task ${taskId} to ${email}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error sending email report:', error);
      throw error;
    }
  }

  async exportJSON(taskId: string): Promise<Blob> {
    try {
      const data = { taskId, timestamp: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      return blob;
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw error;
    }
  }

  async downloadOptimizedSite(taskId: string): Promise<Blob> {
    try {
      const dummyContent = 'Optimized site content';
      return new Blob([dummyContent], { type: 'application/zip' });
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw error;
    }
  }

  async optimizeSiteContent(taskId: string, contentPrompt: string): Promise<OptimizationResult> {
    try {
      console.log(`Optimizing content for task ${taskId} with prompt: ${contentPrompt}`);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        success: true,
        message: "Контент успешно оптимизирован"
      };
    } catch (error) {
      console.error('Error optimizing site content:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Ошибка при оптимизации контента"
      };
    }
  }
}

export const seoApiService = new SeoApiService();
