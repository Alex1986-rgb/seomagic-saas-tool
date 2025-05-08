
import { apiClient } from '../client/apiClient';
import { formatApiError } from '../client/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { SitemapExtractor } from '../audit/crawler/sitemapExtractor';
import { firecrawlService } from './firecrawl/index';
import { CrawlTask } from './firecrawl/types';

export type ScanDetails = {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress?: number; // Make progress optional
};

// Renamed to ApiOptimizationResult to avoid conflict
export interface ApiOptimizationResult {
  success: boolean;
  message?: string;
  data?: any;
}

class SeoApiService {
  private sitemapExtractor = new SitemapExtractor();
  private taskStorage: Record<string, string> = {};

  async startCrawl(url: string, maxPages: number = 500000): Promise<{task_id: string; url: string; start_time: Date}> {
    try {
      // First start the sitemap creation/extraction process
      const task: CrawlTask = await firecrawlService.startCrawl(url, maxPages);
      
      // Try to extract sitemap.xml if it exists
      try {
        const sitemapUrl = `${url}/sitemap.xml`.replace(/([^:]\/)\/+/g, "$1");
        console.log('Attempting to extract sitemap from:', sitemapUrl);
        
        const response = await fetch(sitemapUrl);
        if (response.ok) {
          const sitemapXml = await response.text();
          const extractedUrls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapXml);
          
          // Update task with sitemap data
          if (extractedUrls.length > 0) {
            console.log(`Found ${extractedUrls.length} URLs in sitemap.xml`);
            
            // Update task with sitemap URLs
            await firecrawlService.updateTaskWithSitemapUrls(task.id, extractedUrls);
          }
        }
      } catch (sitemapError) {
        console.warn('Error extracting sitemap, continuing with regular crawl:', sitemapError);
      }
      
      return {
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
      // Get task status
      const status = await this.getStatus(taskId);
      
      // Return page count data
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

  async downloadSitemap(taskId: string, format: 'xml' | 'html' | 'package' = 'xml'): Promise<{ success: boolean }> {
    try {
      await firecrawlService.downloadSitemap(taskId);
      return { success: true };
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      throw error;
    }
  }

  async downloadReport(taskId: string, reportType: 'full' | 'errors' | 'detailed' = 'full'): Promise<{ success: boolean }> {
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

  saveTaskIdForUrl(url: string, taskId: string): void {
    // Store in both in-memory cache and localStorage
    this.taskStorage[url] = taskId;
    localStorage.setItem(`task_id_${url}`, taskId);
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
      throw new Error('Failed to export JSON data');
    }
  }

  async downloadOptimizedSite(taskId: string): Promise<Blob> {
    try {
      const dummyContent = 'Optimized site content';
      return new Blob([dummyContent], { type: 'application/zip' });
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw new Error('Failed to download optimized site');
    }
  }

  async optimizeSiteContent(taskId: string, contentPrompt: string): Promise<ApiOptimizationResult> {
    try {
      console.log(`Optimizing content for task ${taskId} with prompt: ${contentPrompt}`);
      
      // In a real implementation, this would integrate with OpenAI API
      // to optimize the site content based on scan results
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return success result
      return {
        success: true,
        message: "Content successfully optimized"
      };
    } catch (error) {
      console.error('Error optimizing site content:', error);
      const formattedError = formatApiError(error);
      return {
        success: false,
        message: formattedError.message
      };
    }
  }
}

export const seoApiService = new SeoApiService();
