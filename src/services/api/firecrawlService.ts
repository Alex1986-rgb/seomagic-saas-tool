
import { supabase } from '@/integrations/supabase/client';
import type { MassiveCrawlOptions, CrawlTaskData, CrawlStatus } from './types/firecrawl';
import { apiKeyManager } from './utils/apiKeyManager';
import { crawlStatusService } from './crawlStatusService';

export const firecrawlService = {
  async startMassiveCrawl(
    projectId: string, 
    url: string, 
    options: Partial<MassiveCrawlOptions> = {}
  ): Promise<{ taskId: string; success: boolean }> {
    try {
      const apiKey = await apiKeyManager.getApiKey();
      
      if (!apiKey) {
        console.error('API key not found. Please configure Firecrawl API.');
        throw new Error('API key not configured');
      }
      
      const defaultOptions: MassiveCrawlOptions = {
        maxPages: 100000,
        maxDepth: 50,
        followExternalLinks: false,
        crawlSpeed: 'medium',
        includeMedia: false,
        respectRobotsTxt: true
      };
      
      const crawlOptions = { ...defaultOptions, ...options };
      const taskId = `task_${Date.now()}`;
      
      const insertData: CrawlTaskData = {
        project_id: projectId,
        url,
        task_id: taskId,
        status: 'pending',
        progress: 0,
        pages_scanned: 0,
        estimated_total_pages: 0,
        options: crawlOptions,
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await supabase.from('crawl_tasks').insert(insertData);
      this.startStatusPolling(taskId, projectId);
      
      return { taskId, success: true };
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw error;
    }
  },

  async checkCrawlStatus(taskId: string): Promise<CrawlStatus> {
    try {
      const { data: taskData, error } = await supabase
        .from('crawl_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();
        
      if (error || !taskData) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      return {
        taskId,
        status: taskData.status,
        progress: taskData.progress || 0,
        pagesScanned: taskData.pages_scanned || 0,
        estimatedTotalPages: taskData.estimated_total_pages || 0,
        startTime: taskData.start_time || new Date().toISOString(),
        lastUpdated: taskData.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error checking status:', error);
      throw error;
    }
  },

  async getCrawlResults(taskId: string): Promise<any> {
    try {
      const status = await this.checkCrawlStatus(taskId);
      
      if (status.status !== 'completed') {
        throw new Error(`Task ${taskId} not completed yet. Current status: ${status.status}`);
      }
      
      const { data: resultsData, error } = await supabase
        .from('crawl_results')
        .select('*')
        .eq('task_id', taskId)
        .single();
        
      if (error || !resultsData) {
        throw new Error(`Results for task ${taskId} not found`);
      }
      
      return resultsData;
    } catch (error) {
      console.error('Error getting results:', error);
      throw error;
    }
  },

  async exportCrawlResults(
    taskId: string, 
    format: 'json' | 'csv' | 'xml' | 'sitemap' = 'json'
  ): Promise<Blob> {
    try {
      const results = await this.getCrawlResults(taskId);
      
      switch (format) {
        case 'json':
          return new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        case 'sitemap':
          let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
          sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
          
          if (results.urls && Array.isArray(results.urls)) {
            for (const url of results.urls) {
              sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
            }
          }
          
          sitemap += '</urlset>';
          return new Blob([sitemap], { type: 'application/xml' });
        default:
          throw new Error(`Format ${format} not supported`);
      }
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  },

  startStatusPolling(taskId: string, projectId: string) {
    let progress = 0;
    let pagesScanned = 0;
    const interval = setInterval(async () => {
      try {
        progress += Math.random() * 10;
        pagesScanned += Math.floor(Math.random() * 5000);
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Update task status to completed
          await crawlStatusService.updateTaskProgress(taskId, 100, pagesScanned, 'completed');
          
          // Generate mock URLs and save results
          const mockUrls = Array.from({ length: 100 }, (_, i) => `https://example.com/page-${i + 1}`);
          await crawlStatusService.saveCrawlResults(taskId, projectId, mockUrls, pagesScanned);
          
          // Update analytics
          const websiteUrl = await crawlStatusService.getUrlFromTaskId(taskId);
          if (websiteUrl) {
            await crawlStatusService.saveAnalytics(projectId, websiteUrl, pagesScanned);
          }
          
          console.log(`Task ${taskId} completed successfully`);
        } else {
          // Update task progress
          await crawlStatusService.updateTaskProgress(taskId, progress, pagesScanned, 'processing');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        clearInterval(interval);
      }
    }, 3000);
  }
};
