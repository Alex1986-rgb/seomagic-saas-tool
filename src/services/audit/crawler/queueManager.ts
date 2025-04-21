/**
 * Queue management for crawler requests
 */

import { CrawlResult, DeepCrawlerOptions } from './types';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class QueueManager {
  private maxConcurrentRequests = 30;
  private activeRequests = 0;
  private paused = false;
  private maxRetries = 3;
  private debug = false;
  private requestTimeout = 15000;
  private retryAttempts = 2;
  private retryDelay = 1000;
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
  ];

  constructor() {}

  // Add the configure method required by DeepCrawlerCore
  configure(options: { 
    maxConcurrentRequests?: number; 
    requestTimeout?: number; 
    retryAttempts?: number; 
    debug?: boolean;
    retryDelay?: number;
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
    if (options.retryDelay) {
      this.retryDelay = options.retryDelay;
    }
    if (options.debug !== undefined) {
      this.debug = options.debug;
    }
    
    if (this.debug) {
      console.log('QueueManager configured with:', {
        maxConcurrentRequests: this.maxConcurrentRequests,
        requestTimeout: this.requestTimeout,
        retryAttempts: this.retryAttempts,
        debug: this.debug,
        retryDelay: this.retryDelay
      });
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  // Получение случайного User-Agent для обхода блокировок
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  // Добавлен метод для получения метаданных страницы
  private async fetchPageMetadata(url: string): Promise<{title: string, description: string, status: number}> {
    try {
      const response = await axios.get(url, {
        timeout: this.requestTimeout,
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
        }
      });
      
      const $ = cheerio.load(response.data);
      const title = $('title').text() || '';
      const description = $('meta[name="description"]').attr('content') || '';
      
      return { title, description, status: response.status };
    } catch (error) {
      return { title: '', description: '', status: error.response?.status || 0 };
    }
  }

  // Улучшенный метод обработки URL с задержками и повторами
  private async processUrl(url: string, depth: number, processFunction: (url: string, depth: number) => Promise<void>): Promise<boolean> {
    let retries = 0;
    
    while (retries <= this.maxRetries) {
      try {
        if (this.debug) {
          console.log(`Обработка URL ${url} на глубине ${depth}, попытка ${retries + 1}`);
        }
        
        // Добавляем небольшую случайную задержку для более естественного поведения
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
        
        await processFunction(url, depth);
        return true; // Успешная обработка
      } catch (error) {
        retries++;
        
        if (this.debug) {
          console.warn(`Ошибка при обработке URL ${url}: ${error.message}, попытка ${retries}`);
        }
        
        // Если превышено количество попыток, прекращаем
        if (retries > this.maxRetries) {
          if (this.debug) {
            console.error(`Не удалось обработать URL ${url} после ${this.maxRetries} попыток`);
          }
          return false;
        }
        
        // Постепенно увеличиваем время задержки между попытками
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
      }
    }
    
    return false;
  }

  async processCrawlQueue(
    queue: { url: string; depth: number; retries?: number }[],
    visited: Set<string>,
    options: DeepCrawlerOptions,
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    const { maxPages, maxDepth, onProgress } = options;
    let pagesScanned = 0;
    const batchSize = 20; // Уменьшаем batch size для большей стабильности
    
    console.log(`Начинаем обработку очереди с ${queue.length} начальными URL`);
    
    // Создаем карту для отслеживания дублирующихся URL и попыток
    const urlAttempts = new Map<string, number>();
    
    // Настройка для сайтов с большим количеством страниц
    const isLargeSite = maxPages && maxPages > 10000;
    
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
      
      // Параллельно обрабатываем пакет URL с ограничением
      await Promise.all(
        batch.map(async ({ url, depth }) => {
          // Помечаем как посещенный до обработки, чтобы избежать дублирования
          visited.add(url);
          pagesScanned++;
          
          // Сообщаем о прогрессе
          if (onProgress && (pagesScanned % 5 === 0 || isLargeSite && pagesScanned < 100)) {
            // Use the correct format for the onProgress callback
            onProgress({
              pagesScanned,
              currentUrl: url,
              totalUrls: queue.length + pagesScanned
            });
          }
          
          // Обрабатываем URL с повторными попытками
          const success = await this.processUrl(url, depth, processFunction);
          
          if (!success) {
            // При неудаче удаляем из посещенных, чтобы попытаться снова
            visited.delete(url);
            pagesScanned--;
            
            // Добавляем обратно в очередь для повторной попытки, если не превышен лимит
            const attempts = urlAttempts.get(url) || 0;
            if (attempts < this.maxRetries) {
              urlAttempts.set(url, attempts + 1);
              queue.push({ url, depth, retries: attempts + 1 });
            }
          }
        })
      );
      
      // Небольшая пауза между пакетами, чтобы не перегружать сервер
      if (queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
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
      metadata: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalTime: 0,
        totalPages: pagesScanned,
        domain: ''
      }
    };
  }
}
