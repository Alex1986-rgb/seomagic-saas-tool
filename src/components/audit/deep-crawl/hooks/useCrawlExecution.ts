
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';
import { supabase } from "@/integrations/supabase/client";

interface CrawlerSettings {
  url: string;
  onProgress?: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
  maxPages?: number;
}

export function useCrawlExecution() {
  
  const checkExistingCrawlTasks = async (url: string) => {
    try {
      const { data, error } = await supabase
        .from('crawl_tasks')
        .select('*')
        .eq('url', url)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Error checking existing crawl tasks:', error);
        return null;
      }
      
      if (data && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error in checkExistingCrawlTasks:', error);
      return null;
    }
  };
  
  const recordCrawlTask = async (url: string, status: string, pagesScanned: number = 0, estimatedTotalPages: number = 0) => {
    try {
      const { data, error } = await supabase
        .from('crawl_tasks')
        .insert({
          url,
          status,
          pages_scanned: pagesScanned,
          estimated_total_pages: estimatedTotalPages,
          task_id: crypto.randomUUID()
        })
        .select();
        
      if (error) {
        console.error('Error recording crawl task:', error);
        return null;
      }
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error in recordCrawlTask:', error);
      return null;
    }
  };
  
  const updateCrawlTask = async (taskId: string, status: string, pagesScanned: number, estimatedTotalPages: number) => {
    try {
      const { error } = await supabase
        .from('crawl_tasks')
        .update({
          status,
          pages_scanned: pagesScanned,
          estimated_total_pages: estimatedTotalPages,
          progress: estimatedTotalPages > 0 ? Math.round((pagesScanned / estimatedTotalPages) * 100) : 0,
          updated_at: new Date().toISOString()
        })
        .eq('task_id', taskId);
        
      if (error) {
        console.error('Error updating crawl task:', error);
      }
    } catch (error) {
      console.error('Error in updateCrawlTask:', error);
    }
  };
  
  const initializeCrawler = ({
    url, 
    onProgress, 
    maxPages = 2000 // Уменьшаем максимальное количество страниц для стабильности
  }: CrawlerSettings) => {
    
    try {
      // Check if URL is empty
      if (!url || url.trim() === '') {
        throw new Error('URL не может быть пустым');
      }
      
      // Normalize URL, ensuring it starts with http:// or https://
      let normalizedUrl = url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      
      // Remove trailing slash if present
      if (normalizedUrl.endsWith('/')) {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }
      
      // Validate URL
      const urlObj = new URL(normalizedUrl);
      const domain = urlObj.hostname;
      
      console.log(`Инициализация сканера для ${normalizedUrl} с доменом ${domain} и лимитом ${maxPages} страниц`);
      
      // Create new scanner with optimized settings for better performance
      const crawler = new SimpleSitemapCreator({
        maxPages,
        maxDepth: 5,           // Уменьшаем глубину для более быстрого сканирования
        includeStylesheet: true,
        timeout: 15000,        // Уменьшаем таймаут до 15 секунд
        followRedirects: true,
        concurrentRequests: 2, // Уменьшаем количество одновременных запросов
        retryCount: 2,
        retryDelay: 500,
        forceTargetDomain: true // Принудительно сканируем только указанный домен
      });
      
      // Set base URL explicitly
      console.log(`Setting base URL to: ${normalizedUrl}`);
      crawler.setBaseUrl(normalizedUrl);
      
      // Create crawl task in Supabase
      recordCrawlTask(normalizedUrl, 'pending');
      
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
      
      // Verify we're using the correct URL
      const crawlerDomain = crawler.getDomain();
      const crawlerBaseUrl = crawler.getBaseUrl();
      
      console.log(`Запуск сканирования с URL: ${startUrl}`);
      console.log(`Текущий домен сканера: ${crawlerDomain}`);
      console.log(`Базовый URL сканера: ${crawlerBaseUrl}`);
      
      // Record task start
      const task = await recordCrawlTask(startUrl, 'in_progress');
      const taskId = task?.task_id;
      
      // Use progress callback for logging and updating Supabase
      const progressCallback = (scanned: number, total: number, currentUrl: string) => {
        console.log(`Progress: ${scanned}/${total} - ${currentUrl}`);
        
        if (taskId) {
          updateCrawlTask(taskId, 'in_progress', scanned, total);
        }
      };
      
      // Create Promise with timeout
      const crawlWithTimeout = Promise.race([
        crawler.crawl(startUrl, progressCallback),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout: сканирование заняло слишком много времени'));
          }, 90000); // 90 seconds timeout
        })
      ]);
      
      // Directly pass URL for scanning
      const urls = await crawlWithTimeout as string[];
      
      if (!urls || urls.length === 0) {
        console.log('Не удалось найти URLs на сайте, возвращаем пустой массив');
        
        if (taskId) {
          await updateCrawlTask(taskId, 'completed', 0, 0);
        }
        
        return {
          success: true,
          urls: [],
          pageCount: 0
        };
      }
      
      console.log(`Сканирование завершено, найдено ${urls.length} страниц`);
      
      if (taskId) {
        await updateCrawlTask(taskId, 'completed', urls.length, urls.length);
      }
      
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
    executeCrawler,
    checkExistingCrawlTasks
  };
}
