
import { useState, useCallback } from 'react';
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

interface UseSimpleSitemapCreatorProps {
  url: string;
  maxPages?: number;
  maxDepth?: number;
}

export function useSimpleSitemapCreator({ url, maxPages = 10000, maxDepth = 5 }: UseSimpleSitemapCreatorProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const startScan = useCallback(async () => {
    if (!url) {
      setError('URL is required');
      return null;
    }

    try {
      setIsScanning(true);
      setIsGenerating(true);
      setError(null);
      setSitemap(null);
      setScannedUrls([]);
      setUrls([]);
      setProgress(0);

      const scanner = new SimpleSitemapCreator({
        maxPages,
        maxDepth,
        includeStylesheet: true,
        requestDelay: 300,
        timeout: 15000
      });

      // Set base URL and enable debug mode
      if (typeof scanner.setBaseUrl === 'function') {
        scanner.setBaseUrl(url);
      }
      
      if (typeof scanner.enableDebugMode === 'function') {
        scanner.enableDebugMode(true);
      }
      
      if (typeof scanner.logCrawlSettings === 'function') {
        scanner.logCrawlSettings();
      }

      const progressCallback = (scanned: number, total: number, url: string) => {
        const percentage = total > 0 ? Math.min(Math.round((scanned / total) * 100), 100) : 0;
        setProgress(percentage);
        setCurrentUrl(url);
      };

      const crawledUrls = await scanner.crawl(url, progressCallback);
      setScannedUrls(crawledUrls);
      setUrls(crawledUrls);

      // Generate sitemap XML
      const sitemapXml = scanner.generateSitemap(crawledUrls);
      setSitemap(sitemapXml);

      setIsScanning(false);
      setIsGenerating(false);
      return { urls: crawledUrls, sitemap: sitemapXml };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsScanning(false);
      setIsGenerating(false);
      return null;
    }
  }, [url, maxPages, maxDepth]);

  const generateSitemap = useCallback(async () => {
    if (urls.length === 0) {
      await startScan();
    } else {
      try {
        setIsGenerating(true);
        const scanner = new SimpleSitemapCreator({
          includeStylesheet: true,
        });
        const sitemapXml = scanner.generateSitemap(urls);
        setSitemap(sitemapXml);
        setIsGenerating(false);
        return sitemapXml;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsGenerating(false);
        return null;
      }
    }
  }, [urls, startScan]);

  const downloadSitemap = useCallback(() => {
    if (!sitemap) return null;

    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${new Date().toISOString().slice(0, 10)}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  }, [sitemap]);

  const downloadCsv = useCallback(() => {
    if (!urls || urls.length === 0) return null;

    // Create CSV content
    let csvContent = "URL\n";
    urls.forEach(url => {
      csvContent += `${url}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urls-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  }, [urls]);

  return {
    isScanning,
    isGenerating,
    progress,
    currentUrl,
    scannedUrls,
    urls,
    sitemap,
    error,
    startScan,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  };
}

export default useSimpleSitemapCreator;
