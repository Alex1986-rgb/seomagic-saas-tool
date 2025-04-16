
/**
 * Сервис для масштабного сканирования сайтов через Firecrawl API
 */
import { supabase } from '@/integrations/supabase/client';

// Use primitive types instead of complex JSON references to avoid type recursion
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

// Define simpler types to avoid deep recursion
interface AnalyticsData {
  id?: string;
  project_id?: string | null;
  url: string;
  score: number;
  pages_scanned?: number | null;
  positions_tracked?: number | null;
  active_users?: number | null;
  trends?: JsonValue | null;
  distribution?: JsonValue | null;
  created_at?: string | null;
}

// Make task data structure simple with no nesting
interface CrawlTaskData {
  id?: string;
  task_id: string;
  project_id?: string | null;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number | null;
  pages_scanned?: number | null;
  estimated_total_pages?: number | null;
  options?: JsonValue | null;
  start_time?: string | null;
  updated_at?: string | null;
}

// Keep result data structure simple with primitive types and JSON
interface CrawlResultData {
  id?: string;
  task_id: string;
  project_id?: string | null;
  urls: string[];
  page_count: number;
  created_at?: string;
  page_types?: JsonValue | null;
  depth_data?: JsonValue | null;
  broken_links?: JsonValue | null;
  duplicate_pages?: JsonValue | null;
}

// Настройки для масштабного сканирования
export interface MassiveCrawlOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  crawlSpeed: 'slow' | 'medium' | 'fast';
  includeMedia: boolean;
  userAgent?: string;
  respectRobotsTxt: boolean;
}

export interface CrawlStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  pagesScanned: number;
  estimatedTotalPages: number;
  startTime: string;
  lastUpdated: string;
}

export const firecrawlService = {
  /**
   * Запуск масштабного сканирования сайта
   */
  async startMassiveCrawl(
    projectId: string, 
    url: string, 
    options: Partial<MassiveCrawlOptions> = {}
  ): Promise<{ taskId: string; success: boolean }> {
    try {
      // Получаем API-ключ из переменных окружения или конфигурации
      const apiKey = await this.getApiKey();
      
      if (!apiKey) {
        console.error('API ключ не найден. Пожалуйста, настройте Firecrawl API в конфигурации.');
        throw new Error('API ключ не настроен');
      }
      
      // Настройки по умолчанию
      const defaultOptions: MassiveCrawlOptions = {
        maxPages: 100000,
        maxDepth: 50,
        followExternalLinks: false,
        crawlSpeed: 'medium',
        includeMedia: false,
        respectRobotsTxt: true
      };
      
      // Объединяем настройки по умолчанию с пользовательскими
      const crawlOptions = { ...defaultOptions, ...options };
      
      console.log(`Запуск масштабного сканирования для ${url} с макс. кол-вом страниц ${crawlOptions.maxPages}`);
      
      // Запрос к Firecrawl API (в реальном приложении здесь будет настоящий запрос)
      // В демо-версии создаем фиктивный taskId
      const taskId = `task_${Date.now()}`;
      
      // Сохраняем информацию о задаче в базу данных
      const insertData: CrawlTaskData = {
        project_id: projectId,
        url,
        task_id: taskId,
        status: 'pending',
        progress: 0,
        pages_scanned: 0,
        estimated_total_pages: 0,
        options: crawlOptions,
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await supabase.from('crawl_tasks').insert(insertData);
      
      // Запускаем периодическую проверку статуса
      this.startStatusPolling(taskId, projectId);
      
      return { taskId, success: true };
    } catch (error) {
      console.error('Ошибка запуска сканирования:', error);
      throw error;
    }
  },
  
  /**
   * Проверка статуса сканирования
   */
  async checkCrawlStatus(taskId: string): Promise<CrawlStatus> {
    try {
      // Получаем статус из базы данных
      const { data: taskData, error } = await supabase
        .from('crawl_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();
        
      if (error || !taskData) {
        throw new Error(`Задача ${taskId} не найдена`);
      }
      
      return {
        taskId,
        status: taskData.status as 'pending' | 'processing' | 'completed' | 'failed',
        progress: taskData.progress || 0,
        pagesScanned: taskData.pages_scanned || 0,
        estimatedTotalPages: taskData.estimated_total_pages || 0,
        startTime: taskData.start_time || new Date().toISOString(),
        lastUpdated: taskData.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
      throw error;
    }
  },
  
  /**
   * Получение результатов сканирования
   */
  async getCrawlResults(taskId: string): Promise<any> {
    try {
      // Проверяем статус задачи
      const status = await this.checkCrawlStatus(taskId);
      
      if (status.status !== 'completed') {
        throw new Error(`Задача ${taskId} еще не завершена. Текущий статус: ${status.status}`);
      }
      
      // Получаем результаты из базы данных
      const { data: resultsData, error } = await supabase
        .from('crawl_results')
        .select('*')
        .eq('task_id', taskId)
        .single();
        
      if (error || !resultsData) {
        throw new Error(`Результаты для задачи ${taskId} не найдены`);
      }
      
      return resultsData;
    } catch (error) {
      console.error('Ошибка получения результатов:', error);
      throw error;
    }
  },
  
  /**
   * Экспорт результатов сканирования в различных форматах
   */
  async exportCrawlResults(
    taskId: string, 
    format: 'json' | 'csv' | 'xml' | 'sitemap' = 'json'
  ): Promise<Blob> {
    try {
      // Получаем результаты сканирования
      const results = await this.getCrawlResults(taskId);
      
      switch (format) {
        case 'json':
          return new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        case 'sitemap':
          // Генерируем sitemap.xml из результатов
          let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
          sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
          
          if (results.urls && Array.isArray(results.urls)) {
            for (const url of results.urls) {
              sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
            }
          }
          
          sitemap += '</urlset>';
          return new Blob([sitemap], { type: 'application/xml' });
        default:
          throw new Error(`Формат ${format} не поддерживается`);
      }
    } catch (error) {
      console.error('Ошибка экспорта результатов:', error);
      throw error;
    }
  },
  
  /**
   * Получение API ключа
   */
  async getApiKey(): Promise<string | null> {
    // В реальном приложении ключ должен храниться в защищенном хранилище
    // Например, в переменных окружения или в Supabase Edge Function Secrets
    
    try {
      // Для примера, пытаемся получить ключ из local storage
      // В реальном приложении лучше использовать безопасные методы хранения
      const apiKey = localStorage.getItem('firecrawl_api_key');
      return apiKey;
    } catch (error) {
      console.error('Ошибка получения API ключа:', error);
      return null;
    }
  },
  
  /**
   * Установка API ключа
   */
  async setApiKey(apiKey: string): Promise<boolean> {
    try {
      // Сохраняем ключ в local storage (только для демонстрации)
      localStorage.setItem('firecrawl_api_key', apiKey);
      return true;
    } catch (error) {
      console.error('Ошибка установки API ключа:', error);
      return false;
    }
  },
  
  /**
   * Запуск периодической проверки статуса задачи
   */
  startStatusPolling(taskId: string, projectId: string) {
    // Эмуляция обновления статуса для демонстрации
    // В реальном приложении здесь будет настоящий запрос к API
    let progress = 0;
    let pagesScanned = 0;
    const interval = setInterval(async () => {
      try {
        progress += Math.random() * 10;
        pagesScanned += Math.floor(Math.random() * 5000);
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Create update data
          const taskUpdateData = {
            status: 'completed' as const,
            progress: 100,
            pages_scanned: pagesScanned,
            estimated_total_pages: pagesScanned,
            updated_at: new Date().toISOString()
          };
          
          // Обновляем статус задачи на "completed"
          await supabase.from('crawl_tasks').update(taskUpdateData).eq('task_id', taskId);
          
          // Генерируем фиктивные результаты
          const mockUrls = Array.from({ length: 100 }, (_, i) => 
            `https://example.com/page-${i + 1}`
          );
          
          // Сохраняем результаты в базу данных
          const crawlResultData: CrawlResultData = {
            task_id: taskId,
            project_id: projectId,
            urls: mockUrls,
            page_count: pagesScanned,
            created_at: new Date().toISOString()
          };
          
          await supabase.from('crawl_results').insert(crawlResultData);
          
          // Обновляем аналитику проекта
          const websiteUrl = await this.getUrlFromTaskId(taskId);
          if (websiteUrl) {
            const analyticsData: AnalyticsData = {
              project_id: projectId,
              url: websiteUrl,
              score: Math.floor(Math.random() * 30) + 70,
              pages_scanned: pagesScanned,
              positions_tracked: Math.floor(pagesScanned * 0.8),
              active_users: Math.floor(Math.random() * 1000) + 500,
              trends: this.generateMockTrends(),
              distribution: this.generateMockDistribution(pagesScanned)
            };
            
            await supabase.from('analytics').insert(analyticsData);
          }
          
          console.log(`Задача ${taskId} успешно завершена`);
        } else {
          // Create update data
          const taskUpdateData = {
            status: 'processing' as const,
            progress: Math.floor(progress),
            pages_scanned: pagesScanned,
            estimated_total_pages: Math.floor(pagesScanned * 1.5),
            updated_at: new Date().toISOString()
          };
          
          // Обновляем статус задачи
          await supabase.from('crawl_tasks').update(taskUpdateData).eq('task_id', taskId);
        }
      } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        clearInterval(interval);
      }
    }, 3000);
  },
  
  /**
   * Получить URL сайта из task_id
   */
  async getUrlFromTaskId(taskId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('crawl_tasks')
        .select('url')
        .eq('task_id', taskId)
        .single();
        
      if (error || !data) {
        return null;
      }
      
      return data.url;
    } catch (error) {
      console.error('Ошибка получения URL из taskId:', error);
      return null;
    }
  },
  
  /**
   * Генерация фиктивных данных для трендов (для демонстрации)
   */
  generateMockTrends() {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    let currentValue = Math.floor(Math.random() * 20) + 60;
    
    return months.map(month => {
      const change = Math.floor(Math.random() * 7) - 2;
      currentValue = Math.min(Math.max(currentValue + change, 30), 100);
      
      return {
        name: month,
        value: currentValue
      };
    });
  },
  
  /**
   * Генерация фиктивных данных для распределения (для демонстрации)
   */
  generateMockDistribution(totalPages: number) {
    return [
      { category: 'Отлично', count: Math.floor(totalPages * 0.4) },
      { category: 'Хорошо', count: Math.floor(totalPages * 0.3) },
      { category: 'Средне', count: Math.floor(totalPages * 0.2) },
      { category: 'Плохо', count: Math.floor(totalPages * 0.1) }
    ];
  }
};
