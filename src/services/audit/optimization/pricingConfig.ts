
import { OptimizationItem } from '@/features/audit/types/optimization-types';

// Configuration for pricing
export const getPricingConfig = () => {
  return {
    sitemap: 2000,
    metaTagsPerItem: 50,
    contentPerPage: 120,
    imageAltPerItem: 40,
    performancePerPage: 80,
    linksPerItem: 70,
    structurePerItem: 60,
    basePrice: 5000,
    discountThreshold: 20
  };
};

// Let's create a simplified version for now
export const calculateOptimizationCost = (pageCount: number) => {
  // Base costs
  const basePrice = 200;
  const baseCost = 5000;
  
  // Technical costs per unit
  const metaTagPrice = 50;
  const brokenLinkPrice = 70;
  const imageOptimizationPrice = 40;
  const redirectPrice = 60;
  
  // Content costs per unit
  const contentOptimizationPrice = 120;
  const headingStructurePrice = 80;
  const readabilityPrice = 90;
  
  // Errors counts (based on page count)
  const metaTagsCount = Math.round(pageCount * 0.8);
  const brokenLinksCount = Math.round(pageCount * 0.3);
  const imagesCount = Math.round(pageCount * 1.5);
  const redirectsCount = Math.round(pageCount * 0.2);
  const contentCount = Math.round(pageCount * 0.9);
  const headingsCount = Math.round(pageCount * 0.7);
  const readabilityCount = Math.round(pageCount * 0.5);
  
  // Critical errors
  const criticalErrorsCount = Math.round(pageCount * 0.15);
  const criticalErrorPrice = 300;
  
  // Warnings
  const warningsCount = Math.round(pageCount * 0.25);
  const warningPrice = 150;
  
  // Items array
  const items: OptimizationItem[] = [
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
      price: basePrice * pageCount,
      pricePerUnit: basePrice,
      totalPrice: basePrice * pageCount,
      type: 'base'
    },
    // Critical errors
    {
      name: 'Исправление критических ошибок',
      description: 'Устранение критических ошибок, блокирующих индексацию',
      count: criticalErrorsCount,
      price: criticalErrorsCount * criticalErrorPrice,
      pricePerUnit: criticalErrorPrice,
      totalPrice: criticalErrorsCount * criticalErrorPrice,
      type: 'critical'
    },
    // Warnings
    {
      name: 'Исправление предупреждений',
      description: 'Устранение предупреждений и некритичных ошибок',
      count: warningsCount,
      price: warningsCount * warningPrice,
      pricePerUnit: warningPrice,
      totalPrice: warningsCount * warningPrice,
      type: 'warning'
    },
    // Technical improvements
    {
      name: 'Оптимизация мета-тегов',
      description: 'Создание и оптимизация мета-тегов title и description',
      count: metaTagsCount,
      price: metaTagsCount * metaTagPrice,
      pricePerUnit: metaTagPrice,
      totalPrice: metaTagsCount * metaTagPrice,
      type: 'technical'
    },
    {
      name: 'Исправление битых ссылок',
      description: 'Обнаружение и исправление некорректных ссылок',
      count: brokenLinksCount,
      price: brokenLinksCount * brokenLinkPrice,
      pricePerUnit: brokenLinkPrice,
      totalPrice: brokenLinksCount * brokenLinkPrice,
      type: 'technical'
    },
    {
      name: 'Оптимизация изображений',
      description: 'Оптимизация размера и добавление alt-тегов для изображений',
      count: imagesCount,
      price: imagesCount * imageOptimizationPrice,
      pricePerUnit: imageOptimizationPrice,
      totalPrice: imagesCount * imageOptimizationPrice,
      type: 'technical'
    },
    {
      name: 'Настройка редиректов',
      description: 'Создание правильных редиректов для старых URL',
      count: redirectsCount,
      price: redirectsCount * redirectPrice,
      pricePerUnit: redirectPrice,
      totalPrice: redirectsCount * redirectPrice,
      type: 'technical'
    },
    // Content improvements
    {
      name: 'Оптимизация контента для SEO',
      description: 'Оптимизация текстового содержимого для поисковых систем',
      count: contentCount,
      price: contentCount * contentOptimizationPrice,
      pricePerUnit: contentOptimizationPrice,
      totalPrice: contentCount * contentOptimizationPrice,
      type: 'content'
    },
    {
      name: 'Структура заголовков',
      description: 'Оптимизация структуры заголовков H1-H6',
      count: headingsCount,
      price: headingsCount * headingStructurePrice,
      pricePerUnit: headingStructurePrice,
      totalPrice: headingsCount * headingStructurePrice,
      type: 'content'
    },
    {
      name: 'Улучшение читабельности',
      description: 'Работа над улучшением читабельности текста',
      count: readabilityCount,
      price: readabilityCount * readabilityPrice,
      pricePerUnit: readabilityPrice,
      totalPrice: readabilityCount * readabilityPrice,
      type: 'content'
    },
    // Additional
    {
      name: 'Техническая поддержка',
      description: 'Поддержка и консультации по техническим вопросам',
      count: 1,
      price: 2000,
      pricePerUnit: 2000,
      totalPrice: 2000,
      type: 'additional'
    }
  ];
  
  // Calculate total cost
  const totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    items,
    totalCost
  };
};
