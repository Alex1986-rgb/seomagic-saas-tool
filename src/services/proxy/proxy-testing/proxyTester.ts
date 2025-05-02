
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';

// Enhanced configuration for parallel testing
const MAX_CONCURRENT_TESTS = 40; // Increased from 20 to 40
let activeTests = 0;

export async function testProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
  const updatedProxy: Proxy = { 
    ...proxy, 
    status: 'testing', 
    lastChecked: new Date() 
  };
  
  try {
    const startTime = Date.now();
    const axiosInstance = setupAxiosInstance(proxy, testUrl);
    
    // Optimized request settings
    const response = await axiosInstance.get(testUrl, {
      validateStatus: (status) => true,
      maxRedirects: 5,
      timeout: 12000, // Further reduced for faster testing
    });
    
    const endTime = Date.now();
    const speed = endTime - startTime;
    
    if (response.status >= 200 && response.status < 400) {
      updatedProxy.status = 'active';
      updatedProxy.speed = speed;
      updatedProxy.lastSeen = new Date();
    } else {
      updatedProxy.status = 'inactive';
      updatedProxy.speed = speed;
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
    
    updatedProxy.status = 'inactive';
    updatedProxy.speed = undefined;
    updatedProxy.lastError = errorMessage;
  }
  
  return updatedProxy;
}

// Функция для пакетной проверки прокси с контролем параллельных запросов
export async function batchTestProxies(
  proxies: Proxy[], 
  testUrl: string = 'https://api.ipify.org/', 
  onProgress?: (proxy: Proxy) => void
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
      return await testProxy(proxy, testUrl);
    } finally {
      activeTests--;
    }
  };
  
  // Оптимизация: увеличиваем размер партии для более эффективной обработки
  const batchSize = 200; // Increased from 100 to 200
  const batches = [];
  for (let i = 0; i < proxies.length; i += batchSize) {
    batches.push(proxies.slice(i, i + batchSize));
  }
  
  // Используем Promise.all для улучшения параллелизма внутри каждой партии
  let processedCount = 0;
  const totalProxies = proxies.length;
  
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
    await new Promise(resolve => setTimeout(resolve, 50)); // Reduced from 200ms to 50ms
    
    console.log(`Processed ${processedCount}/${totalProxies} proxies (${Math.round(processedCount/totalProxies*100)}%)`);
  }
  
  return results;
}
