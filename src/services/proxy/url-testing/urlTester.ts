
import type { Proxy } from '../types';
import axios, { AxiosResponse } from 'axios';
import { setupAxiosInstance } from '../utils/axiosConfig';

// Пул активных запросов для управления параллелизмом
const MAX_CONCURRENT_REQUESTS = 10;
let activeRequests = 0;

/**
 * Определяет, является ли HTTP статус кодом успешным
 */
function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 400;
}

/**
 * Преобразует HTTP статус в понятное описание
 */
function getStatusDescription(status: number): string {
  if (status >= 200 && status < 300) return 'Успешно';
  if (status >= 300 && status < 400) return 'Перенаправление';
  if (status === 408) return 'Таймаут';
  if (status >= 400 && status < 500) return 'Ошибка клиента';
  if (status >= 500) return 'Ошибка сервера';
  return 'Неизвестный статус';
}

export async function testUrls(
  urls: string[], 
  proxies: Proxy[], 
  useProxies: boolean = true, 
  onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void
): Promise<{url: string, status: number, error?: string, errorDetails?: string, proxy?: string, success: boolean}[]> {
  const results = [];
  const activeProxies = proxies.filter(p => p.status === 'active');
  
  if (useProxies && activeProxies.length === 0) {
    throw new Error('Нет активных прокси для использования');
  }

  // Функция для контроля параллельных запросов
  const throttledRequest = async (fn: () => Promise<any>) => {
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    activeRequests++;
    try {
      return await fn();
    } finally {
      activeRequests--;
    }
  };
  
  // Создаем map для быстрого доступа к прокси
  const proxyMap = new Map<string, Proxy[]>();
  activeProxies.forEach(proxy => {
    const key = `${proxy.protocol}`;
    if (!proxyMap.has(key)) {
      proxyMap.set(key, []);
    }
    proxyMap.get(key)?.push(proxy);
  });
  
  // Улучшаем функцию для выбора прокси с балансировкой нагрузки
  const getRandomProxy = (usedProxies: Set<string>): Proxy | undefined => {
    if (activeProxies.length === 0) return undefined;
    
    // Если все прокси уже использовались, сбрасываем
    if (usedProxies.size >= activeProxies.length) {
      usedProxies.clear();
    }
    
    // Пробуем найти неиспользованный прокси
    const availableProxies = activeProxies.filter(p => !usedProxies.has(`${p.ip}:${p.port}`));
    
    if (availableProxies.length > 0) {
      const proxy = availableProxies[Math.floor(Math.random() * availableProxies.length)];
      usedProxies.add(`${proxy.ip}:${proxy.port}`);
      return proxy;
    }
    
    // Если все использованы, берем любой
    const proxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
    usedProxies.add(`${proxy.ip}:${proxy.port}`);
    return proxy;
  };
  
  // Параллельное тестирование URL
  const testPromises = urls.map(url => throttledRequest(async () => {
    let usedProxies = new Set<string>();
    let currentProxy: Proxy | undefined;
    
    try {
      if (useProxies) {
        currentProxy = getRandomProxy(usedProxies);
      }
      
      let retries = 2;
      let response: AxiosResponse | undefined;
      let error;
      
      while (retries >= 0) {
        try {
          let axiosInstance;
          
          if (useProxies && currentProxy) {
            axiosInstance = setupAxiosInstance(currentProxy);
          } else {
            axiosInstance = axios.create({
              timeout: 20000,
              validateStatus: () => true,
              maxRedirects: 5,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
              }
            });
          }
          
          response = await axiosInstance.get(url, {
            timeout: 20000,
            validateStatus: () => true
          });
          
          break;
        } catch (e) {
          error = e;
          retries--;
          
          if (retries >= 0 && useProxies) {
            // При ошибке пробуем другой прокси
            currentProxy = getRandomProxy(usedProxies);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (response) {
        const statusDescription = getStatusDescription(response.status);
        const isSuccess = isSuccessStatus(response.status);
        
        if (onProgress) {
          onProgress(
            url, 
            response.status, 
            currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined,
            statusDescription
          );
        }
        
        results.push({
          url,
          status: response.status,
          proxy: currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined,
          success: isSuccess,
          errorDetails: isSuccess ? undefined : statusDescription
        });
      } else if (error) {
        throw error;
      }
    } catch (error) {
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
        proxy: currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined,
        success: false
      });
    }
    
    // Короткая пауза между запросами к одному URL
    await new Promise(resolve => setTimeout(resolve, 500));
  }));
  
  // Ожидаем завершения всех запросов
  await Promise.all(testPromises);
  
  return results;
}
