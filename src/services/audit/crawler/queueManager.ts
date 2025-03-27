
/**
 * Queue management for crawler requests
 */

import { CrawlResult, DeepCrawlerOptions } from './types';

export class QueueManager {
  private maxConcurrentRequests = 5;
  private activeRequests = 0;
  private paused = false;

  constructor() {}

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  async processCrawlQueue(
    queue: { url: string; depth: number }[],
    visited: Set<string>,
    options: DeepCrawlerOptions,
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    const { maxPages, maxDepth, onProgress } = options;
    let pagesScanned = 0;
    
    while (queue.length > 0 && !this.paused) {
      // Check if we've reached the maximum number of pages
      if (pagesScanned >= maxPages) {
        break;
      }
      
      // Get the next URL from the queue
      const { url, depth } = queue.shift()!;
      
      // Skip if already visited or beyond max depth
      if (visited.has(url) || depth > maxDepth) {
        continue;
      }
      
      // Mark as visited
      visited.add(url);
      pagesScanned++;
      
      // Report progress
      if (onProgress) {
        onProgress(pagesScanned, queue.length + pagesScanned, url);
      }
      
      // Process the URL
      await processFunction(url, depth);
      
      // Throttle requests to avoid overwhelming the server
      if (queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Return the result
    return {
      urls: Array.from(visited),
      pageCount: pagesScanned
    };
  }
}
