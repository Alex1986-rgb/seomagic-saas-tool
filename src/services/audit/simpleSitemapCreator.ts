import axios from 'axios';
import * as cheerio from 'cheerio';
import { SitemapExtractor } from './crawler/sitemapExtractor';
import { generateSitemapXml } from './sitemap/generator';
import { normalizeUrl, isUrlFromSameDomain, getDomainFromUrl } from './crawler/urlUtils';

interface SitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  userAgent?: string;
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
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
  ];
  
  constructor(options: SitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 10,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      requestDelay: options.requestDelay || 300,
      userAgent: options.userAgent || 'SEO Market Website Scanner Bot',
      concurrentRequests: options.concurrentRequests || 5,
      retryCount: options.retryCount || 2,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 15000
    };
    
    this.sitemapExtractor = new SitemapExtractor();
  }
  
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
  
  cancel(): void {
    this.isCancelled = true;
    console.log('Crawling cancelled by user');
  }
  
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }
  
  private async findSitemaps(url: string): Promise<string[]> {
    try {
      const commonSitemapPaths = [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/sitemap/',
        '/sitemap/sitemap.xml',
        '/wp-sitemap.xml',
      ];
      
      const baseUrl = new URL(url).origin;
      
      for (const path of commonSitemapPaths) {
        const sitemapUrl = `${baseUrl}${path}`;
        try {
          const response = await axios.get(sitemapUrl, {
            headers: { 'User-Agent': this.getRandomUserAgent() },
            timeout: 5000
          });
          
          if (response.status === 200 && 
              (response.headers['content-type']?.includes('xml') || 
               response.data?.includes('<urlset') || 
               response.data?.includes('<sitemapindex'))) {
            
            const urls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapUrl);
            if (urls.length > 0) {
              if (this.debugMode) {
                console.log(`Found sitemap at ${sitemapUrl} with ${urls.length} URLs`);
              }
              return urls;
            }
          }
        } catch (error) {
          if (this.debugMode) {
            console.log(`No sitemap found at ${sitemapUrl}`);
          }
        }
      }
      
      try {
        const robotsTxtUrl = `${baseUrl}/robots.txt`;
        const response = await axios.get(robotsTxtUrl, {
          headers: { 'User-Agent': this.getRandomUserAgent() },
          timeout: 5000
        });
        
        if (response.status === 200) {
          const robotsTxt = response.data;
          const sitemapRegex = /Sitemap:\s*([^\s]+)/gi;
          let match;
          let sitemapUrls = [];
          
          while ((match = sitemapRegex.exec(robotsTxt)) !== null) {
            sitemapUrls.push(match[1]);
          }
          
          if (sitemapUrls.length > 0) {
            let allUrls = [];
            
            for (const sitemapUrl of sitemapUrls) {
              try {
                const urls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapUrl);
                allUrls = [...allUrls, ...urls];
              } catch (error) {
              }
            }
            
            if (allUrls.length > 0) {
              if (this.debugMode) {
                console.log(`Found ${allUrls.length} URLs from sitemaps in robots.txt`);
              }
              return allUrls;
            }
          }
        }
      } catch (error) {
      }
    } catch (error) {
      console.error('Error finding sitemaps:', error);
    }
    
    return [];
  }
  
  private extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const $ = cheerio.load(html);
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          const resolvedUrl = new URL(href, baseUrl).href;
          links.push(resolvedUrl);
        } catch (error) {
        }
      }
    });
    
    return links;
  }
  
  private async processSingleUrl(url: string, currentDepth: number): Promise<string[]> {
    if (this.isCancelled) {
      return [];
    }
    
    if (!isUrlFromSameDomain(url, this.domain)) {
      return [];
    }
    
    const foundLinks: string[] = [];
    let retryCount = 0;
    
    while (retryCount <= this.options.retryCount) {
      try {
        const randomDelay = Math.floor(Math.random() * 300) + this.options.requestDelay;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
          },
          timeout: this.options.timeout,
          maxRedirects: 5
        });
        
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('text/html')) {
          break;
        }
        
        const links = this.extractLinks(response.data, url);
        
        for (const link of links) {
          try {
            if (isUrlFromSameDomain(link, this.domain)) {
              const normalizedLink = normalizeUrl(link);
              foundLinks.push(normalizedLink);
              
              if (currentDepth < this.options.maxDepth && !this.visited.has(normalizedLink)) {
                this.queue.push({ url: normalizedLink, depth: currentDepth + 1 });
              }
            }
          } catch (error) {
          }
        }
        
        break;
      } catch (error) {
        retryCount++;
        
        if (retryCount <= this.options.retryCount) {
          const backoff = this.options.retryDelay * Math.pow(2, retryCount - 1) + Math.random() * 500;
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }
    
    return foundLinks;
  }
  
  async crawl(
    url: string, 
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    try {
      this.isCancelled = false;
      this.visited.clear();
      this.queue = [];
      
      this.setBaseUrl(url);
      const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      this.queue.push({ url: normalizedUrl, depth: 0 });
      
      if (this.debugMode) {
        console.log(`Starting crawl for ${url} with max pages: ${this.options.maxPages}`);
      }
      
      const sitemapUrls = await this.findSitemaps(normalizedUrl);
      if (sitemapUrls.length > 0) {
        console.log(`Found ${sitemapUrls.length} URLs from sitemap(s)`);
        
        sitemapUrls.forEach(sitemapUrl => this.visited.add(sitemapUrl));
        
        if (sitemapUrls.length >= this.options.maxPages) {
          console.log(`Returning ${this.options.maxPages} URLs from sitemap(s)`);
          if (progressCallback) {
            progressCallback(this.options.maxPages, this.options.maxPages, normalizedUrl);
          }
          return sitemapUrls.slice(0, this.options.maxPages);
        }
        
        console.log(`Sitemap has ${sitemapUrls.length} URLs, continuing with crawling to find more...`);
      }
      
      let processedCount = 0;
      this.visited.add(normalizedUrl);
      
      let estimatedTotal = this.options.maxPages;
      if (sitemapUrls.length > 0) {
        estimatedTotal = Math.min(sitemapUrls.length * 2, this.options.maxPages);
      }
      
      if (progressCallback) {
        progressCallback(processedCount, estimatedTotal, normalizedUrl);
      }
      
      while (this.queue.length > 0 && this.visited.size < this.options.maxPages && !this.isCancelled) {
        const batch = this.queue.splice(0, this.options.concurrentRequests);
        const promises = batch.map(({ url: queuedUrl, depth }) => {
          return this.processSingleUrl(queuedUrl, depth);
        });
        
        const batchResults = await Promise.all(promises);
        
        for (let i = 0; i < batch.length; i++) {
          const currentUrl = batch[i].url;
          const foundLinks = batchResults[i];
          
          processedCount++;
          
          for (const link of foundLinks) {
            if (!this.visited.has(link) && this.visited.size < this.options.maxPages) {
              this.visited.add(link);
            }
          }
          
          if (progressCallback && processedCount % 5 === 0) {
            progressCallback(this.visited.size, estimatedTotal, currentUrl);
            
            if (this.visited.size > estimatedTotal * 0.8) {
              estimatedTotal = Math.min(this.visited.size * 1.25, this.options.maxPages);
            }
          }
        }
      }
      
      if (progressCallback) {
        progressCallback(this.visited.size, this.visited.size, "Завершено");
      }
      
      console.log(`Crawling completed. Found ${this.visited.size} URLs.`);
      return Array.from(this.visited);
    } catch (error) {
      console.error('Error during crawl:', error);
      return Array.from(this.visited);
    }
  }
  
  generateSitemap(urls: string[]): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      try {
        sitemap += `  <url>\n    <loc>${url}</loc>\n`;
        sitemap += `    <priority>0.5</priority>\n`;
        sitemap += `  </url>\n`;
      } catch (e) {
      }
    }
    
    sitemap += '</urlset>';
    
    if (this.options.includeStylesheet) {
      sitemap = sitemap.replace('?>', '?><?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>');
    }
    
    return sitemap;
  }
}
