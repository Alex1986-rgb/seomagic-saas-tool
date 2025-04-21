
import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveAs } from 'file-saver';

interface SimpleSitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  timeout?: number;
  forceTargetDomain?: boolean;
  followRedirects?: boolean;
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
}

export class SimpleSitemapCreator {
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private domain: string = '';
  private baseUrl: string = '';
  private options: SimpleSitemapCreatorOptions;
  private userAgent = 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)';
  private isCancelled = false;
  private progressCallback?: (scanned: number, total: number, currentUrl: string) => void;
  private concurrentRequests = 3; // Снижаем конкурентные запросы для надежности
  private activeRequests = 0;
  
  constructor(options: SimpleSitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 100000, // Увеличение лимита для масштабного сканирования
      maxDepth: options.maxDepth || 5,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      timeout: options.timeout || 15000, // Увеличиваем таймаут для более стабильной работы
      forceTargetDomain: options.forceTargetDomain !== undefined ? options.forceTargetDomain : true,
      followRedirects: options.followRedirects !== undefined ? options.followRedirects : true,
      concurrentRequests: options.concurrentRequests || 3,
      retryCount: options.retryCount || 2,
      retryDelay: options.retryDelay || 1000
    };
    
    this.concurrentRequests = this.options.concurrentRequests || 3;
  }
  
  /**
   * Устанавливает базовый URL для сканирования
   * @param url URL сайта
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      const urlObj = new URL(this.baseUrl);
      this.domain = urlObj.hostname;
    } catch (e) {
      console.error("Invalid URL:", e);
      throw new Error("Некорректный URL");
    }
  }
  
  /**
   * Получает текущий домен сканирования
   * @returns домен сайта
   */
  getDomain(): string {
    return this.domain;
  }
  
  /**
   * Получает текущий базовый URL сканирования
   * @returns базовый URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
  
  /**
   * Отменяет текущее сканирование
   */
  cancel(): void {
    this.isCancelled = true;
    console.log("Scanning cancelled");
  }
  
  /**
   * Выполняет сканирование сайта начиная с указанного URL
   * @param url URL для начала сканирования
   * @param progressCallback Функция обратного вызова для отслеживания прогресса
   * @returns Массив найденных URL
   */
  async crawl(url: string, progressCallback?: (scanned: number, total: number, currentUrl: string) => void): Promise<string[]> {
    this.progressCallback = progressCallback;
    this.isCancelled = false;
    
    // Если baseUrl не установлен, устанавливаем его
    if (!this.baseUrl) {
      this.setBaseUrl(url);
    }
    
    this.visited.clear();
    this.queue = [{ url, depth: 0 }];
    
    // Используем сканирование карты сайта для ускорения процесса
    try {
      await this.findAndProcessSitemaps();
    } catch (e) {
      console.warn("Error processing sitemaps:", e);
    }

    const urls: string[] = [];
    
    while (this.queue.length > 0 && this.visited.size < this.options.maxPages! && !this.isCancelled) {
      // Обрабатываем одновременно несколько URL для ускорения сканирования
      const batchSize = Math.min(this.concurrentRequests, this.queue.length);
      const batch = [];
      
      for (let i = 0; i < batchSize && this.activeRequests < this.concurrentRequests; i++) {
        const nextUrl = this.queue.shift();
        if (nextUrl) {
          batch.push(this.processUrl(nextUrl.url, nextUrl.depth));
          this.activeRequests++;
        }
      }
      
      if (batch.length > 0) {
        // Ожидаем завершения текущей партии запросов
        await Promise.allSettled(batch);
      } else {
        // Если активных запросов слишком много, делаем короткую паузу
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Обновляем прогресс
      if (this.progressCallback) {
        const currentUrl = this.queue.length > 0 ? this.queue[0].url : '';
        this.progressCallback(this.visited.size, this.visited.size + this.queue.length, currentUrl);
      }
    }
    
    // Формируем список найденных URL
    this.visited.forEach(url => {
      urls.push(url);
    });
    
    return urls;
  }
  
  /**
   * Создает sitemap.xml на основе найденных URL
   * @param urls Массив URL
   * @param filename Имя файла для сохранения
   */
  generateSitemap(urls: string[], filename?: string): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    // Добавляем необязательную таблицу стилей для просмотра в браузере
    if (this.options.includeStylesheet) {
      sitemap += '<?xml-stylesheet type="text/xsl" href="https://cdn.jsdelivr.net/npm/sitemap-stylesheet@1.0.0/sitemap.xsl"?>\n';
    }
    
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Добавляем URL в sitemap
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        
        // Пропускаем URL, которые не относятся к нашему домену
        if (this.options.forceTargetDomain && urlObj.hostname !== this.domain && urlObj.hostname !== 'www.' + this.domain) {
          continue;
        }
        
        // Пропускаем URL с расширениями файлов, которые не подходят для sitemap
        if (/\.(jpg|jpeg|png|gif|css|js|svg|ico|woff|woff2|ttf|eot)$/i.test(urlObj.pathname)) {
          continue;
        }
        
        sitemap += '  <url>\n';
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        
        // Определяем приоритет на основе глубины URL
        const depth = (url.match(/\//g) || []).length - 3; // примерная оценка глубины
        const priority = Math.max(0.1, 1.0 - depth * 0.2).toFixed(1); // 1.0 -> 0.8 -> 0.6 -> ...
        
        sitemap += `    <priority>${priority}</priority>\n`;
        sitemap += '  </url>\n';
      } catch (e) {
        // Пропускаем некорректные URL
        console.warn("Invalid URL:", url);
      }
    }
    
    sitemap += '</urlset>';
    
    // Сохраняем sitemap в файл, если указано имя файла
    if (filename) {
      const blob = new Blob([sitemap], { type: 'application/xml' });
      saveAs(blob, filename);
    }
    
    return sitemap;
  }
  
  /**
   * Поиск и обработка существующих sitemap.xml для более быстрого сканирования
   * @private
   */
  private async findAndProcessSitemaps(): Promise<void> {
    const possibleSitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/sitemap-index.xml`,
      `${this.baseUrl}/sitemaps/sitemap.xml`,
      `${this.baseUrl}/wp-sitemap.xml`,
      `${this.baseUrl}/sitemap/sitemap.xml`
    ];
    
    // Также проверяем robots.txt
    try {
      const robotsUrl = `${this.baseUrl}/robots.txt`;
      const robotsResponse = await axios.get(robotsUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.options.timeout
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
      console.warn('Could not fetch robots.txt:', error);
    }
    
    // Проверяем каждый возможный URL карты сайта
    for (const sitemapUrl of possibleSitemapUrls) {
      if (this.isCancelled) break;
      
      try {
        console.log(`Checking sitemap: ${sitemapUrl}`);
        const response = await axios.get(sitemapUrl, {
          headers: { 'User-Agent': this.userAgent },
          timeout: this.options.timeout
        });
        
        if (response.status === 200) {
          console.log(`Found sitemap: ${sitemapUrl}`);
          
          // Извлекаем URL из карты сайта
          const $ = cheerio.load(response.data, { xmlMode: true });
          
          // Проверяем, является ли это индексом карты сайта
          const sitemapNodes = $('sitemapindex sitemap loc');
          if (sitemapNodes.length > 0) {
            console.log(`Found sitemap index with ${sitemapNodes.length} subsitemaps`);
            
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
            const urlsFound = await this.processUrlsFromSitemap($);
            console.log(`Extracted ${urlsFound} URLs from sitemap ${sitemapUrl}`);
          }
        }
      } catch (error) {
        console.warn(`Error checking sitemap ${sitemapUrl}:`, error);
      }
    }
  }
  
  /**
   * Обрабатывает отдельную карту сайта
   * @param sitemapUrl URL карты сайта
   * @private
   */
  private async processSitemap(sitemapUrl: string): Promise<number> {
    if (this.isCancelled) return 0;
    
    try {
      console.log(`Processing subsitemap: ${sitemapUrl}`);
      const response = await axios.get(sitemapUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: this.options.timeout
      });
      
      if (response.status === 200) {
        const $ = cheerio.load(response.data, { xmlMode: true });
        return await this.processUrlsFromSitemap($);
      }
    } catch (error) {
      console.warn(`Error processing subsitemap ${sitemapUrl}:`, error);
    }
    
    return 0;
  }
  
  /**
   * Извлекает URL из загруженной карты сайта
   * @param $ Объект cheerio для работы с XML
   * @private
   */
  private async processUrlsFromSitemap($: cheerio.CheerioAPI): Promise<number> {
    if (this.isCancelled) return 0;
    
    let urlCount = 0;
    
    $('url > loc').each((_, element) => {
      const url = $(element).text().trim();
      if (url) {
        // Отфильтровываем внешние домены
        try {
          const urlObj = new URL(url);
          if (
            !this.options.forceTargetDomain ||
            urlObj.hostname === this.domain || 
            urlObj.hostname === 'www.' + this.domain
          ) {
            // Добавляем в начало очереди с приоритетом
            this.queue.unshift({ url, depth: 1 });
            urlCount++;
          }
        } catch (error) {
          console.warn(`Invalid URL in sitemap: ${url}`);
        }
      }
    });
    
    return urlCount;
  }
  
  /**
   * Обрабатывает отдельный URL
   * @param url URL для обработки
   * @param depth Глубина от начального URL
   * @private
   */
  private async processUrl(url: string, depth: number): Promise<void> {
    try {
      // Если URL уже посещен, отменен или превышена глубина - пропускаем
      if (this.isCancelled || this.visited.has(url) || depth > this.options.maxDepth!) {
        this.activeRequests--;
        return;
      }
      
      // Если достигнут лимит страниц, отменяем
      if (this.visited.size >= this.options.maxPages!) {
        this.activeRequests--;
        return;
      }
      
      // Делаем запрос с повторами при неудаче
      let response;
      let retries = 0;
      
      while (retries <= this.options.retryCount!) {
        try {
          response = await axios.get(url, {
            headers: { 'User-Agent': this.userAgent },
            timeout: this.options.timeout,
            maxRedirects: this.options.followRedirects ? 5 : 0
          });
          break; // Если успешно, выходим из цикла
        } catch (error) {
          retries++;
          
          if (retries > this.options.retryCount!) {
            console.warn(`Failed to fetch ${url} after ${retries} retries`);
            this.activeRequests--;
            return;
          }
          
          // Ждем перед повторной попыткой
          await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
        }
      }
      
      if (!response) {
        this.activeRequests--;
        return;
      }
      
      // Проверяем, что это HTML-страница
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        this.activeRequests--;
        return;
      }
      
      // Добавляем URL в список посещенных
      this.visited.add(url);
      
      // Извлекаем и обрабатываем ссылки
      const $ = cheerio.load(response.data);
      const links = this.extractLinks($, url);
      
      // Функция для определения приоритета URL
      const getPriority = (url: string): number => {
        // Ключевые слова для страниц товаров
        const productKeywords = [
          '/product/', '/item/', '/catalog/', '/collection/', 
          '/shop/', '/goods/', '/category/', '/produkt/', 
          '/tovar/', '/p/', '/i/', '/products/'
        ];
        
        // Проверяем наличие ключевых слов в URL
        for (const keyword of productKeywords) {
          if (url.includes(keyword)) {
            return 1; // Высокий приоритет
          }
        }
        
        // Проверяем расширения файлов (не файлы)
        if (!/\.(jpg|jpeg|png|gif|pdf|zip|doc|xls|csv|xml|js|css)$/i.test(url)) {
          return 2; // Средний приоритет
        }
        
        return 3; // Низкий приоритет
      };
      
      // Сортируем внутренние ссылки по приоритету
      const sortedLinks = [...links].sort((a, b) => {
        return getPriority(a) - getPriority(b);
      });
      
      // Добавляем внутренние ссылки в очередь с приоритетом
      for (const link of sortedLinks) {
        if (!this.visited.has(link) && !this.queue.some(item => item.url === link)) {
          this.queue.push({ url: link, depth: depth + 1 });
        }
      }
    } catch (error) {
      console.warn(`Error processing ${url}:`, error);
    } finally {
      this.activeRequests--;
    }
  }
  
  /**
   * Извлекает ссылки со страницы
   * @param $ Объект cheerio для работы с HTML
   * @param currentUrl Текущий URL
   * @private
   */
  private extractLinks($: cheerio.CheerioAPI, currentUrl: string): string[] {
    const links: string[] = [];
    const seenUrls = new Set<string>();
    
    const currentUrlObj = new URL(currentUrl);
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;
      
      try {
        const absoluteUrl = new URL(href, currentUrl);
        
        // Пропускаем якоря на текущей странице
        if (absoluteUrl.href === currentUrl + '#' || absoluteUrl.href === currentUrl) {
          return;
        }
        
        // Пропускаем нежелательные URL (файлы, админ-страницы и т.д.)
        if (
          // Якори - пропускаем только если они относятся к текущей странице
          (absoluteUrl.hash && absoluteUrl.href.split('#')[0] === currentUrl) || 
          /\.(pdf|zip|rar|jpg|jpeg|png|gif|doc|docx|xls|xlsx|csv|svg|ico|mp3|mp4|avi|mov|wmv|flv|webm)$/i.test(absoluteUrl.pathname) || // Файлы
          absoluteUrl.pathname.includes('/wp-admin/') || // WordPress админка
          absoluteUrl.pathname.includes('/wp-login.php') || // WordPress логин
          absoluteUrl.search.includes('utm_') || // UTM-параметры
          /\?(?:fbclid|gclid|msclkid|yclid)=/.test(absoluteUrl.search) // Трекинговые параметры
        ) {
          return;
        }
        
        const urlString = absoluteUrl.href;
        
        // Нормализуем URL, убирая конечный слеш для сравнения
        const normalizedUrl = urlString.endsWith('/') ? urlString.slice(0, -1) : urlString;
        
        if (seenUrls.has(normalizedUrl)) return;
        seenUrls.add(normalizedUrl);
        
        // Проверяем, что это URL того же домена, если включена опция forceTargetDomain
        if (
          !this.options.forceTargetDomain || 
          absoluteUrl.hostname === this.domain || 
          absoluteUrl.hostname === 'www.' + this.domain
        ) {
          links.push(urlString);
        }
      } catch (error) {
        // Пропускаем некорректные URL
      }
    });
    
    return links;
  }
}
