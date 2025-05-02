
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';

// Пул активных проверок для управления параллелизмом
const MAX_CONCURRENT_TESTS = 20;
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
    
    // Оптимизированные настройки запроса
    const response = await axiosInstance.get(testUrl, {
      validateStatus: (status) => true,
      maxRedirects: 5,
      timeout: 15000, // Сокращаем таймаут для ускорения проверки
    });
    
    const endTime = Date.now();
    const speed = endTime - startTime;
    
    if (response.status >= 200 && response.status < 400) {
      updatedProxy.status = 'active';
      updatedProxy.speed = speed;
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
  
  // Функция для управления параллелизмом
  const throttledTest = async (proxy: Proxy): Promise<Proxy> => {
    while (activeTests >= MAX_CONCURRENT_TESTS) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    activeTests++;
    try {
      return await testProxy(proxy, testUrl);
    } finally {
      activeTests--;
    }
  };
  
  // Оптимизация: увеличиваем размер батча для более эффективной обработки
  const batchSize = 100; // Увеличиваем с 50 до 100
  const batches = [];
  for (let i = 0; i < proxies.length; i += batchSize) {
    batches.push(proxies.slice(i, i + batchSize));
  }
  
  // Последовательно обрабатываем пакеты с параллельной проверкой внутри пакета
  for (const batch of batches) {
    const batchPromises = batch.map(async (proxy) => {
      try {
        const testedProxy = await throttledTest(proxy);
        if (onProgress) {
          onProgress(testedProxy);
        }
        return testedProxy;
      } catch (error) {
        // Обработка критических ошибок
        proxy.status = 'inactive';
        if (onProgress) {
          onProgress(proxy);
        }
        return proxy;
      }
    });
    
    // Ожидаем завершения текущего пакета
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Сокращаем паузу между пакетами для ускорения всего процесса
    await new Promise(resolve => setTimeout(resolve, 200)); // Сокращаем с 500 до 200 мс
  }
  
  return results;
}
