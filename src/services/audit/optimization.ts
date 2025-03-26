
/**
 * Functions for calculating optimization metrics and costs
 */

import { OptimizationItem } from '@/components/audit/results/components/optimization';
import { PageContent } from './content';

export interface PageStatistics {
  totalPages: number;
  subpages: Record<string, number>;
  levels: Record<number, number>;
}

/**
 * Анализирует контент и рассчитывает метрики оптимизации
 */
export const calculateOptimizationMetrics = (
  pageStats: PageStatistics, 
  pagesContent?: PageContent[]
): {
  optimizationCost: number;
  optimizationItems: OptimizationItem[];
} => {
  // Обновленные цены в соответствии с требованиями
  let basePagePrice = 500; // Базовая стоимость для сайтов до 50 страниц
  
  // Определяем базовую стоимость в зависимости от количества страниц
  if (pageStats.totalPages > 500) {
    basePagePrice = 150; // От 500 страниц
  } else if (pageStats.totalPages > 50) {
    basePagePrice = 300; // От 50 до 500 страниц
  }
  
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
