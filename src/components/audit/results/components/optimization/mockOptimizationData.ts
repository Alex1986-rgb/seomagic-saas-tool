
import { v4 as uuidv4 } from 'uuid';

export const generateRandomPageCount = () => {
  // Generate a random page count between 15 and 300
  return Math.floor(Math.random() * (300 - 15 + 1) + 15);
};

export const generateMockOptimizationItems = (pageCount: number) => {
  // Calculate proportional distribution of pages across categories
  const metaPages = Math.floor(pageCount * 0.9); // 90% of pages need meta optimization
  const contentPages = Math.floor(pageCount * 0.7); // 70% need content optimization
  const structurePages = Math.floor(pageCount * 0.5); // 50% need structure optimization
  const urlPages = Math.floor(pageCount * 0.4); // 40% need URL optimization
  const imagePages = Math.floor(pageCount * 0.6); // 60% have image optimization needs
  
  return [
    {
      id: uuidv4(),
      type: 'meta',
      name: 'Оптимизация мета-тегов',
      description: 'Настройка title, description, keywords для всех страниц',
      pagesCount: metaPages,
      costPerPage: 150,
      totalCost: metaPages * 150
    },
    {
      id: uuidv4(),
      type: 'content',
      name: 'Оптимизация контента',
      description: 'Улучшение текстов и заголовков для SEO',
      pagesCount: contentPages,
      costPerPage: 250,
      totalCost: contentPages * 250
    },
    {
      id: uuidv4(),
      type: 'structure',
      name: 'Улучшение структуры',
      description: 'Оптимизация HTML-структуры и семантики',
      pagesCount: structurePages,
      costPerPage: 200,
      totalCost: structurePages * 200
    },
    {
      id: uuidv4(),
      type: 'url',
      name: 'Оптимизация URL',
      description: 'Улучшение ЧПУ и структуры URL',
      pagesCount: urlPages,
      costPerPage: 100,
      totalCost: urlPages * 100
    },
    {
      id: uuidv4(),
      type: 'images',
      name: 'Оптимизация изображений',
      description: 'Сжатие, alt-теги и оптимизация изображений',
      pagesCount: imagePages,
      costPerPage: 120,
      totalCost: imagePages * 120
    }
  ];
};

export const calculateTotalCost = (items: any[]) => {
  return items.reduce((total, item) => total + item.totalCost, 0);
};
