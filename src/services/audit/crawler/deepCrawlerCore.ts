/**
 * Core crawler implementation for deep site analysis
 */

import * as cheerio from 'cheerio';
import axios from 'axios';
import { CrawlResult, DeepCrawlerOptions, TaskProgress } from './types';
import { UrlProcessor } from './UrlProcessor';
import { RobotsTxtParser } from './RobotsTxtParser';
import { CrawlQueueManager } from './CrawlQueueManager';

export class DeepCrawlerCore {
  protected url: string;
  protected options: DeepCrawlerOptions;
  private urlProcessor: UrlProcessor;
  private robotsParser: RobotsTxtParser;
  private queueManager: CrawlQueueManager;
  private isCancelled = false;
  private debugMode = false;
  private retryCount = 2;
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ];

  constructor(url: string, options: DeepCrawlerOptions) {
    // Validate URL
    if (!url) {
      throw new Error('URL cannot be empty');
    }

    // Инициализация процессора URL
    this.urlProcessor = new UrlProcessor(url);
    this.url = url;
    
    // Инициализация парсера robots.txt
    this.robotsParser = new RobotsTxtParser();
    
    // Set default options with fallbacks
    this.options = {
      maxPages: options.maxPages || 50000,
      maxDepth: options.maxDepth || 10,
      onProgress: options.onProgress || (() => {}),
    };

    // Инициализация менеджера очереди
    this.queueManager = new CrawlQueueManager();
    this.queueManager.configure({
      maxConcurrentRequests: 10,
      retryAttempts: 3,
      requestTimeout: 15000,
      debug: false
    });
  }

  /**
   * Получение домена для текущего сканирования
   */
  getDomain(): string {
    return this.urlProcessor.getDomain();
  }

  /**
   * Получение базового URL для текущего сканирования
   */
  getBaseUrl(): string {
    return this.urlProcessor.getBaseUrl();
  }

  /**
   * Включение или отключение режима отладки
   */
  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Отмена текущего процесса сканирования
   */
  cancel(): void {
    this.isCancelled = true;
    this.queueManager.pause();
    
    if (this.debugMode) {
      console.log('Crawling cancelled by user');
    }
  }

  /**
   * Получает случайный User-Agent для избежания обнаружения
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Запуск процесса сканирования
   */
  async startCrawling(): Promise<CrawlResult> {
    try {
      if (this.debugMode) {
        console.log(`Starting deep crawl for ${this.url}`);
      }

      // Сброс состояния для нового сканирования
      const queue: { url: string; depth: number }[] = [];
      const visited = new Set<string>();
      this.isCancelled = false;
      this.queueManager.reset();
      this.queueManager.resume();

      // Добавление начального URL в очередь
      queue.push({ url: this.url, depth: 0 });

      // Получение и парсинг robots.txt
      await this.parseRobotsTxt();

      // Начало сканирования
      const result = await this.queueManager.processCrawlQueue(
        queue,
        visited,
        this.options,
        this.processSingleUrl.bind(this)
      );

      // Добавляем домен к метаданным
      result.metadata.domain = this.urlProcessor.getDomain();

      return {
        urls: [],
        visitedCount: 0,
        metadata: {
          totalRequests: 0,
          successRequests: 0,
          failedRequests: 0,
          domain: this.urlProcessor.getDomain(),
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          totalTime: 0
        }
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }

  /**
   * Парсинг файла robots.txt, если он доступен
   */
  private async parseRobotsTxt(): Promise<void> {
    try {
      const disallowedPaths = await this.robotsParser.parse(this.urlProcessor.getBaseUrl());
      this.urlProcessor.setRobotsTxtPaths(disallowedPaths);
    } catch (error) {
      console.warn('Could not parse robots.txt:', error);
    }
  }

  /**
   * Обработка одного URL
   */
  private async processSingleUrl(url: string, depth: number): Promise<void> {
    if (this.isCancelled) {
      return;
    }

    try {
      // Пропускать, если не разрешено в robots.txt
      if (!this.urlProcessor.isAllowedByRobotsTxt(url)) {
        return;
      }

      // Попытка получить URL с логикой повторных попыток
      let response;
      let retryCount = 0;
      
      while (retryCount <= this.retryCount) {
        try {
          response = await axios.get(url, {
            headers: {
              'User-Agent': this.getRandomUserAgent(),
              'Accept': 'text/html,application/xhtml+xml',
              'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
            },
            timeout: 10000,
            maxRedirects: 5
          });
          break; // Успех, выходим из цикла повторных попыток
        } catch (error) {
          retryCount++;
          if (retryCount > this.retryCount) {
            throw error;
          }
          
          // Экспоненциальное замедление
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!response) {
        return;
      }

      // Обрабатывать только HTML контент
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        return;
      }

      // Извлечение ссылок из страницы
      const links = this.extractLinks(response.data, url);
      
      // Фильтрация и сортировка по приоритету
      const sortedLinks = this.urlProcessor.sortByPriority(links);

      // Обработка отсортированных ссылок
      for (const link of sortedLinks) {
        try {
          const normalizedLink = this.urlProcessor.normalize(link);
          if (this.urlProcessor.shouldCrawl(normalizedLink)) {
            this.queueManager.addToQueue(normalizedLink, depth + 1);
          }
        } catch (error) {
          // Некорректная ссылка, пропускаем
        }
      }
    } catch (error) {
      if (this.debugMode) {
        console.error(`Error processing ${url}:`, error);
      }
    }
  }

  /**
   * Извлечение ссылок из HTML контента
   */
  private extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const $ = cheerio.load(html);
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          // Резолв относительных URL
          const resolvedUrl = new URL(href, baseUrl).href;
          links.push(resolvedUrl);
        } catch (error) {
          // Пропускаем некорректные URL
        }
      }
    });
    
    return links;
  }
}
