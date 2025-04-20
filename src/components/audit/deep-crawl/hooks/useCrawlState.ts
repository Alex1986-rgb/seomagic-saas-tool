
import { useState } from 'react';

export function useCrawlState(url: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [crawler, setCrawler] = useState<any>(null);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [domain, setDomain] = useState('');
  const [crawlStage, setCrawlStage] = useState<'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed'>('idle');

  const resetState = () => {
    setIsLoading(false);
    setIsComplete(false);
    setProgress(0);
    setCurrentUrl('');
    setPagesScanned(0);
    setTotalPages(0);
    setCrawler(null);
    setScannedUrls([]);
    setCrawlStage('idle');
  };

  const updateProgress = (pagesScanned: number, totalEstimated: number, currentUrl: string, maxPages: number = 10000) => {
    setPagesScanned(pagesScanned);
    setTotalPages(Math.min(totalEstimated, maxPages));
    setCurrentUrl(currentUrl);
    
    // Calculate progress percentage
    const progressPercent = totalEstimated > 0 
      ? Math.min(Math.round((pagesScanned / Math.min(totalEstimated, maxPages)) * 100), 100)
      : 0;
    
    setProgress(progressPercent);
    
    // Update crawl stage based on progress
    if (progressPercent < 5) {
      setCrawlStage('starting');
    } else if (progressPercent < 90) {
      setCrawlStage('crawling');
    } else if (progressPercent < 100) {
      setCrawlStage('analyzing');
    } else {
      setCrawlStage('completed');
    }
  };

  const completeCrawl = (success: boolean, result?: { urls: string[], pageCount: number }) => {
    setIsLoading(false);
    setIsComplete(true);
    setCrawlStage(success ? 'completed' : 'failed');
    
    if (success && result) {
      setScannedUrls(result.urls);
      setPagesScanned(result.pageCount);
      setProgress(100);
    }
  };

  return {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    crawler,
    scannedUrls,
    domain,
    crawlStage,
    setIsLoading,
    setIsComplete,
    setProgress,
    setCurrentUrl,
    setPagesScanned,
    setTotalPages,
    setCrawler,
    setScannedUrls,
    setDomain,
    setCrawlStage,
    resetState,
    updateProgress,
    completeCrawl
  };
}
