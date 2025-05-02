
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';
import axios from 'axios';

// Расширенная конфигурация для параллельного тестирования
const MAX_CONCURRENT_TESTS = 100; // Увеличено с 50 до 100
let activeTests = 0;
const TIMEOUT_VALUES = {
  FAST: 6000,     // Ускоренный тайм-аут для быстрой проверки
  NORMAL: 10000,  // Стандартный тайм-аут, уменьшен для ускорения
  EXTENDED: 15000 // Расширенный тайм-аут для полной проверки
};

// Список тестовых URL для проверки прокси
const TEST_URLS = [
  'https://api.ipify.org/',
  'https://ifconfig.io/ip',
  'https://httpbin.org/ip',
  'https://checkip.amazonaws.com/'
];

export async function testProxy(
  proxy: Proxy, 
  testUrl: string = TEST_URLS[0],
  timeout: number = TIMEOUT_VALUES.NORMAL,
  retries: number = 2
): Promise<Proxy> {
  const updatedProxy: Proxy = { 
    ...proxy, 
    status: 'testing', 
    lastChecked: new Date() 
  };
  
  let attemptsMade = 0;
  let lastError: string | undefined = undefined;
  
  // Пробуем с несколькими URL, если первый не сработает
  const urlsToTry = [testUrl, ...TEST_URLS.filter(url => url !== testUrl)];
  let urlIndex = 0;
  
  while (attemptsMade < retries && urlIndex < urlsToTry.length) {
    const currentUrl = urlsToTry[urlIndex];
    attemptsMade++;
    
    try {
      const startTime = Date.now();
      const axiosInstance = setupAxiosInstance(proxy, currentUrl);
      
      // Оптимизированные настройки запроса с расширенными заголовками
      const response = await axiosInstance.get(currentUrl, {
        validateStatus: (status) => true,
        maxRedirects: 5,
        timeout,
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      if (response.status >= 200 && response.status < 400) {
        // Проверяем, содержит ли ответ IP-адрес для подтверждения работы прокси
        const responseData = typeof response.data === 'string' 
          ? response.data.trim() 
          : JSON.stringify(response.data);
          
        // Базовая проверка, что ответ содержит IP-адрес
        if (responseData.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
          updatedProxy.status = 'active';
          updatedProxy.speed = speed;
          updatedProxy.lastSeen = new Date();
          updatedProxy.lastError = undefined;
          updatedProxy.checkedUrl = currentUrl;
          return updatedProxy; // Возвращаем при успехе
        } else {
          lastError = `Ответ не содержит IP (${currentUrl})`;
          urlIndex++;
        }
      } else {
        lastError = `HTTP статус ${response.status} (${currentUrl})`;
        urlIndex++;
      }
    } catch (error) {
      let errorMessage = error.message || 'Неизвестная ошибка';
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
        errorMessage = `Превышено время ожидания (${currentUrl})`;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = `Соединение отклонено (${currentUrl})`;
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = `DNS не смог разрешить хост (${currentUrl})`;
      }
      
      lastError = errorMessage;
      
      // Если ошибка с текущим URL, пробуем следующий URL
      if (attemptsMade >= retries) {
        urlIndex++;
        attemptsMade = 0; // Сбросим счетчик попыток для следующего URL
      }
      
      // Небольшая задержка перед повторной попыткой
      if (attemptsMade < retries || urlIndex < urlsToTry.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  
  // После всех попыток, если все неудачны
  updatedProxy.status = 'inactive';
  updatedProxy.speed = undefined;
  updatedProxy.lastError = lastError;
  
  return updatedProxy;
}

// Функция для генерации случайного User-Agent
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.106',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Функция для пакетной проверки прокси с контролем параллельных запросов и приоритизацией
export async function batchTestProxies(
  proxies: Proxy[], 
  testUrl: string = TEST_URLS[0], 
  onProgress?: (proxy: Proxy) => void,
  prioritizeExisting: boolean = true // Приоритет существующим активным прокси
): Promise<Proxy[]> {
  const results: Proxy[] = [];
  
  // Функция для управления параллелизмом с таймаутом
  const throttledTest = async (proxy: Proxy, timeout: number = 50): Promise<Proxy> => {
    const startAttempt = Date.now();
    while (activeTests >= MAX_CONCURRENT_TESTS) {
      // Добавляем таймаут к ожиданию, чтобы предотвратить блокировку
      if (Date.now() - startAttempt > 8000) {
        console.log(`Превышено время ожидания слота для теста прокси ${proxy.id}, выполняем принудительно`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
    activeTests++;
    try {
      // Выбор таймаута в зависимости от статуса прокси
      const timeoutValue = proxy.status === 'active' 
        ? TIMEOUT_VALUES.FAST  // Быстрее для активных
        : proxy.status === 'inactive'
          ? TIMEOUT_VALUES.EXTENDED // Дольше для неактивных (возможно они просто медленные)
          : TIMEOUT_VALUES.NORMAL; // Стандартный для новых
        
      return await testProxy(proxy, testUrl, timeoutValue, proxy.status === 'active' ? 3 : 2);
    } finally {
      activeTests--;
    }
  };
  
  // Сортировка прокси: активные в начало, если prioritizeExisting=true
  let sortedProxies = [...proxies];
  if (prioritizeExisting) {
    sortedProxies.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      // Если скорость известна, сортируем от более быстрых к менее быстрым
      if (a.status === 'active' && b.status === 'active') {
        if (a.speed && b.speed) return a.speed - b.speed;
        if (a.speed) return -1;
        if (b.speed) return 1;
      }
      return 0;
    });
  }
  
  // Оптимизация: увеличиваем размер партии для более эффективной обработки
  const batchSize = 300; // Увеличено до 300
  const batches = [];
  for (let i = 0; i < sortedProxies.length; i += batchSize) {
    batches.push(sortedProxies.slice(i, i + batchSize));
  }
  
  // Используем Promise.all для улучшения параллелизма внутри каждой партии
  let processedCount = 0;
  let activeCount = 0;
  const totalProxies = sortedProxies.length;
  
  for (const batch of batches) {
    // Prepare promises for the batch
    const batchPromises = batch.map(async (proxy) => {
      try {
        const testedProxy = await throttledTest(proxy);
        processedCount++;
        
        if (testedProxy.status === 'active') {
          activeCount++;
        }
        
        if (onProgress) {
          onProgress(testedProxy);
        }
        
        return testedProxy;
      } catch (error) {
        // Process critical errors
        console.error(`Critical error testing proxy ${proxy.id}:`, error);
        proxy.status = 'inactive';
        proxy.lastError = `Critical error: ${error.message || 'Unknown error'}`;
        
        processedCount++;
        if (onProgress) {
          onProgress(proxy);
        }
        
        return proxy;
      }
    });
    
    // Execute all promises in the batch concurrently
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Minimal pause between batches
    await new Promise(resolve => setTimeout(resolve, 20)); // Уменьшено до 20ms
    
    console.log(`Проверено ${processedCount}/${totalProxies} прокси (${Math.round(processedCount/totalProxies*100)}%), Активных: ${activeCount}`);
  }
  
  return results;
}
