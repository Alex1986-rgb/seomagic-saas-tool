
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
  private maxConcurrentRequests = 5; // Reduced concurrent requests
  private retryAttempts = 3;
  private requestTimeout = 20000; // Reduce timeout to 20 seconds
  private abortController: AbortController | null = null;
  private isCancelled = false;

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = {
      ...options,
      maxPages: options.maxPages || 100000, // Reduce default limit
      maxDepth: options.maxDepth || 10      // Reduce default depth
    };
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    this.domain = new URL(this.baseUrl).hostname;
    this.queueManager = new QueueManager();
  }

  cancel() {
    this.isCancelled = true;
    if (this.abortController) {
      this.abortController.abort();
    }
    this.queueManager.pause();
    console.log("Scanning cancelled by user");
  }

  async startCrawling(): Promise<CrawlResult> {
    console.log(`Beginning scan for site ${this.baseUrl} with limit of ${this.options.maxPages} pages`);
    this.queue = [{ url: this.baseUrl, depth: 0 }];
    this.visited.clear();
    this.isCancelled = false;
    this.abortController = new AbortController();
    
    const result: CrawlResult = {
      urls: [],
      pageCount: 0,
      metadata: {
        keywords: [],
        links: { internal: 0, external: 0, broken: 0 }
      },
      brokenLinks: []
    };

    // Attempt to find sitemap for faster scanning
    try {
      await this.findAndProcessSitemaps();
      console.log(`After sitemap processing, queue has ${this.queue.length} URLs`);
    } catch (error) {
      console.warn('Failed to process sitemap, continuing with normal scan');
    }

    // Set shorter processing timeout (30 minutes)
    const processTimeout = setTimeout(() => {
      console.warn(`Scan timeout reached after ${this.visited.size} pages`);
      this.queueManager.pause();
    }, 30 * 60 * 1000);

    try {
      // Use QueueManager for efficient queue processing
      const crawlResult = await this.queueManager.processCrawlQueue(
        this.queue,
        this.visited,
        this.options,
        this.processUrl.bind(this)
      );
      
      // Merge results
      result.urls = crawlResult.urls;
      result.pageCount = crawlResult.pageCount;
      console.log(`Scan completed, found ${result.urls.length} pages`);
      
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
    if (this.isCancelled || this.visited.has(url) || depth > this.options.maxDepth) {
      return;
    }

    try {
      this.abortController = new AbortController();
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.requestTimeout,
        maxRedirects: 5,
        signal: this.abortController.signal
      });

      const $ = cheerio.load(response.data);
      this.visited.add(url);

      // Extract and process links
      const links = await this.processLinks($, url);
      
      // Function to evaluate URL priority
      const getPriority = (url: string): number => {
        // Keywords for product pages
        const productKeywords = [
          '/product/', '/item/', '/catalog/', '/collection/', 
          '/shop/', '/goods/', '/category/', '/produkt/', 
          '/tovar/', '/p/', '/i/', '/products/'
        ];
        
        // Check for keywords in URL
        for (const keyword of productKeywords) {
          if (url.includes(keyword)) {
            return 1; // High priority
          }
        }
        
        // Check for file extensions (not files)
        if (!/\.(jpg|jpeg|png|gif|pdf|zip|doc|xls|csv|xml)$/i.test(url)) {
          return 2; // Medium priority
        }
        
        return 3; // Low priority
      };
      
      // Sort internal links by priority
      const sortedLinks = [...links.internal].sort((a, b) => {
        return getPriority(a) - getPriority(b);
      });
      
      // Add internal links to queue with priority
      for (const link of sortedLinks) {
        if (!this.visited.has(link)) {
          this.queue.push({ url: link, depth: depth + 1 });
        }
      }

      // Report progress
      if (this.options.onProgress) {
        this.options.onProgress({
          pagesScanned: this.visited.size,
          currentUrl: url,
          totalUrls: this.queue.length + this.visited.size
        });
      }

    } catch (error) {
      // Skip but log error
      console.error(`Error scanning ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async processLinks($: cheerio.CheerioAPI, currentUrl: string) {
    const links = {
      internal: [] as string[],
      external: [] as string[],
      broken: [] as string[]
    };

    const currentUrlObj = new URL(currentUrl);
    const seenUrls = new Set<string>(); // To avoid duplicates

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, currentUrl);
        
        // Skip URLs with anchors on current page
        if (absoluteUrl.href === currentUrl + '#' || absoluteUrl.href === currentUrl) {
          return;
        }
        
        // Skip unwanted URLs (files, admin pages, etc)
        if (
          // anchors - only skip if they refer to another fragment of the current page
          (absoluteUrl.hash && absoluteUrl.href.split('#')[0] === currentUrl) || 
          /\.(pdf|zip|rar|jpg|jpeg|png|gif|doc|docx|xls|xlsx|csv)$/i.test(absoluteUrl.pathname) || // files
          absoluteUrl.pathname.includes('/wp-admin/') || // WordPress admin
          absoluteUrl.pathname.includes('/wp-login.php') || // WordPress login
          absoluteUrl.search.includes('utm_') || // UTM parameters
          /\?(?:fbclid|gclid|msclkid|yclid)=/.test(absoluteUrl.search) // tracking parameters
        ) {
          return;
        }
        
        const urlString = absoluteUrl.href;
        
        // Normalize URL, removing trailing slash for comparison
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
        // Skip invalid URLs
      }
    });

    return links;
  }
}
