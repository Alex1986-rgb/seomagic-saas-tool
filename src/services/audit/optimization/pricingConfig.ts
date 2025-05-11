
import { OptimizationItem } from '@/features/audit/types/optimization-types';

/**
 * Returns a standard set of optimization items for pricing calculations
 */
export const getStandardOptimizationItems = (): OptimizationItem[] => {
  return [
    {
      id: "meta_tags",
      name: "Оптимизация мета-тегов",
      description: "Улучшение заголовков, описаний и ключевых слов для лучшей индексации",
      count: 10,
      price: 150,
      totalPrice: 1500,
      category: "meta",
      priority: "high",
      page: "все страницы",
      tasks: ["Оптимизация мета-тегов"],
      cost: 1500,
      errorCount: 0,
      type: "meta"
    },
    {
      id: "schema_markup",
      name: "Создание Schema.org разметки",
      description: "Микроразметка для улучшения отображения в результатах поиска",
      count: 5,
      price: 300,
      totalPrice: 1500,
      category: "structure",
      priority: "medium",
      page: "основные страницы",
      tasks: ["Создание микроразметки"],
      cost: 1500,
      errorCount: 0,
      type: "structure"
    },
    {
      id: "content_optimization",
      name: "Оптимизация контента",
      description: "Улучшение текстового содержания страниц для повышения релевантности",
      count: 8,
      price: 500,
      totalPrice: 4000,
      category: "content",
      priority: "high",
      page: "ключевые страницы",
      tasks: ["Оптимизация контента"],
      cost: 4000,
      errorCount: 0,
      type: "content"
    },
    {
      id: "image_optimization",
      name: "Оптимизация изображений",
      description: "Сжатие и добавление атрибутов alt для улучшения SEO",
      count: 25,
      price: 50,
      totalPrice: 1250,
      category: "images",
      priority: "medium",
      page: "все страницы",
      tasks: ["Оптимизация изображений"],
      cost: 1250,
      errorCount: 0,
      type: "media"
    },
    {
      id: "performance_optimization",
      name: "Улучшение скорости загрузки",
      description: "Оптимизация кода и ресурсов для ускорения загрузки страниц",
      count: 5,
      price: 800,
      totalPrice: 4000,
      category: "performance",
      priority: "high",
      page: "весь сайт",
      tasks: ["Оптимизация скорости"],
      cost: 4000,
      errorCount: 0,
      type: "performance"
    }
  ];
};

/**
 * Calculate discount based on page count
 */
export const getDiscountByPageCount = (pageCount: number): number => {
  if (pageCount <= 3) {
    return 0;
  } else if (pageCount <= 50) {
    return 0.2; // 20% discount
  } else if (pageCount <= 500) {
    return 0.5; // 50% discount
  } else {
    return 0.8; // 80% discount
  }
};

/**
 * Get pricing tier name based on page count
 */
export const getPricingTierName = (pageCount: number): string => {
  if (pageCount <= 3) {
    return 'Начальный';
  } else if (pageCount <= 50) {
    return 'Базовый';
  } else if (pageCount <= 500) {
    return 'Стандарт';
  } else {
    return 'Корпоративный';
  }
};
