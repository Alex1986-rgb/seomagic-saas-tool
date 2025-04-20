
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
    console.log(`Starting crawling for URL: ${url}`);
    resetState();
    setCrawlStage('starting');
    
    try {
      console.log(`Starting crawl for URL: ${url}`);
      
      // Инициализация сканера
      const { crawler: newCrawler, domain: newDomain, maxPages, normalizedUrl } = initializeCrawler({
        url,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
        }
      });
      
      setCrawler(newCrawler);
      setDomain(newDomain);
      console.log(`Executing crawler with URL: ${normalizedUrl}`);
      
      // Выполняем сканирование
      const result = await executeCrawler(newCrawler, normalizedUrl);
      
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
