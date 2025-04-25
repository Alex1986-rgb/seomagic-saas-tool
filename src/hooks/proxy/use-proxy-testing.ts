
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from '../use-toast';

export function useProxyTesting() {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [activeProxiesFound, setActiveProxiesFound] = useState(0);
  const { toast } = useToast();

  const testProxies = useCallback(async (proxyList?: Proxy[], testUrl: string = 'https://api.ipify.org/') => {
    // If no proxyList is provided, get all proxies from the manager
    const proxiesToTest = proxyList || proxyManager.getAllProxies();
    
    if (proxiesToTest.length === 0) {
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
      setActiveProxiesFound(0);
      
      let checkedCount = 0;
      let activeCount = 0;
      
      const testedProxies = await proxyManager.checkProxies(proxiesToTest, testUrl, (proxy) => {
        checkedCount++;
        
        if (proxy.status === 'active') {
          activeCount++;
          setActiveProxiesFound(activeCount);
        }
        
        setProgress(Math.round((checkedCount / proxiesToTest.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${proxiesToTest.length} прокси (Рабочих: ${activeCount})`);
      });
      
      const workingProxies = testedProxies.filter(p => p.status === 'active').length;
      
      toast({
        title: "Проверка прокси завершена",
        description: `Проверено ${proxiesToTest.length} прокси, рабочих: ${workingProxies}`,
      });
      
      return workingProxies;
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
    activeProxiesFound,
    testProxies
  };
}
