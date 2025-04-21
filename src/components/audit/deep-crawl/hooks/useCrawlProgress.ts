
import { useState, useCallback, useEffect } from 'react';
import { useCrawlState } from './useCrawlState';
import { supabase } from "@/integrations/supabase/client";
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

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

  // Add missing methods
  const initializeCrawler = useCallback(({ url, maxPages, onProgress }: { 
    url: string; 
    maxPages: number; 
    onProgress: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void; 
  }) => {
    try {
      const crawler = new SimpleSitemapCreator({
        maxPages,
        maxDepth: 5,
        includeStylesheet: true,
        requestDelay: 300,
        concurrentRequests: 2,
        retryCount: 2,
        retryDelay: 1000,
        timeout: 20000
      });
      
      // Extract domain
      let domain = "";
      try {
        const urlObj = new URL(url);
        domain = urlObj.hostname;
      } catch (e) {
        console.error("Error extracting domain:", e);
        domain = url;
      }
      
      return { crawler, domain, normalizedUrl: url };
    } catch (error) {
      console.error("Error initializing crawler:", error);
      return { crawler: null, domain: "", normalizedUrl: url };
    }
  }, []);
  
  const executeCrawler = useCallback(async (crawler: SimpleSitemapCreator, url: string) => {
    if (!crawler) {
      return { success: false, error: "No crawler instance" };
    }
    
    try {
      // Perform the crawl
      const urls = await crawler.crawl(url, (scanned: number, total: number, currentUrl: string) => {
        updateProgress(scanned, total, currentUrl, crawler.options.maxPages || 10000);
      });
      
      return { 
        success: true, 
        urls,
        pageCount: urls.length 
      };
    } catch (error) {
      console.error("Error executing crawler:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error during crawl",
        urls: [],
        pageCount: 0
      };
    }
  }, [updateProgress]);
  
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
      
      // Create timeouts for error handling
      const crawlTimeoutDuration = 180000; // 3 minutes timeout
      
      const crawlTimeoutId = setTimeout(() => {
        console.error(`Crawl timeout for URL: ${url}`);
        setErrorMsg("Сканирование заняло слишком много времени");
        completeCrawl(false);
      }, crawlTimeoutDuration);
      
      // Timeout for initialization (10 seconds)
      const startupTimeoutId = setTimeout(() => {
        if (crawlStage === 'starting') {
          console.error(`Crawl startup timeout for URL: ${url}`);
          setErrorMsg("Не удалось начать сканирование");
          completeCrawl(false);
          clearTimeout(crawlTimeoutId);
        }
      }, 10000);
      
      // Initialize crawler with explicit URL
      console.log(`Initializing crawler for URL: ${url}`);
      
      // Set higher maxPages for larger sites
      let maxPages = 100000; // Increase default limit
      
      // Special case for known large sites
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('myarredo.ru')) {
          maxPages = 500000; // Allow more pages for known large sites
          console.log(`Detected large site (${urlObj.hostname}), setting max pages to ${maxPages}`);
        }
      } catch (e) {
        console.warn("Could not check if domain is large site:", e);
      }
      
      // Make sure we're using the explicitly provided URL
      const { crawler: newCrawler, domain: newDomain, normalizedUrl } = initializeCrawler({
        url,
        maxPages: maxPages || 100000,
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
      
      // Start crawling
      console.log("Starting crawler execution");
      const result = await executeCrawler(newCrawler, normalizedUrl);
      
      // Clear timeouts after crawling is complete
      clearTimeout(crawlTimeoutId);
      clearTimeout(startupTimeoutId);
      
      if (result && result.success) {
        console.log(`Crawl completed successfully with ${result.urls.length} URLs`);
        
        // Save results to localStorage for quick access
        try {
          localStorage.setItem(`crawl_results_${newDomain}`, JSON.stringify({
            urls: result.urls.slice(0, 1000), // Limit for localStorage
            pageCount: result.pageCount,
            timestamp: new Date().toISOString()
          }));
          
          // Also save to Supabase for long-term storage
          await saveScanResultsToSupabase(result.urls, result.pageCount);
        } catch (e) {
          console.warn("Error saving results, but continuing:", e);
        }
        
        // Update completion state
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
    errorMsg,
    // Add the missing functions to the returned object
    initializeCrawler,
    executeCrawler
  };
}
