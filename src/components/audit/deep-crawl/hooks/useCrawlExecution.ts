
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
    maxPages = 500000
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
      
      // Создаем новый сканер с расширенными параметрами и более короткими тайм-аутами
      const crawler = new SimpleSitemapCreator({
        maxPages,
        maxDepth: 10, // Уменьшаем максимальную глубину для более быстрого сканирования
        includeStylesheet: true,
        timeout: 30000, // Сокращаем тайм-аут до 30 секунд
        followRedirects: true,
        concurrentRequests: 5, // Уменьшаем количество параллельных запросов
        retryCount: 2,
        retryDelay: 500,
        forceTargetDomain: true // Принудительно используем только целевой домен
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
      if (!crawler) {
        console.error('Crawler is not initialized');
        throw new Error('Сканер не инициализирован');
      }
      
      if (!startUrl) {
        console.error('Start URL is empty');
        throw new Error('URL для сканирования не указан');
      }
      
      // Убеждаемся, что мы используем корректный URL
      const crawlerDomain = crawler.getDomain();
      const crawlerBaseUrl = crawler.getBaseUrl();
      
      console.log(`Запуск сканирования с URL: ${startUrl}`);
      console.log(`Текущий домен сканера: ${crawlerDomain}`);
      console.log(`Базовый URL сканера: ${crawlerBaseUrl}`);
      
      // Используем прогресс-коллбэк для логирования
      const progressCallback = (scanned: number, total: number, currentUrl: string) => {
        console.log(`Progress: ${scanned}/${total} - ${currentUrl}`);
      };
      
      // Создаем Promise с таймаутом
      const crawlWithTimeout = new Promise<string[]>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout: сканирование заняло слишком много времени'));
        }, 120000); // 2 минуты таймаут
        
        crawler.crawl(startUrl, progressCallback)
          .then(urls => {
            clearTimeout(timeoutId);
            resolve(urls);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });
      
      // Явно передаем URL для сканирования
      const urls = await crawlWithTimeout;
      
      if (!urls || urls.length === 0) {
        console.error('Не удалось найти URLs на сайте');
        return {
          success: true,
          urls: [],
          pageCount: 0
        };
      }
      
      console.log(`Сканирование завершено, найдено ${urls.length} страниц`);
      
      return {
        success: true,
        urls,
        pageCount: urls.length
      };
    } catch (error) {
      console.error('Error executing crawler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка сканирования',
        urls: [],
        pageCount: 0
      };
    }
  };
  
  return {
    initializeCrawler,
    executeCrawler
  };
}
