
/**
 * Request manager for controlling parallel requests and rate limiting
 */

import { RequestManager } from './types';

export function createRequestManager(): RequestManager {
  return {
    delayBetweenRequests: 50,
    maxConcurrentRequests: 8,
    requestQueue: [],
    activeRequests: 0,
    
    pause: function() {
      console.log('Request manager paused');
    },
    
    resume: function() {
      console.log('Request manager resumed');
      this.processQueue();
    },
    
    addToQueue: function(request: () => Promise<void>) {
      this.requestQueue.push(request);
      this.processQueue();
    },
    
    processQueue: function() {
      if (this.activeRequests >= this.maxConcurrentRequests) {
        return;
      }
      
      if (this.requestQueue.length === 0) {
        return;
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        this.activeRequests++;
        
        setTimeout(() => {
          request().finally(() => {
            this.activeRequests--;
            this.processQueue();
          });
        }, this.delayBetweenRequests);
      }
    }
  };
}
