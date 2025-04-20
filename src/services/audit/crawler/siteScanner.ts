
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlCache } from '../linkExtraction';

interface SiteScannerOptions {
  maxPages?: number;
  maxDepth?: number;
  timeout?: number;
  followExternalLinks?: boolean;
  respectRobotsTxt?: boolean;
  onProgress?: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
  crawlDelay?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface ScanResult {
  urls: string[];
  pageDetails: Map<string, PageDetail>;
  pageCount: number;
}

interface PageDetail {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  imageCount: number;
  wordCount: number;
  statusCode: number | null;
  loadTime: number | null;
}

export class SiteScanner {
  private baseUrl: string;
  private domain: string;
  private options: SiteScannerOptions;
  private visited = new Set<string>();
  private queue: Array<{ url: string; depth: number }> = [];
  private pageDetails = new Map<string, PageDetail>();
  private robotsTxtRules: string[] = [];
  private hasLoadedRobotsTxt = false;
  private isCancelled = false;

  constructor(baseUrl: string, options: SiteScannerOptions = {}) {
    this.baseUrl = baseUrl;
    
    try {
      const urlObj = new URL(baseUrl);
      this.domain = urlObj.hostname;
    } catch (error) {
      this.domain = baseUrl;
    }
    
    this.options = {
      maxPages: 100,
      maxDepth: 3,
      timeout: 30000,  // Увеличенный таймаут
      followExternalLinks: false,
      respectRobotsTxt: true,
      crawlDelay: 300,  // Увеличенная задержка между запросами
      retryCount: 3,    // Количество повторных попыток
      retryDelay: 1000, // Задержка между попытками
      ...options
    };
    
    this.queue.push({ url: baseUrl, depth: 0 });
  }
  
  async scan(): Promise<ScanResult> {
    console.log(`Starting scan of ${this.baseUrl} with max ${this.options.maxPages} pages`);
    
    if (this.options.respectRobotsTxt) {
      await this.loadRobotsTxt();
    }
    
    while (this.queue.length > 0 && this.visited.size < (this.options.maxPages || 100) && !this.isCancelled) {
      const { url, depth } = this.queue.shift()!;
      
      if (this.visited.has(url)) continue;
      
      if (this.options.respectRobotsTxt && this.isDisallowedByRobotsTxt(url)) {
        console.log(`Skipping ${url} - disallowed by robots.txt`);
        continue;
      }
      
      try {
        await this.processUrl(url, depth);
        
        if (this.options.onProgress) {
          this.options.onProgress(
            this.visited.size,
            Math.min(this.visited.size + this.queue.length, this.options.maxPages || 100),
            url
          );
        }
        
        if (this.options.crawlDelay) {
          await this.sleep(this.options.crawlDelay);
        }
      } catch (error) {
        console.warn(`Error processing URL ${url}:`, error);
      }
    }
    
    console.log(`Scan completed. Visited ${this.visited.size} pages.`);
    
    return {
      urls: Array.from(this.visited),
      pageDetails: this.pageDetails,
      pageCount: this.visited.size
    };
  }
  
  private async processUrl(url: string, depth: number): Promise<void> {
    if (depth > (this.options.maxDepth || 3)) return;
    
    this.visited.add(url);
    urlCache.add(url);
    
    try {
      // Используем собственную функцию с повторными попытками
      const { response, loadTime } = await this.fetchWithRetry(url);
      
      if (!response) {
        // Если запрос не удался после всех попыток
        this.pageDetails.set(url, {
          url,
          title: null,
          metaDescription: null,
          h1Count: 0,
          imageCount: 0,
          wordCount: 0,
          statusCode: null,
          loadTime: null
        });
        return;
      }
      
      const statusCode = response.status;
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        return;
      }
      
      const $ = cheerio.load(response.data);
      
      const title = $('title').text().trim() || null;
      const metaDescription = $('meta[name="description"]').attr('content') || null;
      const h1Count = $('h1').length;
      const imageCount = $('img').length;
      const text = $('body').text();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      
      this.pageDetails.set(url, {
        url,
        title,
        metaDescription,
        h1Count,
        imageCount,
        wordCount,
        statusCode,
        loadTime
      });
      
      const links = this.extractLinks($, url);
      
      for (const link of links) {
        if (!this.visited.has(link) && !this.queue.some(item => item.url === link)) {
          this.queue.push({ url: link, depth: depth + 1 });
        }
      }
    } catch (error) {
      console.error(`Error processing URL ${url}:`, error);
      
      this.pageDetails.set(url, {
        url,
        title: null,
        metaDescription: null,
        h1Count: 0,
        imageCount: 0,
        wordCount: 0,
        statusCode: error.response?.status || null,
        loadTime: null
      });
    }
  }
  
  private async fetchWithRetry(url: string): Promise<{ response: any; loadTime: number } | { response: null; loadTime: null }> {
    let retries = 0;
    const maxRetries = this.options.retryCount || 3;
    
    while (retries <= maxRetries) {
      try {
        const startTime = performance.now();
        
        const response = await axios.get(url, {
          timeout: this.options.timeout,
          validateStatus: (status) => status < 500,
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://example.com/bot)',
            'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
          },
          allowAbsoluteUrls: true,
          maxRedirects: 5
        });
        
        const loadTime = performance.now() - startTime;
        return { response, loadTime };
      } catch (error) {
        retries++;
        console.warn(`Attempt ${retries}/${maxRetries + 1} failed for URL ${url}:`, error.message);
        
        if (retries > maxRetries) {
          return { response: null, loadTime: null };
        }
        
        // Ждем перед повторной попыткой
        await this.sleep(this.options.retryDelay || 1000);
      }
    }
    
    return { response: null, loadTime: null };
  }
  
  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const links: string[] = [];
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;
      
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        const urlObj = new URL(absoluteUrl);
        
        const baseUrlObj = new URL(baseUrl);
        if (urlObj.hostname === baseUrlObj.hostname && 
            urlObj.pathname === baseUrlObj.pathname && 
            (urlObj.hash || urlObj.search)) {
          return;
        }
        
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
          return;
        }
        
        if (!this.options.followExternalLinks && urlObj.hostname !== this.domain) {
          return;
        }
        
        const skipExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
        if (skipExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))) {
          return;
        }
        
        links.push(absoluteUrl);
      } catch (error) {
        // Игнорируем невалидные URL
      }
    });
    
    return links;
  }
  
  private async loadRobotsTxt(): Promise<void> {
    if (this.hasLoadedRobotsTxt) return;
    
    try {
      const robotsTxtUrl = `${this.baseUrl.replace(/\/$/, '')}/robots.txt`;
      const { response } = await this.fetchWithRetry(robotsTxtUrl);
      
      if (response && response.status === 200) {
        const robotsTxt = response.data;
        const lines = robotsTxt.split('\n');
        
        let isUserAgentRelevant = false;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('User-agent:')) {
            const userAgent = trimmedLine.substring('User-agent:'.length).trim();
            isUserAgentRelevant = userAgent === '*' || userAgent.toLowerCase().includes('bot');
          } else if (isUserAgentRelevant && trimmedLine.startsWith('Disallow:')) {
            const disallowPath = trimmedLine.substring('Disallow:'.length).trim();
            if (disallowPath) {
              this.robotsTxtRules.push(disallowPath);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error loading robots.txt:', error);
    }
    
    this.hasLoadedRobotsTxt = true;
  }
  
  private isDisallowedByRobotsTxt(url: string): boolean {
    if (this.robotsTxtRules.length === 0) return false;
    
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      for (const rule of this.robotsTxtRules) {
        if (rule === '/') {
          return true;
        }
        
        if (rule.endsWith('*')) {
          const prefix = rule.slice(0, -1);
          if (path.startsWith(prefix)) {
            return true;
          }
        } else {
          if (path === rule || path.startsWith(`${rule}/`)) {
            return true;
          }
        }
      }
    } catch (error) {
      return false;
    }
    
    return false;
  }
  
  // Вспомогательный метод для ожидания
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Метод для отмены сканирования
  cancel(): void {
    this.isCancelled = true;
  }
}
