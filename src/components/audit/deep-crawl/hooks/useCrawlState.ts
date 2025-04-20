
import { useState } from 'react';

export function useCrawlState(url: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [crawlStage, setCrawlStage] = useState<'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed'>('idle');
  const [domain, setDomain] = useState<string>(extractDomain(url));
  const [crawler, setCrawler] = useState<any>(null);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);

  const resetState = () => {
    setIsLoading(true);
    setIsComplete(false);
    setProgress(0);
    setCurrentUrl('');
    setPagesScanned(0);
    setTotalPages(0);
    setCrawlStage('starting');
    setScannedUrls([]);
  };

  const updateProgress = (
    pagesScanned: number, 
    totalEstimated: number, 
    currentUrl: string, 
    maxPages: number
  ) => {
    setPagesScanned(pagesScanned);
    setTotalPages(Math.min(totalEstimated, maxPages));
    setCurrentUrl(currentUrl);
    
    // Calculate progress as percentage
    const progressPercent = totalEstimated > 0 
      ? Math.min(Math.round((pagesScanned / totalEstimated) * 100), 100)
      : Math.min(pagesScanned, 100);
    
    setProgress(progressPercent);
    
    // Set crawling stage
    setCrawlStage('crawling');
  };

  const completeCrawl = (success: boolean, data?: { urls: string[], pageCount: number }) => {
    setIsLoading(false);
    setIsComplete(true);
    
    if (success && data) {
      setCrawlStage('completed');
      setScannedUrls(data.urls);
      setPagesScanned(data.pageCount);
      setProgress(100);
    } else {
      setCrawlStage('failed');
    }
  };

  // Helper to extract domain from URL
  function extractDomain(url: string): string {
    try {
      const normalized = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(normalized);
      return urlObj.hostname;
    } catch (error) {
      // If URL is invalid, return as-is (sanitized)
      return url.replace(/[^a-z0-9.-]/gi, '');
    }
  }

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
    resetState,
    updateProgress,
    completeCrawl,
    setDomain,
    setCrawler,
    setCrawlStage // Add this to expose the setCrawlStage function
  };
}
