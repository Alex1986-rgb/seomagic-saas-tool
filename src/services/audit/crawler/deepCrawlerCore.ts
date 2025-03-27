
/**
 * Core crawler functionality for deep site analysis
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlResult, DeepCrawlerOptions } from './types';
import { UrlProcessor } from './urlProcessor';
import { QueueManager } from './queueManager';
import { CatalogProcessor } from './catalogProcessor';
import { SitemapExtractor } from './sitemapExtractor';

export class DeepCrawlerCore {
  protected visited = new Set<string>();
  protected queue: { url: string; depth: number }[] = [];
  protected domain: string;
  protected baseUrl: string;
  protected options: DeepCrawlerOptions;
  protected productPatterns: RegExp[] = [];
  protected urlProcessor: UrlProcessor;
  protected queueManager: QueueManager;
  protected catalogProcessor: CatalogProcessor;
  protected sitemapExtractor: SitemapExtractor;

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = options;
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      const urlObj = new URL(this.baseUrl);
      this.domain = urlObj.hostname;
    } catch (error) {
      this.domain = url;
    }
    
    // Initialize processors and managers
    this.urlProcessor = new UrlProcessor(this.domain, this.baseUrl);
    this.queueManager = new QueueManager();
    this.catalogProcessor = new CatalogProcessor(this.domain, this.baseUrl);
    this.sitemapExtractor = new SitemapExtractor();
    
    // Set product patterns based on detected site type
    this.productPatterns = this.urlProcessor.getDefaultProductPatterns();
    
    // Add domain-specific patterns if available
    const domainPatterns = this.urlProcessor.getDomainSpecificPatterns(this.domain);
    if (domainPatterns.length > 0) {
      this.productPatterns = [...this.productPatterns, ...domainPatterns];
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
        const sitemapUrls = await this.sitemapExtractor.extractUrlsFromSitemap(response.data);
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
    await this.catalogProcessor.findCatalogPages(this.visited, this.queue, this.productPatterns);
    
    // Continue with deep crawling
    return this.queueManager.processCrawlQueue(
      this.queue, 
      this.visited, 
      this.options, 
      (url, depth) => this.processUrl(url, depth)
    );
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
          const fullUrl = this.urlProcessor.normalizeUrl(href, url, this.baseUrl);
          if (fullUrl) {
            links.push(fullUrl);
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
    this.queueManager.pause();
  }
  
  resumeCrawling(): void {
    this.queueManager.resume();
  }
  
  getStats(): { visited: number, queued: number } {
    return {
      visited: this.visited.size,
      queued: this.queue.length
    };
  }
}
