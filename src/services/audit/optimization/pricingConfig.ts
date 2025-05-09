
import { OptimizationItem } from '@/features/audit/types/optimization-types';

// Define pricing constants
const BASE_PRICE = 2500;
const META_TAGS_PER_PAGE = 10;
const CONTENT_PER_PAGE = 25;
const IMAGE_ALT_PER_ITEM = 5;
const PERFORMANCE_PER_PAGE = 15;
const LINKS_PER_ITEM = 8;
const STRUCTURE_PER_ITEM = 12;

/**
 * Get the current pricing configuration
 */
export const getPricingConfig = () => {
  return {
    sitemap: BASE_PRICE,
    metaTagsPerItem: META_TAGS_PER_PAGE,
    contentPerPage: CONTENT_PER_PAGE,
    imageAltPerItem: IMAGE_ALT_PER_ITEM,
    performancePerPage: PERFORMANCE_PER_PAGE,
    linksPerItem: LINKS_PER_ITEM,
    structurePerItem: STRUCTURE_PER_ITEM
  };
};

/**
 * Calculate optimization cost and items based on page count
 */
export const calculateOptimizationCost = (pageCount: number) => {
  const baseCost = 2500;
  const perPageCost = pageCount * 10;
  
  const items: OptimizationItem[] = [
    {
      name: 'Базовый аудит SEO',
      description: 'Первичный аудит и анализ сайта',
      count: 1,
      price: baseCost,
      pricePerUnit: baseCost,
      totalPrice: baseCost,
      type: 'base'
    },
    {
      name: 'Оптимизация метатегов',
      description: `Оптимизация метатегов для ${pageCount} страниц`,
      count: pageCount,
      price: perPageCost,
      pricePerUnit: 10,
      totalPrice: perPageCost,
      type: 'content'
    },
    {
      name: 'Внутренняя оптимизация',
      description: 'Оптимизация структуры и внутренних ссылок',
      count: 1,
      price: 1500,
      pricePerUnit: 1500,
      totalPrice: 1500,
      type: 'technical'
    },
    {
      name: 'Оптимизация скорости',
      description: 'Ускорение загрузки страниц',
      count: 1,
      price: 2000,
      pricePerUnit: 2000,
      totalPrice: 2000,
      type: 'technical'
    },
    {
      name: 'Скидка за объем',
      description: 'Скидка при заказе комплексной оптимизации',
      count: 1,
      price: -1000,
      pricePerUnit: -1000,
      totalPrice: -1000,
      type: 'discount'
    },
    {
      name: 'Гарантия результата',
      description: 'Гарантируем улучшение позиций в течение 30 дней',
      count: 1,
      price: 0,
      pricePerUnit: 0,
      totalPrice: 0,
      type: 'guarantee'
    },
    {
      name: 'Дополнительные услуги',
      description: 'Прочие услуги по оптимизации',
      count: 1,
      price: 1000,
      pricePerUnit: 1000,
      totalPrice: 1000,
      type: 'other'
    }
  ];
  
  const totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    totalCost,
    items
  };
};
