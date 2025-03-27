
import { AdvancedCrawler } from '@/services/audit/crawler/advancedCrawler';

interface CrawlerConfig {
  url: string;
  onProgress: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
}

export function useCrawlExecution() {
  // Start crawler with parsed domain
  const initializeCrawler = (config: CrawlerConfig) => {
    const { url, onProgress } = config;
    
    // Parse domain from the URL
    let domainName;
    try {
      domainName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (error) {
      domainName = url;
    }
    
    // Identify if it's myarredo or similar site for specialized scanning
    const isFurnitureSite = url.includes('myarredo') || url.includes('arredo');
    const maxPages = isFurnitureSite ? 100000 : 250000;
    
    // Create and return the advanced crawler
    return {
      crawler: new AdvancedCrawler(url, {
        maxPages,
        maxDepth: 50,
        followExternalLinks: false,
        onProgress
      }),
      domain: domainName,
      maxPages
    };
  };

  // Execute the crawler
  const executeCrawler = async (crawler: AdvancedCrawler) => {
    if (!crawler) return null;
    return await crawler.startCrawling();
  };

  return {
    initializeCrawler,
    executeCrawler
  };
}
