
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';

// Определяем типы для наших задач сканирования
export interface CrawlTask {
  id: string;
  url: string;
  domain: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  pages_scanned: number;
  estimated_total_pages: number;
  start_time: string;
  updated_at: string;
  urls?: string[];
  error?: string;
}

// Хранилище задач в памяти для демонстрации (в реальном приложении это будет в БД)
let crawlTasks: CrawlTask[] = [];

/**
 * Сервис для работы с API сканирования сайтов
 */
export const firecrawlService = {
  /**
   * Запуск нового сканирования сайта
   */
  startCrawl: async (url: string): Promise<CrawlTask> => {
    try {
      // Нормализуем URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Извлекаем домен
      let domain;
      try {
        domain = new URL(normalizedUrl).hostname;
      } catch (error) {
        domain = url;
      }
      
      // Создаем новую задачу
      const task: CrawlTask = {
        id: uuidv4(),
        url: normalizedUrl,
        domain,
        status: 'pending',
        progress: 0,
        pages_scanned: 0,
        estimated_total_pages: 0,
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Сохраняем в локальное хранилище
      crawlTasks.push(task);
      localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
      
      // Начинаем симуляцию сканирования
      setTimeout(() => {
        firecrawlService.simulateCrawlProgress(task.id);
      }, 1000);
      
      return task;
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw error;
    }
  },
  
  /**
   * Получение статуса задачи сканирования
   */
  getStatus: async (taskId: string): Promise<CrawlTask> => {
    try {
      // Ищем задачу в памяти
      const task = crawlTasks.find(t => t.id === taskId);
      
      if (!task) {
        // Пробуем получить из localStorage
        const storedTaskJson = localStorage.getItem(`crawl_task_${taskId}`);
        if (storedTaskJson) {
          return JSON.parse(storedTaskJson);
        }
        throw new Error('Task not found');
      }
      
      return task;
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  },
  
  /**
   * Загрузка карты сайта
   */
  downloadSitemap: async (taskId: string): Promise<void> => {
    try {
      // Получаем задачу
      const task = await firecrawlService.getStatus(taskId);
      
      if (task.status !== 'completed') {
        throw new Error('Task is not completed yet');
      }
      
      // Генерируем XML карты сайта
      const urls = task.urls || [];
      const xml = firecrawlService.generateSitemapXml(task.domain, urls);
      
      // Создаем и скачиваем файл
      const blob = new Blob([xml], { type: 'application/xml' });
      saveAs(blob, 'sitemap.xml');
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      throw error;
    }
  },
  
  /**
   * Загрузка PDF отчета
   */
  downloadReport: async (taskId: string, reportType: 'full' | 'errors' = 'full'): Promise<void> => {
    try {
      // Получаем задачу
      const task = await firecrawlService.getStatus(taskId);
      
      if (task.status !== 'completed') {
        throw new Error('Task is not completed yet');
      }
      
      // В реальном приложении здесь должна быть генерация PDF
      // Для демонстрации просто создаем текстовый файл
      const reportText = `SEO Report for ${task.url}\n\nScanned ${task.pages_scanned} pages\n\nGenerated on ${new Date().toLocaleString()}`;
      
      // Создаем и скачиваем файл
      const blob = new Blob([reportText], { type: 'text/plain' });
      saveAs(blob, `${reportType}-seo-report.txt`);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },
  
  /**
   * Симуляция прогресса сканирования для демонстрации
   */
  simulateCrawlProgress: (taskId: string) => {
    // Находим задачу
    const taskIndex = crawlTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = crawlTasks[taskIndex];
    if (!task) return;
    
    // Обновляем статус
    task.status = 'in_progress';
    task.progress = 0;
    task.estimated_total_pages = Math.floor(Math.random() * 500) + 100;
    
    // Сохраняем изменения
    crawlTasks[taskIndex] = task;
    localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
    
    // Симулируем процесс сканирования
    const interval = setInterval(() => {
      // Находим задачу снова (она могла быть обновлена)
      const updatedTaskIndex = crawlTasks.findIndex(t => t.id === taskId);
      if (updatedTaskIndex === -1) {
        clearInterval(interval);
        return;
      }
      
      const updatedTask = crawlTasks[updatedTaskIndex];
      if (!updatedTask) {
        clearInterval(interval);
        return;
      }
      
      // Увеличиваем прогресс
      const step = Math.floor(Math.random() * 10) + 1;
      updatedTask.pages_scanned += step;
      updatedTask.progress = Math.min(
        Math.floor((updatedTask.pages_scanned / updatedTask.estimated_total_pages) * 100),
        99
      );
      updatedTask.updated_at = new Date().toISOString();
      
      // Если достигли 100% или превысили ожидаемое число страниц
      if (updatedTask.pages_scanned >= updatedTask.estimated_total_pages) {
        updatedTask.status = 'completed';
        updatedTask.progress = 100;
        updatedTask.pages_scanned = updatedTask.estimated_total_pages;
        
        // Генерируем случайные URL для демонстрации
        updatedTask.urls = firecrawlService.generateSampleUrls(updatedTask.url, updatedTask.estimated_total_pages);
        
        clearInterval(interval);
      }
      
      // Сохраняем изменения
      crawlTasks[updatedTaskIndex] = updatedTask;
      localStorage.setItem(`crawl_task_${updatedTask.id}`, JSON.stringify(updatedTask));
    }, 1000);
  },
  
  /**
   * Генерация примерных URL для демонстрации
   */
  generateSampleUrls: (baseUrl: string, count: number): string[] => {
    const urls: string[] = [baseUrl];
    const sections = ['about', 'contact', 'services', 'blog', 'products', 'faq'];
    
    // Добавляем основные разделы
    for (const section of sections) {
      urls.push(`${baseUrl}/${section}`);
    }
    
    // Добавляем страницы блога
    for (let i = 0; i < Math.min(count / 2, 50); i++) {
      urls.push(`${baseUrl}/blog/post-${i + 1}`);
    }
    
    // Добавляем страницы продуктов
    for (let i = 0; i < Math.min(count / 2, 200); i++) {
      urls.push(`${baseUrl}/products/product-${i + 1}`);
    }
    
    // Добавляем случайные страницы
    while (urls.length < count) {
      const randomSection = sections[Math.floor(Math.random() * sections.length)];
      const randomPage = `page-${Math.floor(Math.random() * 1000)}`;
      urls.push(`${baseUrl}/${randomSection}/${randomPage}`);
    }
    
    return urls.slice(0, count);
  },
  
  /**
   * Генерация XML карты сайта
   */
  generateSitemapXml: (domain: string, urls: string[]): string => {
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const footer = '</urlset>';
    
    const urlsXml = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
    
    return `${header}${urlsXml}\n${footer}`;
  },
  
  /**
   * Получение идентификатора задачи из локального хранилища
   */
  getTaskIdForUrl: (url: string): string | null => {
    // Получаем все ключи из localStorage
    const keys = Object.keys(localStorage);
    
    // Ищем ключи, начинающиеся с "crawl_task_"
    const taskKeys = keys.filter(key => key.startsWith('crawl_task_'));
    
    // Проверяем каждую задачу
    for (const key of taskKeys) {
      try {
        const taskJson = localStorage.getItem(key);
        if (taskJson) {
          const task = JSON.parse(taskJson);
          if (task.url === url) {
            return task.id;
          }
        }
      } catch (e) {
        console.error('Error parsing task:', e);
      }
    }
    
    return null;
  }
};

// Экспортируем типы для использования в других файлах
export type { CrawlTask };
