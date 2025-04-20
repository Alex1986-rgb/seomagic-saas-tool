
import { DeepCrawlerCore } from '../../audit/crawler/deepCrawlerCore';
import { CrawlTask, CrawlResult } from './types';

interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

export class FirecrawlService {
  private tasks = new Map<string, CrawlTask>();
  private crawlers = new Map<string, DeepCrawlerCore>();

  async startCrawl(url: string, maxPages: number = 500000): Promise<CrawlTask> {
    const taskId = crypto.randomUUID();
    const task: CrawlTask = {
      id: taskId,
      url,
      status: 'pending',
      start_time: new Date().toISOString(),
      pages_scanned: 0,
      estimated_total_pages: maxPages
    };

    this.tasks.set(taskId, task);

    const crawler = new DeepCrawlerCore(url, {
      maxPages,
      maxDepth: 10,
      onProgress: (progress: TaskProgress) => {
        this.updateTaskProgress(taskId, progress);
      }
    });

    this.crawlers.set(taskId, crawler);

    // Start crawling in background
    this.processCrawl(taskId);

    return task;
  }

  private async processCrawl(taskId: string) {
    const task = this.tasks.get(taskId);
    const crawler = this.crawlers.get(taskId);

    if (!task || !crawler) {
      throw new Error('Task or crawler not found');
    }

    try {
      task.status = 'in_progress';
      const result = await crawler.startCrawling();
      
      task.status = 'completed';
      task.results = result;
      task.completion_time = new Date().toISOString();
      
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.tasks.set(taskId, task);
  }

  private updateTaskProgress(taskId: string, progress: TaskProgress) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.pages_scanned = progress.pagesScanned;
      task.current_url = progress.currentUrl;
      this.tasks.set(taskId, task);
    }
  }

  async getStatus(taskId: string): Promise<CrawlTask> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async downloadSitemap(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task || !task.results) {
      throw new Error('Task results not found');
    }

    return task.results.metadata?.sitemap;
  }

  async downloadReport(taskId: string, type: string = 'full'): Promise<CrawlResult> {
    const task = this.tasks.get(taskId);
    if (!task || !task.results) {
      throw new Error('Task results not found');
    }

    return task.results;
  }
}

export const firecrawlService = new FirecrawlService();
