
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import { useToast } from '../use-toast';

export function useUrlTesting() {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  const testUrls = useCallback(async (urls: string[], useProxies: boolean = true) => {
    // Очищаем предыдущие результаты
    setTestResults([]);
    
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
      
      // Добавляем автопротокол для URL без http/https
      const processedUrls = cleanUrls.map(url => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      });
      
      console.log("Обработанные URL для тестирования:", processedUrls);
      
      const results = await proxyManager.testUrls(processedUrls, useProxies, (url, status, proxy, errorDetails) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / processedUrls.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${processedUrls.length} URL`);
        
        const statusInfo = status > 0 
          ? `статус ${status}` 
          : `ошибка: ${errorDetails || 'неизвестная ошибка'}`;
        
        console.log(`Результат проверки URL ${url}: ${statusInfo}, прокси ${proxy || 'не использовался'}`);
        
        // Добавляем результат в состояние для отображения в интерфейсе
        setTestResults(prev => [...prev, {
          url,
          status,
          proxy,
          errorDetails,
          timestamp: new Date().toISOString()
        }]);
      });
      
      toast({
        title: "Проверка URL завершена",
        description: `Проверено ${processedUrls.length} URL`,
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

  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  return {
    isTesting,
    progress,
    statusMessage,
    testUrls,
    testResults,
    clearResults
  };
}
