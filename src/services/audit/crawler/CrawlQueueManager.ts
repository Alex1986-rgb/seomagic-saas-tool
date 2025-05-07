
/**
 * Manages the crawl queue for deep site analysis
 */

import { CrawlResult } from './types';

export class CrawlQueueManager {
  private queue: { url: string; depth: number }[] = [];
  private visited = new Set<string>();
  private processing = new Set<string>();
  private maxConcurrentRequests = 5;
  private retryAttempts = 3;
  private requestTimeout = 10000; // 10 seconds
  private isPaused = false;
  private debugMode = false;
  
  // Stats
  private totalRequests = 0;
  private successRequests = 0;
  private failedRequests = 0;
  private startTime: number = 0;

  /**
   * Configures the queue manager with specific options
   */
  configure(options: {
    maxConcurrentRequests?: number;
    retryAttempts?: number;
    requestTimeout?: number;
    debug?: boolean;
  }) {
    if (options.maxConcurrentRequests) {
      this.maxConcurrentRequests = options.maxConcurrentRequests;
    }
    if (options.retryAttempts !== undefined) {
      this.retryAttempts = options.retryAttempts;
    }
    if (options.requestTimeout) {
      this.requestTimeout = options.requestTimeout;
    }
    if (options.debug !== undefined) {
      this.debugMode = options.debug;
    }
  }

  /**
   * Resets the queue and statistics
   */
  reset() {
    this.queue = [];
    this.visited = new Set<string>();
    this.processing = new Set<string>();
    this.totalRequests = 0;
    this.successRequests = 0;
    this.failedRequests = 0;
    this.startTime = Date.now();
    this.isPaused = false;
  }

  /**
   * Adds a URL to the crawl queue
   */
  addToQueue(url: string, depth: number) {
    // Only add if not already visited or in queue
    if (!this.visited.has(url) && !this.processing.has(url)) {
      this.queue.push({ url, depth });
    }
  }

  /**
   * Marks a URL as visited
   */
  markVisited(url: string) {
    this.visited.add(url);
    this.processing.delete(url);
  }

  /**
   * Pauses the queue processing
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resumes the queue processing
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * Processes the crawl queue with parallel requests
   */
  async processQueue(
    options: { maxPages: number; maxDepth: number },
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    this.startTime = Date.now();
    
    while (this.queue.length > 0 && !this.isPaused) {
      // Stop if we've reached the max pages
      if (this.visited.size >= options.maxPages) {
        break;
      }
      
      // Process up to maxConcurrentRequests in parallel
      const batch = [];
      const batchSize = Math.min(this.maxConcurrentRequests, this.queue.length);
      
      for (let i = 0; i < batchSize; i++) {
        const item = this.queue.shift();
        if (item) {
          this.processing.add(item.url);
          batch.push(this.processItem(item.url, item.depth, processFunction));
        }
      }
      
      if (batch.length > 0) {
        await Promise.all(batch);
      }
    }
    
    const endTime = Date.now();
    
    return {
      urls: Array.from(this.visited),
      visitedCount: this.visited.size,
      metadata: {
        totalRequests: this.totalRequests,
        successRequests: this.successRequests,
        failedRequests: this.failedRequests,
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        totalTime: endTime - this.startTime,
      }
    };
  }

  /**
   * Processes a single queue item with retry logic
   */
  private async processItem(
    url: string,
    depth: number,
    processFunction: (url: string, depth: number) => Promise<void>
  ) {
    this.totalRequests++;
    
    try {
      await processFunction(url, depth);
      this.successRequests++;
    } catch (error) {
      this.failedRequests++;
      if (this.debugMode) {
        console.error(`Error processing ${url}:`, error);
      }
    } finally {
      this.markVisited(url);
    }
  }
}
