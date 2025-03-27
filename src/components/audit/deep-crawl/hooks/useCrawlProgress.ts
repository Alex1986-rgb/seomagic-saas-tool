
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DeepCrawler } from '@/services/audit/deepCrawler';
import { AdvancedCrawler } from '@/services/audit/crawler/advancedCrawler';
import { SitemapGenerator } from '@/services/audit/crawler/sitemapGenerator';
import { generateSitemap } from '@/services/audit/sitemap';

export function useCrawlProgress(url: string) {
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [estimatedPages, setEstimatedPages] = useState(0);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [crawlStage, setCrawlStage] = useState('initializing');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [crawler, setCrawler] = useState<AdvancedCrawler | null>(null);
  const { toast } = useToast();

  const startCrawling = async () => {
    // Reset state
    setProgress(0);
    setPagesScanned(0);
    setEstimatedPages(100000);
    setCurrentUrl('');
    setSitemap(null);
    setIsCompleted(false);
    setCrawlStage('initializing');
    setError(null);
    setScannedUrls([]);
    
    try {
      // Parse domain from the URL
      let domainName;
      try {
        domainName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        setDomain(domainName);
      } catch (error) {
        domainName = url;
        setDomain(url);
      }
      
      // Identify if it's myarredo or similar site for specialized scanning
      const isFurnitureSite = url.includes('myarredo') || url.includes('arredo');
      const maxPages = isFurnitureSite ? 100000 : 250000;
      
      setCrawlStage('starting');
      
      // Create and start the advanced crawler
      const newCrawler = new AdvancedCrawler(url, {
        maxPages,
        maxDepth: 50,
        followExternalLinks: false,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
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
        }
      });
      
      setCrawler(newCrawler);
      
      // Start the crawler
      const result = await newCrawler.startCrawling();
      setScannedUrls(result.urls);
      
      // Generate sitemap from results
      const generatedSitemap = generateSitemap(domainName, result.pageCount);
      setSitemap(generatedSitemap);
      
      // Complete the crawl
      setCrawlStage('completed');
      setProgress(100);
      setIsCompleted(true);
      
      toast({
        title: "Сканирование завершено",
        description: `Найдено ${result.pageCount.toLocaleString('ru-RU')} страниц на сайте`,
      });
      
      return result;
      
    } catch (error) {
      console.error('Error during deep crawl:', error);
      setError('Произошла ошибка при сканировании сайта');
      
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
      
      setCrawlStage('error');
      setIsCompleted(true);
      return null;
    }
  };

  const downloadSitemap = () => {
    if (sitemap) {
      const blob = new Blob([sitemap], { type: 'text/xml' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      let hostname = domain || 'site';
      
      a.download = `sitemap_${hostname}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Карта сайта скачана",
        description: "XML-файл карты сайта успешно сохранен",
      });
    }
  };
  
  // Download enhanced sitemap package
  const downloadAllData = async () => {
    if (!crawler || !domain) return;
    
    try {
      // Create entries for SitemapGenerator
      const entries = scannedUrls.map(url => ({
        url,
        priority: url === (url.startsWith('http') ? url : `https://${url}`) ? 1.0 : 0.7
      }));
      
      await SitemapGenerator.downloadSitemapPackage(entries, domain);
      
      toast({
        title: "Данные скачаны",
        description: "Архив с данными сканирования успешно сохранен",
      });
    } catch (error) {
      console.error('Error downloading data package:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать архив с данными",
        variant: "destructive",
      });
    }
  };

  // Download report with crawl summary
  const downloadReport = async () => {
    if (!crawler) return;
    
    try {
      const blob = await crawler.exportCrawlData();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `crawl-report-${domain}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      
      toast({
        title: "Отчет скачан",
        description: "Отчет о сканировании успешно сохранен",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать отчет о сканировании",
        variant: "destructive",
      });
    }
  };

  return {
    progress,
    currentUrl,
    pagesScanned,
    estimatedPages,
    sitemap,
    crawlStage,
    isCompleted,
    error,
    domain,
    scannedUrls,
    crawler,
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport
  };
}
