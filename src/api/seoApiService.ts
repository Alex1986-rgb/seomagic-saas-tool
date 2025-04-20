
import { firecrawlService } from '../services/api/firecrawl';
import { v4 as uuidv4 } from 'uuid';

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
      
      // В реальной имплементации здесь будет интеграция с OpenAI API
      // для оптимизации содержимого сайта на основе результатов сканирования
      
      // Имитация задержки запроса к API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Возвращаем успешный результат
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
