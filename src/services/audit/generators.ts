
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { AuditData } from '@/types/audit';
import { CategoryData } from '@/types/audit/category-data';
import { AuditItemData } from '@/features/audit/types/audit-items';

/**
 * Generate mock optimization items for demo purposes
 */
export const generateMockOptimizationItems = (pageCount: number): OptimizationItem[] => {
  // Base calculation values
  const baseCost = 5000;
  const perPageBaseCost = 200;
  const criticalErrorCount = Math.max(3, Math.floor(pageCount * 0.15));
  const warningsCount = Math.max(5, Math.floor(pageCount * 0.25));
  const metaTagsCount = Math.max(Math.floor(pageCount * 0.8), 10);
  const brokenLinksCount = Math.max(Math.floor(pageCount * 0.3), 5);
  const imagesCount = Math.max(Math.floor(pageCount * 1.5), 20);
  const redirectsCount = Math.max(Math.floor(pageCount * 0.2), 3);
  const contentOptimizationCount = Math.max(Math.floor(pageCount * 0.9), 15);
  const headingsStructureCount = Math.max(Math.floor(pageCount * 0.7), 10);
  const readabilityCount = Math.max(Math.floor(pageCount * 0.5), 8);

  // Create optimization items array
  return [
    // Base costs
    {
      name: 'Базовая стоимость обработки сайта',
      description: 'Начальная стоимость анализа и подготовки к оптимизации',
      count: 1,
      price: baseCost,
      pricePerUnit: baseCost,
      totalPrice: baseCost,
      type: 'base'
    },
    {
      name: 'Базовая стоимость обработки страниц',
      description: 'Стоимость базовой обработки всех страниц сайта',
      count: pageCount,
      pricePerUnit: perPageBaseCost,
      price: perPageBaseCost,
      totalPrice: pageCount * perPageBaseCost,
      type: 'base'
    },
    
    // Critical errors
    {
      name: 'Исправление критических ошибок',
      description: 'Устранение критических ошибок, блокирующих индексацию',
      count: criticalErrorCount,
      pricePerUnit: 300,
      price: 300,
      totalPrice: criticalErrorCount * 300,
      type: 'critical'
    },
    
    // Warnings
    {
      name: 'Исправление предупреждений',
      description: 'Устранение предупреждений и некритичных ошибок',
      count: warningsCount,
      pricePerUnit: 150,
      price: 150,
      totalPrice: warningsCount * 150,
      type: 'warning'
    },
    
    // Technical improvements
    {
      name: 'Оптимизация мета-тегов',
      description: 'Создание и оптимизация мета-тегов title и description',
      count: metaTagsCount,
      pricePerUnit: 50,
      price: 50,
      totalPrice: metaTagsCount * 50,
      type: 'technical'
    },
    {
      name: 'Исправление битых ссылок',
      description: 'Обнаружение и исправление некорректных ссылок',
      count: brokenLinksCount,
      pricePerUnit: 70,
      price: 70,
      totalPrice: brokenLinksCount * 70,
      type: 'technical'
    },
    {
      name: 'Оптимизация изображений',
      description: 'Оптимизация размера и добавление alt-тегов для изображений',
      count: imagesCount,
      pricePerUnit: 40,
      price: 40,
      totalPrice: imagesCount * 40,
      type: 'technical'
    },
    {
      name: 'Настройка редиректов',
      description: 'Создание правильных редиректов для старых URL',
      count: redirectsCount,
      pricePerUnit: 60,
      price: 60,
      totalPrice: redirectsCount * 60,
      type: 'technical'
    },
    
    // Content improvements
    {
      name: 'Оптимизация контента для SEO',
      description: 'Оптимизация текстового содержимого для поисковых систем',
      count: contentOptimizationCount,
      pricePerUnit: 120,
      price: 120,
      totalPrice: contentOptimizationCount * 120,
      type: 'content'
    },
    {
      name: 'Структура заголовков',
      description: 'Оптимизация структуры заголовков H1-H6',
      count: headingsStructureCount,
      pricePerUnit: 80,
      price: 80,
      totalPrice: headingsStructureCount * 80,
      type: 'content'
    },
    {
      name: 'Улучшение читабельности',
      description: 'Работа над улучшением читабельности текста',
      count: readabilityCount,
      pricePerUnit: 90,
      price: 90,
      totalPrice: readabilityCount * 90,
      type: 'content'
    },
    
    // Additional
    {
      name: 'Гарантия результата',
      description: 'Гарантированное повышение позиций в поисковой выдаче',
      count: 1,
      pricePerUnit: 0,
      price: 0,
      totalPrice: 0,
      type: 'additional'
    }
  ];
};

/**
 * Calculate total cost from optimization items
 */
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

// Helper function to create empty category data
const createCategoryData = (score: number): CategoryData => {
  return {
    score,
    passed: Math.floor(Math.random() * 10) + 5,
    warning: Math.floor(Math.random() * 5) + 2,
    failed: Math.floor(Math.random() * 3),
    items: []
  };
};

/**
 * Generate mock audit data for demo purposes
 */
export const generateAuditData = (url: string): AuditData => {
  const now = new Date();
  const date = now.toISOString();
  const pageCount = Math.floor(Math.random() * 50) + 10;
  
  const score = Math.floor(Math.random() * 30) + 50; // Score between 50-80
  const optimizationItems = generateMockOptimizationItems(pageCount);
  const optimizationCost = calculateTotalCost(optimizationItems);

  // Create test issue data
  const generateIssues = (count: number, prefix: string, impactLevel: 'high' | 'medium' | 'low'): any[] => {
    return Array(count).fill(0).map((_, i) => ({
      id: `${prefix}-${i}`,
      title: `${prefix} проблема ${i+1}`,
      description: `Описание ${prefix} проблемы ${i+1}`,
      impact: impactLevel,
      affected: Math.floor(Math.random() * pageCount) + 1,
      urls: []
    }));
  };
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    url,
    date,
    score,
    previousScore: score - Math.floor(Math.random() * 10),
    status: 'completed',
    pageCount,
    crawledPages: pageCount - Math.floor(Math.random() * 5),
    optimizationItems,
    optimizationCost,
    issues: {
      critical: generateIssues(Math.floor(Math.random() * 5) + 3, 'Критическая', 'high'),
      important: generateIssues(Math.floor(Math.random() * 8) + 5, 'Важная', 'medium'),
      minor: Math.floor(Math.random() * 10) + 8,
      passed: Math.floor(Math.random() * 15) + 10,
      opportunities: generateIssues(Math.floor(Math.random() * 7) + 3, 'Возможность улучшения', 'medium')
    },
    details: {
      seo: createCategoryData(Math.floor(Math.random() * 30) + 50),
      performance: createCategoryData(Math.floor(Math.random() * 30) + 50),
      content: createCategoryData(Math.floor(Math.random() * 30) + 50),
      technical: createCategoryData(Math.floor(Math.random() * 30) + 50),
      mobile: createCategoryData(Math.floor(Math.random() * 30) + 50),
      usability: createCategoryData(Math.floor(Math.random() * 30) + 50)
    }
  };
};
