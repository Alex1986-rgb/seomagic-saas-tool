
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
          protocol: proxy.protocol,
          auth: proxy.username && proxy.password ? {
            username: proxy.username,
            password: proxy.password
          } : undefined
        },
        timeout: 30000, // Increased timeout to 30 seconds
        maxRedirects: 5,
        validateStatus: (status) => status < 600, // Accept any status < 600
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      // Consider the proxy active if we get any response
      if (response) {
        updatedProxy.status = 'active';
        updatedProxy.speed = speed;
        console.log(`Прокси ${proxy.ip}:${proxy.port} работает, скорость: ${speed}ms, статус: ${response.status}`);
      } else {
        updatedProxy.status = 'inactive';
        console.log(`Прокси ${proxy.ip}:${proxy.port} не вернул ответ`);
      }
    } catch (error) {
      console.error(`Прокси ${proxy.ip}:${proxy.port} не работает:`, error.message);
      updatedProxy.status = 'inactive';
    }
    
    return updatedProxy;
  }

  async testUrls(
    urls: string[], 
    proxies: Proxy[], 
    useProxies: boolean = true, 
    onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void
  ): Promise<{url: string, status: number, error?: string, errorDetails?: string, proxy?: string}[]> {
    const results = [];
    const activeProxies = proxies.filter(p => p.status === 'active');
    
    if (useProxies && activeProxies.length === 0) {
      throw new Error('Нет активных прокси для использования');
    }
    
    for (const url of urls) {
      try {
        let currentProxy: Proxy | undefined;
        
        if (useProxies) {
          // Выбираем случайный прокси из активных
          currentProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
        }
        
        const config: any = {
          timeout: 60000, // Increased timeout to 60 seconds
          maxRedirects: 5,
          validateStatus: (status: number) => status < 600,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        };

        if (useProxies && currentProxy) {
          config.proxy = {
            host: currentProxy.ip,
            port: currentProxy.port,
            protocol: currentProxy.protocol,
            auth: currentProxy.username && currentProxy.password ? {
              username: currentProxy.username,
              password: currentProxy.password
            } : undefined
          };
        }

        console.log(`Тестирование URL: ${url} через прокси: ${currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : 'без прокси'}`);
        const response = await axios.get(url, config);

        if (onProgress) {
          onProgress(
            url, 
            response.status, 
            currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined
          );
        }

        results.push({
          url,
          status: response.status,
          proxy: currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined
        });
      } catch (error) {
        console.error(`Ошибка при проверке URL ${url}:`, error);
        
        const errorDetails = error.code === 'ECONNABORTED' 
          ? 'Превышено время ожидания'
          : error.code === 'ECONNREFUSED'
          ? 'Соединение отклонено'
          : error.code === 'ENOTFOUND'
          ? 'Не найден хост'
          : error.message || 'Неизвестная ошибка';

        if (onProgress) {
          onProgress(
            url, 
            error.response?.status || 0,
            currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined,
            errorDetails
          );
        }

        results.push({
          url,
          status: error.response?.status || 0,
          error: error.message,
          errorDetails: errorDetails,
          proxy: currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined
        });
      }

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  }

  async checkProxies(
    proxyList: Proxy[],
    testUrl: string = 'https://api.ipify.org/',
    onProgress?: (proxy: Proxy) => void
  ): Promise<Proxy[]> {
    const results: Proxy[] = [];
    
    for (const currentProxy of proxyList) {
      try {
        const checkedProxy = await this.checkProxy(currentProxy, testUrl);
        results.push(checkedProxy);
        
        if (onProgress) onProgress(checkedProxy);
      } catch (error) {
        console.error(`Ошибка при проверке прокси ${currentProxy.ip}:${currentProxy.port}:`, error);
        currentProxy.status = 'inactive';
        if (onProgress) onProgress(currentProxy);
        results.push(currentProxy);
      }
      
      // Add delay between checks
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}
