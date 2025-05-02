
import { Proxy } from './types';
import { ProxyStorage } from './proxyStorage';
import type { PingResult } from './types';
import { setupAxiosInstance } from './utils/axiosConfig';

export class PingService {
  private proxyStorage: ProxyStorage;
  private activeRequests: number = 0;
  private maxConcurrentRequests: number = 30; // Increased concurrency
  
  constructor(proxyStorage: ProxyStorage) {
    this.proxyStorage = proxyStorage;
  }
  
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 20, // Increased from 10 to 20
    concurrency: number = 10 // Increased from 5 to 10
  ): Promise<PingResult[]> {
    const results: PingResult[] = [];
    const activeProxies = this.proxyStorage.getActiveProxies();
    
    // Update max concurrent requests based on input
    this.maxConcurrentRequests = concurrency * 3;
    
    // Create a queue of work to be done
    const queue: Array<{url: string, rpc: string}> = [];
    for (const url of urls) {
      for (const rpc of rpcEndpoints) {
        queue.push({url, rpc});
      }
    }
    
    // Split queue into batches
    const batches: Array<Array<{url: string, rpc: string}>> = [];
    for (let i = 0; i < queue.length; i += batchSize) {
      batches.push(queue.slice(i, i + batchSize));
    }
    
    console.log(`Processing ${queue.length} ping requests in ${batches.length} batches`);
    
    // Process batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} requests`);
      
      // Execute batch with improved concurrency control
      const batchResults = await this.processRequestsWithConcurrencyControl(
        batch.map(({url, rpc}) => () => 
          this.pingUrl(url, rpc, siteTitle, feedUrl, activeProxies)
        ),
        concurrency
      );
      
      // Add batch results to overall results
      results.push(...batchResults);
      
      // Brief pause between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 500ms
      }
    }
    
    return results;
  }
  
  // Improved concurrency control with queue processing
  private async processRequestsWithConcurrencyControl<T>(
    taskFunctions: Array<() => Promise<T>>, 
    concurrency: number
  ): Promise<T[]> {
    const results: T[] = [];
    const runningTasks = new Set<Promise<void>>();
    
    // Create a function to process the next task
    async function processTask(taskFn: () => Promise<T>): Promise<void> {
      try {
        const result = await taskFn();
        results.push(result);
      } catch (error) {
        console.error('Error executing task:', error);
      }
    }
    
    // Process all tasks with concurrency control
    for (const taskFn of taskFunctions) {
      // If we've reached max concurrency, wait for a task to complete
      if (runningTasks.size >= concurrency) {
        await Promise.race(runningTasks);
      }
      
      // Create and start a new task
      const task = processTask(taskFn).then(() => {
        runningTasks.delete(task);
      });
      
      runningTasks.add(task);
    }
    
    // Wait for all remaining tasks to complete
    await Promise.all(runningTasks);
    
    return results;
  }
  
  private async pingUrl(
    url: string, 
    rpcEndpoint: string, 
    siteTitle: string, 
    feedUrl: string, 
    proxies: Proxy[]
  ): Promise<PingResult> {
    // Implementation improved for XML-RPC ping with proxy support
    try {
      // Wait for a slot if needed
      await this.waitForRequestSlot();
      this.activeRequests++;
      
      // Select a random proxy from the active ones
      const proxy = proxies.length > 0 ? this.getRandomProxy(proxies) : null;
      
      // Format the ping request
      const xmlrpcRequest = this.createXmlRpcRequest(siteTitle, url, feedUrl);
      
      // Direct ping through axios with or without proxy
      const startTime = Date.now();
      let response;
      
      if (proxy) {
        // Use proxy
        const axios = setupAxiosInstance(proxy, rpcEndpoint);
        response = await axios.post(rpcEndpoint, xmlrpcRequest, {
          headers: {
            'Content-Type': 'text/xml',
            'User-Agent': 'Mozilla/5.0 (compatible; SeoToolkit/1.0; +http://example.com)'
          },
          timeout: 15000
        });
      } else {
        // No proxy - fix by adding required lastChecked property
        const directProxy: Proxy = {
          id: 'direct',
          ip: 'direct',
          port: 0,
          protocol: 'http',
          status: 'active',
          lastChecked: new Date()  // Added missing required property
        };
        
        const axios = setupAxiosInstance(directProxy, rpcEndpoint);
        
        response = await axios.post(rpcEndpoint, xmlrpcRequest, {
          headers: {
            'Content-Type': 'text/xml',
            'User-Agent': 'Mozilla/5.0 (compatible; SeoToolkit/1.0; +http://example.com)'
          },
          timeout: 15000
        });
      }
      
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      
      // Parse the response
      const success = response.status >= 200 && response.status < 300 && !response.data.includes('<fault>');
      
      return {
        url,
        rpc: rpcEndpoint,
        success,
        message: success 
          ? `Успешно пингован URL ${url} через ${rpcEndpoint} за ${pingTime}мс` 
          : `Ошибка при пинге URL ${url} через ${rpcEndpoint}`,
        proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,  // This is now allowed in PingResult
        time: pingTime                                           // This is now allowed in PingResult
      };
      
    } catch (error) {
      console.error(`Error pinging ${url} via ${rpcEndpoint}:`, error);
      
      return {
        url,
        rpc: rpcEndpoint,
        success: false,
        message: `Ошибка при пинге URL ${url} через ${rpcEndpoint}: ${error.message || 'Unknown error'}`,
        error: error.message || 'Unknown error'                  // This is now allowed in PingResult
      };
    } finally {
      this.activeRequests--;
    }
  }
  
  // Helper method to wait for available request slot
  private async waitForRequestSlot(maxWaitTime: number = 30000): Promise<void> {
    const startTime = Date.now();
    while (this.activeRequests >= this.maxConcurrentRequests) {
      // Check if we've waited too long
      if (Date.now() - startTime > maxWaitTime) {
        console.warn(`Превышено время ожидания запроса (${maxWaitTime}мс), продолжаем выполнение`);
        return;
      }
      // Wait a bit and check again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Helper to select a random proxy with preference for faster ones
  private getRandomProxy(proxies: Proxy[]): Proxy {
    if (proxies.length === 0) return null;
    
    // Prefer faster proxies by sorting and selecting from the faster half
    if (proxies.length > 3) {
      const sortedProxies = [...proxies].sort((a, b) => {
        const speedA = a.speed || 5000;
        const speedB = b.speed || 5000;
        return speedA - speedB;
      });
      
      // Select from the faster half with higher probability
      const fasterHalf = sortedProxies.slice(0, Math.ceil(sortedProxies.length / 2));
      
      if (Math.random() > 0.3) { // 70% chance to use a proxy from the faster half
        return fasterHalf[Math.floor(Math.random() * fasterHalf.length)];
      }
    }
    
    return proxies[Math.floor(Math.random() * proxies.length)];
  }
  
  // Helper to create XML-RPC request
  private createXmlRpcRequest(blogName: string, pageUrl: string, feedUrl?: string): string {
    if (feedUrl) {
      // Extended ping with feed URL
      return `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.extendedPing</methodName>
  <params>
    <param><value><string>${blogName}</string></value></param>
    <param><value><string>${pageUrl}</string></value></param>
    <param><value><string>${pageUrl}</string></value></param>
    <param><value><string>${feedUrl}</string></value></param>
  </params>
</methodCall>`;
    } else {
      // Standard ping
      return `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value><string>${blogName}</string></value></param>
    <param><value><string>${pageUrl}</string></value></param>
  </params>
</methodCall>`;
    }
  }
}
