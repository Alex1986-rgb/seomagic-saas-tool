
import { useState } from 'react';

export type CrawlStage = 'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'error';

export function useCrawlState(url: string) {
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [estimatedPages, setEstimatedPages] = useState(0);
  const [crawlStage, setCrawlStage] = useState<CrawlStage>('idle');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [crawler, setCrawler] = useState<any>(null);

  const resetState = () => {
    setProgress(0);
    setCurrentUrl('');
    setPagesScanned(0);
    setEstimatedPages(0);
    setCrawlStage('idle');
    setIsCompleted(false);
    setError(null);
    setScannedUrls([]);
  };

  const updateProgress = (
    pagesScanned: number, 
    totalEstimated: number, 
    currentUrl: string,
    maxPages: number
  ) => {
    setPagesScanned(pagesScanned);
    setCurrentUrl(currentUrl);
    
    // Limit the estimated total to maxPages
    const limitedEstimate = Math.min(totalEstimated, maxPages);
    setEstimatedPages(limitedEstimate);
    
    // Calculate progress (limit to 99% until completed)
    const calculatedProgress = Math.round((pagesScanned / limitedEstimate) * 100);
    setProgress(Math.min(calculatedProgress, 99));
    
    // Update state
    if (progress < 5) {
      setCrawlStage('starting');
    } else {
      setCrawlStage('crawling');
    }
  };

  const completeCrawl = (success: boolean, result?: { urls: string[], pageCount: number }) => {
    if (success && result) {
      setProgress(100);
      setCrawlStage('completed');
      setIsCompleted(true);
      setPagesScanned(result.pageCount);
      setScannedUrls(result.urls);
    } else {
      setCrawlStage('error');
      setError('Не удалось завершить сканирование сайта');
    }
  };

  return {
    progress,
    currentUrl,
    pagesScanned,
    estimatedPages,
    crawlStage,
    isCompleted,
    error,
    domain,
    scannedUrls,
    crawler,
    resetState,
    updateProgress,
    completeCrawl,
    setDomain,
    setCrawler,
    setCrawlStage,  // Export the setCrawlStage function
    setError
  };
}
