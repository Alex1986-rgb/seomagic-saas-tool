
import { ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';
import { toast } from "@/hooks/use-toast";

interface PageStatistics {
  totalPages: number;
  subpages: Record<string, number>;
  levels: Record<number, number>;
}

/**
 * Генерирует карту сайта XML на основе просканированных URL
 */
export const generateSitemap = (domain: string, pageCount: number): string => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Добавляем главную страницу
  sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Страницы первого уровня
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  for (const type of pageTypes) {
    sitemap += `  <url>\n    <loc>${baseUrl}/${type}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  
  // Добавляем примеры подстраниц
  const maxSamplePages = Math.min(50, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    sitemap += `  <url>\n    <loc>${baseUrl}/${pageType}/${slugPart}</loc>\n    <priority>0.6</priority>\n  </url>\n`;
  }
  
  sitemap += '</urlset>';
  return sitemap;
};

/**
 * Сканирует сайт с заданными параметрами
 */
export const scanWebsite = async (
  url: string, 
  options: ScanOptions
): Promise<{ 
  success: boolean; 
  pageStats: PageStatistics; 
  sitemap?: string;
}> => {
  // Симуляция сканирования сайта
  const { maxPages, maxDepth, onProgress } = options;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
    // Форматируем URL с протоколом, если отсутствует
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    // Поддерживаем сканирование до 250 000 страниц
    const pagesToScan = Math.min(250000, maxPages);
    let totalScannedPages = 0;
    
    // Инициализируем статистику страниц
    const pageStats: PageStatistics = {
      totalPages: 0,
      subpages: {},
      levels: {}
    };
    
    // Типы страниц для статистической классификации
    const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
    
    // Распределение по типам страниц (более реалистичное для крупного сайта)
    const pageDistribution: Record<string, number> = {
      'product': 0.65, // 65% продуктовых страниц
      'category': 0.15, // 15% категорий
      'blog': 0.12,     // 12% блог
      'contact': 0.01,
      'about': 0.01,
      'faq': 0.02,
      'terms': 0.01,
      'privacy': 0.01
    };
    
    // Сначала быстро отображаем прогресс для первых 100 страниц
    const initialBatchSize = Math.min(100, pagesToScan);
    for (let i = 1; i <= initialBatchSize; i++) {
      // Генерируем случайный тип страницы с учетом распределения
      let randomPageType = 'product';
      const rand = Math.random();
      let cumulative = 0;
      
      for (const [type, prob] of Object.entries(pageDistribution)) {
        cumulative += prob;
        if (rand < cumulative) {
          randomPageType = type;
          break;
        }
      }
      
      // Отслеживаем статистику по типам страниц
      if (!pageStats.subpages[randomPageType]) {
        pageStats.subpages[randomPageType] = 0;
      }
      pageStats.subpages[randomPageType]++;
      
      // Симулируем уровни глубины страниц (1-3)
      const pageDepth = Math.min(Math.floor(Math.random() * 3) + 1, maxDepth);
      if (!pageStats.levels[pageDepth]) {
        pageStats.levels[pageDepth] = 0;
      }
      pageStats.levels[pageDepth]++;
      
      // Генерируем URL с соответствующей глубиной
      let currentUrl = `${formattedUrl}/${randomPageType}`;
      for (let d = 1; d < pageDepth; d++) {
        currentUrl += `/${faker.lorem.slug(2)}`;
      }
      
      // Увеличиваем общее количество страниц
      pageStats.totalPages++;
      totalScannedPages++;
      
      // Вызываем колбэк прогресса
      if (onProgress) {
        onProgress(i, pagesToScan, currentUrl);
      }
      
      // Добавляем небольшую задержку для симуляции сетевых запросов
      await delay(Math.random() * 50 + 20);
    }
    
    // Теперь симулируем быстрое сканирование оставшихся страниц пакетами
    const remainingPages = pagesToScan - initialBatchSize;
    if (remainingPages > 0) {
      // Разбиваем оставшиеся страницы на пакеты
      const batchSize = 1000;
      const numBatches = Math.ceil(remainingPages / batchSize);
      
      for (let batch = 0; batch < numBatches; batch++) {
        const currentBatchSize = Math.min(batchSize, remainingPages - batch * batchSize);
        const startPage = initialBatchSize + batch * batchSize + 1;
        const endPage = startPage + currentBatchSize - 1;
        
        // Распределяем типы страниц в текущем пакете
        for (const pageType of pageTypes) {
          const countForType = Math.floor(currentBatchSize * pageDistribution[pageType]);
          pageStats.subpages[pageType] = (pageStats.subpages[pageType] || 0) + countForType;
          
          // Распределяем по уровням глубины
          for (let level = 1; level <= maxDepth; level++) {
            const levelProb = level === 1 ? 0.2 : level === 2 ? 0.5 : 0.3;
            const pagesAtLevel = Math.floor(countForType * levelProb);
            pageStats.levels[level] = (pageStats.levels[level] || 0) + pagesAtLevel;
          }
        }
        
        // Обновляем общую статистику
        pageStats.totalPages += currentBatchSize;
        totalScannedPages += currentBatchSize;
        
        // Генерируем случайный URL для отображения прогресса
        const randomType = faker.helpers.arrayElement(pageTypes);
        const randomUrl = `${formattedUrl}/${randomType}/${faker.lorem.slug(3)}`;
        
        // Вызываем колбэк прогресса
        if (onProgress) {
          onProgress(totalScannedPages, pagesToScan, randomUrl);
        }
        
        // Добавляем небольшую задержку между пакетами
        await delay(200);
      }
    }
    
    // Генерируем карту сайта XML
    const sitemap = generateSitemap(domain, pageStats.totalPages);
    
    return { success: true, pageStats, sitemap };
  } catch (error) {
    console.error('Ошибка сканирования сайта:', error);
    return { success: false, pageStats: { totalPages: 0, subpages: {}, levels: {} } };
  }
};
