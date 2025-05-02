
import { ProxyStorage } from './proxyStorage';
import { PingService } from './pingService';
import type { PingResult } from './types';

/**
 * Class responsible for managing ping operations
 */
export class PingManager {
  private pingService: PingService;
  
  constructor(proxyStorage: ProxyStorage) {
    this.pingService = new PingService(proxyStorage);
  }

  /**
   * Pings URLs with XML-RPC
   */
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 10,
    concurrency: number = 5,
    useProxies: boolean = true
  ): Promise<PingResult[]> {
    return this.pingService.pingUrlsWithRpc(
      urls, 
      siteTitle, 
      feedUrl, 
      rpcEndpoints,
      batchSize,
      concurrency,
      useProxies
    );
  }
}
