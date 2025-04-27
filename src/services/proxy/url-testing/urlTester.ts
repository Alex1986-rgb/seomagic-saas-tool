
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';
import { testProxy } from '../proxy-testing/proxyTester';

export async function testUrls(
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
    let currentProxy: Proxy | undefined;
    
    try {
      if (useProxies) {
        currentProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
        console.log(`Используем прокси ${currentProxy.ip}:${currentProxy.port} для URL ${url}`);
        
        const testResult = await testProxy(currentProxy, 'https://api.ipify.org/');
        if (testResult.status !== 'active') {
          console.log(`Прокси ${currentProxy.ip}:${currentProxy.port} оказался недоступен при перепроверке, пропускаем`);
          throw new Error(`Прокси ${currentProxy.ip}:${currentProxy.port} недоступен`);
        }
      }
      
      const config: any = {
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: (status: number) => status < 600,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      };

      if (useProxies && currentProxy) {
        config.proxy = {
          host: currentProxy.ip,
          port: currentProxy.port,
          protocol: currentProxy.protocol || 'http',
          auth: currentProxy.username && currentProxy.password ? {
            username: currentProxy.username,
            password: currentProxy.password
          } : undefined
        };
      }

      console.log(`Тестирование URL: ${url} через прокси: ${currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : 'без прокси'}`);
      
      let retries = 2;
      let response;
      let error;
      
      while (retries >= 0) {
        try {
          response = await setupAxiosInstance(currentProxy || {} as Proxy).get(url, config);
          console.log(`Успешный ответ от ${url}: статус ${response.status}`);
          break;
        } catch (e) {
          error = e;
          console.error(`Ошибка при попытке запроса к ${url}:`, e.message || 'Неизвестная ошибка');
          retries--;
          if (retries >= 0) {
            console.log(`Повторная попытка для URL ${url}, осталось попыток: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (useProxies && activeProxies.length > 1) {
              let newProxy;
              do {
                newProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
              } while (newProxy.ip === currentProxy?.ip);
              
              currentProxy = newProxy;
              console.log(`Меняем прокси на ${currentProxy.ip}:${currentProxy.port} для повторной попытки`);
              
              config.proxy = {
                host: currentProxy.ip,
                port: currentProxy.port,
                protocol: currentProxy.protocol || 'http',
                auth: currentProxy.username && currentProxy.password ? {
                  username: currentProxy.username,
                  password: currentProxy.password
                } : undefined
              };
            }
          }
        }
      }
      
      if (response) {
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
      } else if (error) {
        throw error;
      }
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

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}
