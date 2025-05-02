
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from '../use-toast';

export function useProxyCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [collectedProxies, setCollectedProxies] = useState<number>(0);
  const [clearBeforeCollect, setClearBeforeCollect] = useState(true); // По умолчанию очищаем список
  const { toast } = useToast();

  const collectProxies = useCallback(async (shouldClear: boolean = clearBeforeCollect) => {
    try {
      setIsCollecting(true);
      setProgress(0);
      setStatusMessage('Подготовка к сбору прокси...');
      
      // Если очищаем перед сбором, сбрасываем счетчик
      if (shouldClear) {
        setCollectedProxies(0);
      }
      
      // Подсчет активных источников
      let sourcesCount = 0;
      Object.values(proxyManager.defaultProxySources).forEach(source => {
        if (source.enabled) sourcesCount++;
      });
      
      if (sourcesCount === 0) {
        toast({
          title: "Нет активных источников",
          description: "Необходимо активировать источники во вкладке 'Источники'",
          variant: "destructive",
        });
        setIsCollecting(false);
        return 0;
      }
      
      let completedSources = 0;
      
      // Fix here: Pass a single callback function that handles both parameters
      const newProxies = await proxyManager.collectProxies((source, count) => {
        completedSources++;
        setProgress(Math.round((completedSources / sourcesCount) * 100));
        
        if (count >= 0) {
          // Now count represents the total number of proxies
          setCollectedProxies(count);
          setStatusMessage(`Собрано ${count} прокси из источника ${source}`);
        } else {
          setStatusMessage(`Ошибка при сборе прокси из ${source}`);
        }
      });
      
      toast({
        title: "Сбор прокси завершен",
        description: `Найдено ${newProxies.length} ${shouldClear ? 'новых' : 'дополнительных'} прокси`,
      });
      
      return newProxies.length;
    } catch (error) {
      console.error("Ошибка при сборе прокси:", error);
      toast({
        title: "Ошибка сбора прокси",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      return 0;
    } finally {
      setIsCollecting(false);
      setStatusMessage('');
    }
  }, [toast, clearBeforeCollect]);

  return {
    isCollecting,
    progress,
    statusMessage,
    collectedProxies,
    clearBeforeCollect,
    setClearBeforeCollect,
    collectProxies
  };
}
