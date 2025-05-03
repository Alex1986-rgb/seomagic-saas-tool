
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
        // Clear the existing proxies
        proxyManager.clearAllProxies();
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

      // First round of collection
      setStatusMessage('Сбор прокси из основных источников...');
      let completedSources = 0;
      
      // Pass a callback that correctly handles both source and count parameters
      let newProxies = await proxyManager.collectProxies((source, count) => {
        completedSources++;
        setProgress(Math.round((completedSources / (sourcesCount * 2)) * 100)); // Adjusted for two rounds
        
        if (count >= 0) {
          setCollectedProxies(count);
          setStatusMessage(`Собрано ${count} прокси из источника ${source}`);
        } else {
          setStatusMessage(`Ошибка при сборе прокси из ${source}`);
        }
      }, shouldClear);

      // Second round with more aggressive collection from secondary sources
      setStatusMessage('Сбор прокси из дополнительных источников...');
      const secondRoundProxies = await proxyManager.collectAdditionalProxies((source, count) => {
        completedSources++;
        setProgress(Math.round((completedSources / (sourcesCount * 2)) * 100));
        
        if (count >= 0) {
          setCollectedProxies(prev => prev + count);
          setStatusMessage(`Собрано дополнительно ${count} прокси из источника ${source}`);
        } else {
          setStatusMessage(`Ошибка при сборе дополнительных прокси из ${source}`);
        }
      }, false); // Don't clear existing proxies in the second round

      const totalProxies = newProxies.length + secondRoundProxies.length;
      
      toast({
        title: "Сбор прокси завершен",
        description: `Найдено ${totalProxies} ${shouldClear ? 'новых' : 'дополнительных'} прокси`,
      });
      
      return totalProxies;
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
