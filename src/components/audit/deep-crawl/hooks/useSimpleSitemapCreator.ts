
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

export const useSimpleSitemapCreator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const { toast } = useToast();
  
  const sitemapCreator = new SimpleSitemapCreator({
    maxPages: 1000,
    maxDepth: 5,
    includeStylesheet: true,
    timeout: 15000
  });

  const generateSitemap = async (url: string) => {
    if (!url) {
      toast({
        title: "URL не указан",
        description: "Пожалуйста, укажите URL сайта для создания карты сайта",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setUrls([]);
    setSitemap(null);
    
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Start crawling
      const discoveredUrls = await sitemapCreator.crawl(
        normalizedUrl,
        (scanned, total, currentUrl) => {
          setProgress(Math.floor((scanned / Math.max(total, 1)) * 100));
          setCurrentUrl(currentUrl);
        }
      );
      
      // Generate sitemap XML
      const sitemapXml = sitemapCreator.generateSitemapXml(discoveredUrls);
      
      setUrls(discoveredUrls);
      setSitemap(sitemapXml);
      
      toast({
        title: "Карта сайта создана",
        description: `Обнаружено ${discoveredUrls.length} URL на сайте ${url}`,
      });
      
      return {
        urls: discoveredUrls,
        pageCount: discoveredUrls.length
      };
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Ошибка создания карты сайта",
        description: "Произошла ошибка при сканировании сайта и создании карты",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  const downloadSitemap = () => {
    if (!urls.length) {
      toast({
        title: "Нет данных",
        description: "Сначала создайте карту сайта",
        variant: "destructive",
      });
      return;
    }
    
    try {
      sitemapCreator.downloadSitemapXml(urls);
      
      toast({
        title: "Файл скачан",
        description: "Файл sitemap.xml успешно скачан",
      });
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      toast({
        title: "Ошибка скачивания",
        description: "Произошла ошибка при скачивании файла",
        variant: "destructive",
      });
    }
  };

  const downloadCsv = () => {
    if (!urls.length) {
      toast({
        title: "Нет данных",
        description: "Сначала создайте карту сайта",
        variant: "destructive",
      });
      return;
    }
    
    try {
      sitemapCreator.downloadUrlsAsCsv(urls);
      
      toast({
        title: "Файл скачан",
        description: "Файл с URL успешно скачан",
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Ошибка скачивания",
        description: "Произошла ошибка при скачивании файла",
        variant: "destructive",
      });
    }
  };

  return {
    isGenerating,
    progress,
    currentUrl,
    urls,
    sitemap,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  };
};
