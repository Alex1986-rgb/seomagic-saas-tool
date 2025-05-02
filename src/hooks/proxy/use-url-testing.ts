
import { useState, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import { useToast } from '../use-toast';
import { UrlTestResult } from '@/services/proxy/url-testing/urlTester';

export function useUrlTesting() {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [testResults, setTestResults] = useState<UrlTestResult[]>([]);
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
          description: "Для использования прокси необходимо собрать и проверить прокси",
          variant: "destructive",
        });
        return [];
      }
      console.log(`Доступно ${activeProxiesList.length} активных прокси для тестирования URL`);
    }
    
    setIsTesting(true);
    setProgress(0);
    setStatusMessage(`Подготовка к проверке ${urls.length} URL...`);
    
    try {
      let checkedCount = 0;
      
      // Предварительно обрабатываем URL
      const cleanUrls = urls.map(url => url.trim()).filter(url => url);
      
      // Добавляем автопротокол для URL без http/https
      const processedUrls = cleanUrls.map(url => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      });
      
      // Устанавливаем максимальное количество одновременных проверок
      const results = await proxyManager.testUrls(processedUrls, useProxies, (url, status, proxy, errorDetails) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / processedUrls.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${processedUrls.length} URL`);
        
        // Определяем, является ли статус успешным
        const isSuccessStatus = status >= 200 && status < 400;
        
        // Добавляем результат в состояние для отображения в интерфейсе
        setTestResults(prev => [...prev, {
          url,
          status,
          proxy,
          errorDetails,
          timestamp: new Date().toISOString(),
          success: isSuccessStatus
        }]);
      });
      
      // Подсчитываем успешные запросы
      const successfulRequests = results.filter(r => r.success).length;
      
      toast({
        title: "Проверка URL завершена",
        description: `Проверено ${processedUrls.length} URL. Успешно: ${successfulRequests}, с ошибками: ${processedUrls.length - successfulRequests}`,
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
