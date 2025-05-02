
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';

// Enhanced configuration for parallel testing
const MAX_CONCURRENT_TESTS = 50; // Increased from 40 to 50
let activeTests = 0;
const TIMEOUT_VALUES = {
  FAST: 8000,     // For fast testing
  NORMAL: 12000,  // Standard timeout
  EXTENDED: 20000 // For comprehensive testing
};

export async function testProxy(
  proxy: Proxy, 
  testUrl: string = 'https://api.ipify.org/',
  timeout: number = TIMEOUT_VALUES.NORMAL,
  retries: number = 1
): Promise<Proxy> {
  const updatedProxy: Proxy = { 
    ...proxy, 
    status: 'testing', 
    lastChecked: new Date() 
  };
  
  let attemptsMade = 0;
  let lastError: string | undefined = undefined;
  
  while (attemptsMade < retries) {
    attemptsMade++;
    
    try {
      const startTime = Date.now();
      const axiosInstance = setupAxiosInstance(proxy, testUrl);
      
      // Optimized request settings
      const response = await axiosInstance.get(testUrl, {
        validateStatus: (status) => true,
        maxRedirects: 5,
        timeout,
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      if (response.status >= 200 && response.status < 400) {
        updatedProxy.status = 'active';
        updatedProxy.speed = speed;
        updatedProxy.lastSeen = new Date();
        updatedProxy.lastError = undefined; // Clear any previous errors
        return updatedProxy; // Сразу возвращаем при успехе
      } else {
        lastError = `HTTP статус ${response.status}`;
      }
    } catch (error) {
      let errorMessage = error.message || 'Неизвестная ошибка';
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
        errorMessage = 'Превышено время ожидания';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Соединение отклонено';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'DNS не смог разрешить хост';
      }
      
      lastError = errorMessage;
      
      // Небольшая задержка перед повторной попыткой
      if (attemptsMade < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // После всех попыток, если мы здесь, значит все неудачны
  updatedProxy.status = 'inactive';
  updatedProxy.speed = undefined;
  updatedProxy.lastError = lastError;
  
  return updatedProxy;
}

// Функция для пакетной проверки прокси с контролем параллельных запросов и приоритизацией
export async function batchTestProxies(
  proxies: Proxy[], 
  testUrl: string = 'https://api.ipify.org/', 
  onProgress?: (proxy: Proxy) => void,
  prioritizeExisting: boolean = true // Приоритет существующим активным прокси
): Promise<Proxy[]> {
  const results: Proxy[] = [];
  
  // Функция для управления параллелизмом с таймаутом
  const throttledTest = async (proxy: Proxy, timeout: number = 100): Promise<Proxy> => {
    const startAttempt = Date.now();
    while (activeTests >= MAX_CONCURRENT_TESTS) {
      // Добавляем таймаут к ожиданию, чтобы предотвратить блокировку
      if (Date.now() - startAttempt > 10000) {
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
        : TIMEOUT_VALUES.NORMAL; // Стандартный для новых
        
      return await testProxy(proxy, testUrl, timeoutValue, proxy.status === 'active' ? 2 : 1);
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
      return 0;
    });
  }
  
  // Оптимизация: увеличиваем размер партии для более эффективной обработки
  const batchSize = 250; // Increased from 200 to 250
  const batches = [];
  for (let i = 0; i < sortedProxies.length; i += batchSize) {
    batches.push(sortedProxies.slice(i, i + batchSize));
  }
  
  // Используем Promise.all для улучшения параллелизма внутри каждой партии
  let processedCount = 0;
  const totalProxies = sortedProxies.length;
  
  for (const batch of batches) {
    // Prepare promises for the batch
    const batchPromises = batch.map(async (proxy) => {
      try {
        const testedProxy = await throttledTest(proxy);
        processedCount++;
        
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
    
    // Minimal pause between batches - reduced to speed up the process
    await new Promise(resolve => setTimeout(resolve, 30)); // Reduced from 50ms to 30ms
    
    console.log(`Processed ${processedCount}/${totalProxies} proxies (${Math.round(processedCount/totalProxies*100)}%)`);
  }
  
  return results;
}
