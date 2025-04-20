
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
      const { data, error } = await supabase
        .from('crawl_results')
        .insert({
          urls: urls,
          page_types: {},
          created_at: new Date().toISOString(),
          depth_data: []
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
      // Create timeout for detecting hangs
      const crawlTimeoutId = setTimeout(() => {
        console.error(`Crawl timeout for URL: ${url}`);
        setErrorMsg("Сканирование заняло слишком много времени");
        completeCrawl(false);
      }, 120000); // 2 minute timeout for entire scan
      
      // Initialize scanner with explicit URL
      const { crawler: newCrawler, domain: newDomain, maxPages, normalizedUrl } = initializeCrawler({
        url,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
        }
      });
      
      setCrawler(newCrawler);
      setDomain(newDomain);
      console.log(`Executing crawler with URL: ${normalizedUrl} and domain: ${newDomain}`);
      
      // Also add startup timeout
      const startupTimeoutId = setTimeout(() => {
        if (crawlStage === 'starting') {
          console.error(`Crawl startup timeout for URL: ${url}`);
          setErrorMsg("Не удалось начать сканирование");
          completeCrawl(false);
          clearTimeout(crawlTimeoutId);
        }
      }, 15000); // 15 seconds startup timeout
      
      // Execute crawler with explicit URL
      const result = await executeCrawler(newCrawler, normalizedUrl);
      
      // Cancel timeouts since scan completed
      clearTimeout(crawlTimeoutId);
      clearTimeout(startupTimeoutId);
      
      if (result && result.success) {
        console.log(`Crawl completed with ${result.urls.length} URLs`);
        
        // Save results to Supabase
        await saveScanResultsToSupabase(result.urls, result.pageCount);
        
        completeCrawl(true, { urls: result.urls, pageCount: result.pageCount });
      } else {
        console.error("Crawling failed:", result);
        setErrorMsg(result?.error || "Ошибка при сканировании сайта");
        completeCrawl(false);
      }
    } catch (error) {
      console.error("Error during crawl:", error);
      setErrorMsg("Непредвиденная ошибка при сканировании");
      completeCrawl(false);
    }
  }, [url, resetState, initializeCrawler, executeCrawler, updateProgress, completeCrawl, setCrawler, setDomain, setCrawlStage, crawlStage]);

  const cancelCrawl = useCallback(() => {
    console.log("Cancelling crawl");
    setErrorMsg(null);
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
    cancelCrawl,
    errorMsg
  };
}
