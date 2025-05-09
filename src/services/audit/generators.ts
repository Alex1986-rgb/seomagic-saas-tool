/**
 * Утилиты для генерирования данных оптимизации
 */

import { OptimizationItem } from '@/features/audit/types/optimization-types';

// Генерирует основные задачи для оптимизации
const generateBaseTasks = () => [
  'Оптимизация meta-тегов',
  'Исправление заголовков H1-H6',
  'Улучшение контента страницы',
  'Исправление перелинковки',
  'Оптимизация изображений',
  'Исправление микроразметки',
  'Улучшение структуры URL'
];

// Генерирует задачи для конкретного типа страницы
const generateTasksForPageType = (pageType: string) => {
  const baseTasks = generateBaseTasks();
  const specificTasks = {
    'main': [
      'Оптимизация заголовка главной страницы',
      'Улучшение мета-описания с ключевыми словами',
      'Оптимизация контента для повышения релевантности',
    ],
    'product': [
      'Добавление микроразметки товара',
      'Оптимизация описания товара',
      'Добавление уникальных характеристик',
      'Оптимизация изображений товара',
    ],
    'category': [
      'Оптимизация заголовка категории',
      'Улучшение описания категории',
      'Добавление структурированных данных',
    ],
    'blog': [
      'Оптимизация заголовка статьи',
      'Улучшение структуры контента',
      'Добавление внутренних ссылок',
      'Оптимизация изображений в статье',
    ],
    'contact': [
      'Оптимизация контактной информации',
      'Добавление микроразметки организации',
      'Улучшение формы обратной связи',
    ],
    'about': [
      'Оптимизация информации о компании',
      'Улучшение УТП',
      'Добавление социальных доказательств',
    ],
    'service': [
      'Улучшение описания услуги',
      'Оптимизация заголовков услуги',
      'Добавление призывов к действию',
    ]
  };

  // Выбираем тип страницы из доступных или используем общие задачи
  const pageTypeKey = pageType.toLowerCase();
  let availableSpecificTasks: string[] = [];
  
  // Определяем тип страницы по ключевым словам
  for (const [type, tasks] of Object.entries(specificTasks)) {
    if (pageTypeKey.includes(type)) {
      availableSpecificTasks = [...availableSpecificTasks, ...tasks];
      break;
    }
  }
  
  // Если не нашли специфичных задач, используем базовые
  if (availableSpecificTasks.length === 0) {
    availableSpecificTasks = specificTasks.main;
  }

  // Выбираем от 2 до 4 базовых задачи
  const selectedBaseTasks = baseTasks
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);
    
  // Выбираем от 1 до 3 специфичных задачи
  const selectedSpecificTasks = availableSpecificTasks
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1);
  
  // Объединяем и возвращаем задачи
  return [...selectedBaseTasks, ...selectedSpecificTasks];
};

// Генерирует случайный тип приоритета
const generatePriority = (): 'high' | 'medium' | 'low' => {
  const priorities = ['high', 'medium', 'low'];
  return priorities[Math.floor(Math.random() * priorities.length)] as 'high' | 'medium' | 'low';
};

// Генерирует примерную стоимость работ в рублях
const generateCost = (tasks: string[], priority: 'high' | 'medium' | 'low'): number => {
  const baseCost = 1500; // Базовая стоимость оптимизации страницы
  const taskCost = tasks.length * 300; // Стоимость за каждую задачу
  
  const priorityMultiplier = {
    'high': 1.5,
    'medium': 1.0,
    'low': 0.7
  };
  
  return Math.round((baseCost + taskCost) * priorityMultiplier[priority]);
};

// Генерирует URL страницы для демо
const generatePageUrl = (index: number, totalPages: number): string => {
  // Определяем типы страниц сайта
  const pageTypes = [
    { type: 'main', url: '/' },
    { type: 'category', url: '/category/' },
    { type: 'product', url: '/product/' },
    { type: 'blog', url: '/blog/' },
    { type: 'service', url: '/service/' },
    { type: 'about', url: '/about' },
    { type: 'contact', url: '/contact' },
  ];
  
  if (index === 0) {
    return pageTypes[0].url; // Главная страница
  }
  
  if (index === totalPages - 1) {
    return pageTypes[6].url; // Контактная страница
  }
  
  if (index === totalPages - 2) {
    return pageTypes[5].url; // О компании
  }
  
  // Для других страниц выбираем случайный тип
  const randomPageType = pageTypes[Math.floor(Math.random() * (pageTypes.length - 3)) + 1];
  const randomId = Math.floor(Math.random() * 1000) + 1;
  
  if (randomPageType.type === 'blog') {
    return `${randomPageType.url}post-${randomId}-about-something`;
  }
  
  if (randomPageType.type === 'category') {
    const categories = ['electronics', 'clothes', 'furniture', 'books', 'toys'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return `${randomPageType.url}${randomCategory}`;
  }
  
  if (randomPageType.type === 'product') {
    const products = ['iphone', 'laptop', 'tv', 'sofa', 'table', 'book'];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    return `${randomPageType.url}${randomProduct}-${randomId}`;
  }
  
  if (randomPageType.type === 'service') {
    const services = ['delivery', 'installation', 'repair', 'design', 'consulting'];
    const randomService = services[Math.floor(Math.random() * services.length)];
    return `${randomPageType.url}${randomService}`;
  }
  
  return `${randomPageType.url}${randomId}`;
};

// Генерирует категорию для задачи оптимизации
const generateCategory = (priority: 'high' | 'medium' | 'low', pageUrl: string): string => {
  const categories = {
    'high': ['Критические ошибки', 'Технические проблемы', 'SEO-блокеры'],
    'medium': ['Контент', 'Метаданные', 'Структура', 'Перелинковка'],
    'low': ['Улучшения', 'Рекомендации', 'Минорные проблемы']
  };
  
  // Определяем категорию по URL страницы
  if (pageUrl === '/') {
    return 'Главная страница';
  }
  
  if (pageUrl.includes('product')) {
    return 'Товарная страница';
  }
  
  if (pageUrl.includes('blog')) {
    return 'Блог';
  }
  
  if (pageUrl.includes('category')) {
    return 'Категория';
  }
  
  // Если не определили по URL, используем приоритет
  const categoriesForPriority = categories[priority];
  return categoriesForPriority[Math.floor(Math.random() * categoriesForPriority.length)];
};

/**
 * Генерирует элементы оптимизации для демо
 */
export const generateMockOptimizationItems = (pageCount: number = 20): OptimizationItem[] => {
  const items: OptimizationItem[] = [];
  
  for (let i = 0; i < pageCount; i++) {
    const pageUrl = generatePageUrl(i, pageCount);
    const priority = generatePriority();
    const tasks = generateTasksForPageType(pageUrl);
    const cost = generateCost(tasks, priority);
    const category = generateCategory(priority, pageUrl);
    
    items.push({
      id: `optimization-${i}`,
      page: pageUrl,
      tasks,
      cost,
      priority,
      category
    });
  }
  
  return items;
};

/**
 * Генерирует элементы оптимизации для демо
 */
export const generateOptimizationItem = (
  id: string,
  page: string,
  tasks: string[],
  cost: number,
  priority: 'high' | 'medium' | 'low',
  category: string
): OptimizationItem => {
  return {
    id,
    page,
    tasks,
    cost,
    priority,
    category,
    name: `Optimization for ${page}`,
    description: `Tasks: ${tasks.join(', ')}`,
    count: 1,
    price: cost,
    totalPrice: cost
  };
};

/**
 * Рассчитывает общую стоимость оптимизации
 */
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  let totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  
  // Применяем скидку для больших проектов
  if (items.length > 30) {
    totalCost = Math.round(totalCost * 0.85); // 15% скидка
  } else if (items.length > 15) {
    totalCost = Math.round(totalCost * 0.9); // 10% скидка
  } else if (items.length > 5) {
    totalCost = Math.round(totalCost * 0.95); // 5% скидка
  }
  
  return totalCost;
};

/**
 * Генерирует заглушку данных оптимизации для демо
 */
export const generateMockOptimizationData = (pageCount: number = 20) => {
  const items = generateMockOptimizationItems(pageCount);
  const totalCost = calculateTotalCost(items);
  
  return {
    items,
    totalCost,
    pageCount
  };
};
