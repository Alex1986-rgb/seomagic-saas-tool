
import axios from 'axios';
import { Proxy } from './types';

export class ProxyValidator {
  async checkProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
    const updatedProxy: Proxy = { 
      ...proxy, 
      status: 'testing', 
      lastChecked: new Date() 
    };
    
    try {
      const startTime = Date.now();
      const response = await axios.get(testUrl, {
        proxy: {
          host: proxy.ip,
          port: proxy.port,
          protocol: proxy.protocol
        },
        timeout: 10000
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      updatedProxy.status = 'active';
      updatedProxy.speed = speed;
      
      console.log(`Прокси ${proxy.ip}:${proxy.port} работает, скорость: ${speed}ms`);
    } catch (error) {
      console.error(`Прокси ${proxy.ip}:${proxy.port} не работает:`, error.message);
      updatedProxy.status = 'inactive';
    }
    
    return updatedProxy;
  }

  async checkProxies(
    proxyList: Proxy[],
    testUrl: string = 'https://api.ipify.org/',
    onProgress?: (proxy: Proxy) => void
  ): Promise<Proxy[]> {
    const results: Proxy[] = [];
    
    for (const proxy of proxyList) {
      try {
        const checkedProxy = await this.checkProxy(proxy, testUrl);
        results.push(checkedProxy);
        
        if (onProgress) onProgress(checkedProxy);
      } catch (error) {
        console.error(`Ошибка при проверке прокси ${proxy.ip}:${proxy.port}:`, error);
        
        proxy.status = 'inactive';
        
        if (onProgress) onProgress(proxy);
        results.push(proxy);
      }
      
      // Небольшая задержка между проверками
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return results;
  }

  async testUrls(
    urls: string[], 
    proxies: Proxy[], 
    useProxies: boolean = true, 
    onProgress?: (url: string, status: number, proxy?: string) => void
  ): Promise<{url: string, status: number, error?: string, proxy?: string}[]> {
    const results = [];
    const activeProxies = proxies.filter(p => p.status === 'active');
    
    if (useProxies && activeProxies.length === 0) {
      throw new Error('Нет активных прокси для использования');
    }
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        let proxy: Proxy | undefined;
        
        if (useProxies) {
          // Выбираем случайный прокси из активных
          proxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
        }
        
        const config: any = {
          method: 'get',
          url,
          timeout: 15000,
          validateStatus: (status: number) => true, // Принимаем любой статус
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        };
        
        if (useProxies && proxy) {
          config.proxy = {
            host: proxy.ip,
            port: proxy.port,
            protocol: proxy.protocol
          };
        }
        
        const response = await axios(config);
        
        if (onProgress) onProgress(url, response.status, proxy ? `${proxy.ip}:${proxy.port}` : undefined);
        
        results.push({
          url,
          status: response.status,
          proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined
        });
      } catch (error) {
        console.error(`Ошибка при проверке URL ${url}:`, error.message);
        
        if (onProgress) onProgress(url, 0, undefined);
        
        results.push({
          url,
          status: 0,
          error: error.message,
          proxy: undefined
        });
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }
}
