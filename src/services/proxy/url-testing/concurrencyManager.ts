
/**
 * Manages concurrency for URL testing to prevent overloading
 */
export class ConcurrencyManager {
  private activeRequests: number = 0;
  private readonly maxConcurrentRequests: number;
  
  constructor(maxConcurrentRequests: number = 10) {
    this.maxConcurrentRequests = maxConcurrentRequests;
  }
  
  /**
   * Executes a function with concurrency control
   */
  async executeWithThrottle<T>(fn: () => Promise<T>): Promise<T> {
    // Wait until we're below the concurrency limit
    while (this.activeRequests >= this.maxConcurrentRequests) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.activeRequests++;
    try {
      return await fn();
    } finally {
      this.activeRequests--;
    }
  }
}
