
import { ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';
import { toast } from "@/hooks/use-toast";
import { OptimizationItem } from '@/components/audit/results/components/OptimizationCost';

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
  optimized?: {
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    score: number;
  };
}

/**
 * Генерирует карту сайта XML на основе просканированных URL с дополнительной информацией
 */
export const generateSitemap = (domain: string, pageCount: number, includeContent = true): string => {
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
    sitemap += `    <content:body><![CDATA[
      <h1>Добро пожаловать на сайт ${domain}</h1>
      <p>${faker.lorem.paragraphs(3)}</p>
      <h2>Наши услуги</h2>
      <ul>
        <li>Услуга 1</li>
        <li>Услуга 2</li>
        <li>Услуга 3</li>
      </ul>
      <p>${faker.lorem.paragraphs(2)}</p>
    ]]></content:body>\n`;
  }
  sitemap += `  </url>\n`;
  
  // Страницы первого уровня
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  for (const type of pageTypes) {
    sitemap += `  <url>\n    <loc>${baseUrl}/${type}</loc>\n    <priority>0.8</priority>\n`;
    if (includeContent) {
      const pageTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${domain}`;
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      sitemap += `    <content:meta name="description" content="${faker.lorem.sentence(10)}"/>\n`;
      sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(6)}"/>\n`;
      
      // Добавляем примеры контента
      sitemap += `    <content:body><![CDATA[
        <h1>${pageTitle}</h1>
        <p>${faker.lorem.paragraphs(3)}</p>
        <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
        <div class="content-block">
          <img src="/images/${type}-main.jpg" alt="${faker.lorem.words(4)}" />
          <p>${faker.lorem.paragraphs(2)}</p>
        </div>
      ]]></content:body>\n`;
    }
    sitemap += `  </url>\n`;
  }
  
  // Добавляем примеры подстраниц
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7; // 30% шанс использования подчеркиваний вместо дефисов
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    
    sitemap += `  <url>\n    <loc>${baseUrl}/${pageType}/${slug}</loc>\n    <priority>0.6</priority>\n`;
    
    if (includeContent) {
      const pageTitle = faker.commerce.productName();
      const hasDescription = Math.random() > 0.3; // 70% шанс наличия мета-описания
      const hasKeywords = Math.random() > 0.4; // 60% шанс наличия ключевых слов
      const hasAltTags = Math.random() > 0.5; // 50% шанс наличия alt-тегов для изображений
      const hasDuplicateContent = Math.random() > 0.8; // 20% шанс дублирования контента
      
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      
      if (hasDescription) {
        sitemap += `    <content:meta name="description" content="${faker.lorem.sentences(2)}"/>\n`;
      }
      
      if (hasKeywords) {
        sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(5)}"/>\n`;
      }
      
      // Добавляем примеры контента
      if (hasDuplicateContent && i > 0) {
        // Дублирование контента с предыдущей страницы
        sitemap += `    <content:body><![CDATA[
          <h1>${pageTitle}</h1>
          <p>${faker.lorem.paragraphs(3)}</p>
          <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
          <p>${faker.lorem.paragraphs(2)}</p>
          <div class="duplicate-content">
            <p>${faker.lorem.paragraphs(1)}</p>
          </div>
        ]]></content:body>\n`;
      } else {
        sitemap += `    <content:body><![CDATA[
          <h1>${pageTitle}</h1>
          <p>${faker.lorem.paragraphs(3)}</p>
          <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
          <p>${faker.lorem.paragraphs(2)}</p>
          ${hasAltTags 
            ? `<img src="/images/${slug}.jpg" alt="${faker.lorem.words(4)}"/>`
            : `<img src="/images/${slug}.jpg"/>`
          }
        ]]></content:body>\n`;
      }
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
      alt: Math.random() > 0.3 ? faker.lorem.words(3) : undefined
    }))
  });
  
  // Симулируем контент для других страниц
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7; // 30% шанс использования подчеркиваний вместо дефисов
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    const title = faker.commerce.productName();
    
    // Определяем наличие метаданных и alt-тегов
    const hasDescription = Math.random() > 0.3; // 70% шанс наличия мета-описания
    const hasKeywords = Math.random() > 0.4; // 60% шанс наличия ключевых слов
    const hasAltTags = Math.random() > 0.5; // 50% шанс наличия alt-тегов для изображений
    
    pages.push({
      url: `${baseUrl}/${pageType}/${slug}`,
      title,
      content: faker.lorem.paragraphs(4),
      meta: {
        description: hasDescription ? faker.lorem.sentences(1) : undefined,
        keywords: hasKeywords ? faker.lorem.words(5) : undefined
      },
      images: Array.from({ length: Math.floor(Math.random() * 8) + 1 }, (_, i) => ({
        src: `/img/${pageType}-${slug}-${i}.jpg`,
        alt: hasAltTags ? faker.lorem.words(3) : undefined
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
  optimizationItems?: OptimizationItem[];
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
    
    // Генерируем карту сайта XML с контентом
    const sitemap = generateSitemap(domain, pageStats.totalPages, true);
    
    // Собираем контент страниц для оптимизации
    const pagesContent = await collectPagesContent(domain, pageStats.totalPages);
    
    // Анализируем контент и рассчитываем метрики оптимизации
    const {
      optimizationCost,
      optimizationItems
    } = calculateOptimizationMetrics(pageStats, pagesContent);
    
    return { 
      success: true, 
      pageStats, 
      sitemap, 
      pagesContent, 
      optimizationCost,
      optimizationItems
    };
  } catch (error) {
    console.error('Ошибка сканирования сайта:', error);
    return { success: false, pageStats: { totalPages: 0, subpages: {}, levels: {} } };
  }
};

/**
 * Анализирует контент и рассчитывает метрики оптимизации
 */
const calculateOptimizationMetrics = (
  pageStats: PageStatistics, 
  pagesContent?: PageContent[]
): {
  optimizationCost: number;
  optimizationItems: OptimizationItem[];
} => {
  // Базовые цены
  const basePagePrice = 50; // Изменено с 500р на 50р за страницу
  
  // Цены по типам оптимизации
  const pricePerMissingMetaDescription = 50;
  const pricePerMissingMetaKeywords = 30;
  const pricePerMissingAltTag = 20;
  const pricePerUnderscoreUrl = 10;
  const pricePerDuplicateContent = 200;
  const pricePerContentRewrite = 150;
  
  let totalCost = 0;
  const optimizationItems: OptimizationItem[] = [];
  
  // Переменные для подсчета проблем
  let missingMetaDescriptionCount = 0;
  let missingMetaKeywordsCount = 0;
  let missingAltTagsCount = 0;
  let underscoreUrlCount = 0;
  let duplicateContentCount = 0;
  let contentToRewriteCount = 0;
  
  // Базовая стоимость за общее количество страниц
  const totalPagesCount = pageStats.totalPages;
  const basePagesCost = totalPagesCount * basePagePrice;
  optimizationItems.push({
    type: 'Базовая оптимизация страниц',
    count: totalPagesCount,
    pricePerUnit: basePagePrice,
    totalPrice: basePagesCost,
    description: 'Базовая оптимизация страниц включает общий технический аудит, проверку структуры и основные улучшения SEO'
  });
  totalCost += basePagesCost;
  
  // Анализируем контент страниц, если доступен
  if (pagesContent && pagesContent.length > 0) {
    const uniqueContents = new Set<string>();
    
    pagesContent.forEach(page => {
      // Проверка метаданных
      if (!page.meta.description) {
        missingMetaDescriptionCount++;
      }
      
      if (!page.meta.keywords) {
        missingMetaKeywordsCount++;
      }
      
      // Проверка alt-тегов в изображениях
      page.images.forEach(image => {
        if (!image.alt) {
          missingAltTagsCount++;
        }
      });
      
      // Проверка URL на подчеркивания
      if (page.url.includes('_')) {
        underscoreUrlCount++;
      }
      
      // Проверка на дубликаты контента
      const contentHash = page.content.slice(0, 200); // Используем первые 200 символов для упрощения
      if (uniqueContents.has(contentHash)) {
        duplicateContentCount++;
      } else {
        uniqueContents.add(contentHash);
        
        // Контент, который нужно переписать (примерно 70% уникального контента)
        if (Math.random() > 0.3) {
          contentToRewriteCount++;
        }
      }
    });
    
    // Добавляем стоимость оптимизации мета-описаний
    if (missingMetaDescriptionCount > 0) {
      const metaDescriptionCost = missingMetaDescriptionCount * pricePerMissingMetaDescription;
      optimizationItems.push({
        type: 'Оптимизация мета-описаний',
        count: missingMetaDescriptionCount,
        pricePerUnit: pricePerMissingMetaDescription,
        totalPrice: metaDescriptionCost,
        description: 'Создание или улучшение мета-тегов description для лучшего отображения в поисковой выдаче'
      });
      totalCost += metaDescriptionCost;
    }
    
    // Добавляем стоимость оптимизации ключевых слов
    if (missingMetaKeywordsCount > 0) {
      const metaKeywordsCost = missingMetaKeywordsCount * pricePerMissingMetaKeywords;
      optimizationItems.push({
        type: 'Оптимизация ключевых слов',
        count: missingMetaKeywordsCount,
        pricePerUnit: pricePerMissingMetaKeywords,
        totalPrice: metaKeywordsCost,
        description: 'Добавление или улучшение мета-тегов keywords с релевантными ключевыми словами'
      });
      totalCost += metaKeywordsCost;
    }
    
    // Добавляем стоимость оптимизации alt-тегов
    if (missingAltTagsCount > 0) {
      const altTagsCost = missingAltTagsCount * pricePerMissingAltTag;
      optimizationItems.push({
        type: 'Оптимизация alt-тегов изображений',
        count: missingAltTagsCount,
        pricePerUnit: pricePerMissingAltTag,
        totalPrice: altTagsCost,
        description: 'Добавление атрибутов alt к изображениям для улучшения SEO и доступности'
      });
      totalCost += altTagsCost;
    }
    
    // Добавляем стоимость оптимизации URL
    if (underscoreUrlCount > 0) {
      const urlCost = underscoreUrlCount * pricePerUnderscoreUrl;
      optimizationItems.push({
        type: 'Оптимизация URL (замена подчеркиваний)',
        count: underscoreUrlCount,
        pricePerUnit: pricePerUnderscoreUrl,
        totalPrice: urlCost,
        description: 'Замена подчеркиваний (_) на дефисы (-) в URL для лучшей SEO-оптимизации'
      });
      totalCost += urlCost;
    }
    
    // Добавляем стоимость исправления дублей контента
    if (duplicateContentCount > 0) {
      const duplicateContentCost = duplicateContentCount * pricePerDuplicateContent;
      optimizationItems.push({
        type: 'Исправление дублей контента',
        count: duplicateContentCount,
        pricePerUnit: pricePerDuplicateContent,
        totalPrice: duplicateContentCost,
        description: 'Создание уникального контента для страниц с дублирующимся содержимым'
      });
      totalCost += duplicateContentCost;
    }
    
    // Добавляем стоимость переписывания контента
    if (contentToRewriteCount > 0) {
      const contentRewriteCost = contentToRewriteCount * pricePerContentRewrite;
      optimizationItems.push({
        type: 'Оптимизация текстового контента',
        count: contentToRewriteCount,
        pricePerUnit: pricePerContentRewrite,
        totalPrice: contentRewriteCost,
        description: 'Улучшение и SEO-оптимизация существующего контента согласно лучшим практикам'
      });
      totalCost += contentRewriteCost;
    }
  }
  
  // Скидки для больших проектов
  let discountPercent = 0;
  if (totalPagesCount > 1000) {
    discountPercent = 15; // 15% скидка
  } else if (totalPagesCount > 500) {
    discountPercent = 10; // 10% скидка
  } else if (totalPagesCount > 200) {
    discountPercent = 5; // 5% скидка
  }
  
  if (discountPercent > 0) {
    const discountAmount = Math.round(totalCost * (discountPercent / 100));
    totalCost -= discountAmount;
    
    optimizationItems.push({
      type: `Скидка за объем (${discountPercent}%)`,
      count: 1,
      pricePerUnit: -discountAmount,
      totalPrice: -discountAmount,
      description: `Скидка ${discountPercent}% от общей стоимости за большое количество страниц (${totalPagesCount})`
    });
  }
  
  return {
    optimizationCost: Math.round(totalCost),
    optimizationItems
  };
};

/**
 * Создает оптимизированную копию сайта и упаковывает в ZIP
 */
export const createOptimizedSite = async (
  domain: string,
  pagesContent: PageContent[]
): Promise<{
  blob: Blob;
  beforeScore: number;
  afterScore: number;
  demoPage?: PageContent;
}> => {
  // Генерируем оптимизированный контент для всех страниц
  const optimizedPages = pagesContent.map(page => {
    // Копируем страницу
    const optimizedPage = { ...page };
    
    // Добавляем оптимизированную версию контента
    const beforeScore = Math.floor(Math.random() * 50) + 30; // Оценка до оптимизации (30-80)
    const afterScore = Math.floor(Math.random() * 20) + 80; // Оценка после оптимизации (80-100)
    
    // Оптимизируем контент: добавляем ключевые слова, улучшаем структуру
    const optimizedContent = optimizePageContent(page.content);
    
    // Оптимизируем мета-теги
    const optimizedMeta = {
      description: page.meta.description 
        ? improveSeoDescription(page.meta.description)
        : generateSeoDescription(page.title, page.content),
      keywords: generateKeywords(page.title, page.content)
    };
    
    // Сохраняем оптимизированную версию
    optimizedPage.optimized = {
      content: optimizedContent,
      meta: optimizedMeta,
      score: afterScore
    };
    
    return optimizedPage;
  });
  
  // Выбираем демо-страницу для сравнения (предпочтительно главную)
  const demoPage = optimizedPages.find(p => !p.url.includes('/')) || optimizedPages[0];
  
  // Создаем фиктивный ZIP-архив (в реальном приложении здесь было бы создание настоящего архива)
  const averageBeforeScore = Math.floor(
    optimizedPages.reduce((sum, page) => sum + (Math.floor(Math.random() * 50) + 30), 0) / optimizedPages.length
  );
  
  const averageAfterScore = Math.floor(
    optimizedPages.reduce((sum, page) => sum + (page.optimized?.score || 80), 0) / optimizedPages.length
  );
  
  // Заглушка для демонстрации
  const archive = new Blob(['Optimized site content would be here'], { type: 'application/zip' });
  
  return {
    blob: archive,
    beforeScore: averageBeforeScore,
    afterScore: averageAfterScore,
    demoPage
  };
};

/**
 * Вспомогательные функции для оптимизации контента
 */
function optimizePageContent(content: string): string {
  // Добавляем подзаголовки и структурируем текст
  const paragraphs = content.split('\n\n');
  
  // Улучшаем структуру, добавляем подзаголовки
  let optimized = '';
  if (paragraphs.length > 2) {
    optimized += `<h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>\n\n`;
    optimized += paragraphs[0] + '\n\n';
    
    optimized += `<h3>${faker.commerce.productName()}</h3>\n\n`;
    optimized += paragraphs.slice(1, 2).join('\n\n') + '\n\n';
    
    optimized += `<h3>${faker.company.catchPhrase()}</h3>\n\n`;
    optimized += paragraphs.slice(2).join('\n\n');
    
    // Добавляем списки и другие элементы для лучшей структуры
    optimized += '\n\n<ul>\n';
    for (let i = 0; i < 4; i++) {
      optimized += `  <li>${faker.commerce.productName()}: ${faker.commerce.productDescription()}</li>\n`;
    }
    optimized += '</ul>';
  } else {
    optimized = content;
  }
  
  return optimized;
}

function improveSeoDescription(description: string): string {
  // Улучшаем существующее описание, добавляя ключевые слова
  return description + ' ' + faker.commerce.productDescription();
}

function generateSeoDescription(title: string, content: string): string {
  // Генерируем новое SEO-ориентированное описание
  return `${title} - ${faker.commerce.productDescription()}. ${content.substring(0, 100)}...`;
}

function generateKeywords(title: string, content: string): string {
  // Генерируем ключевые слова на основе заголовка и контента
  const words = [...title.split(' '), ...content.substring(0, 200).split(' ')];
  const uniqueWords = [...new Set(words)].filter(w => w.length > 3).slice(0, 10);
  return uniqueWords.join(', ');
}
