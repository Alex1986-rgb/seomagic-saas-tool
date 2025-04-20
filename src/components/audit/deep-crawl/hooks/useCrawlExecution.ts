
import { SiteScanner } from '@/services/audit/crawler/siteScanner';

export function useCrawlExecution() {
  const initializeCrawler = ({ 
    url, 
    onProgress 
  }: { 
    url: string; 
    onProgress: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
  }) => {
    // Normalize URL
    const baseUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Extract domain from URL
    let domain;
    try {
      domain = new URL(baseUrl).hostname;
    } catch (error) {
      domain = url;
    }
    
    // Set a reasonable limit for the maximum number of pages to scan
    const maxPages = 500000;
    
    // Create the scanner instance
    const scanner = new SiteScanner(baseUrl, {
      maxPages,
      maxDepth: 10,
      followExternalLinks: false,
      respectRobotsTxt: true,
      onProgress,
      timeout: 15000,
      crawlDelay: 100 // Be respectful to the server
    });
    
    return { 
      crawler: scanner, 
      domain, 
      maxPages 
    };
  };

  const executeCrawler = async (crawler: SiteScanner) => {
    if (!crawler || !crawler.scan) return null;
    
    try {
      return await crawler.scan();
    } catch (error) {
      console.error('Error executing crawler:', error);
      return null;
    }
  };

  return {
    initializeCrawler,
    executeCrawler
  };
}
