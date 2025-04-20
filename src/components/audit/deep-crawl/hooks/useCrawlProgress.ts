
import { useState } from 'react';
import { useCrawlState } from './useCrawlState';
import { useCrawlExecution } from './useCrawlExecution';
import { useSitemapExport } from '../utils/exportUtils';
import { useToast } from "@/hooks/use-toast";

export function useCrawlProgress(url: string) {
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedSiteBlob, setOptimizedSiteBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  
  // Use the smaller, focused hooks
  const crawlState = useCrawlState(url);
  const crawlExecution = useCrawlExecution();
  const sitemapExport = useSitemapExport();

  const startCrawling = async () => {
    // Reset state
    crawlState.resetState();
    
    try {
      // Initialize crawler
      const { crawler, domain, maxPages } = crawlExecution.initializeCrawler({
        url,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          crawlState.updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
        }
      });
      
      crawlState.setDomain(domain);
      crawlState.setCrawler(crawler);
      
      // Set stage to starting
      crawlState.setCrawlStage('starting');
      
      // Execute crawler
      const result = await crawlExecution.executeCrawler(crawler);
      
      if (result) {
        // Generate sitemap from results
        const generatedSitemap = sitemapExport.generateSitemapFile(domain, result.urls.length);
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
        crawlState.completeCrawl(false);
        return null;
      }
      
    } catch (error) {
      console.error('Error during deep crawl:', error);
      crawlState.completeCrawl(false);
      return null;
    }
  };

  const downloadSitemap = () => {
    sitemapExport.downloadSitemap(sitemap, crawlState.domain);
  };
  
  const downloadAllData = async () => {
    sitemapExport.downloadAllData(crawlState.scannedUrls, crawlState.domain);
  };
  
  const downloadReport = async () => {
    sitemapExport.downloadReport(crawlState.crawler, crawlState.domain);
  };
  
  const optimizeSite = async (prompt: string) => {
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
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport,
    optimizeSite,
    downloadOptimizedSite
  };
}
