
import { useState, useCallback, useEffect } from 'react';
import { useCrawlExecution } from './useCrawlExecution';
import { useCrawlState } from './useCrawlState';

export function useCrawlProgress(urlParam: string) {
  const [url, setUrl] = useState(urlParam);
  
  // Нормализуем URL
  useEffect(() => {
    let normalizedUrl = urlParam;
    if (normalizedUrl && !normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    // Удаляем завершающий слэш, если он есть
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
  
  const startCrawl = useCallback(async () => {
    if (!url) {
      console.error("Cannot start crawl: URL is empty");
      completeCrawl(false);
      return;
    }

    console.log(`Starting crawling for URL: ${url}`);
    resetState();
    setCrawlStage('starting');
    
    try {
      // Создаем таймаут для обнаружения зависаний
      const timeoutId = setTimeout(() => {
        console.error(`Crawl timeout for URL: ${url}`);
        completeCrawl(false);
      }, 60000); // 60 секунд таймаут
      
      // Инициализация сканера с явной передачей URL
      const { crawler: newCrawler, domain: newDomain, maxPages, normalizedUrl } = initializeCrawler({
        url,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
        }
      });
      
      setCrawler(newCrawler);
      setDomain(newDomain);
      console.log(`Executing crawler with URL: ${normalizedUrl} and domain: ${newDomain}`);
      
      // Выполняем сканирование с явной передачей URL
      const result = await executeCrawler(newCrawler, normalizedUrl);
      
      // Отменяем таймаут, так как сканирование завершилось
      clearTimeout(timeoutId);
      
      if (result && result.success) {
        console.log(`Crawl completed with ${result.urls.length} URLs`);
        completeCrawl(true, { urls: result.urls, pageCount: result.pageCount });
      } else {
        console.error("Crawling failed:", result);
        completeCrawl(false);
      }
    } catch (error) {
      console.error("Error during crawl:", error);
      completeCrawl(false);
    }
  }, [url, resetState, initializeCrawler, executeCrawler, updateProgress, completeCrawl, setCrawler, setDomain, setCrawlStage]);

  const cancelCrawl = useCallback(() => {
    console.log("Cancelling crawl");
    // Clean up
    completeCrawl(false);
  }, [completeCrawl]);

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
    cancelCrawl
  };
}
