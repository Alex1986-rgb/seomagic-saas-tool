
import { CrawlResult } from './types';

interface QueueManagerOptions {
  maxConcurrentRequests: number;
  retryAttempts: number;
  requestTimeout: number;
  debug: boolean;
}

/**
 * Класс для управления очередью сканирования страниц
 */
export class CrawlQueueManager {
  private maxConcurrentRequests: number = 5;
  private retryAttempts: number = 3;
  private requestTimeout: number = 10000;
  private debug: boolean = false;
  private paused: boolean = false;
  
  // Метрики сканирования
  private activeRequests: number = 0;
  private completedRequests: number = 0;
  private failedRequests: number = 0;
  
  /**
   * Конфигурирует очередь сканирования
   */
  configure(options: QueueManagerOptions): void {
    this.maxConcurrentRequests = options.maxConcurrentRequests;
    this.retryAttempts = options.retryAttempts;
    this.requestTimeout = options.requestTimeout;
    this.debug = options.debug;
  }
  
  /**
   * Сбрасывает состояние очереди
   */
  reset(): void {
    this.activeRequests = 0;
    this.completedRequests = 0;
    this.failedRequests = 0;
    this.paused = false;
  }
  
  /**
   * Приостанавливает обработку очереди
   */
  pause(): void {
    this.paused = true;
    if (this.debug) {
      console.log('Queue processing paused');
    }
  }
  
  /**
   * Возобновляет обработку очереди
   */
  resume(): void {
    this.paused = false;
    if (this.debug) {
      console.log('Queue processing resumed');
    }
  }
  
  /**
   * Добавляет URL в очередь сканирования
   */
  addToQueue(url: string, depth: number): void {
    // Реализация добавления URL в очередь
    // В реальном применении здесь была бы логика управления очередью
    if (this.debug) {
      console.log(`Added to queue: ${url} at depth ${depth}`);
    }
  }
  
  /**
   * Обрабатывает очередь сканирования
   */
  async processCrawlQueue(
    queue: { url: string; depth: number }[], 
    visited: Set<string>,
    options: any,
    processUrlFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    const result: CrawlResult = {
      urls: [],
      visitedCount: 0,
      metadata: {
        totalRequests: 0,
        successRequests: 0,
        failedRequests: 0,
        domain: '',
        startTime: new Date().toISOString(),
        endTime: '',
        totalTime: 0
      }
    };
    
    const startTime = Date.now();
    
    let index = 0;
    const batchSize = this.maxConcurrentRequests;
    
    while (index < queue.length && !this.paused && result.visitedCount < options.maxPages) {
      // Обработка текущего батча URL
      const currentBatch = queue.slice(index, index + batchSize)
        .filter(item => !visited.has(item.url) && item.depth <= options.maxDepth);
      
      if (currentBatch.length === 0) {
        break;
      }
      
      // Параллельная обработка URLs в текущем батче
      await Promise.all(
        currentBatch.map(async item => {
          const { url, depth } = item;
          
          if (visited.has(url)) return;
          
          visited.add(url);
          result.visitedCount++;
          result.urls.push(url);
          
          // Обработка одного URL
          try {
            this.activeRequests++;
            await processUrlFunction(url, depth);
            this.completedRequests++;
            result.metadata.successRequests++;
          } catch (error) {
            this.failedRequests++;
            result.metadata.failedRequests++;
            if (this.debug) {
              console.error(`Error processing ${url}:`, error);
            }
          } finally {
            this.activeRequests--;
          }
          
          // Вызов callback функции для обновления UI
          if (options.onProgress) {
            options.onProgress(
              result.visitedCount, 
              Math.min(queue.length, options.maxPages), 
              url
            );
          }
        })
      );
      
      index += batchSize;
    }
    
    // Заполнение результатов
    const endTime = Date.now();
    result.metadata.totalTime = (endTime - startTime) / 1000;
    result.metadata.endTime = new Date().toISOString();
    result.metadata.totalRequests = result.metadata.successRequests + result.metadata.failedRequests;
    
    return result;
  }
  
  /**
   * Получить текущие метрики сканирования
   */
  getMetrics() {
    return {
      activeRequests: this.activeRequests,
      completedRequests: this.completedRequests,
      failedRequests: this.failedRequests,
      isPaused: this.paused,
    };
  }
}
