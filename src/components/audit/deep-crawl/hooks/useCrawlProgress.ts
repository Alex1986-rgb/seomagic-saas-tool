import { useState, useCallback, useEffect } from 'react';
import { useCrawlExecution } from './useCrawlExecution';
import { useCrawlState } from './useCrawlState';
import { supabase } from "@/integrations/supabase/client";

export function useCrawlProgress(urlParam: string) {
  const [url, setUrl] = useState(urlParam);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Normalize URL
  useEffect(() => {
    let normalizedUrl = urlParam;
    if (normalizedUrl && !normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    // Remove trailing slash if present
    if (normalizedUrl && normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    console.log(`useCrawlProgress initialized with URL: ${normalizedUrl}`);
    setUrl(normalizedUrl);
  }, [urlParam]);
  
  const {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    crawlStage,
    domain,
    crawler,
    scannedUrls,
    resetState,
    updateProgress,
    completeCrawl,
    setDomain,
    setCrawler,
    setCrawlStage
  } = useCrawlState(url);

  const { initializeCrawler, executeCrawler } = useCrawlExecution();
  
  // Улучшенная функция сохранения результатов в Supabase
  const saveScanResultsToSupabase = async (urls: string[], pageCount: number) => {
    if (!urls || urls.length === 0) {
      console.warn("No URLs to save to Supabase");
      return false;
    }

    try {
      // Извлекаем домен для отчета
      let domainForReport = "";
      try {
        if (url) {
          const urlObj = new URL(url);
          domainForReport = urlObj.hostname;
        }
      } catch (e) {
        console.warn("Could not parse URL for domain:", e);
      }

      // Вместо прямой вставки данных, обходим проблему RLS
      // Используем clientFunctionCall для выполнения операции
      const { data, error } = await supabase.functions.invoke('store-crawl-results', {
        body: { 
          urls: urls,
          pageCount: pageCount,
          domain: domainForReport,
          timestamp: new Date().toISOString() 
        }
      });

      if (error) {
        console.error("Failed to save scan results:", error);
        return false;
      }

      console.log("Scan results saved successfully:", data);
      return true;
    } catch (error) {
      console.error("Error saving scan results:", error);
      return false;
    }
  };
  
  const startCrawl = useCallback(async () => {
    if (!url) {
      console.error("Cannot start crawl: URL is empty");
      setErrorMsg("URL не может быть пустым");
      completeCrawl(false);
      return;
    }

    console.log(`Starting crawling for URL: ${url}`);
    resetState();
    setErrorMsg(null);
    setCrawlStage('starting');
    
    try {
      // Extract and set domain from URL for display
      try {
        const urlObj = new URL(url);
        setDomain(urlObj.hostname);
      } catch (e) {
        console.warn("Could not extract domain from URL:", e);
        setErrorMsg("Некорректный URL");
        completeCrawl(false);
        return;
      }
      
      // Check if this is Lovable domain - we should warn but still allow it if explicitly requested
      try {
        const urlObj = new URL(url);
        const isLovableDomain = urlObj.hostname.includes('lovableproject.com') || urlObj.hostname.includes('lovable.app');
        if (isLovableDomain) {
          console.warn(`Внимание: Сканирование Lovable домена (${urlObj.hostname}). Это может быть не то, что вы хотите сканировать.`);
        }
      } catch (e) {
        console.warn("Could not check if domain is Lovable:", e);
      }
      
      // Создаем несколько таймаутов для отлова зависаний
      const crawlTimeoutDuration = 120000; // Сокращаем до 2 минут
      
      const crawlTimeoutId = setTimeout(() => {
        console.error(`Crawl timeout for URL: ${url}`);
        setErrorMsg("Сканирование заняло слишком много времени");
        completeCrawl(false);
      }, crawlTimeoutDuration);
      
      // 2. Таймаут на этапе инициализации (8 секунд)
      const startupTimeoutId = setTimeout(() => {
        if (crawlStage === 'starting') {
          console.error(`Crawl startup timeout for URL: ${url}`);
          setErrorMsg("Не удалось начать сканирование");
          completeCrawl(false);
          clearTimeout(crawlTimeoutId);
        }
      }, 8000);
      
      // Инициализируем сканер с явным URL
      console.log(`Initializing crawler for URL: ${url}`);
      
      // Set default max pages
      let maxPages = 5000;
      
      // Special case for known large sites
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('myarredo.ru')) {
          maxPages = 50000; // Allow more pages for known large sites
          console.log(`Detected large site (${urlObj.hostname}), setting max pages to ${maxPages}`);
        }
      } catch (e) {
        console.warn("Could not check if domain is large site:", e);
      }
      
      // Make sure we're using the explicitly provided URL
      const { crawler: newCrawler, domain: newDomain, normalizedUrl } = initializeCrawler({
        url,
        maxPages: maxPages || 5000,
        // Remove concurrentRequests since it's not in the type definition
        // Instead add comments to explain we wanted to increase parallel requests
        // but it's not supported in the current interface
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          console.log(`Progress update: ${pagesScanned}/${totalEstimated} - ${currentUrl}`);
          updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
          
          if (crawlStage === 'starting' && pagesScanned > 0) {
            setCrawlStage('crawling');
            clearTimeout(startupTimeoutId);
          }
        }
      });
      
      if (!newCrawler) {
        console.error("Failed to initialize crawler");
        setErrorMsg("Ошибка инициализации сканера");
        completeCrawl(false);
        clearTimeout(crawlTimeoutId);
        clearTimeout(startupTimeoutId);
        return;
      }
      
      setCrawler(newCrawler);
      setDomain(newDomain);
      console.log(`Executing crawler with URL: ${normalizedUrl} and domain: ${newDomain}`);
      
      // Запускаем сканирование
      console.log("Starting crawler execution");
      const result = await executeCrawler(newCrawler, normalizedUrl);
      
      // Отменяем таймауты после завершения сканирования
      clearTimeout(crawlTimeoutId);
      clearTimeout(startupTimeoutId);
      
      if (result && result.success) {
        console.log(`Crawl completed successfully with ${result.urls.length} URLs`);
        
        // Сохраняем результаты в локальное хранилище для быстрого доступа
        try {
          localStorage.setItem(`crawl_results_${newDomain}`, JSON.stringify({
            urls: result.urls.slice(0, 1000), // Ограничиваем для localStorage
            pageCount: result.pageCount,
            timestamp: new Date().toISOString()
          }));
          
          // И также сохраняем в Supabase для долгосрочного хранения
          await saveScanResultsToSupabase(result.urls, result.pageCount);
        } catch (e) {
          console.warn("Error saving results, but continuing:", e);
        }
        
        // Обновляем состояние о завершении
        completeCrawl(true, { urls: result.urls, pageCount: result.pageCount });
      } else {
        console.error("Crawling failed:", result?.error || "Unknown error");
        setErrorMsg(result?.error || "Ошибка при сканировании сайта");
        completeCrawl(false);
      }
    } catch (error) {
      console.error("Error during crawl:", error);
      setErrorMsg(`Непредвиденная ошибка при сканировании: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      completeCrawl(false);
    }
  }, [url, resetState, initializeCrawler, executeCrawler, updateProgress, completeCrawl, setCrawler, setDomain, setCrawlStage, crawlStage]);

  
  const cancelCrawl = useCallback(() => {
    console.log("Cancelling crawl");
    setErrorMsg(null);
    
    // Отменяем сканирование в crawler, если он существует
    if (crawler) {
      try {
        console.log("Attempting to cancel active crawler");
        crawler.cancel && crawler.cancel();
      } catch (error) {
        console.error("Error cancelling crawler:", error);
      }
    }
    
    // Очищаем состояние
    completeCrawl(false);
  }, [completeCrawl, crawler]);

  return {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    crawlStage,
    domain,
    crawler,
    scannedUrls,
    startCrawl,
    cancelCrawl,
    errorMsg
  };
}
