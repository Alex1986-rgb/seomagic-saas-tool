import { useState } from 'react';
import { useCrawlState } from './useCrawlState';
import { useCrawlExecution } from './useCrawlExecution';
import { useSitemapExport } from '../utils/exportUtils';
import { useToast } from "@/hooks/use-toast";

export function useCrawlProgress(url: string) {
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedSiteBlob, setOptimizedSiteBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use the smaller, focused hooks
  const crawlState = useCrawlState(url);
  const crawlExecution = useCrawlExecution();
  const sitemapExport = useSitemapExport();

  const startCrawling = async () => {
    // Reset state
    crawlState.resetState();
    setError(null);
    
    if (!url) {
      setError("URL не может быть пустым");
      crawlState.completeCrawl(false);
      return null;
    }
    
    try {
      console.log(`Starting crawl for URL: ${url}`);
      
      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Initialize crawler
      const { crawler, domain, maxPages } = crawlExecution.initializeCrawler({
        url: normalizedUrl,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          crawlState.updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
        }
      });
      
      crawlState.setDomain(domain);
      crawlState.setCrawler(crawler);
      
      // Set stage to starting
      crawlState.setCrawlStage('starting');
      
      // Execute crawler
      console.log('Executing crawler...');
      const result = await crawlExecution.executeCrawler(crawler);
      
      if (result && result.urls && result.urls.length > 0) {
        console.log(`Crawl completed with ${result.urls.length} URLs`);
        
        // Generate sitemap from results
        const generatedSitemap = sitemapExport.generateSitemapFile(domain, result.urls);
        setSitemap(generatedSitemap);
        
        // Complete the crawl with the correct data structure
        crawlState.completeCrawl(true, {
          urls: result.urls,
          pageCount: result.pageCount || result.urls.length // Fallback to urls length if pageCount doesn't exist
        });
        
        return {
          urls: result.urls,
          pageCount: result.pageCount || result.urls.length
        };
      }
      else {
        console.error('Crawler execution completed but no URLs were found');
        setError("Не удалось найти страницы на сайте");
        crawlState.completeCrawl(false);
        return null;
      }
      
    } catch (error) {
      console.error('Error during deep crawl:', error);
      setError(error instanceof Error ? error.message : "Неизвестная ошибка при сканировании");
      crawlState.completeCrawl(false);
      return null;
    }
  };

  const downloadSitemap = () => {
    if (!sitemap && crawlState.scannedUrls.length > 0) {
      // Generate sitemap if it doesn't exist yet
      const generatedSitemap = sitemapExport.generateSitemapFile(
        crawlState.domain, 
        crawlState.scannedUrls
      );
      setSitemap(generatedSitemap);
      sitemapExport.downloadSitemap(generatedSitemap, crawlState.domain);
    } else if (sitemap) {
      sitemapExport.downloadSitemap(sitemap, crawlState.domain);
    } else {
      toast({
        title: "Ошибка",
        description: "Нет данных для создания карты сайта",
        variant: "destructive"
      });
    }
  };
  
  const downloadAllData = async () => {
    if (crawlState.scannedUrls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет данных для скачивания",
        variant: "destructive"
      });
      return;
    }
    
    sitemapExport.downloadAllData(crawlState.scannedUrls, crawlState.domain);
  };
  
  const downloadReport = async () => {
    if (!crawlState.crawler || crawlState.scannedUrls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет данных для создания отчета",
        variant: "destructive"
      });
      return;
    }
    
    sitemapExport.downloadReport(crawlState.crawler, crawlState.domain);
  };
  
  const optimizeSite = async (prompt: string) => {
    if (crawlState.scannedUrls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет данных для оптимизации",
        variant: "destructive"
      });
      return;
    }
    
    setIsOptimizing(true);
    toast({
      title: "Запуск оптимизации",
      description: "Начинаем процесс оптимизации сайта с использованием ИИ",
    });
    
    try {
      // Wait to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create an optimized version of the site
      const sampleContent = generateSampleContent(crawlState.domain, crawlState.scannedUrls, prompt);
      
      // Generate a ZIP file with the optimized site
      const zip = await sitemapExport.createOptimizedSiteZip(crawlState.domain, sampleContent, prompt);
      setOptimizedSiteBlob(zip);
      
      toast({
        title: "Оптимизация завершена",
        description: "Сайт был успешно оптимизирован согласно вашим требованиям",
      });
    } catch (error) {
      console.error('Error optimizing site:', error);
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось выполнить оптимизацию сайта",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const downloadOptimizedSite = () => {
    if (optimizedSiteBlob) {
      sitemapExport.downloadOptimizedSite(optimizedSiteBlob, crawlState.domain);
      toast({
        title: "Сайт скачан",
        description: "Оптимизированная версия сайта успешно скачана",
      });
    } else {
      toast({
        title: "Сайт не готов",
        description: "Сначала необходимо запустить оптимизацию",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate sample content for demonstration
  const generateSampleContent = (domain: string, urls: string[], prompt: string) => {
    // This function would normally analyze the content and optimize it
    // For the demo, we're generating sample content
    const sampleContent = urls.slice(0, Math.min(urls.length, 30)).map(url => {
      const isHomepage = url.endsWith(domain) || url.endsWith(domain + '/');
      const pathParts = url.replace(/https?:\/\//, '').split('/').filter(Boolean);
      const title = isHomepage 
        ? `${domain} - Главная страница` 
        : `${pathParts[pathParts.length - 1].replace(/-/g, ' ')} | ${domain}`;
      
      return {
        url,
        title,
        content: `<p>Это оптимизированный контент для страницы ${url}.</p><p>Оптимизировано с помощью ИИ на основе промпта: "${prompt}"</p>`,
        metaTags: {
          description: `Оптимизированное мета-описание для ${url}. Включает ключевые слова и привлекательное описание для поисковых систем.`,
          keywords: `ключевые, слова, для, ${pathParts[pathParts.length - 1] || domain}, оптимизированные`
        }
      };
    });
    
    return sampleContent;
  };

  return {
    ...crawlState,
    sitemap,
    isOptimizing,
    error,
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport,
    optimizeSite,
    downloadOptimizedSite
  };
}
