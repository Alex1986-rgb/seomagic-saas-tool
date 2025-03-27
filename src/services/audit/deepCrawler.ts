
/**
 * Deep crawler service for large e-commerce sites
 * Specialized in handling furniture catalogs and other large product collections
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlCache } from './linkExtraction';

interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  onProgress: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
}

interface CrawlResult {
  urls: string[];
  pageCount: number;
}

export class DeepCrawler {
  protected visited = new Set<string>();
  protected queue: { url: string; depth: number }[] = [];
  protected domain: string;
  protected baseUrl: string;
  protected options: DeepCrawlerOptions;
  protected productPatterns: RegExp[] = [
    /\/product\//i, /\/products\//i, /\/item\//i, /\/items\//i,
    /\/catalog\//i, /\/collection\//i, /\/goods\//i,
    /\/tovary?\//i, /\/mebel\//i, /\/furniture\//i
  ];
  private maxConcurrentRequests = 5;
  private activeRequests = 0;
  private paused = false;
  private specialPatterns: Record<string, RegExp[]> = {
    'myarredo.ru': [
      /\/catalog\//, /\/factory\//, /\/product\//, /\/collection\//,
      /\/interior\//, /\/sale\//, /\/brands\//
    ],
    'arredo': [
      /\/catalog\//, /\/factory\//, /\/product\//, /\/collection\//,
      /\/interior\//, /\/sale\//, /\/brands\//
    ]
  };

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = options;
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      const urlObj = new URL(this.baseUrl);
      this.domain = urlObj.hostname;
    } catch (error) {
      this.domain = url;
    }
    
    // Add domain-specific patterns if available
    for (const key in this.specialPatterns) {
      if (this.domain.includes(key)) {
        console.log(`Using specialized patterns for ${key}`);
        this.productPatterns = [...this.productPatterns, ...this.specialPatterns[key]];
        break;
      }
    }
  }

  async startCrawling(): Promise<CrawlResult> {
    this.queue = [{ url: this.baseUrl, depth: 0 }];
    this.visited.clear();
    
    // First, check if we can find a sitemap
    const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
    try {
      console.log(`Checking for sitemap at ${sitemapUrl}`);
      const response = await axios.get(sitemapUrl, { timeout: 10000 });
      if (response.status === 200 && response.data.includes('<urlset')) {
        console.log('Sitemap found, extracting URLs...');
        const sitemapUrls = await this.extractUrlsFromSitemap(response.data);
        console.log(`Extracted ${sitemapUrls.length} URLs from sitemap`);
        
        // Add sitemap URLs to queue
        sitemapUrls.forEach(url => {
          if (!this.visited.has(url)) {
            this.queue.push({ url, depth: 0 });
          }
        });
        
        if (this.options.onProgress) {
          this.options.onProgress(0, sitemapUrls.length, sitemapUrl);
        }
      }
    } catch (error) {
      console.log('No sitemap found or error accessing it, continuing with crawl');
    }
    
    // Next, try to find catalog pages
    await this.findCatalogPages();
    
    // Continue with deep crawling
    return this.processCrawlQueue();
  }
  
  private async findCatalogPages(): Promise<void> {
    console.log('Looking for catalog pages...');
    try {
      const response = await axios.get(this.baseUrl, { timeout: 8000 });
      const $ = cheerio.load(response.data);
      
      // Find all links to potential catalog pages
      const catalogLinks: string[] = [];
      
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              fullUrl = `${this.baseUrl}${href}`;
            } else if (!href.startsWith('http')) {
              fullUrl = `${this.baseUrl}/${href}`;
            }
            
            // Check if it matches product/catalog patterns
            const isProductPattern = this.productPatterns.some(pattern => pattern.test(fullUrl));
            const isExternalLink = !fullUrl.includes(this.domain);
            
            if (isProductPattern && (!isExternalLink || this.options.followExternalLinks)) {
              catalogLinks.push(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      // Add catalog links to the front of the queue for priority processing
      catalogLinks.forEach(url => {
        if (!this.visited.has(url)) {
          this.queue.unshift({ url, depth: 1 });
        }
      });
      
      console.log(`Found ${catalogLinks.length} potential catalog links`);
    } catch (error) {
      console.error('Error finding catalog pages:', error);
    }
  }
  
  private async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    const urls: string[] = [];
    const $ = cheerio.load(sitemapXml, { xmlMode: true });
    
    // Extract URLs from the sitemap
    $('url > loc').each((_, element) => {
      const url = $(element).text().trim();
      if (url) {
        urls.push(url);
      }
    });
    
    // Fixed: Collect nested sitemap URLs first, then process them sequentially
    const nestedSitemapUrls: string[] = [];
    $('sitemap > loc').each((_, element) => {
      const sitemapUrl = $(element).text().trim();
      if (sitemapUrl) {
        nestedSitemapUrls.push(sitemapUrl);
      }
    });
    
    // Process nested sitemaps sequentially
    for (const sitemapUrl of nestedSitemapUrls) {
      try {
        const response = await axios.get(sitemapUrl, { timeout: 8000 });
        const nestedUrls = await this.extractUrlsFromSitemap(response.data);
        urls.push(...nestedUrls);
      } catch (error) {
        console.error(`Error processing nested sitemap ${sitemapUrl}:`, error);
      }
    }
    
    return urls;
  }
  
  private async processCrawlQueue(): Promise<CrawlResult> {
    let pagesScanned = 0;
    
    while (this.queue.length > 0 && pagesScanned < this.options.maxPages) {
      // Process up to maxConcurrentRequests at a time
      const batchPromises: Promise<void>[] = [];
      
      while (this.activeRequests < this.maxConcurrentRequests && this.queue.length > 0 && pagesScanned < this.options.maxPages) {
        const { url, depth } = this.queue.shift()!;
        
        if (this.visited.has(url) || depth > this.options.maxDepth) {
          continue;
        }
        
        this.visited.add(url);
        pagesScanned++;
        
        if (this.options.onProgress) {
          this.options.onProgress(pagesScanned, Math.max(this.options.maxPages, this.queue.length + pagesScanned), url);
        }
        
        // Update global URL cache
        urlCache.add(url);
        
        // Process URL
        this.activeRequests++;
        const promise = this.processUrl(url, depth).finally(() => {
          this.activeRequests--;
          
          // If crawler was paused and we have capacity again, unpause
          if (this.paused && this.activeRequests < this.maxConcurrentRequests) {
            this.paused = false;
          }
        });
        
        batchPromises.push(promise);
      }
      
      // If we've hit the max concurrent requests, pause until some complete
      if (this.activeRequests >= this.maxConcurrentRequests) {
        this.paused = true;
        await Promise.race(batchPromises);
      }
      
      // If all promises are in flight, wait for one to complete
      if (batchPromises.length > 0) {
        await Promise.race(batchPromises);
      }
    }
    
    console.log(`Crawl completed. Visited ${pagesScanned} pages.`);
    
    return {
      urls: Array.from(this.visited),
      pageCount: pagesScanned
    };
  }
  
  protected async processUrl(url: string, depth: number): Promise<void> {
    try {
      const response = await axios.get(url, { 
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://example.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
        }
      });
      
      const $ = cheerio.load(response.data);
      const links: string[] = [];
      
      // Extract all links
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              fullUrl = this.baseUrl + href;
            } else if (!href.startsWith('http')) {
              fullUrl = `${this.baseUrl}/${href}`;
            }
            
            const urlObj = new URL(fullUrl);
            const isExternalLink = urlObj.hostname !== this.domain;
            
            // Only follow internal links or external if specified
            if (!isExternalLink || this.options.followExternalLinks) {
              links.push(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      // Add links to queue
      for (const link of links) {
        if (!this.visited.has(link)) {
          // Prioritize product links
          const isProductLink = this.productPatterns.some(pattern => pattern.test(link));
          
          if (isProductLink) {
            this.queue.unshift({ url: link, depth: depth + 1 });
          } else {
            this.queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (error) {
      console.warn(`Error processing URL ${url}:`, error);
    }
  }
  
  pauseCrawling(): void {
    this.paused = true;
  }
  
  resumeCrawling(): void {
    this.paused = false;
  }
  
  getStats(): { visited: number, queued: number } {
    return {
      visited: this.visited.size,
      queued: this.queue.length
    };
  }
}
