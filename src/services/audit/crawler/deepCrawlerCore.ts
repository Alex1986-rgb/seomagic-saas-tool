
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlResult, DeepCrawlerOptions } from './types';
import { UrlProcessor } from './urlProcessor';
import { QueueManager } from './queueManager';

export class DeepCrawlerCore {
  protected visited = new Set<string>();
  protected queue: { url: string; depth: number }[] = [];
  protected domain: string;
  protected baseUrl: string;
  protected options: DeepCrawlerOptions;
  protected userAgent = 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)';
  private queueManager: QueueManager;
  private maxConcurrentRequests = 5; // Увеличиваем параллельные запросы

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = {
      ...options,
      maxPages: options.maxPages || 500000, // Увеличиваем лимит по умолчанию
      maxDepth: options.maxDepth || 10      // Увеличиваем глубину по умолчанию
    };
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    this.domain = new URL(this.baseUrl).hostname;
    this.queueManager = new QueueManager();
  }

  async startCrawling(): Promise<CrawlResult> {
    console.log(`Начинаем сканирование сайта ${this.baseUrl} с лимитом ${this.options.maxPages} страниц`);
    this.queue = [{ url: this.baseUrl, depth: 0 }];
    this.visited.clear();
    
    const result: CrawlResult = {
      urls: [],
      metadata: {
        keywords: [],
        links: { internal: 0, external: 0, broken: 0 }
      },
      brokenLinks: []
    };

    // Попытка найти карту сайта для ускорения сканирования
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`.replace(/([^:]\/)\/+/g, "$1");
      console.log('Пытаемся извлечь карту сайта из:', sitemapUrl);
      
      const response = await axios.get(sitemapUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000
      });
      
      if (response.status === 200) {
        console.log('Найдена карта сайта, извлекаем URL');
        const $ = cheerio.load(response.data, { xmlMode: true });
        const urls: string[] = [];
        
        $('url > loc').each((_, element) => {
          const url = $(element).text().trim();
          if (url) {
            urls.push(url);
            this.queue.push({ url, depth: 1 });
          }
        });
        
        console.log(`Извлечено ${urls.length} URL из карты сайта`);
      }
    } catch (error) {
      console.warn('Не удалось извлечь карту сайта, продолжаем обычное сканирование');
    }

    // Устанавливаем больший таймаут для обработки очереди
    const processTimeout = setTimeout(() => {
      console.warn(`Достигнут таймаут сканирования после ${this.visited.size} страниц`);
    }, 30 * 60 * 1000); // 30 минут таймаут

    try {
      // Используем QueueManager для эффективной обработки большой очереди
      const crawlResult = await this.queueManager.processCrawlQueue(
        this.queue,
        this.visited,
        this.options,
        this.processUrl.bind(this)
      );
      
      // Объединяем результаты
      result.urls = crawlResult.urls;
      console.log(`Сканирование завершено, найдено ${result.urls.length} страниц`);
      
      return result;
    } finally {
      clearTimeout(processTimeout);
    }
  }

  protected async processUrl(url: string, depth: number): Promise<void> {
    if (this.visited.has(url) || depth > this.options.maxDepth) {
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000 // Увеличиваем таймаут
      });

      const $ = cheerio.load(response.data);
      this.visited.add(url);

      // Извлекаем и обрабатываем ссылки
      const links = await this.processLinks($, url);
      
      // Добавляем внутренние ссылки в очередь с приоритетом для страниц товаров
      for (const link of links.internal) {
        if (!this.visited.has(link)) {
          // Проверяем, является ли страница страницей товара
          const isProductPage = /product|item|catalog|collection/i.test(link);
          
          if (isProductPage) {
            // Добавляем с высоким приоритетом
            this.queue.unshift({ url: link, depth: depth + 1 });
          } else {
            this.queue.push({ url: link, depth: depth + 1 });
          }
        }
      }

      // Сообщаем о прогрессе
      if (this.options.onProgress) {
        this.options.onProgress({
          pagesScanned: this.visited.size,
          currentUrl: url,
          totalUrls: this.queue.length + this.visited.size
        });
      }

    } catch (error) {
      console.error(`Error crawling ${url}:`, error);
      // Обрабатываем ошибку, но продолжаем сканирование
    }
  }

  private async processLinks($: cheerio.CheerioAPI, currentUrl: string) {
    const links = {
      internal: [] as string[],
      external: [] as string[],
      broken: [] as string[]
    };

    const currentUrlObj = new URL(currentUrl);
    const seenUrls = new Set<string>(); // Для избежания дублирования

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, currentUrl);
        
        // Пропускаем нежелательные URL (файлы, якоря, etc.)
        if (
          absoluteUrl.hash || // якоря
          /\.(pdf|zip|rar|jpg|jpeg|png|gif|doc|docx|xls|xlsx|csv)$/i.test(absoluteUrl.pathname) || // файлы
          absoluteUrl.pathname.includes('/wp-admin/') || // админка WordPress
          absoluteUrl.pathname.includes('/wp-login.php') // логин WordPress
        ) {
          return;
        }
        
        const urlString = absoluteUrl.href;
        if (seenUrls.has(urlString)) return;
        seenUrls.add(urlString);
        
        const isSameDomain = absoluteUrl.hostname === this.domain;

        if (isSameDomain) {
          links.internal.push(urlString);
        } else {
          links.external.push(urlString);
        }
      } catch (error) {
        // Пропускаем недействительные URL
      }
    });

    return links;
  }
}
