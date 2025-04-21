import { SitemapExtractor } from './crawler/sitemapExtractor';
import { generateSitemapXml } from './sitemap/generator';

interface SitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  userAgent?: string;
}

export class SimpleSitemapCreator {
  private options: Required<SitemapCreatorOptions>;
  private sitemapExtractor: SitemapExtractor;
  
  constructor(options: SitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 1000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      requestDelay: options.requestDelay || 500,
      userAgent: options.userAgent || 'SEO Market Website Scanner Bot'
    };
    
    this.sitemapExtractor = new SitemapExtractor();
  }
  
  async crawl(
    url: string, 
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    try {
      // В реальной реализации здесь был бы код сканирования сайта
      // Для простоты демонстрации будем имитировать процесс
      
      const hostname = new URL(url).hostname;
      const baseUrl = url.endsWith('/') ? url : `${url}/`;
      
      // Имитация прогресса сканирования
      const totalPages = Math.min(100, this.options.maxPages);
      const urls: string[] = [];
      
      // Добавляем базовый URL
      urls.push(baseUrl);
      
      // Имитация процесса сканирования
      for (let i = 1; i < totalPages; i++) {
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
      if (progressCallback) {
        progressCallback(totalPages, totalPages, 'Завершение...');
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
