
import { useState, useCallback, useEffect } from 'react';

type CrawlStage = 'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed';

export const useCrawlProgress = (baseUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [crawlStage, setCrawlStage] = useState<CrawlStage>('idle');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>('');

  // Extract domain from URL
  const extractDomain = useCallback(() => {
    try {
      const normalizedUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const urlObj = new URL(normalizedUrl);
      setDomain(urlObj.hostname);
    } catch (e) {
      setDomain(baseUrl);
    }
  }, [baseUrl]);

  // Initialize domain on mount
  useEffect(() => {
    extractDomain();
  }, [extractDomain]);

  // Инициализация веб-краулера
  const initializeCrawler = useCallback(() => {
    setIsLoading(true);
    setCrawlStage('starting');
    setProgress(0);
    setPagesScanned(0);
    setScannedUrls([]);
    setError(null);
    
    return {
      baseUrl,
      maxPages: 1000,
      timeout: 30000,
      userAgent: 'Lovable SEO Audit Tool',
      ignoreRobotsTxt: false
    };
  }, [baseUrl]);

  // Выполнение сканирования
  const executeCrawler = useCallback((config: any) => {
    setCrawlStage('crawling');
    
    // Имитация процесса сканирования
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCrawlStage('analyzing');
          return 100;
        }
        
        const newProgress = prev + Math.random() * 5;
        const newPagesScanned = Math.floor(newProgress * 10);
        
        setPagesScanned(newPagesScanned);
        setTotalPages(1000);
        
        // Генерация случайных URL-адресов
        if (newPagesScanned > scannedUrls.length) {
          const newUrls = [];
          for (let i = scannedUrls.length; i < newPagesScanned; i++) {
            const randomPath = Math.random().toString(36).substring(2, 8);
            newUrls.push(`${baseUrl}/${randomPath}`);
          }
          setScannedUrls(prev => [...prev, ...newUrls]);
          setCurrentUrl(newUrls[newUrls.length - 1]);
        }
        
        return newProgress;
      });
    }, 200);
    
    // Завершение процесса сканирования через определенное время
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setCrawlStage('completed');
      setIsLoading(false);
      setIsComplete(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [baseUrl, scannedUrls]);

  // Запуск сканирования
  const startCrawl = useCallback(async () => {
    try {
      // Extract domain when starting a crawl
      extractDomain();
      
      const config = initializeCrawler();
      const cleanup = executeCrawler(config);
      
      return new Promise<{urls: string[]}>((resolve) => {
        const checkComplete = setInterval(() => {
          if (crawlStage === 'completed') {
            clearInterval(checkComplete);
            resolve({urls: scannedUrls});
          }
        }, 500);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setCrawlStage('failed');
      setIsLoading(false);
      throw err;
    }
  }, [initializeCrawler, executeCrawler, crawlStage, scannedUrls, extractDomain]);

  // Отмена сканирования
  const cancelCrawl = useCallback(() => {
    setIsLoading(false);
    setCrawlStage('idle');
    setProgress(0);
  }, []);

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
    initializeCrawler,
    executeCrawler,
    error,
    domain,
    errorMsg: error // alias for compatibility with existing code
  };
};
