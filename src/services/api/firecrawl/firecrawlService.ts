
import { DeepCrawlerCore } from '../../audit/crawler/deepCrawlerCore';
import { CrawlTask, CrawlResult, crawlTasks, TaskProgress } from './types';

export class FirecrawlService {
  private tasks = new Map<string, CrawlTask>();
  private crawlers = new Map<string, DeepCrawlerCore>();

  async startCrawl(url: string, maxPages: number = 500000): Promise<CrawlTask> {
    const taskId = crypto.randomUUID();
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    
    const task: CrawlTask = {
      id: taskId,
      url,
      domain,
      status: 'pending',
      start_time: new Date().toISOString(),
      pages_scanned: 0,
      estimated_total_pages: maxPages,
      progress: 0,
      isLargeSite: maxPages > 10000 // Помечаем как крупный сайт, если лимит больше 10k
    };

    this.tasks.set(taskId, task);

    const crawler = new DeepCrawlerCore(url, {
      maxPages,
      maxDepth: 15, // Увеличиваем глубину для больших сайтов
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
      
      // Convert CrawlResult from crawler to the firecrawl type
      const convertedResult: CrawlResult = {
        urls: result.urls,
        metadata: {
          startTime: result.metadata.startTime,
          endTime: result.metadata.endTime,
          totalTime: result.metadata.totalTime,
          domain: result.metadata.domain,
          // Add required firecrawl properties
          keywords: [],
          links: {
            internal: 0,
            external: 0,
            broken: 0
          }
        }
      };
      
      task.status = 'completed';
      task.results = convertedResult;
      task.completion_time = new Date().toISOString();
      
      // Обновляем urls в задаче
      if (result.urls) {
        task.urls = result.urls;
      }
      
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
      
      // Для крупных сайтов используем другую формулу прогресса, чтобы не держать на 1% слишком долго
      if (task.isLargeSite) {
        if (progress.pagesScanned < 100) {
          task.progress = Math.min(Math.floor((progress.pagesScanned / 100) * 5), 5); // Быстрее растет до 5%
        } else if (progress.pagesScanned < 1000) {
          task.progress = 5 + Math.min(Math.floor(((progress.pagesScanned - 100) / 900) * 15), 15); // 5-20%
        } else {
          // После 1000 страниц прогресс растет медленнее, но постоянно
          task.progress = 20 + Math.min(Math.floor(Math.log10(progress.pagesScanned) * 15), 79);
        }
      } else {
        // Для обычных сайтов обычная формула
        task.progress = Math.min(Math.floor((progress.pagesScanned / (task.estimated_total_pages || 1)) * 100), 99);
      }
      
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

  async downloadSitemap(taskId: string): Promise<string | void> {
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

    // Convert brokenLinks to expected format if needed
    if (task.results.brokenLinks && Array.isArray(task.results.brokenLinks) && 
        task.results.brokenLinks.length > 0 && typeof task.results.brokenLinks[0] !== 'string') {
      // Make a copy of the results to avoid modifying the original
      const convertedResults: CrawlResult = { ...task.results };
      return convertedResults;
    }

    return task.results;
  }

  async updateTaskWithSitemapUrls(taskId: string, urls: string[]): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.urls = urls;
    if (!task.results) {
      task.results = { urls };
    } else {
      task.results.urls = urls;
    }
    
    this.tasks.set(taskId, task);
  }
  
  getTaskIdForUrl(url: string): string | null {
    for (const [id, task] of this.tasks.entries()) {
      if (task.url === url) {
        return id;
      }
    }
    return null;
  }
}

export const firecrawlService = new FirecrawlService();
