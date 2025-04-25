
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from '../use-toast';

export function useProxyCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [collectedProxies, setCollectedProxies] = useState<number>(0);
  const { toast } = useToast();

  const collectProxies = useCallback(async () => {
    try {
      setIsCollecting(true);
      setProgress(0);
      setStatusMessage('Подготовка к сбору прокси...');
      setCollectedProxies(0);
      
      // Count enabled sources
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
        return 0;
      }
      
      let completedSources = 0;
      let totalCollected = 0;
      
      const newProxies = await proxyManager.collectProxies((source, count) => {
        if (count >= 0) {
          totalCollected += count;
          setCollectedProxies(totalCollected);
          setStatusMessage(`Собрано ${count} прокси из источника ${source} (всего: ${totalCollected})`);
          completedSources++;
          setProgress(Math.round((completedSources / sourcesCount) * 100));
        } else {
          setStatusMessage(`Ошибка при сборе прокси из ${source}`);
        }
      });
      
      toast({
        title: "Сбор прокси завершен",
        description: `Найдено ${newProxies.length} новых прокси`,
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
  }, [toast]);

  return {
    isCollecting,
    progress,
    statusMessage,
    collectedProxies,
    collectProxies
  };
}
