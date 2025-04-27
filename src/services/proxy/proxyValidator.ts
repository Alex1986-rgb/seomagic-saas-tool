
import type { Proxy } from './types';
import { testProxy, batchTestProxies } from './proxy-testing/proxyTester';
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
    // Используем оптимизированный метод пакетной проверки
    return batchTestProxies(proxyList, testUrl, onProgress);
  }
}
