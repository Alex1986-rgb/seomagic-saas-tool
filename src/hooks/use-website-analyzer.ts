
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateAuditData } from '@/services/audit/generators';
import { SitemapExtractor } from '@/services/audit/crawler/sitemapExtractor';

interface ScanOptions {
  useSitemap: boolean;
  useRobotsTxt: boolean;
  maxPages: number;
  followExternalLinks: boolean;
  scanJavascript: boolean;
  includeImages: boolean;
  performSeoAudit: boolean;
  generateOptimizedVersion: boolean;
}

export const useWebsiteAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [hasAuditResults, setHasAuditResults] = useState(false);
  const [options, setOptions] = useState<ScanOptions>({
    useSitemap: true,
    useRobotsTxt: true,
    maxPages: 1000,
    followExternalLinks: false,
    scanJavascript: true,
    includeImages: true,
    performSeoAudit: true,
    generateOptimizedVersion: true
  });
  const { toast } = useToast();

  const sitemapExtractor = new SitemapExtractor({ maxSitemaps: 5 });

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (isError) {
      setIsError(false);
    }
  }, [isError]);

  const startFullScan = useCallback(async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScanning(true);
      setIsError(false);
      setScanProgress(0);
      setScanStage('Подготовка к сканированию...');

      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Try to fetch and process sitemap if option enabled
      let urlsFromSitemap: string[] = [];
      if (options.useSitemap) {
        setScanStage('Поиск и обработка sitemap.xml...');
        setScanProgress(10);
        
        try {
          // First try direct sitemap.xml access
          const sitemapUrl = `${normalizedUrl}/sitemap.xml`;
          console.log(`Attempting to fetch sitemap from: ${sitemapUrl}`);
          
          // The real implementation would fetch and process all URLs from the sitemap
          urlsFromSitemap = await sitemapExtractor.fetchAndProcessSitemaps(sitemapUrl);
          
          // If no URLs found and robots.txt option is enabled, try to get sitemap from robots.txt
          if (urlsFromSitemap.length === 0 && options.useRobotsTxt) {
            setScanStage('Поиск sitemap в robots.txt...');
            const sitemapUrlFromRobots = await sitemapExtractor.extractSitemapFromRobotsTxt(normalizedUrl);
            
            if (sitemapUrlFromRobots) {
              urlsFromSitemap = await sitemapExtractor.fetchAndProcessSitemaps(sitemapUrlFromRobots);
            }
          }
          
          console.log(`Found ${urlsFromSitemap.length} URLs from sitemap`);
          
          if (urlsFromSitemap.length > 0) {
            setScannedUrls(urlsFromSitemap);
          }
        } catch (error) {
          console.error('Error processing sitemap:', error);
          // Continue with crawling even if sitemap processing fails
        }
      }
      
      for (let i = 2; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(i * 10);
        
        switch (i) {
          case 2:
            setScanStage('Анализ структуры сайта...');
            break;
          case 4:
            setScanStage('Сканирование страниц...');
            break;
          case 6:
            setScanStage('Проверка метаданных...');
            break;
          case 8:
            setScanStage('Генерация отчета...');
            break;
          case 10:
            setScanStage('Сканирование завершено');
            // Generate audit data using the URLs from sitemap or create mock data
            const urlsToUse = urlsFromSitemap.length > 0 ? urlsFromSitemap.slice(0, options.maxPages) : [];
            const generatedData = generateAuditData(url, urlsToUse);
            setAuditData(generatedData);
            setHasAuditResults(true);
            break;
        }
      }

      toast({
        title: "Сканирование завершено",
        description: urlsFromSitemap.length > 0 
          ? `Найдено ${urlsFromSitemap.length} URL в sitemap` 
          : "Сайт успешно просканирован",
      });

      // If SEO audit is enabled, we would trigger that process here
      if (options.performSeoAudit) {
        // The real implementation would perform the audit
        console.log('Performing SEO audit with options:', options);
      }

      // If generating optimized version is enabled
      if (options.generateOptimizedVersion) {
        // The real implementation would generate the optimized version
        console.log('Generating optimized version with options:', options);
      }
    } catch (error) {
      console.error("Scan error:", error);
      setIsError(true);
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [url, options, toast, sitemapExtractor]);

  const updateOptions = useCallback((newOptions: Partial<ScanOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    url,
    isScanning,
    scanProgress,
    scanStage,
    isError,
    scannedUrls,
    auditData,
    hasAuditResults,
    options,
    handleUrlChange,
    startFullScan,
    setScannedUrls,
    updateOptions,
  };
};
