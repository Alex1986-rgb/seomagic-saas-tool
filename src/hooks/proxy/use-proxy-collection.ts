
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from '../use-toast';

export function useProxyCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();

  const collectProxies = useCallback(async () => {
    try {
      setIsCollecting(true);
      setProgress(0);
      setStatusMessage('Подготовка к сбору прокси...');
      
      let sourcesCount = 0;
      Object.values(proxyManager.defaultProxySources).forEach(source => {
        if (source.enabled) sourcesCount++;
      });
      
      let completedSources = 0;
      
      const newProxies = await proxyManager.collectProxies((source, count) => {
        if (count >= 0) {
          setStatusMessage(`Собрано ${count} прокси из источника ${source}`);
          completedSources++;
          setProgress(Math.round((completedSources / sourcesCount) * 100));
        } else {
          setStatusMessage(`Ошибка при сбор прокси из ${source}`);
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
    collectProxies
  };
}
