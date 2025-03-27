
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

export function useSimpleSitemapCreator() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlsScanned, setUrlsScanned] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sitemapCreator = new SimpleSitemapCreator({
    maxPages: 2000,
    maxDepth: 10,
    includeStylesheet: true
  });

  const scanWebsite = async (url: string) => {
    if (isScanning) return;
    
    setIsScanning(true);
    setProgress(0);
    setUrlsScanned(0);
    setCurrentUrl('');
    setDiscoveredUrls([]);
    setError(null);
    
    try {
      // Extract domain from URL
      let domainName;
      try {
        domainName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        setDomain(domainName);
      } catch (error) {
        setDomain(url);
      }
      
      // Start crawling
      const urls = await sitemapCreator.crawl(url, (scanned, total, currentUrl) => {
        setUrlsScanned(scanned);
        setCurrentUrl(currentUrl);
        setProgress(Math.floor((scanned / total) * 100));
      });
      
      setDiscoveredUrls(urls);
      
      toast({
        title: "Сканирование завершено",
        description: `Найдено ${urls.length.toLocaleString('ru-RU')} URL на сайте`,
      });
      
      return urls;
    } catch (error) {
      console.error('Ошибка сканирования:', error);
      setError('Произошла ошибка при сканировании сайта');
      
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const downloadSitemap = (format: 'xml' | 'html' | 'package' = 'xml') => {
    if (discoveredUrls.length === 0) {
      toast({
        title: "Нет данных для скачивания",
        description: "Сначала необходимо выполнить сканирование сайта",
        variant: "destructive",
      });
      return;
    }
    
    try {
      sitemapCreator.downloadSitemap(discoveredUrls, format);
      
      toast({
        title: "Карта сайта скачана",
        description: "Файл карты сайта успешно сохранен",
      });
    } catch (error) {
      console.error('Ошибка при скачивании карты сайта:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось сохранить карту сайта",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    sitemapCreator.stop();
    setIsScanning(false);
    
    toast({
      title: "Сканирование остановлено",
      description: "Процесс сканирования был остановлен",
    });
  };

  return {
    isScanning,
    progress,
    urlsScanned,
    currentUrl,
    discoveredUrls,
    domain,
    error,
    scanWebsite,
    downloadSitemap,
    stopScanning
  };
}
