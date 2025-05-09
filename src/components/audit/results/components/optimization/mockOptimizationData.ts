
import { OptimizationItem } from '@/features/audit/types/optimization-types';

export const generateMockOptimizationItems = (pageCount: number = 25): OptimizationItem[] => {
  // Base costs
  const basePrice = 200;
  
  // Technical costs per unit
  const metaTagPrice = 50;
  const brokenLinkPrice = 70;
  const imageOptimizationPrice = 40;
  const redirectPrice = 60;
  
  // Content costs per unit
  const contentOptimizationPrice = 120;
  const headingStructurePrice = 80;
  const readabilityPrice = 90;
  const conversionTextPrice = 150;
  
  // Errors counts (based on page count)
  const metaTagsCount = Math.round(pageCount * 0.8);
  const brokenLinksCount = Math.round(pageCount * 0.3);
  const imagesCount = Math.round(pageCount * 1.5);
  const redirectsCount = Math.round(pageCount * 0.2);
  const contentCount = Math.round(pageCount * 0.9);
  const headingsCount = Math.round(pageCount * 0.7);
  const readabilityCount = Math.round(pageCount * 0.5);
  const conversionCount = Math.round(pageCount * 0.4);
  
  // Critical errors
  const criticalErrorsCount = Math.round(pageCount * 0.15);
  const criticalErrorPrice = 300;
  
  // Warnings
  const warningsCount = Math.round(pageCount * 0.25);
  const warningPrice = 150;
  
  // Calculate discounts
  let discountPercentage = 0;
  if (pageCount > 50) discountPercentage = 5;
  if (pageCount > 100) discountPercentage = 10;
  if (pageCount > 200) discountPercentage = 15;
  
  let idCounter = 1;
  
  // Function to generate a unique ID
  const generateId = () => {
    return `item-${idCounter++}`;
  };
  
  // Items array
  const items: OptimizationItem[] = [
    {
      id: generateId(),
      page: 'all',
      tasks: ['base_processing'],
      cost: 5000,
      priority: 'high',
      category: 'base',
      name: 'Базовая стоимость обработки сайта',
      description: 'Начальная стоимость анализа и подготовки к оптимизации',
      count: 1,
      price: 5000,
      pricePerUnit: 5000,
      totalPrice: 5000,
      type: 'base'
    },
    {
      id: generateId(),
      page: 'all',
      tasks: ['page_processing'],
      cost: basePrice * pageCount,
      priority: 'high',
      category: 'base',
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
      id: generateId(),
      page: 'errors',
      tasks: ['fix_critical_errors'],
      cost: criticalErrorsCount * criticalErrorPrice,
      priority: 'high',
      category: 'technical',
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
      id: generateId(),
      page: 'warnings',
      tasks: ['fix_warnings'],
      cost: warningsCount * warningPrice,
      priority: 'medium',
      category: 'technical',
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
      id: generateId(),
      page: 'meta',
      tasks: ['optimize_meta_tags'],
      cost: metaTagsCount * metaTagPrice,
      priority: 'high',
      category: 'technical',
      name: 'Оптимизация мета-тегов',
      description: 'Создание и оптимизация мета-тегов title и description',
      count: metaTagsCount,
      price: metaTagsCount * metaTagPrice,
      pricePerUnit: metaTagPrice,
      totalPrice: metaTagsCount * metaTagPrice,
      type: 'technical'
    },
    {
      id: generateId(),
      page: 'links',
      tasks: ['fix_broken_links'],
      cost: brokenLinksCount * brokenLinkPrice,
      priority: 'high',
      category: 'technical',
      name: 'Исправление битых ссылок',
      description: 'Обнаружение и исправление некорректных ссылок',
      count: brokenLinksCount,
      price: brokenLinksCount * brokenLinkPrice,
      pricePerUnit: brokenLinkPrice,
      totalPrice: brokenLinksCount * brokenLinkPrice,
      type: 'technical'
    },
    {
      id: generateId(),
      page: 'images',
      tasks: ['optimize_images'],
      cost: imagesCount * imageOptimizationPrice,
      priority: 'medium',
      category: 'technical',
      name: 'Оптимизация изображений',
      description: 'Оптимизация размера и добавление alt-тегов для изображений',
      count: imagesCount,
      price: imagesCount * imageOptimizationPrice,
      pricePerUnit: imageOptimizationPrice,
      totalPrice: imagesCount * imageOptimizationPrice,
      type: 'technical'
    },
    {
      id: generateId(),
      page: 'redirects',
      tasks: ['setup_redirects'],
      cost: redirectsCount * redirectPrice,
      priority: 'medium',
      category: 'technical',
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
      id: generateId(),
      page: 'content',
      tasks: ['optimize_seo_content'],
      cost: contentCount * contentOptimizationPrice,
      priority: 'high',
      category: 'content',
      name: 'Оптимизация контента для SEO',
      description: 'Оптимизация текстового содержимого для поисковых систем',
      count: contentCount,
      price: contentCount * contentOptimizationPrice,
      pricePerUnit: contentOptimizationPrice,
      totalPrice: contentCount * contentOptimizationPrice,
      type: 'content'
    },
    {
      id: generateId(),
      page: 'headings',
      tasks: ['optimize_headings'],
      cost: headingsCount * headingStructurePrice,
      priority: 'medium',
      category: 'content',
      name: 'Структура заголовков',
      description: 'Оптимизация структуры заголовков H1-H6',
      count: headingsCount,
      price: headingsCount * headingStructurePrice,
      pricePerUnit: headingStructurePrice,
      totalPrice: headingsCount * headingStructurePrice,
      type: 'content'
    },
    {
      id: generateId(),
      page: 'readability',
      tasks: ['improve_readability'],
      cost: readabilityCount * readabilityPrice,
      priority: 'medium',
      category: 'content',
      name: 'Улучшение читабельности',
      description: 'Работа над улучшением читабельности текста',
      count: readabilityCount,
      price: readabilityCount * readabilityPrice,
      pricePerUnit: readabilityPrice,
      totalPrice: readabilityCount * readabilityPrice,
      type: 'content'
    },
    {
      id: generateId(),
      page: 'conversion',
      tasks: ['optimize_conversion_texts'],
      cost: conversionCount * conversionTextPrice,
      priority: 'medium',
      category: 'content',
      name: 'Оптимизация текстов для конверсии',
      description: 'Улучшение текстов для повышения конверсии',
      count: conversionCount,
      price: conversionCount * conversionTextPrice,
      pricePerUnit: conversionTextPrice,
      totalPrice: conversionCount * conversionTextPrice,
      type: 'content'
    }
  ];
  
  // Add discount if applicable
  if (discountPercentage > 0) {
    const totalBeforeDiscount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = totalBeforeDiscount * (discountPercentage / 100);
    
    items.push({
      id: generateId(),
      page: 'all',
      tasks: ['apply_discount'],
      cost: -discountAmount,
      priority: 'low',
      category: 'discount',
      name: `Скидка ${discountPercentage}%`,
      description: `Скидка за объем работ (более ${pageCount} страниц)`,
      count: 1,
      price: -discountAmount,
      pricePerUnit: -discountAmount,
      totalPrice: -discountAmount,
      type: 'additional'
    });
  }

  // Add guarantee
  items.push({
    id: generateId(),
    page: 'all',
    tasks: ['guarantee_results'],
    cost: 0,
    priority: 'low',
    category: 'guarantee',
    name: 'Гарантия результата',
    description: 'Гарантированное повышение позиций в поисковой выдаче',
    count: 1,
    price: 0,
    pricePerUnit: 0,
    totalPrice: 0,
    type: 'additional'
  });
  
  return items;
};

export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

export const generateRandomPageCount = (): number => {
  // Generate a random page count between 15 and 250
  return Math.floor(Math.random() * 235) + 15;
};
