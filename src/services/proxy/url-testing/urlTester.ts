
import type { Proxy } from '../types';
import axios from 'axios';
import { testProxy } from '../proxy-testing/proxyTester';
import { setupAxiosInstance } from '../utils/axiosConfig';

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
    let usedProxies: string[] = []; // Track which proxies we've already tried for this URL
    
    try {
      if (useProxies) {
        // Randomly select a proxy from active proxies that we haven't tried yet for this URL
        const availableProxies = activeProxies.filter(p => !usedProxies.includes(`${p.ip}:${p.port}`));
        
        // If we've tried all proxies, reset and try again
        if (availableProxies.length === 0 && activeProxies.length > 0) {
          currentProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
        } else if (availableProxies.length > 0) {
          currentProxy = availableProxies[Math.floor(Math.random() * availableProxies.length)];
        }
        
        if (currentProxy) {
          usedProxies.push(`${currentProxy.ip}:${currentProxy.port}`);
          console.log(`Используем прокси ${currentProxy.ip}:${currentProxy.port} для URL ${url}`);
        }
      }
      
      let retries = 3; // Increase retries to 3
      let response;
      let error;
      
      while (retries >= 0) {
        try {
          console.log(`Отправка запроса к ${url}, осталось попыток: ${retries}`);
          
          // Use our configured axios instance
          let axiosInstance;
          
          if (useProxies && currentProxy) {
            axiosInstance = setupAxiosInstance(currentProxy);
          } else {
            axiosInstance = axios.create({
              timeout: 60000,
              validateStatus: () => true,
              maxRedirects: 5,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            });
          }
          
          response = await axiosInstance.get(url, {
            timeout: 60000, // Increased timeout
            validateStatus: () => true
          });
          
          console.log(`Успешный ответ от ${url}: статус ${response.status}`);
          break;
        } catch (e) {
          error = e;
          const errorMessage = e.message || 'Неизвестная ошибка';
          console.error(`Ошибка при попытке запроса к ${url} через ${currentProxy?.ip}:${currentProxy?.port}:`, errorMessage);
          retries--;
          
          if (retries >= 0) {
            console.log(`Повторная попытка для URL ${url}, осталось попыток: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Longer delay between retries
            
            if (useProxies && activeProxies.length > 1) {
              // Try a different proxy
              const availableProxies = activeProxies.filter(p => 
                !usedProxies.includes(`${p.ip}:${p.port}`) || usedProxies.length >= activeProxies.length
              );
              
              if (availableProxies.length > 0) {
                currentProxy = availableProxies[Math.floor(Math.random() * availableProxies.length)];
                usedProxies.push(`${currentProxy.ip}:${currentProxy.port}`);
                console.log(`Меняем прокси на ${currentProxy.ip}:${currentProxy.port} для повторной попытки`);
              }
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

    // Add delay between URL tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}
