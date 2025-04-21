
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

export function useSimpleSitemapCreator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sitemap, setSitemap] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  
  const generateSitemap = async (url: string) => {
    if (!url) return;
    
    setIsGenerating(true);
    setProgress(0);
    setSitemap('');
    setUrls([]);
    
    try {
      const crawler = new SimpleSitemapCreator({
        maxPages: 10000,
        maxDepth: 5,
        includeStylesheet: true
      });
      
      // Track progress
      const progressCallback = (scanned: number, total: number, url: string) => {
        setProgress(Math.min(100, Math.round((scanned / total) * 100)));
        setCurrentUrl(url);
      };
      
      // Start crawling
      const foundUrls = await crawler.crawl(url, progressCallback);
      setUrls(foundUrls);
      
      // Generate sitemap XML
      const sitemapXml = crawler.generateSitemap(foundUrls);
      setSitemap(sitemapXml);
      
      return {
        urls: foundUrls,
        sitemap: sitemapXml
      };
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };
  
  const downloadSitemap = () => {
    if (!sitemap) return;
    
    const blob = new Blob([sitemap], { type: 'application/xml;charset=utf-8' });
    saveAs(blob, 'sitemap.xml');
  };
  
  const downloadCsv = () => {
    if (!urls.length) return;
    
    const csvContent = 'URL\n' + urls.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
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
}
