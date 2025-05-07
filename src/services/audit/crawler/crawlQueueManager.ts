
import { CrawlResult, DeepCrawlerOptions } from './types';

/**
 * Класс для управления очередью сканирования
 */
export class CrawlQueueManager {
  private queue: { url: string; depth: number }[] = [];
  private visited = new Set<string>();
  private processing = new Set<string>();
  private maxConcurrentRequests = 10;
  private retryAttempts = 3;
  private requestTimeout = 15000;
  private debug = false;
  private isPaused = false;

  /**
   * Настройка очереди сканирования
   */
  configure(options: { 
    maxConcurrentRequests?: number; 
    retryAttempts?: number;
    requestTimeout?: number;
    debug?: boolean;
  }): void {
    if (options.maxConcurrentRequests) this.maxConcurrentRequests = options.maxConcurrentRequests;
    if (options.retryAttempts) this.retryAttempts = options.retryAttempts;
    if (options.requestTimeout) this.requestTimeout = options.requestTimeout;
    if (options.debug !== undefined) this.debug = options.debug;
  }

  /**
   * Добавление URL в очередь
   */
  addToQueue(url: string, depth: number): void {
    if (!this.visited.has(url) && !this.processing.has(url)) {
      this.queue.push({ url, depth });
      this.processing.add(url);
    }
  }

  /**
   * Пауза обработки очереди
   */
  pause(): void {
    this.isPaused = true;
    if (this.debug) {
      console.log('Queue processing paused');
    }
  }

  /**
   * Возобновление обработки очереди
   */
  resume(): void {
    this.isPaused = false;
    if (this.debug) {
      console.log('Queue processing resumed');
    }
  }

  /**
   * Сброс очереди и посещенных URL
   */
  reset(): void {
    this.queue = [];
    this.visited.clear();
    this.processing.clear();
    this.isPaused = false;
  }

  /**
   * Основной метод обработки очереди сканирования
   */
  async processCrawlQueue(
    initialQueue: { url: string; depth: number }[],
    visitedUrls: Set<string>,
    options: DeepCrawlerOptions,
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    const startTime = new Date();
    this.queue = [...initialQueue];
    this.visited = new Set(visitedUrls);
    
    const maxPages = options.maxPages || 10000;
    const maxDepth = options.maxDepth || 10;
    const onProgress = options.onProgress || (() => {});
    
    try {
      while (this.queue.length > 0 && this.visited.size < maxPages && !this.isPaused) {
        // Берем пакет URL для параллельной обработки
        const batch = this.queue.splice(0, this.maxConcurrentRequests)
          .filter(item => item.depth <= maxDepth && !this.visited.has(item.url));
        
        if (batch.length === 0) continue;
        
        // Отмечаем URL как посещенные
        batch.forEach(item => this.visited.add(item.url));
        
        // Запускаем параллельную обработку
        await Promise.all(
          batch.map(item => processFunction(item.url, item.depth)
            .catch(error => {
              if (this.debug) {
                console.error(`Error processing ${item.url}:`, error);
              }
            })
          )
        );
        
        // Вызов колбэка прогресса
        const progress = Math.min((this.visited.size / maxPages) * 100, 100);
        onProgress(progress, this.visited.size, maxPages);
        
        // Небольшая пауза, чтобы не перегружать сервер
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const endTime = new Date();
      const totalTime = endTime.getTime() - startTime.getTime();
      
      return {
        urls: Array.from(this.visited),
        pageCount: this.visited.size,
        metadata: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          totalTime,
          totalPages: this.visited.size,
          domain: '', // Должен быть установлен вызывающей стороной
        }
      };
    } catch (error) {
      console.error('Error during crawl queue processing:', error);
      throw error;
    }
  }
}
