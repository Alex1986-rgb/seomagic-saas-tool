
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

  const startScan = useCallback(async () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      setSitemap(null);
      setScannedUrls([]);
      setProgress(0);

      const scanner = new SimpleSitemapCreator({
        maxPages,
        maxDepth,
        includeStylesheet: true,
        requestDelay: 300
      });

      const progressCallback = (scanned: number, total: number, url: string) => {
        const percentage = total > 0 ? Math.min(Math.round((scanned / total) * 100), 100) : 0;
        setProgress(percentage);
        setCurrentUrl(url);
      };

      const urls = await scanner.crawl(url, progressCallback);
      setScannedUrls(urls);

      // Generate sitemap XML
      const sitemapXml = scanner.generateSitemap(urls);
      setSitemap(sitemapXml);

      setIsScanning(false);
      return { urls, sitemap: sitemapXml };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsScanning(false);
      return null;
    }
  }, [url, maxPages, maxDepth]);

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

  return {
    isScanning,
    progress,
    currentUrl,
    scannedUrls,
    sitemap,
    error,
    startScan,
    downloadSitemap
  };
}

export default useSimpleSitemapCreator;
