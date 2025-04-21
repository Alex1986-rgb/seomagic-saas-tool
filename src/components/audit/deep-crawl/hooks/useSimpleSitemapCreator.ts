
import { useState, useCallback } from 'react';
import { useCrawlProgress } from './useCrawlProgress';
import { useToast } from "@/hooks/use-toast";

interface SimpleSitemapCreatorProps {
  url: string;
}

export const useSimpleSitemapCreator = ({ url }: SimpleSitemapCreatorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    isLoading: isScanning,
    progress,
    currentUrl,
    domain,
    scannedUrls: urls,
    startCrawl,
    cancelCrawl,
    error: scanError
  } = useCrawlProgress(url);

  // Генерация карты сайта
  const generateSitemap = useCallback(() => {
    if (!urls || urls.length === 0) {
      toast({
        title: "Ошибка генерации",
        description: "Необходимо сначала выполнить сканирование сайта",
        variant: "destructive"
      });
      return null;
    }
    
    setIsGenerating(true);
    
    try {
      // Формирование XML-карты сайта
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
      const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      const urlsetClose = '</urlset>';
      
      let urlsXml = '';
      
      urls.forEach(pageUrl => {
        urlsXml += '  <url>\n';
        urlsXml += `    <loc>${pageUrl}</loc>\n`;
        urlsXml += '    <changefreq>monthly</changefreq>\n';
        urlsXml += '    <priority>0.8</priority>\n';
        urlsXml += '  </url>\n';
      });
      
      const sitemapContent = xmlHeader + urlsetOpen + urlsXml + urlsetClose;
      setSitemap(sitemapContent);
      
      toast({
        title: "Готово",
        description: "Карта сайта успешно сгенерирована",
      });
      
      return sitemapContent;
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать карту сайта",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [urls, toast]);

  // Скачивание карты сайта как XML-файл
  const downloadSitemap = useCallback(() => {
    const sitemapContent = sitemap || generateSitemap();
    if (!sitemapContent) {
      toast({
        title: "Ошибка",
        description: "Нет данных для скачивания",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const blob = new Blob([sitemapContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = `sitemap-${domain || 'site'}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Успешно",
        description: "Файл sitemap.xml скачан",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скачать файл",
        variant: "destructive"
      });
    }
  }, [sitemap, generateSitemap, domain, toast]);

  // Скачивание списка URL-адресов как CSV-файл
  const downloadCsv = useCallback(() => {
    if (!urls || urls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет данных для скачивания",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const csvContent = 'URL\n' + urls.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = `urls-${domain || 'site'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Успешно",
        description: "Файл urls.csv скачан",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скачать файл",
        variant: "destructive"
      });
    }
  }, [urls, domain, toast]);

  return {
    isScanning,
    isGenerating,
    progress,
    sitemap,
    urls,
    currentUrl,
    domain,
    error: scanError,
    startScan: startCrawl,
    cancelScan: cancelCrawl,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  };
};
