
/**
 * Core crawler implementation with functionality shared by all crawler types
 */

import { CrawlResult, DeepCrawlerOptions } from './crawler/types';

export class DeepCrawlerCore {
  protected url: string;
  protected baseUrl: string;
  protected domain: string;
  protected options: DeepCrawlerOptions;
  protected queue: { url: string; depth: number }[] = [];
  protected visited = new Set<string>();

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

    // Set default options
    this.options = {
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 10,
      onProgress: options.onProgress || (() => {}),
    };
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
    return {
      urls: Array.from(this.visited),
      pageCount: this.visited.size,
      metadata: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalTime: 0,
        totalPages: this.visited.size,
        domain: this.domain,
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
