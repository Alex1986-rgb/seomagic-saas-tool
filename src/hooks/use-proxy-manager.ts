
import { useState, useEffect, useCallback } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from './use-toast';
import { useProxyCollection } from './proxy/use-proxy-collection';
import { useProxyTesting } from './proxy/use-proxy-testing';
import { useUrlTesting } from './proxy/use-url-testing';

interface UseProxyManagerProps {
  initialTestUrl?: string;
}

export function useProxyManager({ initialTestUrl = 'https://api.ipify.org/' }: UseProxyManagerProps = {}) {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [activeProxies, setActiveProxies] = useState<Proxy[]>([]);
  const [testUrl, setTestUrl] = useState(initialTestUrl);
  const { toast } = useToast();

  const { 
    isCollecting, 
    progress: collectionProgress, 
    statusMessage: collectionStatus, 
    collectProxies,
    clearBeforeCollect,
    setClearBeforeCollect
  } = useProxyCollection();
  
  const { 
    isTesting: isTestingProxies, 
    progress: testingProgress, 
    statusMessage: testingStatus, 
    testProxies 
  } = useProxyTesting();
  
  const { 
    isTesting: isTestingUrls, 
    progress: urlTestProgress, 
    statusMessage: urlTestStatus, 
    testUrls 
  } = useUrlTesting();

  const isLoading = isCollecting || isTestingProxies || isTestingUrls;
  const progress = isCollecting ? collectionProgress : (isTestingProxies ? testingProgress : urlTestProgress);
  const statusMessage = isCollecting ? collectionStatus : (isTestingProxies ? testingStatus : urlTestStatus);

  const loadProxies = useCallback(() => {
    const allProxies = proxyManager.getAllProxies();
    setProxies(allProxies);
    setActiveProxies(proxyManager.getActiveProxies());
  }, []);

  useEffect(() => {
    loadProxies();
  }, [loadProxies]);

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
      toast({
        title: "Импорт завершен",
        description: `Импортировано ${importedProxies.length} прокси`,
      });
      loadProxies();
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

  const getRandomActiveProxy = useCallback(() => {
    const activeProxiesList = proxyManager.getActiveProxies();
    if (activeProxiesList.length === 0) return null;
    return activeProxiesList[Math.floor(Math.random() * activeProxiesList.length)];
  }, []);

  // Add captcha API methods that were missing
  const getCaptchaApiKey = useCallback(() => {
    return proxyManager.getCaptchaApiKey();
  }, []);

  const setBotableApiKey = useCallback((apiKey: string) => {
    proxyManager.setBotableApiKey(apiKey);
  }, []);

  const setCaptchaApiKey = useCallback((apiKey: string) => {
    proxyManager.setCaptchaApiKey(apiKey);
  }, []);

  const getBotableApiKey = useCallback(() => {
    return proxyManager.getBotableApiKey();
  }, []);

  return {
    // State
    proxies,
    activeProxies,
    isLoading,
    isCollecting,
    isTestingProxies,
    isTestingUrls,
    progress,
    statusMessage,
    testUrl,
    setTestUrl,
    clearBeforeCollect,
    setClearBeforeCollect,
    
    // Methods
    loadProxies,
    collectProxies,
    testProxies,
    importProxies,
    getRandomActiveProxy,
    testUrls,
    
    // Captcha API methods that were missing before
    getCaptchaApiKey,
    setBotableApiKey,
    setCaptchaApiKey,
    getBotableApiKey,
    
    // Direct access to manager
    proxyManager
  };
}
