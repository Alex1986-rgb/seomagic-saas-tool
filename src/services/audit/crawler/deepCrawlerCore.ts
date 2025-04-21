
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
  protected userAgent = 'Mozilla/5.0 (compatible; LovableSEOAuditBot/1.1)';
  private queueManager: QueueManager;
  private maxConcurrentRequests = 10; // Увеличиваем для быстрого сканирования
  private retryAttempts = 3;
  private requestTimeout = 15000; // 15 seconds timeout
  private abortController: AbortController | null = null;
  private isCancelled = false;
  private debugMode = false;

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = {
      ...options,
      maxPages: options.maxPages || 100000, // Увеличиваем лимит по умолчанию
      maxDepth: options.maxDepth || 15      // Увеличиваем глубину по умолчанию
    };
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    this.domain = new URL(this.baseUrl).hostname;
    this.queueManager = new QueueManager();
    console.log(`DeepCrawlerCore initialized with ${this.baseUrl}, domain: ${this.domain}, maxPages: ${this.options.maxPages}`);
  }

  enableDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  logCrawlSettings(): void {
    console.log('Crawler settings:', {
      baseUrl: this.baseUrl,
      domain: this.domain,
      maxPages: this.options.maxPages,
      maxDepth: this.options.maxDepth,
      maxConcurrentRequests: this.maxConcurrentRequests,
      retryAttempts: this.retryAttempts,
      requestTimeout: this.requestTimeout
    });
  }

  cancel() {
    this.isCancelled = true;
    if (this.abortController) {
      this.abortController.abort();
    }
    this.queueManager.pause();
    console.log("Scanning cancelled by user");
  }

  getDomain(): string {
    return this.domain;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async startCrawling(): Promise<CrawlResult> {
    console.log(`Beginning scan for site ${this.baseUrl} with limit of ${this.options.maxPages} pages`);
    
    // Reset state
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
      
      // Log the first 5 URLs in the queue for debugging
      if (this.debugMode && this.queue.length > 0) {
        console.log('First URLs in queue after sitemap processing:');
        for (let i = 0; i < Math.min(5, this.queue.length); i++) {
          console.log(`  ${i+1}. ${this.queue[i].url} (depth: ${this.queue[i].depth})`);
        }
      }
    } catch (error) {
      console.warn('Failed to process sitemap, continuing with normal scan:', error);
    }

    // Set shorter processing timeout (45 minutes)
    const processTimeout = setTimeout(() => {
      console.warn(`Scan timeout reached after ${this.visited.size} pages`);
      this.queueManager.pause();
    }, 45 * 60 * 1000);

    try {
      // Configure queue manager with better settings
      this.queueManager.configure({
        maxConcurrentRequests: this.maxConcurrentRequests,
        requestTimeout: this.requestTimeout,
        retryAttempts: this.retryAttempts,
        debug: this.debugMode
      });
      
      // Start the crawl process with improved logging
      console.log('Starting to process the URL queue');
      const crawlResult = await this.queueManager.processCrawlQueue(
        this.queue,
        this.visited,
        this.options,
        this.processUrl.bind(this)
      );
      
      // Merge results
      result.urls = crawlResult.urls;
      result.pageCount = crawlResult.pageCount;
      
      // Extra logging
      console.log(`Scan completed, found ${result.urls.length} pages`);
      console.log(`Visited ${this.visited.size} unique URLs`);
      if (this.debugMode) {
        console.log(`First 5 discovered URLs:`);
        for (let i = 0; i < Math.min(5, result.urls.length); i++) {
          console.log(`  ${i+1}. ${result.urls[i]}`);
        }
      }
      
      return result;
    } finally {
      clearTimeout(processTimeout);
    }
  }

  // Improved method for finding and processing sitemaps
  private async findAndProcessSitemaps(): Promise<void> {
    const possibleSitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/sitemap-index.xml`,
      `${this.baseUrl}/sitemaps/sitemap.xml`,
      `${this.baseUrl}/wp-sitemap.xml`,
      // Add more common sitemap paths
      `${this.baseUrl}/sitemap1.xml`,
      `${this.baseUrl}/sitemap_1.xml`,
      `${this.baseUrl}/sitemap/sitemap.xml`,
      `${this.baseUrl}/sitemap_product.xml`,
      `${this.baseUrl}/sitemap_category.xml`
    ];
    
    console.log(`Checking ${possibleSitemapUrls.length} possible sitemap locations`);
    
    // Also check robots.txt
    try {
      const robotsUrl = `${this.baseUrl}/robots.txt`;
      console.log(`Checking robots.txt at ${robotsUrl}`);
      
      const robotsResponse = await axios.get(robotsUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.requestTimeout,
        validateStatus: status => status < 500 // Accept 404s without throwing
      });
      
      if (robotsResponse.status === 200) {
        const robotsText = robotsResponse.data;
        console.log(`Found robots.txt, looking for Sitemap entries`);
        
        const sitemapMatches = robotsText.match(/Sitemap:\s*(https?:\/\/[^\s]+)/gi);
        
        if (sitemapMatches && sitemapMatches.length > 0) {
          console.log(`Found ${sitemapMatches.length} sitemap entries in robots.txt`);
          sitemapMatches.forEach(match => {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            possibleSitemapUrls.push(sitemapUrl);
            console.log(`Added sitemap from robots.txt: ${sitemapUrl}`);
          });
        } else {
          console.log(`No sitemap entries found in robots.txt`);
        }
      } else {
        console.log(`robots.txt not found (status ${robotsResponse.status})`);
      }
    } catch (error) {
      console.warn('Не удалось получить robots.txt:', error);
    }
    
    let sitemapsProcessed = 0;
    let urlsAdded = 0;
    
    // Проверяем каждый возможный URL карты сайта
    for (const sitemapUrl of possibleSitemapUrls) {
      try {
        console.log(`Проверка карты сайта: ${sitemapUrl}`);
        const response = await axios.get(sitemapUrl, {
          headers: { 'User-Agent': this.userAgent },
          timeout: this.requestTimeout,
          validateStatus: status => status < 500 // Accept 404s without throwing
        });
        
        if (response.status === 200) {
          console.log(`Найдена карта сайта: ${sitemapUrl} (${response.data.length} bytes)`);
          sitemapsProcessed++;
          
          // Извл��каем URL из карты сайта
          const $ = cheerio.load(response.data, { xmlMode: true });
          
          // Проверяем, является ли это индексом карты сайта
          const sitemapNodes = $('sitemapindex sitemap loc');
          if (sitemapNodes.length > 0) {
            console.log(`Обнаружен индекс карты сайта с ${sitemapNodes.length} подкартами`);
            
            // Обрабатываем каждую подкарту сайта
            const subsitemapPromises = [];
            sitemapNodes.each((_, element) => {
              const subsitemapUrl = $(element).text().trim();
              if (subsitemapUrl) {
                console.log(`Found sub-sitemap: ${subsitemapUrl}`);
                subsitemapPromises.push(this.processSitemap(subsitemapUrl));
              }
            });
            
            // Ждем завершения обработки всех подкарт
            const subsitemapResults = await Promise.allSettled(subsitemapPromises);
            
            // Count successful results
            const successCount = subsitemapResults.filter(r => r.status === 'fulfilled').length;
            console.log(`Processed ${successCount} of ${subsitemapPromises.length} sub-sitemaps`);
            
            // Add up URLs found
            for (const result of subsitemapResults) {
              if (result.status === 'fulfilled') {
                urlsAdded += result.value;
              }
            }
          } else {
            // Обрабатываем обычную карту сайта
            const foundUrls = await this.processUrlsFromSitemap($);
            urlsAdded += foundUrls;
            console.log(`Извлечено ${foundUrls} URL из карты сайта ${sitemapUrl}`);
          }
        } else {
          console.log(`Sitemap not found at ${sitemapUrl} (status ${response.status})`);
        }
      } catch (error) {
        console.warn(`Ошибка при проверке карты сайта ${sitemapUrl}:`, error);
      }
    }
    
    console.log(`Sitemap processing complete: processed ${sitemapsProcessed} sitemaps, added ${urlsAdded} URLs to queue`);
    
    // If no sitemaps were found or processed, add some common paths to queue
    if (urlsAdded === 0) {
      console.log(`No sitemaps found, adding common paths to queue`);
      const commonPaths = [
        '/',
        '/about',
        '/contact',
        '/products',
        '/services',
        '/blog',
        '/catalog',
        '/shop',
        '/category',
        '/news'
      ];
      
      for (const path of commonPaths) {
        const commonUrl = `${this.baseUrl}${path}`;
        if (!this.visited.has(commonUrl) && !this.queue.some(q => q.url === commonUrl)) {
          this.queue.push({ url: commonUrl, depth: 1 });
          console.log(`Added common path to queue: ${commonUrl}`);
          urlsAdded++;
        }
      }
    }
  }
  
  // Improved sitemap processing with better error handling
  private async processSitemap(sitemapUrl: string): Promise<number> {
    try {
      console.log(`Обработка подкарты сайта: ${sitemapUrl}`);
      const response = await axios.get(sitemapUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.requestTimeout,
        validateStatus: status => status < 500 // Accept 404s without throwing
      });
      
      if (response.status === 200) {
        const $ = cheerio.load(response.data, { xmlMode: true });
        return await this.processUrlsFromSitemap($);
      } else {
        console.log(`Sub-sitemap not found at ${sitemapUrl} (status ${response.status})`);
      }
    } catch (error) {
      console.warn(`Ошибка при обработке подкарты сайта ${sitemapUrl}:`, error);
    }
    
    return 0;
  }
  
  // Improved URL extraction from sitemap
  private async processUrlsFromSitemap($: cheerio.CheerioAPI): Promise<number> {
    let urlCount = 0;
    
    // Try both URL formats commonly found in sitemaps
    $('url > loc, url loc').each((_, element) => {
      const url = $(element).text().trim();
      if (url) {
        // Отфильтровываем внешние домены
        try {
          const urlObj = new URL(url);
          // Accept main domain or www.domain
          if (urlObj.hostname === this.domain || 
              urlObj.hostname === 'www.' + this.domain || 
              this.domain === 'www.' + urlObj.hostname) {
                
            // Skip URL with certain extensions (images, PDFs, etc.)
            if (!/\.(jpg|jpeg|png|gif|pdf|zip|doc|docx|xls|xlsx|csv|xml)$/i.test(url)) {
              // Prioritize product and category pages
              const isPriority = /\/(product|category|catalog|item)\//.test(url);
              
              // Add to the beginning of queue if priority
              if (isPriority) {
                this.queue.unshift({ url, depth: 1 });
              } else {
                this.queue.push({ url, depth: 1 });
              }
              urlCount++;
              
              // Print progress for large sitemaps
              if (urlCount % 1000 === 0) {
                console.log(`Processed ${urlCount} URLs from sitemap`);
              }
            }
          }
        } catch (error) {
          console.warn(`Некорректный URL в карте сайта: ${url}`);
        }
      }
    });
    
    return urlCount;
  }

  // Improved URL processing with better error handling
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
        signal: this.abortController.signal,
        validateStatus: status => status >= 200 && status < 400 // Only accept 2xx and 3xx
      });

      const $ = cheerio.load(response.data);
      this.visited.add(url);

      // Extract and process links with improved priority
      const links = await this.processLinks($, url);
      
      // Function to evaluate URL priority (lower number = higher priority)
      const getPriority = (urlStr: string): number => {
        // Fix: Convert string to URL object to access pathname
        let urlObj: URL;
        try {
          urlObj = new URL(urlStr);
        } catch (e) {
          console.warn(`Invalid URL for priority evaluation: ${urlStr}`);
          return 4; // Low priority for invalid URLs
        }
        
        // Keywords for product pages
        const productKeywords = [
          '/product/', '/item/', '/catalog/', '/collection/', 
          '/shop/', '/goods/', '/category/', '/produkt/', 
          '/tovar/', '/p/', '/i/', '/products/'
        ];
        
        // Check for keywords in URL
        for (const keyword of productKeywords) {
          if (urlObj.pathname.includes(keyword)) {
            return 1; // High priority
          }
        }
        
        // Category or "important" pages
        if (urlObj.pathname.includes('/category/') || 
            urlObj.pathname.includes('/blog/') || 
            urlObj.pathname.includes('/news/') ||
            urlObj.pathname.split('/').length <= 3) { // Shallow URLs are important
          return 2; // Medium priority
        }
        
        // Check for file extensions (not files)
        if (!/\.(jpg|jpeg|png|gif|pdf|zip|doc|xls|csv|xml)$/i.test(urlObj.pathname)) {
          return 3; // Normal priority
        }
        
        return 4; // Low priority
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

      // Extra debug logging for every 100 pages
      if (this.debugMode && this.visited.size % 100 === 0) {
        console.log(`Processed ${this.visited.size} pages, ${this.queue.length} URLs in queue`);
      }

    } catch (error) {
      // Skip but log error
      if (this.debugMode) {
        console.error(`Error scanning ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  // Improved link processing with better filtering
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
                           absoluteUrl.hostname === 'www.' + this.domain ||
                           this.domain === 'www.' + absoluteUrl.hostname;

        if (isSameDomain) {
          links.internal.push(urlString);
        } else {
          links.external.push(urlString);
        }
      } catch (error) {
        // Skip invalid URLs
      }
    });

    // Also look for canonical URLs if available
    const canonicalUrl = $('link[rel="canonical"]').attr('href');
    if (canonicalUrl && !seenUrls.has(canonicalUrl)) {
      try {
        const absoluteCanonical = new URL(canonicalUrl, currentUrl).href;
        const isSameDomain = new URL(absoluteCanonical).hostname === this.domain;
        
        if (isSameDomain && !seenUrls.has(absoluteCanonical)) {
          links.internal.push(absoluteCanonical);
          seenUrls.add(absoluteCanonical);
        }
      } catch (error) {
        // Skip invalid canonical URLs
      }
    }

    return links;
  }
}
