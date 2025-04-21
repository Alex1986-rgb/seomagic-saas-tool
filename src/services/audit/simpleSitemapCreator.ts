
import axios from 'axios';
import * as cheerio from 'cheerio';

interface SimpleSitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number; // Adding timeout option
}

export class SimpleSitemapCreator {
  private options: SimpleSitemapCreatorOptions;
  private visited = new Set<string>();
  private domain: string = '';
  private baseUrl: string = '';
  private isDebugMode: boolean = false;

  constructor(options: SimpleSitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      requestDelay: options.requestDelay || 100,
      concurrentRequests: options.concurrentRequests || 5,
      retryCount: options.retryCount || 3,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 15000
    };
  }

  // Method to set base URL
  public setBaseUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      this.baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      this.domain = urlObj.hostname;
    } catch (error) {
      console.error('Invalid URL in setBaseUrl:', url);
    }
  }

  // Method to get domain
  public getDomain(): string {
    return this.domain;
  }

  // Method to get base URL
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  // Method to enable debug mode
  public enableDebugMode(enable: boolean): void {
    this.isDebugMode = enable;
    if (this.isDebugMode) {
      console.log('Debug mode enabled for SimpleSitemapCreator');
    }
  }

  // Method to log crawl settings
  public logCrawlSettings(): void {
    console.log('SimpleSitemapCreator settings:', {
      maxPages: this.options.maxPages,
      maxDepth: this.options.maxDepth,
      requestDelay: this.options.requestDelay,
      concurrentRequests: this.options.concurrentRequests,
      domain: this.domain,
      baseUrl: this.baseUrl
    });
  }

  // Method to cancel crawling (placeholder)
  public cancel(): void {
    console.log('Crawling cancelled');
    this.visited.clear();
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return '';
    }
  }

  // Парсинг URLs из HTML
  private extractUrls(html: string, baseUrl: string): string[] {
    const $ = cheerio.load(html);
    const urls: string[] = [];

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
        try {
          const absoluteUrl = new URL(href, baseUrl).href;
          // Удаляем фрагмент и параметры запроса
          const cleanUrl = absoluteUrl.split('#')[0].split('?')[0];
          urls.push(cleanUrl);
        } catch (e) {
          // Пропускаем некорректные URL
        }
      }
    });

    return urls;
  }

  // Проверяем, должен ли URL быть включен в карту сайта
  private shouldIncludeUrl(url: string): boolean {
    if (!url.startsWith(this.baseUrl)) {
      return false;
    }

    const urlLower = url.toLowerCase();
    // Исключаем статические файлы и административные пути
    return !urlLower.match(/\.(css|js|jpg|jpeg|png|gif|svg|webp|pdf|zip|rar|doc|docx|xls|xlsx|mp3|mp4|avi|mov)$/);
  }

  // Поиск существующих Sitemap на сайте
  private async findSitemaps(url: string): Promise<string[]> {
    try {
      const urls: string[] = [];
      const baseUrlObj = new URL(url);
      const baseUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}`;
      
      const possibleSitemapPaths = [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/sitemap-index.xml',
        '/sitemapindex.xml',
        '/sitemap/',
      ];

      for (const path of possibleSitemapPaths) {
        try {
          const sitemapUrl = `${baseUrl}${path}`;
          const response = await axios.get(sitemapUrl, { timeout: 5000 });
          
          if (response.status === 200 && response.data) {
            const $ = cheerio.load(response.data, { xmlMode: true });
            
            // Извлекаем URLs из стандартного sitemap
            $('url > loc').each((_, element) => {
              const foundUrl = $(element).text().trim();
              if (foundUrl) urls.push(foundUrl);
            });
            
            // Также проверяем sitemap индексы
            $('sitemap > loc').each((_, element) => {
              const sitemapUrl = $(element).text().trim();
              if (sitemapUrl) {
                // TODO: Можно рекурсивно загрузить вложенные sitemaps при необходимости
                console.log(`Found sitemap index: ${sitemapUrl}`);
              }
            });
          }
        } catch (error) {
          // Пропускаем ошибки при проверке путей sitemap
        }
      }
      
      console.log(`Found ${urls.length} URLs from existing sitemaps`);
      return urls;
    } catch (error) {
      console.error('Error finding sitemaps:', error);
      return [];
    }
  }

  // Основной метод сканирования
  public async crawl(url: string, progressCallback?: (scanned: number, total: number, currentUrl: string) => void): Promise<string[]> {
    if (!url) {
      throw new Error('URL cannot be empty');
    }

    // Нормализация URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      const urlObj = new URL(normalizedUrl);
      this.baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      this.domain = urlObj.hostname;
    } catch (error) {
      throw new Error(`Invalid URL: ${normalizedUrl}`);
    }

    this.visited.clear();
    
    // Сначала пытаемся найти существующие карты сайта
    const sitemapUrls = await this.findSitemaps(normalizedUrl);
    if (sitemapUrls.length > 0) {
      console.log(`Using existing sitemap with ${sitemapUrls.length} URLs`);
      // Если нашли достаточное количество URL в существующих картах сайта,
      // можем использовать их вместо повторного сканирования
      if (sitemapUrls.length > this.options.maxPages! / 10) {
        return sitemapUrls.slice(0, this.options.maxPages);
      }
      
      // Иначе добавляем найденные URL и продолжаем сканирование
      for (const foundUrl of sitemapUrls) {
        this.visited.add(foundUrl);
      }
    }

    // Если sitemap не найден или содержит мало URL, выполняем сканирование
    const queue = [{ url: normalizedUrl, depth: 0 }];
    
    while (queue.length > 0 && this.visited.size < this.options.maxPages!) {
      const { url: currentUrl, depth } = queue.shift()!;
      
      if (this.visited.has(currentUrl) || depth > this.options.maxDepth!) {
        continue;
      }
      
      this.visited.add(currentUrl);
      
      if (progressCallback) {
        progressCallback(this.visited.size, queue.length + this.visited.size, currentUrl);
      }
      
      try {
        const response = await axios.get(currentUrl, { timeout: this.options.timeout });
        
        if (response.status === 200 && response.data) {
          const extractedUrls = this.extractUrls(response.data, currentUrl);
          
          for (const foundUrl of extractedUrls) {
            if (this.shouldIncludeUrl(foundUrl) && !this.visited.has(foundUrl)) {
              queue.push({ url: foundUrl, depth: depth + 1 });
            }
          }
        }
      } catch (error) {
        // Пропускаем ошибки при сканировании отдельных страниц
      }
      
      // Добавляем задержку между запросами
      if (this.options.requestDelay! > 0) {
        await new Promise(resolve => setTimeout(resolve, this.options.requestDelay));
      }
    }
    
    return Array.from(this.visited);
  }

  // Генерация sitemap XML
  public generateSitemap(urls: string[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="https://static.googleusercontent.com/media/www.google.com/en//schemas/sitemap/0.84/sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Добавляем URLs
    for (const url of urls) {
      // Пропускаем некорректные URL
      if (url) {
        xml += '  <url>\n';
        xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '  </url>\n';
      }
    }
    
    xml += '</urlset>';
    return xml;
  }

  // Вспомогательный метод для экранирования специальных XML символов
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
