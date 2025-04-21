
import { useState, useCallback } from 'react';
import { useCrawlProgress } from './useCrawlProgress';

interface SimpleSitemapCreatorProps {
  url: string;
}

export const useSimpleSitemapCreator = ({ url }: SimpleSitemapCreatorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemap, setSitemap] = useState<string | null>(null);

  const {
    isLoading: isScanning,
    progress,
    currentUrl,
    scannedUrls: urls,
    startCrawl,
    cancelCrawl
  } = useCrawlProgress(url);

  // Генерация карты сайта
  const generateSitemap = useCallback(() => {
    if (!urls || urls.length === 0) return null;
    
    setIsGenerating(true);
    
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
    setIsGenerating(false);
    
    return sitemapContent;
  }, [urls]);

  // Скачивание карты сайта как XML-файл
  const downloadSitemap = useCallback(() => {
    const sitemapContent = sitemap || generateSitemap();
    if (!sitemapContent) return;
    
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sitemap, generateSitemap]);

  // Скачивание списка URL-адресов как CSV-файл
  const downloadCsv = useCallback(() => {
    if (!urls || urls.length === 0) return;
    
    const csvContent = 'URL\n' + urls.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'urls.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [urls]);

  return {
    isScanning,
    isGenerating,
    progress,
    sitemap,
    urls,
    currentUrl,
    startScan: startCrawl,
    cancelScan: cancelCrawl,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  };
};
