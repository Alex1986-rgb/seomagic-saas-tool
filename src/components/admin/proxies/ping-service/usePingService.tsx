
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { PingResult } from '@/services/proxy/types';

export function usePingService() {
  const [pingResults, setPingResults] = useState<PingResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [batchSize, setBatchSize] = useState<number>(10);
  const [concurrency, setConcurrency] = useState<number>(5);
  const [delay, setDelay] = useState<number>(500);
  const { toast } = useToast();

  const handleStartPing = async (
    urlList: string[],
    rpcList: string[],
    siteTitle: string,
    feedUrl: string,
    useProxies: boolean
  ) => {
    setIsLoading(true);
    setPingResults([]);
    setProgress(0);
    
    try {
      // Проверяем наличие активных прокси если требуется их использование
      if (useProxies) {
        const activeProxies = proxyManager.getActiveProxies();
        if (activeProxies.length === 0) {
          toast({
            title: "Внимание",
            description: "Нет активных прокси. Будет использоваться прямое соединение.",
            variant: "default",
          });
        } else {
          console.log(`Доступно ${activeProxies.length} активных прокси для пинга`);
        }
      }
      
      // Пингуем URL-ы через RPC сервисы
      const totalOperations = urlList.length * rpcList.length;
      let completed = 0;
      
      const results = await proxyManager.pingUrlsWithRpc(
        urlList, 
        siteTitle, 
        feedUrl, 
        rpcList,
        batchSize,
        concurrency,
        useProxies
      );
      
      // Добавляем результаты постепенно для лучшего UX
      for (const result of results) {
        completed++;
        setProgress(Math.round((completed / totalOperations) * 100));
        
        setPingResults(prev => [...prev, result]);
        
        // Небольшая задержка для эмуляции постепенного добавления результатов
        await new Promise(resolve => setTimeout(resolve, delay / 10));
      }

      // Подсчитаем успешные результаты
      const successfulPings = results.filter(r => r.success).length;
      
      toast({
        title: successfulPings > 0 ? "Операция завершена успешно" : "Операция завершена с ошибками",
        description: `Обработано ${urlList.length} URL через ${rpcList.length} RPC сервисов. Успешных пингов: ${successfulPings}`,
        variant: successfulPings > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Ошибка при пинге URL:", error);
      toast({
        title: "Ошибка операции",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };
  
  const clearResults = () => {
    setPingResults([]);
  };

  return {
    pingResults,
    isLoading,
    progress,
    batchSize,
    setBatchSize,
    concurrency,
    setConcurrency,
    delay,
    setDelay,
    handleStartPing,
    clearResults
  };
}
