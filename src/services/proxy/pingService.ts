
import { Proxy } from './types';
import { ProxyStorage } from './proxyStorage';
import type { PingResult } from './types';
import { setupAxiosInstance } from './utils/axiosConfig';
import { makeXmlRpcRequest } from './url-testing/requestManager';
import { ConcurrencyManager } from './url-testing/concurrencyManager';

export class PingService {
  private proxyStorage: ProxyStorage;
  private concurrencyManager: ConcurrencyManager;
  
  constructor(proxyStorage: ProxyStorage) {
    this.proxyStorage = proxyStorage;
    this.concurrencyManager = new ConcurrencyManager(30); // Increased concurrency
  }
  
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 20,
    concurrency: number = 10,
    useProxies: boolean = true
  ): Promise<PingResult[]> {
    const results: PingResult[] = [];
    const activeProxies = useProxies ? this.proxyStorage.getActiveProxies() : [];
    
    // Update concurrency manager with new concurrency setting
    this.concurrencyManager = new ConcurrencyManager(concurrency * 3);
    
    // Check if we have proxies available
    const hasProxies = activeProxies.length > 0;
    if (useProxies && !hasProxies) {
      console.log('No active proxies available, will attempt direct connections');
    }
    
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
    console.log(`Using proxies: ${useProxies}, Available proxies: ${activeProxies.length}`);
    
    // Process batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} requests`);
      
      // Execute batch with improved concurrency control
      const batchResults = await this.processRequestsWithConcurrencyControl(
        batch.map(({url, rpc}) => () => 
          this.pingUrl(url, rpc, siteTitle, feedUrl, useProxies ? activeProxies : [])
        ),
        concurrency
      );
      
      // Add batch results to overall results
      results.push(...batchResults);
      
      // Brief pause between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    return results;
  }
  
  private async processRequestsWithConcurrencyControl<T>(
    taskFunctions: Array<() => Promise<T>>, 
    concurrency: number
  ): Promise<T[]> {
    const results: T[] = [];
    const runningTasks = new Set<Promise<void>>();
    
    // Process all tasks with concurrency control
    for (const taskFn of taskFunctions) {
      // If we've reached max concurrency, wait for a task to complete
      if (runningTasks.size >= concurrency) {
        await Promise.race(runningTasks);
      }
      
      // Create and start a new task
      const task = this.concurrencyManager.executeWithThrottle(async () => {
        try {
          const result = await taskFn();
          results.push(result);
        } catch (error) {
          console.error('Error executing task:', error);
        }
      }).then(() => {
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
    try {
      // Select a random proxy from the active ones
      const proxy = proxies.length > 0 ? this.getRandomProxy(proxies) : null;
      
      // Format the ping request
      const xmlrpcRequest = this.createXmlRpcRequest(siteTitle, url, feedUrl);
      
      // Track timing
      const startTime = Date.now();
      
      // Try direct connection first for better stability
      const response = await makeXmlRpcRequest(rpcEndpoint, xmlrpcRequest, null, 20000, 1);
      
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      
      // Convert to PingResult format
      return {
        url,
        rpc: rpcEndpoint,
        success: response.success,
        message: response.success 
          ? `Успешно пингован URL ${url} через ${rpcEndpoint} за ${pingTime}мс` 
          : `Ошибка при пинге URL ${url} через ${rpcEndpoint}: ${response.errorDetails || response.error || 'Unknown error'}`,
        proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
        time: pingTime,
        error: response.success ? undefined : (response.error || response.errorDetails || 'Unknown error'),
        direct: true // Указываем что это было прямое соединение
      };
    } catch (error) {
      console.error(`Error in pingUrl for ${url} via ${rpcEndpoint}:`, error);
      
      return {
        url,
        rpc: rpcEndpoint,
        success: false,
        message: `Ошибка при пинге URL ${url} через ${rpcEndpoint}: ${error.message || 'Unknown error'}`,
        error: error.message || 'Unknown error',
        direct: true
      };
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
    // Escape special characters in XML
    const escapedBlogName = this.escapeXml(blogName);
    const escapedPageUrl = this.escapeXml(pageUrl);
    const escapedFeedUrl = feedUrl ? this.escapeXml(feedUrl) : '';
    
    if (feedUrl) {
      // Extended ping with feed URL
      return `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.extendedPing</methodName>
  <params>
    <param><value><string>${escapedBlogName}</string></value></param>
    <param><value><string>${escapedPageUrl}</string></value></param>
    <param><value><string>${escapedPageUrl}</string></value></param>
    <param><value><string>${escapedFeedUrl}</string></value></param>
  </params>
</methodCall>`;
    } else {
      // Standard ping
      return `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value><string>${escapedBlogName}</string></value></param>
    <param><value><string>${escapedPageUrl}</string></value></param>
  </params>
</methodCall>`;
    }
  }
  
  // Helper to escape XML special characters
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
