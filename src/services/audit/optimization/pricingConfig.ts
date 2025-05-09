
import { OptimizationItem } from '@/features/audit/types/optimization-types';

export const getStandardOptimizationItems = (): OptimizationItem[] => {
  return [
    {
      id: "base_cost",
      name: "Базовая стоимость оптимизации",
      description: "Базовая стоимость работ по оптимизации, включает диагностику и анализ",
      count: 1,
      price: 5000,
      totalPrice: 5000,
      priority: "high",
      category: "base",
      page: "все страницы",
      tasks: ["Базовый анализ"],
      cost: 5000,
      errorCount: 0
    },
    {
      id: "critical_errors",
      name: "Исправление критических ошибок",
      description: "Устранение критических ошибок, влияющих на индексацию",
      count: 5,
      price: 1000,
      totalPrice: 5000,
      priority: "high",
      category: "errors",
      page: "все страницы",
      tasks: ["Исправление ошибок индексации"],
      cost: 5000,
      errorCount: 5
    },
    {
      id: "meta_tags",
      name: "Оптимизация мета-тегов",
      description: "Оптимизация title, description и keywords для всех страниц",
      count: 15,
      price: 300,
      totalPrice: 4500,
      priority: "high",
      category: "seo",
      page: "все страницы",
      tasks: ["Оптимизация мета-тегов"],
      cost: 4500,
      errorCount: 12
    },
    {
      id: "broken_links",
      name: "Исправление битых ссылок",
      description: "Обнаружение и исправление неработающих ссылок",
      count: 8,
      price: 200,
      totalPrice: 1600,
      priority: "medium",
      category: "technical",
      page: "все страницы",
      tasks: ["Анализ ссылок", "Коррекция ссылок"],
      cost: 1600,
      errorCount: 8
    },
    {
      id: "image_optimization",
      name: "Оптимизация изображений",
      description: "Оптимизация изображений для ускорения загрузки и SEO",
      count: 30,
      price: 100,
      totalPrice: 3000,
      priority: "medium",
      category: "media",
      page: "все страницы",
      tasks: ["Оптимизация изображений"],
      cost: 3000,
      errorCount: 24
    },
    {
      id: "content_optimization",
      name: "Оптимизация контента",
      description: "Оптимизация текстового контента для поисковых систем",
      count: 15,
      price: 500,
      totalPrice: 7500,
      priority: "high",
      category: "content",
      page: "все страницы",
      tasks: ["Оптимизация текстов", "Добавление ключевых слов"],
      cost: 7500,
      errorCount: 18
    },
    {
      id: "heading_structure",
      name: "Улучшение структуры заголовков",
      description: "Оптимизация H1-H6 заголовков для лучшего SEO",
      count: 15,
      price: 200,
      totalPrice: 3000,
      priority: "medium",
      category: "structure",
      page: "все страницы",
      tasks: ["Оптимизация заголовков"],
      cost: 3000,
      errorCount: 9
    },
    {
      id: "sitemap",
      name: "Создание карты сайта",
      description: "Генерация XML и HTML карты сайта",
      count: 1,
      price: 1500,
      totalPrice: 1500,
      priority: "medium",
      category: "technical",
      page: "корень сайта",
      tasks: ["Создание sitemap.xml"],
      cost: 1500,
      errorCount: 1
    },
    {
      id: "url_structure",
      name: "Оптимизация структуры URL",
      description: "Оптимизация URL-адресов для SEO",
      count: 10,
      price: 200,
      totalPrice: 2000,
      priority: "low",
      category: "structure",
      page: "все страницы",
      tasks: ["Анализ URL"],
      cost: 2000,
      errorCount: 14
    },
    {
      id: "conversion_texts",
      name: "Улучшение текстов для конверсии",
      description: "Оптимизация текстов для увеличения конверсии",
      count: 5,
      price: 800,
      totalPrice: 4000,
      priority: "high",
      category: "content",
      page: "ключевые страницы",
      tasks: ["Оптимизация призывов к действию"],
      cost: 4000,
      errorCount: 7
    },
    {
      id: "mobile_optimization",
      name: "Оптимизация для мобильных устройств",
      description: "Улучшение мобильной версии сайта",
      count: 1,
      price: 3000,
      totalPrice: 3000,
      priority: "high",
      category: "technical",
      page: "все страницы",
      tasks: ["Mobile-friendly оптимизация"],
      cost: 3000,
      errorCount: 11
    },
    {
      id: "speed_optimization",
      name: "Улучшение производительности",
      description: "Оптимизация скорости загрузки страниц",
      count: 1,
      price: 4000,
      totalPrice: 4000,
      priority: "medium",
      category: "technical",
      page: "все страницы",
      tasks: ["Оптимизация скорости"],
      cost: 4000,
      errorCount: 16
    }
  ];
};

export const calculateTotalOptimizationCost = (items: OptimizationItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

// Add the missing function that was being imported in optimizationCalculator.ts
export const getPricingConfig = () => {
  return {
    // Base pricing
    baseCost: 5000,
    pagesMultiplier: 1.2,
    
    // Feature-specific pricing
    sitemap: 1500,
    metaTagsPerItem: 300,
    contentPerPage: 500,
    imageAltPerItem: 100,
    performancePerPage: 400,
    linksPerItem: 200,
    structurePerItem: 200,
    
    // Discounts
    smallSiteDiscount: 0.1,  // 10% discount for small sites
    mediumSiteDiscount: 0.05, // 5% discount for medium sites
    largeSiteThreshold: 50,   // Pages threshold for large sites
    mediumSiteThreshold: 20,  // Pages threshold for medium sites
    smallSiteThreshold: 5,    // Pages threshold for small sites
  };
};
