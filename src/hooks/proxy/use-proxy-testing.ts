
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from '../use-toast';

export function useProxyTesting() {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();

  const testProxies = useCallback(async (proxyList: Proxy[], testUrl: string) => {
    if (proxyList.length === 0) {
      toast({
        title: "Нет прокси для проверки",
        description: "Сначала соберите или импортируйте прокси",
        variant: "destructive",
      });
      return 0;
    }
    
    try {
      setIsTesting(true);
      setProgress(0);
      setStatusMessage('Подготовка к проверке прокси...');
      
      let checkedCount = 0;
      
      const testedProxies = await proxyManager.checkProxies(proxyList, testUrl, (proxy) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / proxyList.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${proxyList.length} прокси`);
      });
      
      toast({
        title: "Проверка прокси завершена",
        description: `Проверено ${proxyList.length} прокси`,
      });
      
      return testedProxies.filter(p => p.status === 'active').length;
    } catch (error) {
      console.error("Ошибка при проверке прокси:", error);
      toast({
        title: "Ошибка проверки прокси",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      return 0;
    } finally {
      setIsTesting(false);
      setStatusMessage('');
    }
  }, [toast]);

  return {
    isTesting,
    progress,
    statusMessage,
    testProxies
  };
}
