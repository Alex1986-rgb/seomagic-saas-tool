
import { DeepCrawler } from '../../audit/crawler/deepCrawlerCore';
import { CrawlTask, CrawlResult, TaskProgress } from './types';

export class FirecrawlService {
  private tasks = new Map<string, CrawlTask>();
  private crawlers = new Map<string, DeepCrawler>();

  /**
   * Запуск полного сканирования сайта без ограничений по количеству страниц
   * @param url URL сайта для сканирования
   * @param maxPages Максимальное количество страниц для сканирования (по умолчанию 15000000)
   * @returns ID задачи сканирования
   */
  async startCrawl(url: string, maxPages: number = 15000000): Promise<CrawlTask> {
    try {
      const taskId = crypto.randomUUID();
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      let domain = "";
      
      try {
        const urlObj = new URL(normalizedUrl);
        domain = urlObj.hostname;
      } catch (e) {
        console.error("Invalid URL:", e);
        throw new Error("Некорректный URL");
      }
      
      const task: CrawlTask = {
        id: taskId,
        url: normalizedUrl,
        domain,
        status: 'pending',
        start_time: new Date().toISOString(),
        pages_scanned: 0,
        estimated_total_pages: maxPages,
        progress: 0,
        isLargeSite: maxPages > 10000 // Помечаем как крупный сайт, если лимит больше 10k
      };

      this.tasks.set(taskId, task);

      const crawler = new DeepCrawler(normalizedUrl, {
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
    } catch (error) {
      console.error("Error starting crawl:", error);
      throw error;
    }
  }

  /**
   * Процесс сканирования в фоне
   * @param taskId ID задачи сканирования
   */
  private async processCrawl(taskId: string) {
    const task = this.tasks.get(taskId);
    const crawler = this.crawlers.get(taskId);

    if (!task || !crawler) {
      throw new Error('Task or crawler not found');
    }

    try {
      task.status = 'in_progress';
      const result = await crawler.startCrawling();
      
      // Convert crawler CrawlResult to firecrawl format
      const convertedResult: CrawlResult = {
        urls: result.urls,
        metadata: {
          keywords: [],
          sitemap: '',
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
        task.pages_scanned = result.urls.length;
      }
      
      // Генерируем Sitemap.xml
      if (result.urls && result.urls.length > 0) {
        task.sitemap = this.generateSitemap(task.domain, result.urls);
      }
      
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.tasks.set(taskId, task);
  }

  /**
   * Обновление прогресса задачи сканирования
   * @param taskId ID задачи сканирования
   * @param progress Объект прогресса задачи
   */
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

  /**
   * Получение статуса задачи сканирования
   * @param taskId ID задачи сканирования
   * @returns Объект задачи сканирования
   */
  async getStatus(taskId: string): Promise<CrawlTask> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  /**
   * Скачивание Sitemap.xml
   * @param taskId ID задачи сканирования
   * @returns Содержимое Sitemap.xml или undefined
   */
  async downloadSitemap(taskId: string): Promise<string | void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    return task.sitemap;
  }

  /**
   * Скачивание отчета о сканировании
   * @param taskId ID задачи сканирования
   * @param type Тип отчета (по умолчанию 'full')
   * @returns Результаты сканирования
   */
  async downloadReport(taskId: string, type: string = 'full'): Promise<CrawlResult> {
    const task = this.tasks.get(taskId);
    if (!task || !task.results) {
      throw new Error('Task results not found');
    }

    return task.results;
  }

  /**
   * Обновление задачи сканирования URL-ами из Sitemap
   * @param taskId ID задачи сканирования
   * @param urls Массив URL-ов
   */
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
  
  /**
   * Получение ID задачи сканирования по URL сайта
   * @param url URL сайта
   * @returns ID задачи сканирования или null
   */
  getTaskIdForUrl(url: string): string | null {
    for (const [id, task] of this.tasks.entries()) {
      if (task.url === url) {
        return id;
      }
    }
    return null;
  }

  /**
   * Генерация Sitemap.xml
   * @param domain Домен сайта
   * @param urls Массив URL-ов
   * @returns Содержимое Sitemap.xml
   */
  private generateSitemap(domain: string, urls: string[]): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Добавляем только URL текущего домена
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        // Проверяем, что URL относится к нашему домену
        if (urlObj.hostname === domain || urlObj.hostname === 'www.' + domain) {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${url}</loc>\n`;
          sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
          sitemap += '  </url>\n';
        }
      } catch (e) {
        // Пропускаем некорректные URL
        console.warn("Invalid URL:", url);
      }
    }

    sitemap += '</urlset>';
    return sitemap;
  }

  /**
   * Отмена задачи сканирования
   * @param taskId ID задачи сканирования
   */
  async cancelCrawl(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    const crawler = this.crawlers.get(taskId);

    if (task && crawler) {
      task.status = 'cancelled';
      crawler.cancel();
    }
  }
}

export const firecrawlService = new FirecrawlService();
