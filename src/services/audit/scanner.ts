import { ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';
import { toast } from "@/hooks/use-toast";

interface PageStatistics {
  totalPages: number;
  subpages: Record<string, number>;
  levels: Record<number, number>;
}

interface PageContent {
  url: string;
  title: string;
  content: string;
  meta: {
    description?: string;
    keywords?: string;
  };
  images: {
    src: string;
    alt?: string;
  }[];
}

/**
 * Генерирует карту сайта XML на основе просканированных URL с дополнительной информацией
 */
export const generateSitemap = (domain: string, pageCount: number, includeContent = false): string => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  
  // Используем расширенный формат sitemap для включения контента, если это требуется
  if (includeContent) {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:content="http://www.google.com/schemas/sitemap-content/1.0">\n';
  } else {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  }
  
  // Добавляем главную страницу
  sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <priority>1.0</priority>\n`;
  if (includeContent) {
    sitemap += `    <content:title>Главная страница ${domain}</content:title>\n`;
    sitemap += `    <content:meta name="description" content="Официальный сайт ${domain}"/>\n`;
  }
  sitemap += `  </url>\n`;
  
  // Страницы первого уровня
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  for (const type of pageTypes) {
    sitemap += `  <url>\n    <loc>${baseUrl}/${type}</loc>\n    <priority>0.8</priority>\n`;
    if (includeContent) {
      sitemap += `    <content:title>${type.charAt(0).toUpperCase() + type.slice(1)} - ${domain}</content:title>\n`;
      sitemap += `    <content:meta name="description" content="${faker.lorem.sentence(10)}"/>\n`;
    }
    sitemap += `  </url>\n`;
  }
  
  // Добавляем примеры подстраниц
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    sitemap += `  <url>\n    <loc>${baseUrl}/${pageType}/${slugPart}</loc>\n    <priority>0.6</priority>\n`;
    
    if (includeContent) {
      const pageTitle = faker.commerce.productName();
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      sitemap += `    <content:meta name="description" content="${faker.lorem.sentences(2)}"/>\n`;
      
      // Добавляем примеры контента
      sitemap += `    <content:body><![CDATA[
        <h1>${pageTitle}</h1>
        <p>${faker.lorem.paragraphs(3)}</p>
        <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
        <p>${faker.lorem.paragraphs(2)}</p>
        <img src="/images/${slugPart}.jpg" alt="${pageTitle}"/>
      ]]></content:body>\n`;
    }
    
    sitemap += `  </url>\n`;
  }
  
  sitemap += '</urlset>';
  return sitemap;
};

/**
 * Собирает контент всех страниц
 */
export const collectPagesContent = async (
  domain: string,
  pageCount: number
): Promise<PageContent[]> => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const pages: PageContent[] = [];
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  // Главная страница
  pages.push({
    url: baseUrl,
    title: `${domain} - Главная страница`,
    content: faker.lorem.paragraphs(5),
    meta: {
      description: faker.lorem.sentences(2),
      keywords: faker.lorem.words(8)
    },
    images: Array.from({ length: 5 }, (_, i) => ({
      src: `/img/home-${i}.jpg`,
      alt: faker.lorem.words(3)
    }))
  });
  
  // Симулируем контент для других страниц
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const title = faker.commerce.productName();
    
    pages.push({
      url: `${baseUrl}/${pageType}/${slugPart}`,
      title,
      content: faker.lorem.paragraphs(4),
      meta: {
        description: faker.lorem.sentences(1),
        keywords: faker.lorem.words(5)
      },
      images: Array.from({ length: Math.floor(Math.random() * 8) + 1 }, (_, i) => ({
        src: `/img/${pageType}-${slugPart}-${i}.jpg`,
        alt: Math.random() > 0.3 ? faker.lorem.words(3) : undefined
      }))
    });
  }
  
  return pages;
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
  pagesContent?: PageContent[];
  optimizationCost?: number;
}> => {
  // Симуляция сканирования сайта
  const { maxPages, maxDepth, onProgress } = options;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
    // Форматируем URL с протоколом, если отсутствует
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    // Поддерживаем сканирование до 250 000 страниц с глубиной до 50
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
      
      // Симулируем уровни глубины страниц (1-maxDepth)
      const pageDepth = Math.min(Math.floor(Math.random() * maxDepth) + 1, maxDepth);
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
      const batchSize = 5000; // Увеличиваем размер пакета для более эффективной обработки
      const numBatches = Math.ceil(remainingPages / batchSize);
      
      for (let batch = 0; batch < numBatches; batch++) {
        const currentBatchSize = Math.min(batchSize, remainingPages - batch * batchSize);
        const startPage = initialBatchSize + batch * batchSize + 1;
        const endPage = startPage + currentBatchSize - 1;
        
        // Распределяем типы страниц в текущем пакете
        for (const pageType of pageTypes) {
          const countForType = Math.floor(currentBatchSize * pageDistribution[pageType]);
          pageStats.subpages[pageType] = (pageStats.subpages[pageType] || 0) + countForType;
          
          // Распределяем по уровням глубины (до maxDepth)
          for (let level = 1; level <= maxDepth; level++) {
            // Рассчитываем вероятность страниц на данном уровне (убывает с глубиной)
            const levelProb = level === 1 ? 0.1 : 
                               level <= 5 ? 0.4 : 
                               level <= 15 ? 0.3 : 
                               level <= 30 ? 0.15 : 0.05;
            
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
    
    // Собираем контент страниц для оптимизации
    const pagesContent = await collectPagesContent(domain, pageStats.totalPages);
    
    // Рассчитываем стоимость оптимизации
    const optimizationCost = calculateOptimizationCost(pageStats, pagesContent);
    
    return { success: true, pageStats, sitemap, pagesContent, optimizationCost };
  } catch (error) {
    console.error('Ошибка сканирования сайта:', error);
    return { success: false, pageStats: { totalPages: 0, subpages: {}, levels: {} } };
  }
};

/**
 * Рассчитывает стоимость оптимизации на основе анализа
 */
const calculateOptimizationCost = (pageStats: PageStatistics, pagesContent?: PageContent[]): number => {
  // Базовые ставки стоимости
  const baseCost = 1000; // Базовая стоимость аудита
  const perPageCost = 10; // Стоимость за страницу
  const perImageCost = 5; // Стоимость за оптимизацию изображения
  const perMetaCost = 15; // Стоимость за оптимизацию мета-тегов
  
  // Рассчитываем стоимость на основе количества страниц
  let totalCost = baseCost;
  
  // Добавляем стоимость за количество страниц
  totalCost += pageStats.totalPages * perPageCost;
  
  // Если есть контент страниц, учитываем детали
  if (pagesContent && pagesContent.length > 0) {
    let missingMetaTags = 0;
    let imagesWithoutAlt = 0;
    
    // Анализируем каждую страницу
    pagesContent.forEach(page => {
      // Проверяем мета-теги
      if (!page.meta.description || page.meta.description.length < 50) {
        missingMetaTags++;
      }
      if (!page.meta.keywords) {
        missingMetaTags++;
      }
      
      // Проверяем alt-теги изображений
      page.images.forEach(img => {
        if (!img.alt) {
          imagesWithoutAlt++;
        }
      });
    });
    
    // Добавляем стоимость за оптимизацию мета-тегов и изображений
    totalCost += missingMetaTags * perMetaCost;
    totalCost += imagesWithoutAlt * perImageCost;
  }
  
  // Скидка для крупных сайтов
  if (pageStats.totalPages > 1000) {
    totalCost = totalCost * 0.85; // 15% скидка
  } else if (pageStats.totalPages > 500) {
    totalCost = totalCost * 0.9; // 10% скидка
  } else if (pageStats.totalPages > 200) {
    totalCost = totalCost * 0.95; // 5% скидка
  }
  
  // Округляем до целого числа
  return Math.round(totalCost);
};

/**
 * Создает оптимизированную копию сайта и упаковывает в ZIP
 */
export const createOptimizedSite = async (
  domain: string,
  pagesContent: PageContent[]
): Promise<Blob> => {
  // Здесь будет логика создания оптимизированной копии
  // В реальном проекте здесь можно использовать JSZip или аналогичную библиотеку
  
  // Заглушка для демонстрации
  const archive = new Blob(['Optimized site content would be here'], { type: 'application/zip' });
  return archive;
};
