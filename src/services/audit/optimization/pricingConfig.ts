
import { OptimizationItem } from '@/features/audit/types/optimization-types';

// Basic pricing configuration
export const getPricingConfig = () => {
  return {
    sitemap: 1500,
    metaTagsPerItem: 50,
    contentPerPage: 200,
    imageAltPerItem: 20,
    performancePerPage: 100,
    linksPerItem: 30,
    structurePerItem: 40,
    basePrice: 5000
  };
};

// Generate standardized optimization items
export const getStandardOptimizationItems = (): OptimizationItem[] => {
  const items: OptimizationItem[] = [
    {
      id: 'item-1',
      page: 'all',
      tasks: ['generate_sitemap'],
      cost: 1500,
      priority: 'high',
      category: 'structure',
      name: 'Создание XML-карты сайта',
      description: 'Генерация и отправка XML-карты сайта в поисковые системы',
      count: 1,
      price: 1500,
      pricePerUnit: 1500,
      totalPrice: 1500,
      type: 'technical'
    },
    {
      id: 'item-2',
      page: 'all',
      tasks: ['optimize_meta_tags'],
      cost: 2500,
      priority: 'high',
      category: 'meta',
      name: 'Оптимизация мета-тегов',
      description: 'Улучшение заголовков и описаний страниц',
      count: 50,
      price: 2500,
      pricePerUnit: 50,
      totalPrice: 2500,
      type: 'technical'
    },
    {
      id: 'item-3',
      page: 'content',
      tasks: ['improve_content'],
      cost: 5000,
      priority: 'high',
      category: 'content',
      name: 'Улучшение контента',
      description: 'Оптимизация текстового содержимого страниц',
      count: 25,
      price: 5000,
      pricePerUnit: 200,
      totalPrice: 5000,
      type: 'content'
    },
    {
      id: 'item-4',
      page: 'images',
      tasks: ['optimize_images'],
      cost: 1200,
      priority: 'medium',
      category: 'images',
      name: 'Оптимизация изображений',
      description: 'Сжатие изображений и добавление атрибутов alt',
      count: 60,
      price: 1200,
      pricePerUnit: 20,
      totalPrice: 1200,
      type: 'technical'
    },
    {
      id: 'item-5',
      page: 'performance',
      tasks: ['optimize_speed'],
      cost: 2000,
      priority: 'high',
      category: 'performance',
      name: 'Оптимизация скорости',
      description: 'Улучшение скорости загрузки сайта',
      count: 20,
      price: 2000,
      pricePerUnit: 100,
      totalPrice: 2000,
      type: 'technical'
    },
    {
      id: 'item-6',
      page: 'links',
      tasks: ['fix_broken_links'],
      cost: 900,
      priority: 'medium',
      category: 'links',
      name: 'Исправление битых ссылок',
      description: 'Поиск и исправление некорректных ссылок',
      count: 30,
      price: 900,
      pricePerUnit: 30,
      totalPrice: 900,
      type: 'technical'
    },
    {
      id: 'item-7',
      page: 'structure',
      tasks: ['improve_structure'],
      cost: 1600,
      priority: 'medium',
      category: 'structure',
      name: 'Улучшение структуры сайта',
      description: 'Оптимизация URL структуры и навигации',
      count: 40,
      price: 1600,
      pricePerUnit: 40,
      totalPrice: 1600,
      type: 'technical'
    }
  ];
  
  return items;
};
