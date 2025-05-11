
import { faker } from '@faker-js/faker';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

/**
 * Generate a list of mock optimization items
 */
export const generateMockOptimizationItems = (pageCount: number): OptimizationItem[] => {
  const items: OptimizationItem[] = [
    {
      id: faker.string.uuid(),
      name: 'Оптимизация мета-тегов',
      description: 'Улучшение заголовков, описаний и ключевых слов для лучшей индексации',
      count: Math.ceil(pageCount * 0.7),
      price: 150,
      totalPrice: Math.ceil(pageCount * 0.7) * 150,
      category: 'meta',
      priority: 'high',
      page: 'все страницы',
      tasks: ['Оптимизация мета-тегов'],
      cost: Math.ceil(pageCount * 0.7) * 150,
      errorCount: Math.ceil(pageCount * 0.5),
      type: 'meta'
    },
    {
      id: faker.string.uuid(),
      name: 'Создание Schema.org разметки',
      description: 'Микроразметка для улучшения отображения в результатах поиска',
      count: Math.min(10, Math.ceil(pageCount * 0.3)),
      price: 300,
      totalPrice: Math.min(10, Math.ceil(pageCount * 0.3)) * 300,
      category: 'structure',
      priority: 'medium',
      page: 'основные страницы',
      tasks: ['Создание микроразметки'],
      cost: Math.min(10, Math.ceil(pageCount * 0.3)) * 300,
      errorCount: Math.ceil(pageCount * 0.2),
      type: 'structure'
    },
    {
      id: faker.string.uuid(),
      name: 'Оптимизация контента',
      description: 'Улучшение текстового содержания страниц для повышения релевантности',
      count: Math.ceil(pageCount * 0.5),
      price: 500,
      totalPrice: Math.ceil(pageCount * 0.5) * 500,
      category: 'content',
      priority: 'high',
      page: 'ключевые страницы',
      tasks: ['Оптимизация контента'],
      cost: Math.ceil(pageCount * 0.5) * 500,
      errorCount: Math.ceil(pageCount * 0.4),
      type: 'content'
    },
    {
      id: faker.string.uuid(),
      name: 'Оптимизация изображений',
      description: 'Сжатие и добавление атрибутов alt для улучшения SEO',
      count: Math.ceil(pageCount * 2.5), // Примерно 2-3 изображения на страницу
      price: 50,
      totalPrice: Math.ceil(pageCount * 2.5) * 50,
      category: 'images',
      priority: 'medium',
      page: 'все страницы',
      tasks: ['Оптимизация изображений'],
      cost: Math.ceil(pageCount * 2.5) * 50,
      errorCount: Math.ceil(pageCount * 1.5),
      type: 'media'
    },
    {
      id: faker.string.uuid(),
      name: 'Улучшение скорости загрузки',
      description: 'Оптимизация кода и ресурсов для ускорения загрузки страниц',
      count: Math.ceil(pageCount * 0.2),
      price: 800,
      totalPrice: Math.ceil(pageCount * 0.2) * 800,
      category: 'performance',
      priority: 'high',
      page: 'весь сайт',
      tasks: ['Оптимизация скорости'],
      cost: Math.ceil(pageCount * 0.2) * 800,
      errorCount: Math.ceil(pageCount * 0.1),
      type: 'performance'
    }
  ];
  
  return items;
};

/**
 * Calculate total cost for optimization
 */
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((total, item) => total + (item.totalPrice || 0), 0);
};

/**
 * Generate a random page count for demos
 */
export const generateRandomPageCount = (): number => {
  return faker.number.int({ min: 10, max: 200 });
};

/**
 * Generate mock audit data for demonstrations
 */
export const generateAuditData = (url: string) => {
  const pageCount = generateRandomPageCount();
  const optimizationItems = generateMockOptimizationItems(pageCount);
  const optimizationCost = calculateTotalCost(optimizationItems);
  
  return {
    url,
    pageCount,
    score: faker.number.int({ min: 30, max: 70 }),
    status: 'completed',
    crawlDate: faker.date.recent(),
    issues: {
      critical: [
        'Отсутствуют мета-теги на 23 страницах',
        'Дубликаты заголовков на 7 страницах',
        'Отсутствует SSL-сертификат'
      ],
      important: [
        'Медленная загрузка на мобильных устройствах',
        'Отсутствует адаптивная версия на 12 страницах',
        'Неоптимизированные изображения: 47 файлов'
      ],
      opportunities: [
        'Улучшить структуру внутренних ссылок',
        'Добавить Schema.org разметку',
        'Оптимизировать контент на 18 страницах'
      ],
      minor: [
        'Отсутствуют alt-атрибуты у 34 изображений',
        'Устаревший формат изображений на 27 файлах',
        'Отсутствуют заголовки h2 на 9 страницах'
      ],
      passed: [
        'Правильная структура URL',
        'Карта сайта XML присутствует',
        'Правильная настройка robots.txt'
      ]
    },
    optimizationItems,
    optimizationCost,
    recommendations: [
      'Добавить мета-теги на страницы без описаний',
      'Исправить дубликаты заголовков',
      'Установить SSL-сертификат',
      'Оптимизировать сайт для мобильных устройств',
      'Оптимизировать изображения для ускорения загрузки'
    ]
  };
};
