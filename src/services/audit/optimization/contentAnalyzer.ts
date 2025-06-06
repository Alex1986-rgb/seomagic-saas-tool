
/**
 * Анализатор контента страниц
 */
import { PageContent } from '@/features/audit/types/optimization-types';

interface ContentAnalysis {
  missingMetaDescriptions: number;
  missingMetaKeywords: number;
  missingAltTags: number;
  underscoreUrls: number;
  duplicateContent: number;
  contentToRewrite: number;
}

/**
 * Анализирует содержимое страниц и выявляет проблемы SEO
 */
export const analyzeContent = (pagesContent: PageContent[]): ContentAnalysis => {
  const analysis: ContentAnalysis = {
    missingMetaDescriptions: 0,
    missingMetaKeywords: 0,
    missingAltTags: 0,
    underscoreUrls: 0,
    duplicateContent: 0,
    contentToRewrite: 0
  };
  
  // Набор для отслеживания дубликатов контента
  const contentHashes = new Set<string>();
  
  for (const page of pagesContent) {
    // Проверяем мета-описания
    if ((!page.metadata || !page.metadata.description) && (!page.meta || !page.meta.description)) {
      analysis.missingMetaDescriptions++;
    }
    
    // Проверяем мета-ключевые слова
    if ((!page.metadata || !page.metadata.keywords) && (!page.meta || !page.meta.keywords)) {
      analysis.missingMetaKeywords++;
    }
    
    // Проверяем alt-теги изображений
    if (page.images) {
      for (const image of page.images) {
        if (!image.alt) {
          analysis.missingAltTags++;
        }
      }
    }
    
    // Проверяем URL на наличие подчеркиваний
    if (page.url.includes('_')) {
      analysis.underscoreUrls++;
    }
    
    // Проверяем дубликаты контента
    // Создаем простой хеш на основе начала контента
    const contentHash = page.content.substring(0, 200).toLowerCase().trim();
    if (contentHashes.has(contentHash)) {
      analysis.duplicateContent++;
    } else {
      contentHashes.add(contentHash);
    }
    
    // Проверяем необходимость переписывания контента
    // Если контент слишком короткий или имеет низкое соотношение ключевых слов
    if (
      (page.wordCount !== undefined && page.wordCount < 300) || 
      ((!page.metadata || !page.metadata.description) && (!page.meta || !page.meta.description))
    ) {
      analysis.contentToRewrite++;
    }
  }
  
  return analysis;
};

/**
 * Вычисляет процент оптимизированности страницы
 */
export const calculatePageOptimizationScore = (page: PageContent): number => {
  let score = 100;
  
  // Проверка на наличие мета-тегов
  if ((!page.metadata || !page.metadata.description) && (!page.meta || !page.meta.description)) {
    score -= 15;
  }
  if ((!page.metadata || !page.metadata.keywords) && (!page.meta || !page.meta.keywords)) {
    score -= 10;
  }
  
  // Проверка на наличие заголовков
  if (page.headings) {
    if (page.headings.h1.length === 0) score -= 15;
    if (page.headings.h2.length === 0) score -= 5;
    if (page.headings.h3.length === 0) score -= 2;
  } else {
    score -= 22; // 15 + 5 + 2 = 22
  }
  
  // Проверка на длину контента
  if (page.wordCount !== undefined) {
    if (page.wordCount < 300) score -= 15;
    else if (page.wordCount < 500) score -= 7;
  } else {
    score -= 7; // Default penalty if wordCount is not available
  }
  
  // Проверка на оптимизацию изображений
  if (page.images && page.images.length > 0) {
    const imagesWithoutAlt = page.images.filter(img => !img.alt).length;
    if (imagesWithoutAlt > 0) {
      const percentage = imagesWithoutAlt / page.images.length;
      score -= Math.round(percentage * 15);
    }
  }
  
  return Math.max(0, score);
};
