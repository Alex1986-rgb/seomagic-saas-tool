
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
  private maxConcurrentRequests = 15; // Увеличиваем параллельные запросы
  private retryAttempts = 3; // Добавляем повторные попытки
  private requestTimeout = 30000; // Увеличиваем таймаут до 30 секунд

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = {
      ...options,
      maxPages: options.maxPages || 500000, // Увеличиваем лимит по умолчанию
      maxDepth: options.maxDepth || 15      // Увеличиваем глубину по умолчанию
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
      pageCount: 0, // Initialize pageCount with 0
      metadata: {
        keywords: [],
        links: { internal: 0, external: 0, broken: 0 }
      },
      brokenLinks: []
    };

    // Попытка найти карту сайта для ускорения сканирования
    try {
      await this.findAndProcessSitemaps();
      console.log(`После обработки карты сайта в очереди ${this.queue.length} URL-адресов`);
    } catch (error) {
      console.warn('Не удалось обработать карту сайта, продолжаем обычное сканирование');
    }

    // Устанавливаем больший таймаут для обработки очереди (2 часа)
    const processTimeout = setTimeout(() => {
      console.warn(`Достигнут таймаут сканирования после ${this.visited.size} страниц`);
      this.queueManager.pause();
    }, 2 * 60 * 60 * 1000);

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
      result.pageCount = crawlResult.pageCount; // Set the pageCount from crawlResult
      console.log(`Сканирование завершено, найдено ${result.urls.length} страниц`);
      
      return result;
    } finally {
      clearTimeout(processTimeout);
    }
  }

  // Новый метод для поиска и обработки sitemap.xml
  private async findAndProcessSitemaps(): Promise<void> {
    const possibleSitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/sitemap-index.xml`,
      `${this.baseUrl}/sitemaps/sitemap.xml`,
      `${this.baseUrl}/wp-sitemap.xml`
    ];
    
    // Также проверяем robots.txt
    try {
      const robotsUrl = `${this.baseUrl}/robots.txt`;
      const robotsResponse = await axios.get(robotsUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.requestTimeout
      });
      
      if (robotsResponse.status === 200) {
        const robotsText = robotsResponse.data;
        const sitemapMatches = robotsText.match(/Sitemap:\s*(https?:\/\/[^\s]+)/gi);
        
        if (sitemapMatches) {
          sitemapMatches.forEach(match => {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            possibleSitemapUrls.push(sitemapUrl);
          });
        }
      }
    } catch (error) {
      console.warn('Не удалось получить robots.txt:', error);
    }
    
    // Проверяем каждый возможный URL карты сайта
    for (const sitemapUrl of possibleSitemapUrls) {
      try {
        console.log(`Проверка карты сайта: ${sitemapUrl}`);
        const response = await axios.get(sitemapUrl, {
          headers: { 'User-Agent': this.userAgent },
          timeout: this.requestTimeout
        });
        
        if (response.status === 200) {
          console.log(`Найдена карта сайта: ${sitemapUrl}`);
          
          // Извлекаем URL из карты сайта
          const $ = cheerio.load(response.data, { xmlMode: true });
          let urlsFound = 0;
          
          // Проверяем, является ли это индексом карты сайта
          const sitemapNodes = $('sitemapindex sitemap loc');
          if (sitemapNodes.length > 0) {
            console.log(`Обнаружен индекс карты сайта с ${sitemapNodes.length} подкартами`);
            
            // Обрабатываем каждую подкарту сайта
            const subsitemapPromises = [];
            sitemapNodes.each((_, element) => {
              const subsitemapUrl = $(element).text().trim();
              if (subsitemapUrl) {
                subsitemapPromises.push(this.processSitemap(subsitemapUrl));
              }
            });
            
            // Ждем завершения обработки всех подкарт
            await Promise.all(subsitemapPromises);
          } else {
            // Обрабатываем обычную карту сайта
            urlsFound = await this.processUrlsFromSitemap($);
            console.log(`Извлечено ${urlsFound} URL из карты сайта ${sitemapUrl}`);
          }
        }
      } catch (error) {
        console.warn(`Ошибка при проверке карты сайта ${sitemapUrl}:`, error);
      }
    }
  }
  
  // Обработка отдельной карты сайта
  private async processSitemap(sitemapUrl: string): Promise<number> {
    try {
      console.log(`Обработка подкарты сайта: ${sitemapUrl}`);
      const response = await axios.get(sitemapUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.requestTimeout
      });
      
      if (response.status === 200) {
        const $ = cheerio.load(response.data, { xmlMode: true });
        return await this.processUrlsFromSitemap($);
      }
    } catch (error) {
      console.warn(`Ошибка при обработке подкарты сайта ${sitemapUrl}:`, error);
    }
    
    return 0;
  }
  
  // Извлечение URL из загруженной карты сайта
  private async processUrlsFromSitemap($: cheerio.CheerioAPI): Promise<number> {
    let urlCount = 0;
    
    $('url > loc').each((_, element) => {
      const url = $(element).text().trim();
      if (url) {
        // Отфильтровываем внешние домены
        try {
          const urlObj = new URL(url);
          if (urlObj.hostname === this.domain || urlObj.hostname === 'www.' + this.domain) {
            // Добавляем в начало очереди с приоритетом
            this.queue.unshift({ url, depth: 1 });
            urlCount++;
          }
        } catch (error) {
          console.warn(`Некорректный URL в карте сайта: ${url}`);
        }
      }
    });
    
    return urlCount;
  }

  protected async processUrl(url: string, depth: number): Promise<void> {
    if (this.visited.has(url) || depth > this.options.maxDepth) {
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.requestTimeout,
        maxRedirects: 5 // Увеличиваем количество разрешенных редиректов
      });

      const $ = cheerio.load(response.data);
      this.visited.add(url);

      // Извлекаем и обрабатываем ссылки
      const links = await this.processLinks($, url);
      
      // Функция оценки приоритета URL
      const getPriority = (url: string): number => {
        // Ищем ключевые слова для продуктовых страниц
        const productKeywords = [
          '/product/', '/item/', '/catalog/', '/collection/', 
          '/shop/', '/goods/', '/category/', '/produkt/', 
          '/tovar/', '/p/', '/i/', '/products/'
        ];
        
        // Проверяем на наличие ключевых слов в URL
        for (const keyword of productKeywords) {
          if (url.includes(keyword)) {
            return 1; // Высокий приоритет
          }
        }
        
        // Проверяем на наличие расширения в URL (не файлы)
        if (!/\.(jpg|jpeg|png|gif|pdf|zip|doc|xls|csv|xml)$/i.test(url)) {
          return 2; // Средний приоритет
        }
        
        return 3; // Низкий приоритет
      };
      
      // Сортируем внутренние ссылки по приоритету
      const sortedLinks = [...links.internal].sort((a, b) => {
        return getPriority(a) - getPriority(b);
      });
      
      // Добавляем внутренние ссылки в очередь с учетом приоритета
      for (const link of sortedLinks) {
        if (!this.visited.has(link)) {
          this.queue.push({ url: link, depth: depth + 1 });
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
        
        // Пропускаем URL с якорями на текущей странице
        if (absoluteUrl.href === currentUrl + '#' || absoluteUrl.href === currentUrl) {
          return;
        }
        
        // Пропускаем нежелательные URL (файлы, якоря, etc.)
        if (
          // якоря - пропускаем только если они указывают на другой фрагмент текущей страницы
          (absoluteUrl.hash && absoluteUrl.href.split('#')[0] === currentUrl) || 
          /\.(pdf|zip|rar|jpg|jpeg|png|gif|doc|docx|xls|xlsx|csv)$/i.test(absoluteUrl.pathname) || // файлы
          absoluteUrl.pathname.includes('/wp-admin/') || // админка WordPress
          absoluteUrl.pathname.includes('/wp-login.php') || // логин WordPress
          absoluteUrl.search.includes('utm_') || // UTM-метки
          /\?(?:fbclid|gclid|msclkid|yclid)=/.test(absoluteUrl.search) // параметры отслеживания
        ) {
          return;
        }
        
        const urlString = absoluteUrl.href;
        
        // Нормализуем URL, удаляя трейлинг слэш для сравнения
        const normalizedUrl = urlString.endsWith('/') ? urlString.slice(0, -1) : urlString;
        
        if (seenUrls.has(normalizedUrl)) return;
        seenUrls.add(normalizedUrl);
        
        const isSameDomain = absoluteUrl.hostname === this.domain || 
                             absoluteUrl.hostname === 'www.' + this.domain;

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
