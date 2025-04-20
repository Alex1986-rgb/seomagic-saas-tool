
import axios from 'axios';
import { saveAs } from 'file-saver';
import { SiteScanner } from './crawler/siteScanner';
import { SitemapExtractor } from './crawler/sitemapExtractor';

export interface SimpleSitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  timeout?: number;
  followRedirects?: boolean;
  retryCount?: number;
  retryDelay?: number;
  concurrentRequests?: number;
  forceTargetDomain?: boolean; // Добавляем опцию принудительного использования целевого домена
}

export class SimpleSitemapCreator {
  private options: SimpleSitemapCreatorOptions;
  private sitemapExtractor: SitemapExtractor;
  private baseUrl: string = '';
  private domain: string = '';
  
  constructor(options: SimpleSitemapCreatorOptions = {}) {
    this.options = {
      maxPages: 10000,
      maxDepth: 5,
      includeStylesheet: true,
      timeout: 30000,
      followRedirects: true,
      retryCount: 3,
      retryDelay: 1000,
      concurrentRequests: 30,
      forceTargetDomain: true, // По умолчанию строго придерживаемся целевого домена
      ...options
    };
    
    this.sitemapExtractor = new SitemapExtractor();
  }
  
  /**
   * Задать базовый URL для сканирования
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url && url.trim() !== '' 
      ? (url.startsWith('http') ? url : `https://${url}`)
      : '';
    
    if (this.baseUrl) {
      try {
        const urlObj = new URL(this.baseUrl);
        this.domain = urlObj.hostname;
        console.log(`SimpleSitemapCreator: установлен базовый URL ${this.baseUrl} с доменом ${this.domain}`);
      } catch (error) {
        console.error('Невозможно извлечь домен из URL:', error);
      }
    }
  }
  
  /**
   * Получить базовый URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
  
  /**
   * Получить текущий домен
   */
  getDomain(): string {
    return this.domain;
  }
  
  /**
   * Crawl a website and return all URLs
   */
  async crawl(
    url: string, 
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    // Строго соблюдаем указанный URL
    const normalizedUrl = url && url.trim() !== '' 
      ? (url.startsWith('http') ? url : `https://${url}`)
      : this.baseUrl;
    
    if (!normalizedUrl) {
      console.error('No URL provided for crawling');
      return [];
    }
    
    // Обновляем baseUrl и domain на случай, если URL изменился
    this.setBaseUrl(normalizedUrl);
    
    try {
      console.log(`Начинаем сканирование сайта ${normalizedUrl} (домен: ${this.domain})`);
      
      // First, try to find and parse sitemaps
      const sitemapUrls = await this.findSitemaps(normalizedUrl);
      let allUrls: string[] = [];
      
      for (const sitemapUrl of sitemapUrls) {
        try {
          console.log(`Found sitemap at ${sitemapUrl}, extracting URLs...`);
          
          // Fetch the sitemap with retry logic
          const sitemapXml = await this.fetchWithRetry(sitemapUrl);
          if (sitemapXml) {
            const extractedUrls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapXml);
            
            // Фильтруем URL, чтобы оставить только те, которые относятся к целевому домену
            const filteredUrls = this.filterUrlsByDomain(extractedUrls, this.domain);
            
            if (filteredUrls.length > 0) {
              console.log(`Extracted ${filteredUrls.length} URLs from sitemap ${sitemapUrl}`);
              allUrls = [...allUrls, ...filteredUrls];
              
              // Report progress if we have a callback
              if (progressCallback) {
                progressCallback(
                  filteredUrls.length,
                  filteredUrls.length,
                  "Extracted URLs from sitemap"
                );
              }
            }
          }
        } catch (error) {
          console.warn(`Error processing sitemap ${sitemapUrl}:`, error);
        }
      }
      
      // If we found URLs from sitemaps, return them
      if (allUrls.length > 0) {
        console.log(`Найдено ${allUrls.length} URL в картах сайта для домена ${this.domain}`);
        return [...new Set(allUrls)]; // Remove duplicates
      }
      
      // If no sitemaps found or they were empty, fall back to crawler
      console.log('No valid sitemaps found or they were empty, falling back to crawling...');
      
      const scanner = new SiteScanner(normalizedUrl, {
        maxPages: this.options.maxPages,
        maxDepth: this.options.maxDepth,
        timeout: this.options.timeout,
        onProgress: progressCallback,
        crawlDelay: 300,
        retryCount: this.options.retryCount,
        retryDelay: this.options.retryDelay,
        // Удаляем свойство domain, так как оно не существует в типе SiteScannerOptions
      });
      
      // Принудительно ограничиваем сканирование только указанным доменом
      // Это достигается путем фильтрации после получения результатов
      const result = await scanner.scan();
      
      // Фильтруем результаты, чтобы оставить только URL для нашего домена
      if (this.options.forceTargetDomain) {
        const filteredUrls = this.filterUrlsByDomain(result.urls, this.domain);
        console.log(`Отфильтровано ${filteredUrls.length} URL из ${result.urls.length} для домена ${this.domain}`);
        return filteredUrls;
      }
      
      return result.urls;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }
  
  /**
   * Фильтрует URL, оставляя только те, которые относятся к указанному домену
   */
  private filterUrlsByDomain(urls: string[], targetDomain: string): string[] {
    if (!targetDomain) {
      console.warn("Целевой домен не указан для фильтрации URL");
      return urls;
    }
    
    console.log(`Фильтруем URLs для домена: ${targetDomain}`);
    
    return urls.filter(url => {
      try {
        const urlObj = new URL(url);
        const urlDomain = urlObj.hostname;
        
        // Проверяем совпадение доменов с учетом www.
        const isMatch = 
          urlDomain === targetDomain || 
          urlDomain === 'www.' + targetDomain ||
          targetDomain === 'www.' + urlDomain;
        
        return isMatch;
      } catch (error) {
        console.warn(`Не удалось проанализировать URL: ${url}`, error);
        return false;
      }
    });
  }
  
  /**
   * Find sitemaps for a website
   */
  private async findSitemaps(url: string): Promise<string[]> {
    const sitemaps: string[] = [];
    const domain = this.extractDomain(url);
    
    // Common sitemap locations
    const potentialPaths = [
      `${url}/sitemap.xml`,
      `${url}/sitemap_index.xml`,
      `${url}/sitemap.php`,
      `${url}/sitemap.txt`,
      `${url}/sitemaps/sitemap.xml`
    ];
    
    // Also check robots.txt for sitemap references
    try {
      const robotsTxt = await this.fetchWithRetry(`${url}/robots.txt`);
      if (robotsTxt) {
        const sitemapMatches = robotsTxt.match(/Sitemap:\s*([^\s]+)/gi);
        if (sitemapMatches) {
          sitemapMatches.forEach(match => {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            potentialPaths.push(sitemapUrl);
          });
        }
      }
    } catch (error) {
      console.warn('Error checking robots.txt:', error);
    }
    
    // Check each potential sitemap location
    for (const path of potentialPaths) {
      try {
        const response = await axios.head(path, { 
          timeout: this.options.timeout,
          maxRedirects: 5
        });
        
        if (response.status === 200) {
          sitemaps.push(path);
        }
      } catch (error) {
        // Ignore 404s and other errors
      }
    }
    
    return sitemaps;
  }
  
  /**
   * Generate sitemap XML from a list of URLs
   */
  generateSitemapXml(urls: string[]): string {
    const now = new Date().toISOString().substring(0, 10);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }

  /**
   * Download sitemap as XML file
   */
  downloadSitemapXml(urls: string[], filename: string = 'sitemap.xml'): void {
    const xml = this.generateSitemapXml(urls);
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, filename);
  }
  
  /**
   * Download URLs as CSV file
   */
  downloadUrlsAsCsv(urls: string[], filename: string = 'urls.csv'): void {
    const csv = urls.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, filename);
  }
  
  /**
   * Helper method to fetch with retry
   */
  private async fetchWithRetry(url: string): Promise<string | null> {
    let retries = 0;
    const maxRetries = this.options.retryCount || 3;
    const retryDelay = this.options.retryDelay || 1000;
    
    // Проверяем валидность URL
    try {
      new URL(url);
    } catch (error) {
      console.error(`Invalid URL: ${url}`, error);
      return null;
    }
    
    while (retries <= maxRetries) {
      try {
        const response = await axios.get(url, { 
          timeout: this.options.timeout,
          maxRedirects: 5,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SitemapGenerator/1.0; +https://example.com/bot)',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
          }
        });
        
        if (response.status === 200) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.warn(`Attempt ${retries + 1}/${maxRetries} failed for URL ${url}:`, error);
        retries++;
        if (retries > maxRetries) {
          return null;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    return null;
  }
  
  /**
   * Escape special characters for XML
   */
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }
}
