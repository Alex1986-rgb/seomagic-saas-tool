
import type { Proxy } from './types';
import { testProxy } from './proxy-testing/proxyTester';
import { testUrls } from './url-testing/urlTester';

export class ProxyValidator {
  async checkProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
    return testProxy(proxy, testUrl);
  }

  async testUrls(
    urls: string[], 
    proxies: Proxy[], 
    useProxies: boolean = true, 
    onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void
  ): Promise<{url: string, status: number, error?: string, errorDetails?: string, proxy?: string}[]> {
    return testUrls(urls, proxies, useProxies, onProgress);
  }

  async checkProxies(
    proxyList: Proxy[],
    testUrl: string = 'https://api.ipify.org/',
    onProgress?: (proxy: Proxy) => void
  ): Promise<Proxy[]> {
    const results: Proxy[] = [];
    let successCount = 0;
    
    for (const currentProxy of proxyList) {
      try {
        const checkedProxy = await this.checkProxy(currentProxy, testUrl);
        
        if (checkedProxy.status === 'active') {
          successCount++;
          console.log(`Успешно проверен прокси ${currentProxy.ip}:${currentProxy.port}, всего работающих: ${successCount}`);
        }
        
        results.push(checkedProxy);
        
        if (onProgress) onProgress(checkedProxy);
      } catch (error) {
        console.error(`Ошибка при проверке прокси ${currentProxy.ip}:${currentProxy.port}:`, error);
        currentProxy.status = 'inactive';
        if (onProgress) onProgress(currentProxy);
        results.push(currentProxy);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Проверка прокси завершена. Всего проверено: ${proxyList.length}, работающих: ${successCount}`);
    
    return results;
  }
}
