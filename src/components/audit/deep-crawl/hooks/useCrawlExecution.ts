
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
      // Extract domain from URL for checking
      let domain = url;
      try {
        const urlObj = new URL(url);
        domain = urlObj.hostname;
      } catch (e) {
        console.warn("Could not parse URL:", e);
      }
      
      const { data, error } = await supabase
        .from('crawl_tasks')
        .select('*')
        .or(`url.eq.${url},url.ilike.%${domain}%`)
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
      // Try to extract domain for better identification
      let domain = "";
      try {
        const urlObj = new URL(url);
        domain = urlObj.hostname;
      } catch (e) {
        console.warn("Could not parse URL for domain:", e);
      }
      
      const { data, error } = await supabase
        .from('crawl_tasks')
        .insert({
          url,
          status,
          pages_scanned: pagesScanned,
          estimated_total_pages: estimatedTotalPages,
          task_id: crypto.randomUUID(),
          options: { domain }
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
    maxPages = 100000 // Увеличиваем лимит по умолчанию
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
      let urlObj;
      try {
        urlObj = new URL(normalizedUrl);
      } catch (error) {
        throw new Error('Некорректный URL: ' + normalizedUrl);
      }
      
      const domain = urlObj.hostname;
      console.log(`Инициализируем сканер для домена: ${domain} с URL: ${normalizedUrl}, максимум страниц: ${maxPages}`);
      
      // Check if this is Lovable domain - we should warn but still allow it
      const isLovableDomain = domain.includes('lovableproject.com') || domain.includes('lovable.app');
      if (isLovableDomain) {
        console.warn(`Внимание: Сканирование Lovable домена (${domain}). Это может быть не то, что вы хотите сканировать.`);
      }
      
      // Special case for large known sites like myarredo.ru
      let adjustedMaxPages = maxPages;
      if (domain.includes('myarredo.ru')) {
        adjustedMaxPages = 500000; // Allow more pages for large sites
        console.log(`Обнаружен крупный сайт (${domain}), увеличиваем лимит до ${adjustedMaxPages} страниц`);
      }
      
      // Determine if the site is a popular CMS or e-commerce platform
      const isCmsOrEcommerce = 
        domain.includes('wordpress.com') ||
        domain.includes('shopify.com') ||
        domain.includes('wix.com') ||
        domain.includes('opencart') ||
        domain.includes('magento') ||
        domain.includes('prestashop');
      
      // Optimized settings for different site types
      const timeout = isCmsOrEcommerce ? 20000 : 15000; // Longer timeout for CMS sites
      const retryCount = domain.includes('myarredo.ru') ? 4 : 3; // More retries for known problematic sites
            
      // Create new scanner with appropriate settings
      const crawler = new SimpleSitemapCreator({
        maxPages: adjustedMaxPages,
        maxDepth: 10, // Увеличиваем глубину поиска
        includeStylesheet: true,
        timeout: timeout,
        retryCount: retryCount,
        retryDelay: 1000,
        requestDelay: 500, // Add some delay between requests
        concurrentRequests: domain.includes('myarredo.ru') ? 3 : 5 // Fewer concurrent requests for problematic sites
      });
      
      // Set base URL explicitly
      crawler.setBaseUrl(normalizedUrl);
      console.log(`Base URL set to: ${normalizedUrl}, domain: ${domain}`);
      
      // Create crawl task in Supabase
      recordCrawlTask(normalizedUrl, 'pending');
      
      return { 
        crawler, 
        domain, 
        maxPages: adjustedMaxPages, 
        normalizedUrl 
      };
    } catch (error) {
      console.error('Error initializing crawler:', error);
      throw new Error('Не удалось инициализировать сканирование: ' + (error instanceof Error ? error.message : 'неизвестная ошибка'));
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
      const isLovableDomain = crawlerDomain.includes('lovableproject.com') || crawlerDomain.includes('lovable.app');
      const timeoutDuration = 300000; // 5 minutes timeout - increased for large sites
      
      // Configure crawler with additional logging if method exists
      console.log('Configuring crawler with extra debug settings');
      if (typeof crawler.enableDebugMode === 'function') {
        crawler.enableDebugMode(true);
      }
      if (typeof crawler.logCrawlSettings === 'function') {
        crawler.logCrawlSettings();
      }
      
      const crawlWithTimeout = Promise.race([
        crawler.crawl(startUrl, progressCallback),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout: сканирование заняло слишком много времени'));
          }, timeoutDuration);
        })
      ]);
      
      // Directly pass URL for scanning
      console.log('Starting the actual crawl process...');
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
