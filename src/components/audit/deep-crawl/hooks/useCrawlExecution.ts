
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
    maxPages = 500000 // Увеличиваем максимальное количество страниц по умолчанию
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
      
      // Удаляем конечный слэш, если он есть
      if (normalizedUrl.endsWith('/')) {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }
      
      // Проверяем валидность URL
      const urlObj = new URL(normalizedUrl);
      const domain = urlObj.hostname;
      
      console.log(`Инициализация сканера для ${normalizedUrl} с доменом ${domain} и лимитом ${maxPages} страниц`);
      
      // Создаем новый сканер с расширенными параметрами
      const crawler = new SimpleSitemapCreator({
        maxPages,
        maxDepth: 20, // Увеличиваем глубину сканирования еще больше
        includeStylesheet: true,
        timeout: 60000, // Увеличиваем таймаут до 60 секунд
        followRedirects: true,
        concurrentRequests: 20, // Увеличиваем количество параллельных запросов
        retryCount: 3,    // Повторные попытки при ошибках
        retryDelay: 500   // Меньшая задержка между попытками
      });
      
      // Устанавливаем базовый URL явно
      crawler.setBaseUrl(normalizedUrl);
      
      return { crawler, domain, maxPages, normalizedUrl };
    } catch (error) {
      console.error('Error initializing crawler:', error);
      throw new Error('Не удалось инициализировать сканирование: неверный URL');
    }
  };
  
  const executeCrawler = async (crawler: SimpleSitemapCreator, startUrl: string) => {
    try {
      // Выполняем сканирование с расширенными параметрами
      const progressCallback = (scanned: number, total: number, currentUrl: string) => {
        console.log(`Progress: ${scanned}/${total} - ${currentUrl}`);
      };
      
      console.log(`Запуск сканирования с URL: ${startUrl}`);
      
      // Передаем нормализованный URL в метод crawl
      const urls = await crawler.crawl(startUrl, progressCallback);
      
      if (!urls || urls.length === 0) {
        console.error('Не удалось найти URLs на сайте');
        return null;
      }
      
      console.log(`Сканирование завершено, найдено ${urls.length} страниц`);
      
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
