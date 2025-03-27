
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
    processUrlFn: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult> {
    let pagesScanned = 0;
    
    while (queue.length > 0 && pagesScanned < options.maxPages) {
      // Process up to maxConcurrentRequests at a time
      const batchPromises: Promise<void>[] = [];
      
      while (this.activeRequests < this.maxConcurrentRequests && queue.length > 0 && pagesScanned < options.maxPages) {
        const { url, depth } = queue.shift()!;
        
        if (visited.has(url) || depth > options.maxDepth) {
          continue;
        }
        
        visited.add(url);
        pagesScanned++;
        
        if (options.onProgress) {
          options.onProgress(
            pagesScanned, 
            Math.max(options.maxPages, queue.length + pagesScanned), 
            url
          );
        }
        
        // Update global URL cache if it exists
        try {
          const { urlCache } = require('../linkExtraction');
          if (urlCache) {
            urlCache.add(url);
          }
        } catch (e) {
          // Ignore if cache doesn't exist
        }
        
        // Process URL
        this.activeRequests++;
        const promise = processUrlFn(url, depth).finally(() => {
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
      urls: Array.from(visited),
      pageCount: pagesScanned
    };
  }
}
