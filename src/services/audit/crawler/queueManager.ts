
/**
 * Queue management for crawler requests
 */

import { CrawlResult, DeepCrawlerOptions } from './types';

export class QueueManager {
  private maxConcurrentRequests = 15; // Увеличиваем максимальное количество параллельных запросов
  private activeRequests = 0;
  private paused = false;

  constructor() {}

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  async processCrawlQueue(
    queue: { url: string; depth: number }[],
    visited: Set<string>,
    options: DeepCrawlerOptions,
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    const { maxPages, maxDepth, onProgress } = options;
    let pagesScanned = 0;
    const batchSize = 50; // Обрабатываем URL пакетами
    
    console.log(`Начинаем обработку очереди с ${queue.length} начальными URL`);
    
    while (queue.length > 0 && !this.paused) {
      // Проверяем, достигли ли мы максимального количества страниц
      if (pagesScanned >= maxPages) {
        console.log(`Достигнут лимит ${maxPages} страниц`);
        break;
      }
      
      // Берем пакет URL для параллельной обработки
      const batch = [];
      for (let i = 0; i < Math.min(batchSize, queue.length); i++) {
        if (queue.length === 0) break;
        
        const item = queue.shift()!;
        
        // Пропускаем, если уже посещали или слишком глубоко
        if (visited.has(item.url) || item.depth > maxDepth) {
          i--; // Компенсируем счетчик, так как этот элемент пропущен
          continue;
        }
        
        batch.push(item);
      }
      
      if (batch.length === 0) continue;
      
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
          
          // Обрабатываем URL
          await processFunction(url, depth);
        })
      );
      
      // Небольшая пауза между пакетами, чтобы не перегружать сервер
      if (queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
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
