
import { useState, useEffect, useCallback } from 'react';
import { Proxy, proxyManager } from '@/services/proxy/proxyManager';
import { useToast } from './use-toast';

interface UseProxyManagerProps {
  initialTestUrl?: string;
}

export function useProxyManager({ initialTestUrl = 'https://api.ipify.org/' }: UseProxyManagerProps = {}) {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [activeProxies, setActiveProxies] = useState<Proxy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [testUrl, setTestUrl] = useState(initialTestUrl);
  const { toast } = useToast();

  // Загрузка списка прокси
  const loadProxies = useCallback(() => {
    const allProxies = proxyManager.getAllProxies();
    setProxies(allProxies);
    setActiveProxies(proxyManager.getActiveProxies());
  }, []);

  // Начальная загрузка при монтировании
  useEffect(() => {
    loadProxies();
  }, [loadProxies]);

  // Сбор прокси из источников
  const collectProxies = useCallback(async () => {
    setIsCollecting(true);
    setIsLoading(true);
    setProgress(0);
    setStatusMessage('Подготовка к сбору прокси...');

    try {
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
          setStatusMessage(`Ошибка при сборе прокси из ${source}`);
        }
      });
      
      toast({
        title: "Сбор прокси завершен",
        description: `Найдено ${newProxies.length} новых прокси`,
      });
      
      loadProxies();
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
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [loadProxies, toast]);

  // Проверка прокси
  const testProxies = useCallback(async (proxyList?: Proxy[], customTestUrl?: string) => {
    const proxiesToTest = proxyList || proxies;
    const url = customTestUrl || testUrl;
    
    if (proxiesToTest.length === 0) {
      toast({
        title: "Нет прокси для проверки",
        description: "Сначала соберите или импортируйте прокси",
        variant: "destructive",
      });
      return 0;
    }
    
    setIsTesting(true);
    setIsLoading(true);
    setProgress(0);
    setStatusMessage('Подготовка к проверке прокси...');
    
    try {
      let checkedCount = 0;
      
      const testedProxies = await proxyManager.checkProxies(proxiesToTest, url, (proxy) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / proxiesToTest.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${proxiesToTest.length} прокси`);
      });
      
      toast({
        title: "Проверка прокси завершена",
        description: `Проверено ${proxiesToTest.length} прокси`,
      });
      
      loadProxies();
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
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [proxies, testUrl, toast, loadProxies]);

  // Импорт прокси из текста
  const importProxies = useCallback((proxyText: string) => {
    if (!proxyText.trim()) {
      toast({
        title: "Пустой список",
        description: "Введите список прокси для импорта",
        variant: "destructive",
      });
      return 0;
    }
    
    try {
      const importedProxies = proxyManager.importProxies(proxyText);
      
      if (importedProxies.length > 0) {
        toast({
          title: "Импорт завершен",
          description: `Импортировано ${importedProxies.length} прокси`,
        });
        
        loadProxies();
      } else {
        toast({
          title: "Импорт завершен",
          description: "Не найдено валидных прокси для импорта",
          variant: "destructive",
        });
      }
      
      return importedProxies.length;
    } catch (error) {
      console.error("Ошибка при импорте прокси:", error);
      toast({
        title: "Ошибка импорта",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      return 0;
    }
  }, [loadProxies, toast]);

  // Получение случайного активного прокси
  const getRandomActiveProxy = useCallback(() => {
    const activeProxiesList = proxyManager.getActiveProxies();
    if (activeProxiesList.length === 0) return null;
    
    return activeProxiesList[Math.floor(Math.random() * activeProxiesList.length)];
  }, []);

  // Тестирование URL через прокси
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
    
    setIsLoading(true);
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
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [toast]);

  // Методы для работы с API ключами капчи
  const setCaptchaApiKey = useCallback((apiKey: string) => {
    proxyManager.setCaptchaApiKey(apiKey);
  }, []);
  
  const setBotableApiKey = useCallback((apiKey: string) => {
    proxyManager.setBotableApiKey(apiKey);
  }, []);
  
  const getCaptchaApiKey = useCallback(() => {
    return proxyManager.getCaptchaApiKey();
  }, []);
  
  const getBotableApiKey = useCallback(() => {
    return proxyManager.getBotableApiKey();
  }, []);

  return {
    // Состояние
    proxies,
    activeProxies,
    isLoading,
    isCollecting,
    isTesting,
    progress,
    statusMessage,
    testUrl,
    
    // Методы для работы с прокси
    loadProxies,
    collectProxies,
    testProxies,
    importProxies,
    getRandomActiveProxy,
    testUrls,
    
    // Методы для работы с API капчи
    setCaptchaApiKey,
    setBotableApiKey,
    getCaptchaApiKey,
    getBotableApiKey,
    
    // Прямой доступ к менеджеру прокси
    proxyManager
  };
}
