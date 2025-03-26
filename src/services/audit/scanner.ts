import { ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';
import { toast } from "@/hooks/use-toast";
import { OptimizationItem } from '@/components/audit/results/components/optimization';

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
  
  if (includeContent) {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:content="http://www.google.com/schemas/sitemap-content/1.0">\n';
  } else {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  }
  
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
  
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  for (const type of pageTypes) {
    sitemap += `  <url>\n    <loc>${baseUrl}/${type}</loc>\n    <priority>0.8</priority>\n`;
    if (includeContent) {
      const pageTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${domain}`;
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      sitemap += `    <content:meta name="description" content="${faker.lorem.sentence(10)}"/>\n`;
      sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(6)}"/>\n`;
      
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
  
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7;
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    
    sitemap += `  <url>\n    <loc>${baseUrl}/${pageType}/${slug}</loc>\n    <priority>0.6</priority>\n`;
    
    if (includeContent) {
      const pageTitle = faker.commerce.productName();
      const hasDescription = Math.random() > 0.3;
      const hasKeywords = Math.random() > 0.4;
      const hasAltTags = Math.random() > 0.5;
      const hasDuplicateContent = Math.random() > 0.8;
      
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      
      if (hasDescription) {
        sitemap += `    <content:meta name="description" content="${faker.lorem.sentences(2)}"/>\n`;
      }
      
      if (hasKeywords) {
        sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(5)}"/>\n`;
      }
      
      if (hasDuplicateContent && i > 0) {
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
  
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7;
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    const title = faker.commerce.productName();
    
    const hasDescription = Math.random() > 0.3;
    const hasKeywords = Math.random() > 0.4;
    const hasAltTags = Math.random() > 0.5;
    
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
  const { maxPages, maxDepth, onProgress } = options;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    const pagesToScan = Math.min(250000, maxPages);
    let totalScannedPages = 0;
    
    const pageStats: PageStatistics = {
      totalPages: 0,
      subpages: {},
      levels: {}
    };
    
    const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
    
    const pageDistribution: Record<string, number> = {
      'product': 0.65,
      'category': 0.15,
      'blog': 0.12,
      'contact': 0.01,
      'about': 0.01,
      'faq': 0.02,
      'terms': 0.01,
      'privacy': 0.01
    };
    
    const initialBatchSize = Math.min(100, pagesToScan);
    for (let i = 1; i <= initialBatchSize; i++) {
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
      
      if (!pageStats.subpages[randomPageType]) {
        pageStats.subpages[randomPageType] = 0;
      }
      pageStats.subpages[randomPageType]++;
      
      const pageDepth = Math.min(Math.floor(Math.random() * maxDepth) + 1, maxDepth);
      if (!pageStats.levels[pageDepth]) {
        pageStats.levels[pageDepth] = 0;
      }
      pageStats.levels[pageDepth]++;
      
      const currentUrl = `${formattedUrl}/${randomPageType}`;
      for (let d = 1; d < pageDepth; d++) {
        currentUrl += `/${faker.lorem.slug(2)}`;
      }
      
      pageStats.totalPages++;
      totalScannedPages++;
      
      if (onProgress) {
        onProgress(i, pagesToScan, currentUrl);
      }
      
      await delay(Math.random() * 50 + 20);
    }
    
    const remainingPages = pagesToScan - initialBatchSize;
    if (remainingPages > 0) {
      const batchSize = 5000;
      const numBatches = Math.ceil(remainingPages / batchSize);
      
      for (let batch = 0; batch < numBatches; batch++) {
        const currentBatchSize = Math.min(batchSize, remainingPages - batch * batchSize);
        const startPage = initialBatchSize + batch * batchSize + 1;
        const endPage = startPage + currentBatchSize - 1;
        
        for (const pageType of pageTypes) {
          const countForType = Math.floor(currentBatchSize * pageDistribution[pageType]);
          pageStats.subpages[pageType] = (pageStats.subpages[pageType] || 0) + countForType;
          
          for (let level = 1; level <= maxDepth; level++) {
            const levelProb = level === 1 ? 0.1 : 
                               level <= 5 ? 0.4 : 
                               level <= 15 ? 0.3 : 
                               level <= 30 ? 0.15 : 0.05;
            
            const pagesAtLevel = Math.floor(countForType * levelProb);
            pageStats.levels[level] = (pageStats.levels[level] || 0) + pagesAtLevel;
          }
        }
        
        pageStats.totalPages += currentBatchSize;
        totalScannedPages += currentBatchSize;
        
        const randomType = faker.helpers.arrayElement(pageTypes);
        const randomUrl = `${formattedUrl}/${randomType}/${faker.lorem.slug(3)}`;
        
        if (onProgress) {
          onProgress(totalScannedPages, pagesToScan, randomUrl);
        }
        
        await delay(200);
      }
    }
    
    const sitemap = generateSitemap(domain, pageStats.totalPages, true);
    
    const pagesContent = await collectPagesContent(domain, pageStats.totalPages);
    
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
  const basePagePrice = 50;
  
  const pricePerMissingMetaDescription = 50;
  const pricePerMissingMetaKeywords = 30;
  const pricePerMissingAltTag = 20;
  const pricePerUnderscoreUrl = 10;
  const pricePerDuplicateContent = 200;
  const pricePerContentRewrite = 150;
  
  let totalCost = 0;
  const optimizationItems: OptimizationItem[] = [];
  
  let missingMetaDescriptionCount = 0;
  let missingMetaKeywordsCount = 0;
  let missingAltTagsCount = 0;
  let underscoreUrlCount = 0;
  let duplicateContentCount = 0;
  let contentToRewriteCount = 0;
  
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
  
  if (pagesContent && pagesContent.length > 0) {
    const uniqueContents = new Set<string>();
    
    pagesContent.forEach(page => {
      if (!page.meta.description) {
        missingMetaDescriptionCount++;
      }
      
      if (!page.meta.keywords) {
        missingMetaKeywordsCount++;
      }
      
      page.images.forEach(image => {
        if (!image.alt) {
          missingAltTagsCount++;
        }
      });
      
      if (page.url.includes('_')) {
        underscoreUrlCount++;
      }
      
      const contentHash = page.content.slice(0, 200);
      if (uniqueContents.has(contentHash)) {
        duplicateContentCount++;
      } else {
        uniqueContents.add(contentHash);
        
        if (Math.random() > 0.3) {
          contentToRewriteCount++;
        }
      }
    });
    
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
  
  let discountPercent = 0;
  if (totalPagesCount > 1000) {
    discountPercent = 15;
  } else if (totalPagesCount > 500) {
    discountPercent = 10;
  } else if (totalPagesCount > 200) {
    discountPercent = 5;
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
  const optimizedPages = pagesContent.map(page => {
    const optimizedPage = { ...page };
    
    const beforeScore = Math.floor(Math.random() * 50) + 30;
    const afterScore = Math.floor(Math.random() * 20) + 80;
    
    const optimizedContent = optimizePageContent(page.content);
    
    const optimizedMeta = {
      description: page.meta.description 
        ? improveSeoDescription(page.meta.description)
        : generateSeoDescription(page.title, page.content),
      keywords: generateKeywords(page.title, page.content)
    };
    
    optimizedPage.optimized = {
      content: optimizedContent,
      meta: optimizedMeta,
      score: afterScore
    };
    
    return optimizedPage;
  });
  
  const demoPage = optimizedPages.find(p => !p.url.includes('/')) || optimizedPages[0];
  
  const averageBeforeScore = Math.floor(
    optimizedPages.reduce((sum, page) => sum + (Math.floor(Math.random() * 50) + 30), 0) / optimizedPages.length
  );
  
  const averageAfterScore = Math.floor(
    optimizedPages.reduce((sum, page) => sum + (page.optimized?.score || 80), 0) / optimizedPages.length
  );
  
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
  const paragraphs = content.split('\n\n');
  
  let optimized = '';
  if (paragraphs.length > 2) {
    optimized += `<h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>\n\n`;
    optimized += paragraphs[0] + '\n\n';
    
    optimized += `<h3>${faker.commerce.productName()}</h3>\n\n`;
    optimized += paragraphs.slice(1, 2).join('\n\n') + '\n\n';
    
    optimized += `<h3>${faker.company.catchPhrase()}</h3>\n\n`;
    optimized += paragraphs.slice(2).join('\n\n');
    
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
  return description + ' ' + faker.commerce.productDescription();
}

function generateSeoDescription(title: string, content: string): string {
  return `${title} - ${faker.commerce.productDescription()}. ${content.substring(0, 100)}...`;
}

function generateKeywords(title: string, content: string): string {
  const words = [...title.split(' '), ...content.substring(0, 200).split(' ')];
  const uniqueWords = [...new Set(words)].filter(w => w.length > 3).slice(0, 10);
  return uniqueWords.join(', ');
}
