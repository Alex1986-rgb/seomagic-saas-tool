
import { v4 as uuidv4 } from 'uuid';
import { CrawlTask } from './types';

/**
 * Firecrawl service for website crawling operations
 */
class FirecrawlService {
  private tasks: Record<string, CrawlTask> = {};
  private urlToTaskMap: Record<string, string> = {};

  /**
   * Start crawling a website
   */
  async startCrawl(url: string, maxPages: number = 10000): Promise<CrawlTask> {
    // Normalize URL
    const normalizedUrl = this.normalizeUrl(url);
    
    // Create a new task
    const taskId = uuidv4();
    const task: CrawlTask = {
      id: taskId,
      url: normalizedUrl,
      status: 'in_progress',
      pages_scanned: 0,
      estimated_total_pages: Math.min(maxPages, 100),
      progress: 0,
      start_time: new Date()
    };
    
    // Store the task
    this.tasks[taskId] = task;
    this.urlToTaskMap[normalizedUrl] = taskId;
    
    // Simulate async crawling
    this.simulateCrawling(taskId, maxPages);
    
    return task;
  }

  /**
   * Get task status
   */
  async getStatus(taskId: string): Promise<CrawlTask> {
    const task = this.tasks[taskId];
    
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    return task;
  }

  /**
   * Update task with sitemap URLs
   */
  async updateTaskWithSitemapUrls(taskId: string, urls: string[]): Promise<void> {
    const task = this.tasks[taskId];
    
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    // Update estimated pages if more were found in sitemap
    if (urls.length > task.estimated_total_pages) {
      task.estimated_total_pages = urls.length;
    }
  }

  /**
   * Cancel crawl
   */
  async cancelCrawl(taskId: string): Promise<{success: boolean}> {
    const task = this.tasks[taskId];
    
    if (!task) {
      return { success: false };
    }
    
    task.status = 'cancelled';
    return { success: true };
  }

  /**
   * Download sitemap
   */
  async downloadSitemap(taskId: string): Promise<Blob> {
    // This would typically generate a sitemap based on crawl results
    // For now, return a simple dummy sitemap
    const xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://example.com/</loc></url>\n</urlset>';
    return new Blob([xmlContent], { type: 'application/xml' });
  }

  /**
   * Download report
   */
  async downloadReport(taskId: string, reportType: string): Promise<Blob> {
    // This would typically generate a report based on crawl results
    // For now, return a simple dummy report
    const reportContent = `Report for task ${taskId}, type: ${reportType}\nGenerated on ${new Date().toISOString()}`;
    return new Blob([reportContent], { type: 'text/plain' });
  }

  /**
   * Get task ID for URL
   */
  getTaskIdForUrl(url: string): string | null {
    const normalizedUrl = this.normalizeUrl(url);
    return this.urlToTaskMap[normalizedUrl] || null;
  }

  /**
   * Simulate crawling process
   */
  private simulateCrawling(taskId: string, maxPages: number): void {
    const task = this.tasks[taskId];
    if (!task) return;
    
    const totalPages = Math.min(maxPages, 100);
    let scannedPages = 0;
    
    const interval = setInterval(() => {
      if (!this.tasks[taskId] || this.tasks[taskId].status !== 'in_progress') {
        clearInterval(interval);
        return;
      }
      
      scannedPages += 5;
      
      if (scannedPages >= totalPages) {
        this.tasks[taskId].status = 'completed';
        this.tasks[taskId].pages_scanned = totalPages;
        this.tasks[taskId].progress = 100;
        clearInterval(interval);
        return;
      }
      
      this.tasks[taskId].pages_scanned = scannedPages;
      this.tasks[taskId].progress = Math.floor((scannedPages / totalPages) * 100);
    }, 1000);
  }

  /**
   * Normalize URL
   */
  private normalizeUrl(url: string): string {
    // Simple normalization, remove trailing slash
    return url.replace(/\/$/, '');
  }
}

export const firecrawlService = new FirecrawlService();
