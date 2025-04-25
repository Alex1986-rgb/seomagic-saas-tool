
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
      
      // Предварительно обрабатываем URL
      const cleanUrls = urls.map(url => url.trim()).filter(url => url);
      console.log("Тестируемые URL:", cleanUrls);
      
      const results = await proxyManager.testUrls(cleanUrls, useProxies, (url, status, proxy) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / cleanUrls.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${cleanUrls.length} URL`);
        console.log(`Результат проверки URL ${url}: статус ${status}, прокси ${proxy || 'не использовался'}`);
      });
      
      toast({
        title: "Проверка URL завершена",
        description: `Проверено ${cleanUrls.length} URL`,
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
