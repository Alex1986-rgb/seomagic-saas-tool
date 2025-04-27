
import axios from 'axios';
import { Proxy } from './types';

export class ProxyValidator {
  private async setupAxiosInstance(proxy: Proxy, testUrl: string = 'https://api.ipify.org/') {
    // Настраиваем расширенный axios instance с поддержкой аутентификации
    const axiosInstance = axios.create({
      timeout: 15000, // Увеличенный таймаут до 15 секунд
      proxy: {
        host: proxy.ip,
        port: proxy.port,
        protocol: proxy.protocol,
        auth: proxy.username && proxy.password ? {
          username: proxy.username,
          password: proxy.password
        } : undefined
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/plain,*/*;q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'DNT': '1',
      },
      // Отключаем выбрасывание ошибок для кодов состояния вне диапазона 2xx
      validateStatus: null
    });

    return axiosInstance;
  }

  async checkProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
    const updatedProxy: Proxy = { 
      ...proxy, 
      status: 'testing', 
      lastChecked: new Date() 
    };
    
    try {
      const startTime = Date.now();
      const axiosInstance = await this.setupAxiosInstance(proxy, testUrl);
      
      // Более надежная проверка с таймаутом и обработкой ошибок
      const response = await axiosInstance.get(testUrl, {
        validateStatus: (status) => true, // Принимаем любой статус ответа
        maxRedirects: 5,
        timeout: 15000,
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      // Проверяем статус ответа, чтобы определить рабочий прокси
      if (response.status >= 200 && response.status < 400) {
        updatedProxy.status = 'active';
        updatedProxy.speed = speed;
        
        console.log(`Прокси ${proxy.ip}:${proxy.port} работает, скорость: ${speed}ms, статус: ${response.status}`);
      } else {
        // Прокси ответил, но с неприемлемым статусом
        updatedProxy.status = 'inactive';
        updatedProxy.speed = speed;
        console.log(`Прокси ${proxy.ip}:${proxy.port} ответил с неприемлемым статусом: ${response.status}`);
      }
      
    } catch (error) {
      let errorMessage = error.message || 'Неизвестная ошибка';
      
      // Обрабатываем различные типы ошибок
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
        errorMessage = 'Превышено время ожидания';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Соединение отклонено';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'DNS не смог разрешить хост';
      }
      
      console.error(`Прокси ${proxy.ip}:${proxy.port} не работает: ${errorMessage}`);
      updatedProxy.status = 'inactive';
      updatedProxy.speed = undefined;
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
    
    // Для каждого URL
    for (const url of urls) {
      // Declare currentProxy outside the try/catch blocks so it's accessible in both
      let currentProxy: Proxy | undefined;
      
      try {
        if (useProxies) {
          // Выбираем случайный прокси из активных, с механизмом ротации
          currentProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
          console.log(`Используем прокси ${currentProxy.ip}:${currentProxy.port} для URL ${url}`);
          
          // Проверяем, что прокси действительно доступен
          const testResult = await this.checkProxy(currentProxy, 'https://api.ipify.org/');
          if (testResult.status !== 'active') {
            console.log(`Прокси ${currentProxy.ip}:${currentProxy.port} оказался недоступен при перепроверке, пропускаем`);
            throw new Error(`Прокси ${currentProxy.ip}:${currentProxy.port} недоступен`);
          }
        }
        
        const config: any = {
          timeout: 30000, // Уменьшили таймаут до 30 секунд для более быстрой проверки
          maxRedirects: 5,
          validateStatus: (status: number) => status < 600, // Принимаем любой статус до 600
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
          
          // Логируем использование прокси
          console.log(`Настроен прокси для запроса к ${url}:`, {
            host: currentProxy.ip,
            port: currentProxy.port,
            protocol: currentProxy.protocol || 'http'
          });
        }

        console.log(`Тестирование URL: ${url} через прокси: ${currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : 'без прокси'}`);
        
        // Добавляем повторные попытки при ошибках соединения
        let retries = 2;
        let response;
        let error;
        
        while (retries >= 0) {
          try {
            // Используем прямой axios.get вместо создания инстанса для более простого управления запросом
            response = await axios.get(url, config);
            console.log(`Успешный ответ от ${url}: статус ${response.status}`);
            break; // Успешный запрос, выходим из цикла
          } catch (e) {
            error = e;
            console.error(`Ошибка при попытке запроса к ${url}:`, e.message || 'Неизвестная ошибка');
            retries--;
            if (retries >= 0) {
              console.log(`Повторная попытка для URL ${url}, осталось попыток: ${retries}`);
              // Задержка перед следующей попыткой
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Если есть другие прокси, пробуем использовать другой прокси
              if (useProxies && activeProxies.length > 1) {
                let newProxy;
                do {
                  newProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
                } while (newProxy.ip === currentProxy?.ip);
                
                currentProxy = newProxy;
                console.log(`Меняем прокси на ${currentProxy.ip}:${currentProxy.port} для повторной попытки`);
                
                if (currentProxy) {
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
        }
        
        // Если после всех попыток ответ получен
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
          // Если все попытки завершились с ошибкой
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

      // Добавляем задержку между запросами для избежания блокировки
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
      
      // Добавляем задержку между проверками
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Финальная статистика
    console.log(`Проверка прокси завершена. Всего проверено: ${proxyList.length}, работающих: ${successCount}`);
    
    return results;
  }
}
