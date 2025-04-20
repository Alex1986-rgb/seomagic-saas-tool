
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
      // Проверяем, не пустой ли URL
      if (!url || url.trim() === '') {
        throw new Error('URL не может быть пустым');
      }
      
      // Нормализуем URL, убедившись, что он начинается с http:// или https://
      let normalizedUrl = url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      
      // Проверяем валидность URL
      const urlObj = new URL(normalizedUrl);
      const domain = urlObj.hostname;
      
      console.log(`Инициализация сканера для ${normalizedUrl} с лимитом ${maxPages} страниц`);
      
      // Создаем новый сканер
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
      // Выполняем сканирование
      const progressCallback = (scanned: number, total: number, currentUrl: string) => {
        console.log(`Progress: ${scanned}/${total} - ${currentUrl}`);
      };
      
      // Явно передаем пустую строку для url, так как URL уже инициализирован в crawl
      const urls = await crawler.crawl('', progressCallback);
      
      if (!urls || urls.length === 0) {
        console.error('Не удалось найти URLs на сайте');
        return null;
      }
      
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
