
import type { Proxy } from '../types';
import { testProxy } from './singleProxyTester';

export async function batchTestProxies(
  proxyList: Proxy[],
  testUrl: string = 'https://api.ipify.org/',
  onProgress?: (proxy: Proxy) => void
): Promise<Proxy[]> {
  const results: Proxy[] = [];
  const concurrentLimit = 10; // Max concurrent proxy tests
  
  // Process in batches to avoid overwhelming the network
  for (let i = 0; i < proxyList.length; i += concurrentLimit) {
    const batch = proxyList.slice(i, i + concurrentLimit);
    const batchPromises = batch.map(async proxy => {
      const testedProxy = await testProxy(proxy, testUrl);
      
      if (onProgress) {
        onProgress(testedProxy);
      }
      
      return testedProxy;
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + concurrentLimit < proxyList.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
