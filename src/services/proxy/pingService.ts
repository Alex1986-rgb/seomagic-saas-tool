
import { Proxy } from './types';
import { ProxyStorage } from './proxyStorage';
import type { PingResult } from './types';

export class PingService {
  private proxyStorage: ProxyStorage;
  
  constructor(proxyStorage: ProxyStorage) {
    this.proxyStorage = proxyStorage;
  }
  
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 10,
    concurrency: number = 5
  ): Promise<PingResult[]> {
    const results: PingResult[] = [];
    const activeProxies = this.proxyStorage.getActiveProxies();
    
    // Создаем очередь URL-сервис пар для обработки
    const queue: Array<{url: string, rpc: string}> = [];
    for (const url of urls) {
      for (const rpc of rpcEndpoints) {
        queue.push({url, rpc});
      }
    }
    
    // Разбиваем очередь на батчи
    const batches: Array<Array<{url: string, rpc: string}>> = [];
    for (let i = 0; i < queue.length; i += batchSize) {
      batches.push(queue.slice(i, i + batchSize));
    }
    
    // Обрабатываем батчи последовательно
    for (const batch of batches) {
      // Обрабатываем запросы в батче параллельно с ограничением параллелизма
      const batchPromises = batch.map(({url, rpc}) => 
        this.pingUrl(url, rpc, siteTitle, feedUrl, activeProxies)
      );
      
      // Выполняем запросы с ограничением параллелизма
      const batchResults = await this.executeWithConcurrencyLimit(batchPromises, concurrency);
      
      // Добавляем результаты батча в общий список
      results.push(...batchResults);
      
      // Небольшая задержка между батчами для снижения нагрузки
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }
  
  private async executeWithConcurrencyLimit<T>(
    promises: Array<Promise<T>>, 
    concurrency: number
  ): Promise<T[]> {
    const results: T[] = [];
    let activePromises: Array<{ promise: Promise<void>, completed: boolean }> = [];
    
    for (const promise of promises) {
      // Дожидаемся, когда количество активных промисов будет меньше concurrency
      if (activePromises.filter(p => !p.completed).length >= concurrency) {
        // Ждем завершения любого из активных промисов
        await Promise.race(activePromises.filter(p => !p.completed).map(p => p.promise));
      }
      
      const promiseInfo = {
        promise: (async () => {
          try {
            const result = await promise;
            results.push(result);
          } catch (error) {
            console.error('Error executing promise:', error);
          } finally {
            promiseInfo.completed = true;
          }
        })(),
        completed: false
      };
      
      activePromises.push(promiseInfo);
    }
    
    // Ждем завершения всех оставшихся промисов
    await Promise.all(activePromises.map(p => p.promise));
    
    return results;
  }
  
  private async pingUrl(
    url: string, 
    rpcEndpoint: string, 
    siteTitle: string, 
    feedUrl: string, 
    proxies: Proxy[]
  ): Promise<PingResult> {
    // В реальном приложении здесь был бы код для выполнения XML-RPC запросов
    // через прокси. Сейчас симулируем процесс с задержкой и случайным результатом
    
    // Симуляция задержки сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));
    
    const success = Math.random() > 0.3; // 70% успешных пингов для демонстрации
    
    return {
      url,
      rpc: rpcEndpoint,
      success,
      message: success 
        ? `Успешно пингован URL ${url} через ${rpcEndpoint}` 
        : `Ошибка при пинге URL ${url} через ${rpcEndpoint}`
    };
  }
}
