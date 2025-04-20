
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
  
  // Function to store scan results to Supabase
  const saveScanResultsToSupabase = async (urls: string[], pageCount: number) => {
    try {
      // Проверяем, что URLs не пусты
      if (!urls || urls.length === 0) {
        console.warn("No URLs to save to Supabase");
        return false;
      }

      // Try to extract domain for reporting
      let domainForReport = "";
      try {
        if (url) {
          const urlObj = new URL(url);
          domainForReport = urlObj.hostname;
        }
      } catch (e) {
        console.warn("Could not parse URL for domain:", e);
      }

      const { data, error } = await supabase
        .from('crawl_results')
        .insert({
          urls: urls,
          page_types: {},
          created_at: new Date().toISOString(),
          depth_data: [],
          project_id: null // To comply with any potential RLS policies
        })
        .select('id');

      if (error) {
        console.error("Failed to save scan results to Supabase:", error);
        return false;
      }

      console.log("Scan results saved to Supabase:", data);
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
      
      // Check if this is Lovable domain - we should warn but still allow it
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
      const crawlTimeoutDuration = 180000; // 3 minutes for all domains
      
      const crawlTimeoutId = setTimeout(() => {
        console.error(`Crawl timeout for URL: ${url}`);
        setErrorMsg("Сканирование заняло слишком много времени");
        completeCrawl(false);
      }, crawlTimeoutDuration);
      
      // 2. Таймаут на этапе инициализации (10 секунд)
      const startupTimeoutId = setTimeout(() => {
        if (crawlStage === 'starting') {
          console.error(`Crawl startup timeout for URL: ${url}`);
          setErrorMsg("Не удалось начать сканирование");
          completeCrawl(false);
          clearTimeout(crawlTimeoutId);
        }
      }, 10000);
      
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
      
      const { crawler: newCrawler, domain: newDomain, normalizedUrl } = initializeCrawler({
        url,
        maxPages,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          console.log(`Progress update: ${pagesScanned}/${totalEstimated} - ${currentUrl}`);
          updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
          
          // Обновляем этап сканирования, чтобы предотвратить таймаут
          if (crawlStage === 'starting' && pagesScanned > 0) {
            setCrawlStage('crawling');
            clearTimeout(startupTimeoutId); // Отменяем таймаут инициализации
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
        
        // Сохраняем результаты в Supabase
        try {
          await saveScanResultsToSupabase(result.urls, result.pageCount);
        } catch (e) {
          console.warn("Error saving results to Supabase, but continuing:", e);
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
    scannedUrls,
    startCrawl,
    cancelCrawl,
    errorMsg
  };
}
