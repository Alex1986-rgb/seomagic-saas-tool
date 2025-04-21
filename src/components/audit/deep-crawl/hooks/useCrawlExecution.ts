import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

interface UseCrawlExecutionProps {
  url: string;
  maxPages?: number;
  maxDepth?: number;
  initialStage?: 'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed';
}

export function useCrawlExecution({
  url,
  maxPages = 10000,
  maxDepth = 5,
  initialStage = 'idle'
}: UseCrawlExecutionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [crawlStage, setCrawlStage] = useState<
    'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed'
  >(initialStage);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const { toast } = useToast();

  // Create a reference to the crawler
  const crawlerRef = useRef<SimpleSitemapCreator | null>(null);

  const startCrawl = useCallback(async () => {
    setIsLoading(true);
    setIsComplete(false);
    setProgress(0);
    setCurrentUrl('');
    setPagesScanned(0);
    setTotalPages(0);
    setCrawlStage('starting');
    setScannedUrls([]);

    try {
      // Create the crawler with options including timeout
      const crawler = new SimpleSitemapCreator({
        maxPages,
        maxDepth,
        includeStylesheet: true,
        requestDelay: 300,
        concurrentRequests: 2,
        retryCount: 2,
        retryDelay: 1000,
        timeout: 20000
      });

      // Store the crawler in the ref
      crawlerRef.current = crawler;

      // Set the base URL
      crawler.setBaseUrl(url);

      // Log domain and base URL information
      const domain = crawler.getDomain();
      const baseUrl = crawler.getBaseUrl();
      console.log(`Crawling domain: ${domain}`);
      console.log(`Base URL: ${baseUrl}`);

      // Enable debug mode and log settings for debugging
      if (process.env.NODE_ENV === 'development') {
        crawler.enableDebugMode(true);
        crawler.logCrawlSettings();
      }

      const progressCallback = (scanned: number, total: number, url: string) => {
        const percentage = total > 0 ? Math.min(Math.round((scanned / total) * 100), 100) : 0;
        setProgress(percentage);
        setCurrentUrl(url);
        setPagesScanned(scanned);
        setTotalPages(total);
        setCrawlStage('crawling');
      };

      const crawledUrls = await crawler.crawl(url, progressCallback);
      setScannedUrls(crawledUrls);

      // Simulate analyzing stage
      setCrawlStage('analyzing');
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsLoading(false);
      setIsComplete(true);
      setCrawlStage('completed');
      setProgress(100);

      toast({
        title: "Сканирование завершено",
        description: `Обнаружено ${crawledUrls.length} URL на сайте`,
      });

      return { urls: crawledUrls, pageCount: crawledUrls.length };
    } catch (error: any) {
      console.error("Crawl failed:", error);
      setIsLoading(false);
      setIsComplete(false);
      setCrawlStage('failed');
      setProgress(0);

      toast({
        title: "Ошибка сканирования",
        description: error.message || "Не удалось завершить сканирование сайта",
        variant: "destructive",
      });

      return null;
    }
  }, [url, maxPages, maxDepth, toast]);

  const cancelCrawl = useCallback(() => {
    if (crawlerRef.current) {
      crawlerRef.current.cancel();
      setIsLoading(false);
      setIsComplete(false);
      setCrawlStage('idle');
      setProgress(0);
      toast({
        title: "Сканирование отменено",
        description: "Сканирование сайта было отменено пользователем.",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (initialStage === 'starting') {
      startCrawl();
    }

    return () => {
      if (crawlerRef.current) {
        crawlerRef.current.cancel();
      }
    };
  }, [initialStage, startCrawl]);

  return {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    crawlStage,
    scannedUrls,
    startCrawl,
    cancelCrawl,
  };
}
