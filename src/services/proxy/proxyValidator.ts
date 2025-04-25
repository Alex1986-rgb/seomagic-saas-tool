
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
    onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void
  ): Promise<{url: string, status: number, error?: string, errorDetails?: string, proxy?: string}[]> {
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
        
        // Корректно обрабатываем кириллические URL
        let encodedUrl = url;
        try {
          // Проверяем, что URL уже не закодирован
          if (url.includes('http') && !url.includes('%')) {
            // Разбиваем URL на части и кодируем только путь и параметры, сохраняя домен
            const urlObj = new URL(url);
            urlObj.pathname = encodeURIComponent(urlObj.pathname.replace(/^\//, '')).replace(/%2F/g, '/');
            encodedUrl = urlObj.toString();
          }
        } catch (e) {
          console.log('Ошибка при кодировании URL:', e);
          encodedUrl = url; // Используем оригинальный URL если что-то пошло не так
        }
        
        // Пытаемся сначала без кодирования, если не получится - с кодированием
        const urlsToTry = [url, encodedUrl];
        let success = false;
        let response;
        let errorMsg = '';
        let errorDetails = '';
        
        for (const currentUrl of urlsToTry) {
          if (success) break;
          
          try {
            const config: any = {
              method: 'get',
              url: currentUrl,
              timeout: 45000, // Увеличиваем тайм-аут до 45 секунд
              validateStatus: (status: number) => true, // Принимаем любой статус
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Referer': 'https://www.google.com/'
              },
              maxRedirects: 7,
              decompress: true
            };
            
            if (useProxies && proxy) {
              config.proxy = {
                host: proxy.ip,
                port: proxy.port,
                protocol: proxy.protocol
              };
              
              // Добавляем авторизацию для прокси, если есть
              if (proxy.username && proxy.password) {
                config.proxy.auth = {
                  username: proxy.username,
                  password: proxy.password
                };
              }
            }
            
            console.log(`Тестирование URL: ${currentUrl} через прокси: ${proxy ? `${proxy.ip}:${proxy.port}` : 'без прокси'}`);
            response = await axios(config);
            success = true;
          } catch (error) {
            errorMsg = error.message || 'Неизвестная ошибка';
            
            // Детализация ошибки для более точной диагностики
            if (error.code) {
              errorDetails = `Код ошибки: ${error.code}`;
              
              if (error.code === 'ECONNABORTED') {
                errorDetails += ' (Превышено время ожидания)';
              } else if (error.code === 'ECONNREFUSED') {
                errorDetails += ' (Соединение отклонено)';
              } else if (error.code === 'ENOTFOUND') {
                errorDetails += ' (Не найден хост)';
              }
            }
            
            if (error.response) {
              errorDetails += ` Статус: ${error.response.status}`;
            }
            
            console.log(`Ошибка при проверке URL ${currentUrl} через прокси ${proxy ? `${proxy.ip}:${proxy.port}` : 'без прокси'}: ${errorMsg} (${errorDetails})`);
          }
        }
        
        if (success && response) {
          // Запрос выполнен успешно
          if (onProgress) onProgress(url, response.status, proxy ? `${proxy.ip}:${proxy.port}` : undefined);
          
          results.push({
            url,
            status: response.status,
            proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined
          });
        } else {
          // При ошибке возвращаем более подробную информацию
          if (onProgress) onProgress(url, 0, proxy ? `${proxy.ip}:${proxy.port}` : undefined, errorDetails);
          
          results.push({
            url,
            status: 0,
            error: errorMsg,
            errorDetails: errorDetails,
            proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined
          });
        }
      } catch (error) {
        // Обработка непредвиденных ошибок
        const errorMsg = error.message || 'Неизвестная ошибка';
        console.error(`Ошибка при проверке URL ${url}:`, errorMsg);
        
        if (onProgress) onProgress(url, 0, undefined, errorMsg);
        
        results.push({
          url,
          status: 0,
          error: errorMsg,
          proxy: undefined
        });
      }
      
      // Увеличиваем задержку между запросами, чтобы избежать блокировок
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    return results;
  }
}
