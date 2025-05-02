
import type { Proxy } from '../types';
import { TIMEOUT_VALUES, MAX_CONCURRENT_TESTS } from './config';
import { testProxy } from './singleProxyTester';
import { sortProxiesByPriority, chunkArray } from './utils';

// Активные тесты для контроля параллелизма
let activeTests = 0;

/**
 * Управление параллельными запросами при тестировании прокси
 */
async function throttledTest(proxy: Proxy, timeout: number = 50): Promise<Proxy> {
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
      
    return await testProxy(proxy, undefined, timeoutValue, proxy.status === 'active' ? 3 : 2);
  } finally {
    activeTests--;
  }
}

/**
 * Функция для пакетной проверки прокси с контролем параллельных запросов и приоритизацией
 */
export async function batchTestProxies(
  proxies: Proxy[], 
  testUrl: string = undefined, 
  onProgress?: (proxy: Proxy) => void,
  prioritizeExisting: boolean = true
): Promise<Proxy[]> {
  const results: Proxy[] = [];
  
  // Сортировка прокси по приоритету
  let sortedProxies = prioritizeExisting ? sortProxiesByPriority(proxies) : [...proxies];
  
  // Оптимизация: увеличиваем размер партии для более эффективной обработки
  const batchSize = 300;
  const batches = chunkArray(sortedProxies, batchSize);
  
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
    await new Promise(resolve => setTimeout(resolve, 20));
    
    console.log(`Проверено ${processedCount}/${totalProxies} прокси (${Math.round(processedCount/totalProxies*100)}%), Активных: ${activeCount}`);
  }
  
  return results;
}
