
/**
 * Core crawler implementation for deep site analysis
 */

import * as cheerio from 'cheerio';
import axios from 'axios';
import { CrawlResult, DeepCrawlerOptions, TaskProgress } from './types';
import { UrlProcessor } from './urlProcessor';
import { RobotsTxtParser } from './robotsTxtParser';
import { CrawlQueueManager } from './crawlQueueManager';
import { PageProcessor } from './pageProcessor';

export class DeepCrawlerCore {
  protected url: string;
  protected options: DeepCrawlerOptions;
  private urlProcessor: UrlProcessor;
  private robotsParser: RobotsTxtParser;
  private queueManager: CrawlQueueManager;
  private isCancelled = false;
  private debugMode = false;
  private retryCount = 2;
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ];

  constructor(url: string, options: DeepCrawlerOptions) {
    // Validate URL
    if (!url) {
      throw new Error('URL cannot be empty');
    }

    // Initialize the URL processor
    this.urlProcessor = new UrlProcessor(url);
    this.url = url;
    
    // Initialize the robots.txt parser
    this.robotsParser = new RobotsTxtParser();
    
    // Set default options with fallbacks
    this.options = {
      maxPages: options.maxPages || 50000,
      maxDepth: options.maxDepth || 10,
      onProgress: options.onProgress || (() => {}),
    };

    // Initialize queue manager
    this.queueManager = new CrawlQueueManager();
    this.queueManager.configure({
      maxConcurrentRequests: 10,
      retryAttempts: 3,
      requestTimeout: 15000,
      debug: false,
      onProgress: (progress) => {
        if (this.options.onProgress) {
          this.options.onProgress(progress);
        }
      }
    });
  }

  /**
   * Get domain for current scan
   */
  getDomain(): string {
    return this.urlProcessor.getDomain();
  }

  /**
   * Get base URL for current scan
   */
  getBaseUrl(): string {
    return this.urlProcessor.getBaseUrl();
  }

  /**
   * Enable or disable debug mode
   */
  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Cancel current scan process
   */
  cancel(): void {
    this.isCancelled = true;
    this.queueManager.pause();
    
    if (this.debugMode) {
      console.log('Crawling cancelled by user');
    }
  }

  /**
   * Get random User-Agent to avoid detection
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Start crawling process
   */
  async startCrawling(): Promise<CrawlResult> {
    try {
      if (this.debugMode) {
        console.log(`Starting deep crawl for ${this.url}`);
      }

      // Reset state for new scan
      const queue: { url: string; depth: number }[] = [];
      const visited = new Set<string>();
      this.isCancelled = false;
      this.queueManager.reset();
      this.queueManager.resume();

      // Add initial URL to queue
      queue.push({ url: this.url, depth: 0 });

      // Fetch and parse robots.txt
      await this.parseRobotsTxt();

      // Process queue
      const result = await this.queueManager.processQueue(
        queue,
        visited,
        {
          maxPages: this.options.maxPages,
          maxDepth: this.options.maxDepth
        }
      );

      // Add domain to metadata
      if (result.metadata) {
        result.metadata.domain = this.urlProcessor.getDomain();
      }

      return result;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }

  /**
   * Parse robots.txt if available
   */
  private async parseRobotsTxt(): Promise<void> {
    try {
      const disallowedPaths = await this.robotsParser.parse(this.urlProcessor.getBaseUrl());
      this.urlProcessor.setRobotsTxtPaths(disallowedPaths);
    } catch (error) {
      console.warn('Could not parse robots.txt:', error);
    }
  }

  /**
   * Process single URL
   */
  private async processSingleUrl(url: string, depth: number): Promise<void> {
    if (this.isCancelled) {
      return;
    }

    try {
      // Skip if not allowed by robots.txt
      if (!this.urlProcessor.isAllowedByRobotsTxt(url)) {
        return;
      }

      // Try to fetch URL with retry logic
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

      // Process only HTML content
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        return;
      }

      // Extract links from page
      const links = this.extractLinks(response.data, url);
      
      // Filter and sort by priority
      const sortedLinks = this.urlProcessor.sortByPriority(links);

      // Process sorted links
      for (const link of sortedLinks) {
        try {
          const normalizedLink = this.urlProcessor.normalizeUrl(link);
          if (this.urlProcessor.shouldCrawl(normalizedLink)) {
            this.queueManager.addToQueue(normalizedLink, depth + 1);
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
   * Extract links from HTML content
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
}
