
import { CrawlResult } from './types';

/**
 * Manages the crawling queue for the deep crawler
 */
export class CrawlQueueManager {
  private concurrentRequests = 0;
  private maxConcurrentRequests = 10;
  private requestDelay = 500; // ms between requests
  private retryAttempts = 3;
  private requestTimeout = 30000; // 30s timeout
  private isPaused = false;
  private debug = false;
  private totalRequests = 0;
  private successRequests = 0;
  private failedRequests = 0;
  private onProgress?: (progress: { pagesScanned: number; currentUrl: string; totalUrls: number; }) => void;

  /**
   * Configure the queue manager
   */
  configure(options: {
    maxConcurrentRequests?: number;
    requestDelay?: number;
    retryAttempts?: number;
    requestTimeout?: number;
    debug?: boolean;
    onProgress?: (progress: { pagesScanned: number; currentUrl: string; totalUrls: number; }) => void;
  }): void {
    if (options.maxConcurrentRequests) this.maxConcurrentRequests = options.maxConcurrentRequests;
    if (options.requestDelay) this.requestDelay = options.requestDelay;
    if (options.retryAttempts) this.retryAttempts = options.retryAttempts;
    if (options.requestTimeout) this.requestTimeout = options.requestTimeout;
    if (typeof options.debug !== 'undefined') this.debug = options.debug;
    if (options.onProgress) this.onProgress = options.onProgress;
  }

  /**
   * Reset the queue manager state
   */
  reset(): void {
    this.concurrentRequests = 0;
    this.totalRequests = 0;
    this.successRequests = 0;
    this.failedRequests = 0;
    this.isPaused = false;
  }

  /**
   * Pause the queue processing
   */
  pause(): void {
    this.isPaused = true;
    this.log('Queue processing paused');
  }

  /**
   * Resume the queue processing
   */
  resume(): void {
    this.isPaused = false;
    this.log('Queue processing resumed');
  }

  /**
   * Process the crawl queue
   */
  async processQueue(
    queue: { url: string; depth: number }[], 
    visited: Set<string>,
    options: { 
      maxPages: number; 
      maxDepth: number;
    }
  ): Promise<CrawlResult> {
    const startTime = new Date().toISOString();
    let queueIndex = 0;
    
    // Process recursively until queue is empty or limits reached
    while (queueIndex < queue.length && 
           visited.size < options.maxPages && 
           !this.isPaused) {
      
      // Wait if too many concurrent requests
      if (this.concurrentRequests >= this.maxConcurrentRequests) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      
      const current = queue[queueIndex++];
      
      // Skip if URL was already visited or exceeds max depth
      if (visited.has(current.url) || current.depth > options.maxDepth) {
        continue;
      }
      
      // Mark as visited
      visited.add(current.url);
      
      // Start processing the URL
      this.concurrentRequests++;
      this.totalRequests++;
      
      // Report progress
      if (this.onProgress) {
        this.onProgress({
          pagesScanned: visited.size,
          currentUrl: current.url,
          totalUrls: queue.length
        });
      }
      
      try {
        // Simulate URL processing (in a real implementation this would fetch and process the URL)
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        
        // Add to successful requests
        this.successRequests++;
      } catch (error) {
        this.log(`Error processing ${current.url}: ${error}`);
        this.failedRequests++;
      } finally {
        // Decrease active requests counter
        this.concurrentRequests--;
      }
    }
    
    const endTime = new Date().toISOString();
    const totalTime = new Date(endTime).getTime() - new Date(startTime).getTime();
    
    // Return crawl result with metadata
    return {
      urls: Array.from(visited),
      visitedCount: visited.size,
      pageCount: visited.size,
      metadata: {
        totalRequests: this.totalRequests,
        successRequests: this.successRequests,
        failedRequests: this.failedRequests,
        startTime,
        endTime,
        totalTime
      }
    };
  }

  /**
   * Add a URL to the queue
   */
  addToQueue(url: string, depth: number): void {
    // This method would be implemented in the complete version
    // to dynamically add URLs to the queue during processing
  }

  /**
   * Log message if debug mode is enabled
   */
  private log(message: string): void {
    if (this.debug) {
      console.log(`[QueueManager] ${message}`);
    }
  }
}
