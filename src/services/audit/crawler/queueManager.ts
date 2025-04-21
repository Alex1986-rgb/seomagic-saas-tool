
/**
 * Queue management for crawler requests
 */

import { CrawlResult, DeepCrawlerOptions } from './types';

export class QueueManager {
  private maxConcurrentRequests = 30; // Увеличиваем максимальное количество параллельных запросов до 30
  private activeRequests = 0;
  private paused = false;
  private maxRetries = 3; // Добавляем возможность повторных попыток для URL
  private debug = false;
  private requestTimeout = 15000;
  private retryAttempts = 2;

  constructor() {}

  // Add the missing configure method
  configure(options: { 
    maxConcurrentRequests?: number; 
    requestTimeout?: number; 
    retryAttempts?: number; 
    debug?: boolean 
  }): void {
    if (options.maxConcurrentRequests) {
      this.maxConcurrentRequests = options.maxConcurrentRequests;
    }
    if (options.requestTimeout) {
      this.requestTimeout = options.requestTimeout;
    }
    if (options.retryAttempts) {
      this.retryAttempts = options.retryAttempts;
    }
    if (options.debug !== undefined) {
      this.debug = options.debug;
    }
    
    if (this.debug) {
      console.log('QueueManager configured with:', {
        maxConcurrentRequests: this.maxConcurrentRequests,
        requestTimeout: this.requestTimeout,
        retryAttempts: this.retryAttempts,
        debug: this.debug
      });
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  async processCrawlQueue(
    queue: { url: string; depth: number; retries?: number }[],
    visited: Set<string>,
    options: DeepCrawlerOptions,
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    const { maxPages, maxDepth, onProgress } = options;
    let pagesScanned = 0;
    const batchSize = 100; // Увеличиваем размер пакета для обработки
    
    console.log(`Начинаем обработку очереди с ${queue.length} начальными URL`);
    
    // Создаем карту для отслеживания дублирующихся URL и попыток
    const urlAttempts = new Map<string, number>();
    
    // Продолжаем, пока есть элементы в очереди и не приостановлено
    while (queue.length > 0 && !this.paused) {
      // Проверяем, достигли ли мы максимального количества страниц
      if (maxPages && pagesScanned >= maxPages) {
        console.log(`Достигнут лимит ${maxPages} страниц`);
        break;
      }
      
      // Берем пакет URL для параллельной обработки
      const batch = [];
      for (let i = 0; i < Math.min(batchSize, queue.length); i++) {
        if (queue.length === 0) break;
        
        const item = queue.shift()!;
        
        // Пропускаем, если слишком глубоко
        if (item.depth > maxDepth) {
          i--; // Компенсируем счетчик, так как этот элемент пропущен
          continue;
        }
        
        // Пропускаем, если уже посещали (и не превышен лимит попыток)
        if (visited.has(item.url)) {
          // Проверяем, не нужна ли повторная попытка
          const attempts = urlAttempts.get(item.url) || 0;
          if (attempts < this.maxRetries) {
            urlAttempts.set(item.url, attempts + 1);
            // Добавляем URL обратно в очередь с увеличенным счетчиком попыток
            queue.push({...item, retries: (item.retries || 0) + 1});
          }
          i--; // Компенсируем счетчик
          continue;
        }
        
        batch.push(item);
      }
      
      if (batch.length === 0) continue;
      
      // Проверяем, не слишком ли много активных запросов
      if (batch.length > this.maxConcurrentRequests) {
        batch.splice(this.maxConcurrentRequests).forEach(item => queue.unshift(item));
      }
      
      console.log(`Обработка пакета из ${batch.length} URL-адресов, всего просканировано: ${pagesScanned}, в очереди: ${queue.length}`);
      
      // Параллельно обрабатываем пакет URL
      await Promise.all(
        batch.map(async ({ url, depth }) => {
          // Помечаем как посещенный до обработки, чтобы избежать дублирования
          visited.add(url);
          pagesScanned++;
          
          // Сообщаем о прогрессе
          if (onProgress && pagesScanned % 10 === 0) {
            // Use the correct format for the onProgress callback
            onProgress({
              pagesScanned,
              currentUrl: url,
              totalUrls: queue.length + pagesScanned
            });
          }
          
          try {
            // Обрабатываем URL
            await processFunction(url, depth);
          } catch (error) {
            console.error(`Ошибка при обработке URL ${url}:`, error);
            // При ошибке удаляем из посещенных, чтобы попытаться снова
            visited.delete(url);
            
            // Добавляем обратно в очередь для повторной попытки, если не превышен лимит
            const attempts = urlAttempts.get(url) || 0;
            if (attempts < this.maxRetries) {
              urlAttempts.set(url, attempts + 1);
              queue.push({ url, depth, retries: attempts + 1 });
              // Не увеличиваем счетчик pagesScanned, так как этот URL не был успешно обработан
              pagesScanned--;
            }
          }
        })
      );
      
      // Небольшая пауза между пакетами, чтобы не перегружать сервер
      if (queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Уменьшаем паузу для ускорения
      }
      
      // Выводим промежуточную статистику
      if (pagesScanned % 100 === 0) {
        console.log(`Просканировано ${pagesScanned} страниц, осталось в очереди: ${queue.length}`);
      }
    }
    
    console.log(`Сканирование завершено, всего просканировано ${pagesScanned} страниц`);
    
    // Возвращаем результат
    return {
      urls: Array.from(visited),
      pageCount: pagesScanned
    };
  }
}
