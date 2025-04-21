
import { SitemapExtractor } from './crawler/sitemapExtractor';
import { generateSitemapXml } from './sitemap/generator';

interface SitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  userAgent?: string;
  // Добавим недостающие параметры для совместимости
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

export class SimpleSitemapCreator {
  private options: Required<SitemapCreatorOptions>;
  private sitemapExtractor: SitemapExtractor;
  private baseUrl: string = '';
  private domain: string = '';
  private isCancelled: boolean = false;
  private debugMode: boolean = false;
  
  constructor(options: SitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 1000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      requestDelay: options.requestDelay || 500,
      userAgent: options.userAgent || 'SEO Market Website Scanner Bot',
      concurrentRequests: options.concurrentRequests || 3,
      retryCount: options.retryCount || 2,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 10000
    };
    
    this.sitemapExtractor = new SitemapExtractor();
  }
  
  // Add the missing methods for debug functionality
  enableDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'} for SimpleSitemapCreator`);
  }

  logCrawlSettings(): void {
    console.log('SimpleSitemapCreator settings:', {
      baseUrl: this.baseUrl,
      domain: this.domain,
      maxPages: this.options.maxPages,
      maxDepth: this.options.maxDepth,
      requestDelay: this.options.requestDelay,
      concurrentRequests: this.options.concurrentRequests,
      retryCount: this.options.retryCount,
      retryDelay: this.options.retryDelay,
      timeout: this.options.timeout,
      debugMode: this.debugMode
    });
  }
  
  // Добавляем методы для работы с baseUrl и domain
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    try {
      const urlObj = new URL(url);
      this.domain = urlObj.hostname;
    } catch (error) {
      console.error('Invalid URL format:', error);
    }
  }
  
  getBaseUrl(): string {
    return this.baseUrl;
  }
  
  getDomain(): string {
    return this.domain;
  }
  
  // Добавляем метод отмены сканирования
  cancel(): void {
    this.isCancelled = true;
    console.log('Crawling cancelled by user');
  }
  
  async crawl(
    url: string, 
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    try {
      // Сбрасываем флаг отмены при новом запуске
      this.isCancelled = false;
      
      // Устанавливаем базовый URL и домен
      this.setBaseUrl(url);
      
      // В реальной реализации здесь был бы код сканирования сайта
      // Для простоты демонстрации будем имитировать процесс
      const baseUrl = url.endsWith('/') ? url : `${url}/`;
      
      // Log debug information if debug mode is enabled
      if (this.debugMode) {
        console.log(`Starting crawl for ${url} with max pages: ${this.options.maxPages}`);
      }
      
      // Имитация прогресса сканирования
      const totalPages = Math.min(100, this.options.maxPages);
      const urls: string[] = [];
      
      // Добавляем базовый URL
      urls.push(baseUrl);
      
      // Имитация процесса сканирования
      for (let i = 1; i < totalPages; i++) {
        // Проверяем флаг отмены
        if (this.isCancelled) {
          console.log('Crawling was cancelled');
          break;
        }
        
        // Имитируем задержку для демонстрации прогресса
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Генерируем случайные адреса страниц
        const path = this.getRandomPath(i);
        const pageUrl = `${baseUrl}${path}`;
        urls.push(pageUrl);
        
        // Вызываем callback для уведомления о прогрессе
        if (progressCallback) {
          progressCallback(i, totalPages, pageUrl);
        }
      }
      
      // Уведомляем о завершении
      if (progressCallback && !this.isCancelled) {
        progressCallback(totalPages, totalPages, 'Завершение...');
      }
      
      if (this.debugMode) {
        console.log(`Crawl completed, found ${urls.length} URLs`);
      }
      
      return urls;
    } catch (error) {
      console.error('Ошибка при сканировании сайта:', error);
      throw error;
    }
  }
  
  private getRandomPath(index: number): string {
    const sections = ['about', 'services', 'products', 'blog', 'contact', 'faq', 'pricing'];
    const subsections = ['details', 'info', 'overview', 'list'];
    
    if (index % 10 === 0) {
      // Создаем страницу верхнего уровня
      return `${sections[index % sections.length]}/`;
    } else if (index % 5 === 0) {
      // Создаем страницу второго уровня
      return `${sections[index % sections.length]}/${subsections[index % subsections.length]}/`;
    } else {
      // Создаем страницу с параметрами
      return `${sections[index % sections.length]}/${subsections[index % subsections.length]}/item-${index}.html`;
    }
  }
  
  generateSitemap(urls: string[]): string {
    return generateSitemapXml(urls, {
      includeStylesheet: this.options.includeStylesheet
    });
  }
  
  // Извлечение URL из существующей карты сайта
  async extractFromSitemap(sitemapXml: string): Promise<string[]> {
    return this.sitemapExtractor.extractUrlsFromSitemap(sitemapXml);
  }
}
