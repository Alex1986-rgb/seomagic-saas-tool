
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Генерирует случайное количество страниц для оптимизации
 */
export const generateRandomPageCount = (): number => {
  // Генерируем случайное число страниц от 5 до 300
  return Math.floor(Math.random() * 295) + 5;
};

/**
 * Генерирует массив элементов оптимизации на основе количества страниц
 */
export const generateMockOptimizationItems = (pageCount: number): OptimizationItem[] => {
  const items: OptimizationItem[] = [
    {
      id: uuidv4(),
      name: 'Оптимизация мета-тегов',
      description: 'Улучшение meta title и meta description для всех страниц',
      count: pageCount,
      price: 50,
      totalPrice: pageCount * 50
    },
    {
      id: uuidv4(),
      name: 'Оптимизация контента',
      description: 'Улучшение текстового содержимого с учетом ключевых слов',
      count: Math.min(pageCount, 20),
      price: 250,
      totalPrice: Math.min(pageCount, 20) * 250
    },
    {
      id: uuidv4(),
      name: 'Оптимизация изображений',
      description: 'Оптимизация alt-тегов и сжатие изображений',
      count: Math.min(pageCount * 3, 50),
      price: 30,
      totalPrice: Math.min(pageCount * 3, 50) * 30
    },
    {
      id: uuidv4(),
      name: 'Улучшение структуры',
      description: 'Оптимизация заголовков H1-H6 и внутренней структуры страниц',
      count: pageCount,
      price: 100,
      totalPrice: pageCount * 100
    },
    {
      id: uuidv4(),
      name: 'Технический аудит',
      description: 'Поиск и устранение технических проблем сайта',
      count: 1, // Adding the required 'count' property
      price: 5000,
      totalPrice: 5000
    }
  ];

  return items;
};

/**
 * Рассчитывает общую стоимость оптимизации
 */
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  let total = 0;

  items.forEach(item => {
    if (item.totalPrice) {
      total += item.totalPrice;
    }
  });

  return total;
};

/**
 * Генерирует демонстрационные данные аудита для тестирования
 */
export const generateAuditData = (url: string, pageCount: number = 20) => {
  return {
    url,
    status: 'completed',
    pageCount: pageCount,
    score: Math.floor(Math.random() * 40) + 40, // Случайное значение от 40 до 79
    issues: {
      critical: ["Отсутствуют метатеги на важных страницах", "Медленная загрузка страниц"],
      important: ["Отсутствуют ALT-теги у изображений", "Недостаточно ключевых слов"],
      opportunities: ["Улучшение мета-описаний", "Добавление схем разметки"],
      minor: ["Мелкие ошибки верстки", "Некоторые ссылки не имеют описания"],
      passed: ["Правильная структура URL", "Корректное использование заголовков"]
    },
    optimizationItems: generateMockOptimizationItems(pageCount),
    optimizationCost: 15000
  };
};
