
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import { useToast } from '../use-toast';

export function useUrlTesting() {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();

  const testUrls = useCallback(async (urls: string[], useProxies: boolean = true) => {
    if (urls.length === 0) {
      toast({
        title: "Нет URL для проверки",
        description: "Введите список URL для проверки",
        variant: "destructive",
      });
      return [];
    }
    
    if (useProxies) {
      const activeProxiesList = proxyManager.getActiveProxies();
      if (activeProxiesList.length === 0) {
        toast({
          title: "Нет активных прокси",
          description: "Для использования прокси необходимо иметь активные прокси",
          variant: "destructive",
        });
        return [];
      }
    }
    
    setIsTesting(true);
    setProgress(0);
    setStatusMessage(`Подготовка к проверке ${urls.length} URL...`);
    
    try {
      let checkedCount = 0;
      const results = await proxyManager.testUrls(urls, useProxies, (url, status, proxy) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / urls.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${urls.length} URL`);
      });
      
      toast({
        title: "Проверка URL завершена",
        description: `Проверено ${urls.length} URL`,
      });
      
      return results;
    } catch (error) {
      console.error("Ошибка при проверке URL:", error);
      toast({
        title: "Ошибка проверки URL",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsTesting(false);
      setStatusMessage('');
    }
  }, [toast]);

  return {
    isTesting,
    progress,
    statusMessage,
    testUrls
  };
}
