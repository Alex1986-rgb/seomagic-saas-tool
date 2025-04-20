
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

export const useSimpleSitemapCreator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  
  const sitemapCreator = new SimpleSitemapCreator({
    maxPages: 500000,
    maxDepth: 10,
    includeStylesheet: true
  });
  
  const generateSitemap = async (url: string) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    setSitemap(null);
    setUrls([]);
    setCurrentUrl('');
    
    try {
      const scannedUrls = await sitemapCreator.crawl(
        url,
        (scanned, total, currentUrl) => {
          setProgress(Math.floor((scanned / total) * 100));
          setCurrentUrl(currentUrl);
        }
      );
      
      const xml = sitemapCreator.generateSitemapXml(scannedUrls);
      
      setSitemap(xml);
      setUrls(scannedUrls);
      
      // Store the URLs for future use
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      localStorage.setItem(`sitemap_urls_${domain}`, JSON.stringify(scannedUrls));
      
      return scannedUrls;
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadSitemap = () => {
    if (!sitemap) return;
    
    const blob = new Blob([sitemap], { type: 'application/xml' });
    saveAs(blob, 'sitemap.xml');
  };
  
  const downloadCsv = () => {
    if (urls.length === 0) return;
    
    const csvContent = 'URL\n' + urls.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'urls.csv');
  };
  
  return {
    isGenerating,
    progress,
    sitemap,
    urls,
    currentUrl,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  };
};
