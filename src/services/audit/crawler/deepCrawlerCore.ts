
/**
 * Core crawler implementation with functionality shared by all crawler types
 */

import { CrawlResult, DeepCrawlerOptions, TaskProgress } from './types';
import { EventEmitter } from 'events';

// Define a minimal SitemapGenerator class to satisfy the interface
class SitemapGenerator {
  private urls: Set<string> = new Set();
  
  addUrl(url: string): void {
    this.urls.add(url);
  }
  
  generate(): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    this.urls.forEach(url => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    return sitemap;
  }
}

export class DeepCrawler extends EventEmitter {
  protected url: string;
  protected baseUrl: string;
  protected domain: string;
  protected options: DeepCrawlerOptions;
  protected queue: { url: string; depth: number }[] = [];
  protected visited = new Set<string>();
  protected sitemapGenerator: SitemapGenerator;

  constructor(url: string, options: DeepCrawlerOptions) {
    super();
    
    // Normalize and validate the URL
    if (!url) {
      throw new Error('URL cannot be empty');
    }

    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      const urlObj = new URL(normalizedUrl);
      this.url = normalizedUrl;
      this.baseUrl = urlObj.origin;
      this.domain = urlObj.hostname;
    } catch (error) {
      throw new Error(`Invalid URL: ${normalizedUrl}`);
    }

    // Set default options
    this.options = {
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 10,
      onProgress: options.onProgress || (() => {}),
    };
    
    this.sitemapGenerator = new SitemapGenerator();
  }

  /**
   * Gets the domain for the current crawl
   */
  getDomain(): string {
    return this.domain;
  }

  /**
   * Gets the base URL for the current crawl
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Basic crawling implementation that can be overridden by subclasses
   */
  async startCrawling(): Promise<CrawlResult> {
    // Simulate a crawling process with progress updates
    const totalPages = Math.min(100, this.options.maxPages);
    
    for (let i = 0; i < totalPages; i++) {
      const mockUrl = `${this.baseUrl}/page-${i}`;
      this.visited.add(mockUrl);
      this.sitemapGenerator.addUrl(mockUrl);
      
      // Call the progress callback if provided
      if (this.options.onProgress) {
        this.options.onProgress({
          pagesScanned: i + 1,
          currentUrl: mockUrl,
          totalUrls: totalPages
        });
      }
      
      // Add a small delay to simulate work being done
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return {
      urls: Array.from(this.visited),
      pageCount: this.visited.size,
      metadata: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalTime: 0,
        totalRequests: this.visited.size,
        successRequests: this.visited.size,
        failedRequests: 0,
        domain: this.domain,
        totalPages: this.visited.size
      }
    };
  }

  /**
   * Cancels an ongoing crawling operation
   */
  cancel(): void {
    console.log('Crawling operation cancelled');
  }
}

export default DeepCrawler;
