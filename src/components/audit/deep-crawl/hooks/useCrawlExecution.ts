
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';

interface CrawlerSettings {
  url: string;
  onProgress?: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
  maxPages?: number;
}

export function useCrawlExecution() {
  
  const initializeCrawler = ({
    url, 
    onProgress, 
    maxPages = 500
  }: CrawlerSettings) => {
    
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      const domain = urlObj.hostname;
      
      // Create a new crawler
      const crawler = new SimpleSitemapCreator({
        maxPages,
        maxDepth: 5,
        includeStylesheet: true,
        timeout: 30000,
        followRedirects: true
      });
      
      return { crawler, domain, maxPages };
    } catch (error) {
      console.error('Error initializing crawler:', error);
      throw new Error('Не удалось инициализировать сканирование: неверный URL');
    }
  };
  
  const executeCrawler = async (crawler: SimpleSitemapCreator) => {
    try {
      // Execute the crawler
      const progressCallback = (scanned: number, total: number, currentUrl: string) => {
        console.log(`Progress: ${scanned}/${total} - ${currentUrl}`);
      };
      
      const urls = await crawler.crawl('', progressCallback);
      
      return {
        success: true,
        urls,
        pageCount: urls.length
      };
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
