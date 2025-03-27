
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AdvancedCrawler } from '@/services/audit/crawler/advancedCrawler';

export function useCrawlState(url: string) {
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [estimatedPages, setEstimatedPages] = useState(0);
  const [crawlStage, setCrawlStage] = useState('initializing');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [crawler, setCrawler] = useState<AdvancedCrawler | null>(null);
  const { toast } = useToast();

  // Reset state function
  const resetState = () => {
    setProgress(0);
    setPagesScanned(0);
    setEstimatedPages(100000);
    setCurrentUrl('');
    setCrawlStage('initializing');
    setError(null);
    setIsCompleted(false);
    setScannedUrls([]);
  };

  // Update progress function
  const updateProgress = (
    pagesScanned: number, 
    totalEstimated: number, 
    currentUrl: string,
    maxPages: number
  ) => {
    setPagesScanned(pagesScanned);
    setEstimatedPages(totalEstimated);
    setCurrentUrl(currentUrl);
    
    const progressPercent = Math.min(
      Math.floor((pagesScanned / Math.min(totalEstimated, maxPages)) * 100),
      99
    );
    setProgress(progressPercent);
    
    // Update crawl stage based on progress
    if (progressPercent < 20) {
      setCrawlStage('exploring');
    } else if (progressPercent < 50) {
      setCrawlStage('discovery');
    } else if (progressPercent < 80) {
      setCrawlStage('indexing');
    } else {
      setCrawlStage('finalizing');
    }
  };

  // Complete crawl function
  const completeCrawl = (success: boolean, result?: { urls: string[], pageCount: number }) => {
    if (success && result) {
      setScannedUrls(result.urls);
      setCrawlStage('completed');
      setProgress(100);
      setIsCompleted(true);
      
      toast({
        title: "Сканирование завершено",
        description: `Найдено ${result.pageCount.toLocaleString('ru-RU')} страниц на сайте`,
      });
    } else {
      setError('Произошла ошибка при сканировании сайта');
      setCrawlStage('error');
      setIsCompleted(true);
      
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
    }
  };

  return {
    // State
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
    
    // State setters
    setDomain,
    setCrawler,
    setCrawlStage, // Adding this to expose it to consumers
    
    // Actions
    resetState,
    updateProgress,
    completeCrawl
  };
}
