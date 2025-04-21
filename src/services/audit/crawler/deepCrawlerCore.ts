
/**
 * Core crawler implementation for deep site analysis
 */

import * as cheerio from 'cheerio';
import axios from 'axios';
import { QueueManager } from './queueManager';
import { normalizePath, normalizeUrl, isUrlFromSameDomain, isExternalUrl } from './urlUtils';
import { CrawlResult, DeepCrawlerOptions, ExtractorFunction } from './types';

export class DeepCrawlerCore {
  private url: string;
  private baseUrl: string;
  private domain: string;
  private options: DeepCrawlerOptions;
  private queue: { url: string; depth: number }[] = [];
  private visited = new Set<string>();
  private queueManager: QueueManager;
  private isCancelled = false;
  private robotsTxtAllowed: { [key: string]: boolean } = {};
  private debugMode = false;
  private retryCount = 2;
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ];

  constructor(url: string, options: DeepCrawlerOptions) {
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

    // Set default options with fallbacks
    this.options = {
      maxPages: options.maxPages || 50000,
      maxDepth: options.maxDepth || 10,
      onProgress: options.onProgress || (() => {}),
    };

    // Initialize queue manager and configure it
    this.queueManager = new QueueManager();
    if (typeof this.queueManager.configure === 'function') {
      this.queueManager.configure({
        maxConcurrentRequests: 10,
        retryAttempts: 3,
        requestTimeout: 15000,
        debug: false
      });
    }
  }

  /**
   * Retrieves the domain for the current crawl
   */
  getDomain(): string {
    return this.domain;
  }

  /**
   * Retrieves the base URL for the current crawl
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Enables or disables debug mode
   */
  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Cancels the current crawling process
   */
  cancel(): void {
    this.isCancelled = true;
    this.queueManager.pause();
    
    if (this.debugMode) {
      console.log('Crawling cancelled by user');
    }
  }

  /**
   * Gets a random user agent to avoid detection
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Starts the crawling process
   */
  async startCrawling(): Promise<CrawlResult> {
    try {
      if (this.debugMode) {
        console.log(`Starting deep crawl for ${this.url}`);
      }

      // Reset state for new crawl
      this.queue = [];
      this.visited.clear();
      this.isCancelled = false;
      this.queueManager.resume();

      // Add the initial URL to the queue
      this.queue.push({ url: this.url, depth: 0 });

      // Fetch and parse robots.txt
      await this.parseRobotsTxt();

      // Begin crawling
      const result = await this.queueManager.processCrawlQueue(
        this.queue,
        this.visited,
        this.options,
        this.processSingleUrl.bind(this)
      );

      return result;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }

  /**
   * Parses robots.txt file if available
   */
  private async parseRobotsTxt(): Promise<void> {
    try {
      const robotsUrl = `${this.baseUrl}/robots.txt`;
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': this.getRandomUserAgent()
        }
      }).catch(() => null);

      if (response && response.status === 200) {
        const lines = response.data.split('\n');
        let currentUserAgent = '*';

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('User-agent:')) {
            currentUserAgent = trimmedLine.substring(11).trim();
          } else if (trimmedLine.startsWith('Disallow:') && 
                    (currentUserAgent === '*' || currentUserAgent.includes('bot'))) {
            const path = trimmedLine.substring(9).trim();
            if (path) {
              this.robotsTxtAllowed[path] = false;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Could not parse robots.txt:', error);
    }
  }

  /**
   * Checks if a URL is allowed by robots.txt
   */
  private isAllowedByRobotsTxt(url: string): boolean {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== this.domain) {
        return false; // External URLs are not allowed in our crawl
      }

      const pathname = urlObj.pathname;
      for (const path in this.robotsTxtAllowed) {
        if (pathname.startsWith(path) && !this.robotsTxtAllowed[path]) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Processes a single URL
   */
  private async processSingleUrl(url: string, depth: number): Promise<void> {
    if (this.isCancelled) {
      return;
    }

    try {
      // Skip if not allowed by robots.txt
      if (!this.isAllowedByRobotsTxt(url)) {
        return;
      }

      // Try to fetch the URL with retry logic
      let response;
      let retryCount = 0;
      
      while (retryCount <= this.retryCount) {
        try {
          response = await axios.get(url, {
            headers: {
              'User-Agent': this.getRandomUserAgent(),
              'Accept': 'text/html,application/xhtml+xml',
              'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
            },
            timeout: 10000,
            maxRedirects: 5
          });
          break; // Success, exit retry loop
        } catch (error) {
          retryCount++;
          if (retryCount > this.retryCount) {
            throw error;
          }
          
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!response) {
        return;
      }

      // Only process HTML content
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        return;
      }

      // Extract links from the page
      const links = this.extractLinks(response.data, url);
      
      // Filter by priority
      const sortedLinks = this.sortLinksByPriority(links);

      // Process the sorted links
      for (const link of sortedLinks) {
        try {
          const normalizedLink = normalizeUrl(link);
          if (this.shouldCrawl(normalizedLink)) {
            this.queue.push({ url: normalizedLink, depth: depth + 1 });
          }
        } catch (error) {
          // Invalid link, skip
        }
      }
    } catch (error) {
      if (this.debugMode) {
        console.error(`Error processing ${url}:`, error);
      }
    }
  }

  /**
   * Sorts links by priority for more efficient crawling
   * This helps find important pages earlier in the crawl
   */
  private sortLinksByPriority(links: string[]): string[] {
    return links.sort((a, b) => {
      let aPriority = 0;
      let bPriority = 0;
      
      try {
        const aUrl = new URL(a);
        const bUrl = new URL(b);
        
        // Higher priority for URLs with fewer path segments
        const aPathDepth = aUrl.pathname.split('/').filter(Boolean).length;
        const bPathDepth = bUrl.pathname.split('/').filter(Boolean).length;
        
        aPriority -= aPathDepth;
        bPriority -= bPathDepth;
        
        // Higher priority for URLs without query params
        if (!aUrl.search) aPriority += 2;
        if (!bUrl.search) bPriority += 2;
        
        // Higher priority for URLs that look like product pages
        if (aUrl.pathname.includes('product') || aUrl.pathname.includes('item')) aPriority += 3;
        if (bUrl.pathname.includes('product') || bUrl.pathname.includes('item')) bPriority += 3;
        
        // Higher priority for category pages
        if (aUrl.pathname.includes('category') || aUrl.pathname.includes('catalog')) aPriority += 2;
        if (bUrl.pathname.includes('category') || bUrl.pathname.includes('catalog')) bPriority += 2;
        
        return bPriority - aPriority;
      } catch (error) {
        return 0;
      }
    });
  }

  /**
   * Extracts links from HTML content
   */
  private extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const $ = cheerio.load(html);
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          // Resolve relative URLs
          const resolvedUrl = new URL(href, baseUrl).href;
          links.push(resolvedUrl);
        } catch (error) {
          // Skip invalid URLs
        }
      }
    });
    
    return links;
  }

  /**
   * Determines whether a URL should be crawled
   */
  private shouldCrawl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Skip non-http/https URLs
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return false;
      }
      
      // Only crawl within the same domain
      if (urlObj.hostname !== this.domain) {
        return false;
      }
      
      // Skip URLs with certain file extensions
      const fileExtensions = /\.(jpg|jpeg|png|gif|css|js|svg|pdf|zip|rar|doc|xls)$/i;
      if (fileExtensions.test(urlObj.pathname)) {
        return false;
      }
      
      // Skip admin/backend URLs
      if (urlObj.pathname.includes('/wp-admin/') || 
          urlObj.pathname.includes('/admin/') ||
          urlObj.pathname.includes('/wp-login.php')) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
}
