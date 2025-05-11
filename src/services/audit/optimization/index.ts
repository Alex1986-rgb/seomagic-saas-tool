
/**
 * Модуль оптимизации сайта
 */
import { PageContent, OptimizationMetrics, OptimizationItem } from '@/features/audit/types/optimization-types';
import { analyzeContent } from './contentAnalyzer';

/**
 * Рассчитывает метрики оптимизации на основе содержимого страниц
 */
export const calculateOptimizationMetrics = (
  pagesContent: PageContent[],
  totalPagesCount: number
): OptimizationMetrics => {
  // Получаем базовые метрики контента
  const analysis = analyzeContent(pagesContent);
  
  // Коэффициенты для расчета стоимости
  const baseCost = 0.05; // базовая стоимость за страницу
  const metaDescriptionCost = 0.5; // стоимость генерации мета-описания
  const metaKeywordsCost = 0.3; // стоимость генерации ключевых слов
  const contentOptimizationCost = 1.5; // стоимость оптимизации контента
  const urlFixCost = 0.2; // стоимость исправления URL
  const altTagCost = 0.1; // стоимость генерации alt-тегов
  
  // Рассчитываем текущую оценку (максимум 100)
  const totalIssues = Object.values(analysis).reduce((acc, val) => acc + val, 0);
  const maxIssues = pagesContent.length * 6; // 6 потенциальных проблем на страницу
  const baseScore = Math.max(30, 100 - (totalIssues / maxIssues) * 70);
  const potentialIncrease = Math.min(100 - baseScore, 50); // максимальное увеличение 50 баллов
  
  // Рассчитываем общую стоимость оптимизации
  const baseTotalCost = totalPagesCount * baseCost;
  const metaDescriptionTotalCost = analysis.missingMetaDescriptions * metaDescriptionCost;
  const metaKeywordsTotalCost = analysis.missingMetaKeywords * metaKeywordsCost;
  const contentTotalCost = analysis.contentToRewrite * contentOptimizationCost;
  const urlTotalCost = analysis.underscoreUrls * urlFixCost;
  const altTagTotalCost = analysis.missingAltTags * altTagCost;
  
  const totalCost = Math.round(
    baseTotalCost + 
    metaDescriptionTotalCost + 
    metaKeywordsTotalCost + 
    contentTotalCost + 
    urlTotalCost + 
    altTagTotalCost
  );
  
  // Формируем список задач оптимизации
  const optimizationItems: OptimizationItem[] = [
    {
      id: "base-opt",
      page: "all",
      tasks: ["base_optimization"],
      cost: baseTotalCost,
      priority: "high",
      category: "base",
      name: "Базовая оптимизация",
      description: `Базовая оптимизация для ${totalPagesCount} страниц`,
      count: totalPagesCount,
      price: baseCost,
      totalPrice: baseTotalCost,
      errorCount: 0
    },
    {
      id: "meta-desc",
      page: "meta",
      tasks: ["create_meta_descriptions"],
      cost: metaDescriptionTotalCost,
      priority: "high",
      category: "meta",
      name: "Создание META-описаний",
      description: "Генерация отсутствующих мета-описаний",
      count: analysis.missingMetaDescriptions,
      price: metaDescriptionCost,
      totalPrice: metaDescriptionTotalCost,
      errorCount: analysis.missingMetaDescriptions
    },
    {
      id: "meta-keys",
      page: "meta",
      tasks: ["create_meta_keywords"],
      cost: metaKeywordsTotalCost,
      priority: "medium",
      category: "meta",
      name: "Создание META-ключевых слов",
      description: "Генерация отсутствующих ключевых слов",
      count: analysis.missingMetaKeywords,
      price: metaKeywordsCost,
      totalPrice: metaKeywordsTotalCost,
      errorCount: analysis.missingMetaKeywords
    },
    {
      id: "content-opt",
      page: "content",
      tasks: ["optimize_content"],
      cost: contentTotalCost,
      priority: "high",
      category: "content",
      name: "Оптимизация текстов",
      description: "Оптимизация текстового содержимого страниц",
      count: analysis.contentToRewrite,
      price: contentOptimizationCost,
      totalPrice: contentTotalCost,
      errorCount: analysis.contentToRewrite
    },
    {
      id: "url-fix",
      page: "url",
      tasks: ["fix_urls"],
      cost: urlTotalCost,
      priority: "medium",
      category: "structure",
      name: "Исправление URL-адресов",
      description: "Исправление URL с подчеркиваниями",
      count: analysis.underscoreUrls,
      price: urlFixCost,
      totalPrice: urlTotalCost,
      errorCount: analysis.underscoreUrls
    },
    {
      id: "alt-tags",
      page: "images",
      tasks: ["add_alt_tags"],
      cost: altTagTotalCost,
      priority: "medium",
      category: "images",
      name: "Добавление ALT-атрибутов",
      description: "Генерация ALT-текстов для изображений",
      count: analysis.missingAltTags,
      price: altTagCost,
      totalPrice: altTagTotalCost,
      errorCount: analysis.missingAltTags
    }
  ];
  
  return {
    fixedIssues: totalIssues,
    optimizedPages: pagesContent.length,
    optimizedImages: analysis.missingAltTags,
    totalTime: pagesContent.length * 5, // Estimate: 5 seconds per page
    missingMetaDescriptions: analysis.missingMetaDescriptions,
    missingMetaKeywords: analysis.missingMetaKeywords,
    missingAltTags: analysis.missingAltTags,
    duplicateMetaTags: analysis.duplicateContent,
    lowContentPages: analysis.contentToRewrite,
    poorTitleTags: Math.floor(totalPagesCount * 0.1),
    poorHeadingStructure: Math.floor(totalPagesCount * 0.15),
    slowLoadingPages: Math.floor(totalPagesCount * 0.2),
    poorMobileOptimization: Math.floor(totalPagesCount * 0.25),
    brokenLinks: Math.floor(totalPagesCount * 0.05),
    poorUrlStructure: analysis.underscoreUrls,
    underscoreUrls: analysis.underscoreUrls,
    duplicateContent: analysis.duplicateContent,
    contentToRewrite: analysis.contentToRewrite,
    totalScore: Math.round(baseScore),
    potentialScoreIncrease: Math.round(potentialIncrease),
    estimatedCost: totalCost,
    optimizationItems,
    beforeScore: Math.round(baseScore),
    afterScore: Math.round(baseScore + potentialIncrease)
  };
};
