
/**
 * Types for firecrawl service
 */

export interface CrawlTask {
  id: string;
  url: string;
  domain: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  pages_scanned: number;
  estimated_total_pages: number;
  start_time: string;
  updated_at: string;
  urls: string[];
  isLargeSite?: boolean;
  estimatedUrlCount?: number;
  error?: string;
  current_url?: string;
}

export interface CrawlResult {
  success: boolean;
  message?: string;
  urls?: string[];
  error?: string;
}

export interface CrawlOptions {
  maxPages?: number;
  followExternalLinks?: boolean;
  analyzeMobile?: boolean;
  optimizeImages?: boolean;
  optimizeHeadings?: boolean;
  optimizeMetaTags?: boolean;
  optimizeContent?: boolean;
  dynamicRendering?: boolean;
}

// Набор задач сканирования (временно хранится в памяти)
export const crawlTasks: CrawlTask[] = [];

/**
 * Generate a unique task ID
 */
export const generateTaskId = (): string => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Estimate site size based on domain
 */
export const estimateSiteSize = (domain: string): number => {
  // Простая эвристика для оценки размера сайта
  // В реальном приложении здесь был бы более сложный алгоритм
  
  // Проверяем, относится ли домен к известным крупным сайтам
  if (domain.includes('amazon') || domain.includes('aliexpress') || domain.includes('ebay')) {
    return 5000000;
  }
  
  if (domain.includes('walmart') || domain.includes('target') || domain.includes('bestbuy')) {
    return 2000000;
  }
  
  if (domain.includes('etsy') || domain.includes('shopify') || domain.includes('wayfair')) {
    return 1000000;
  }
  
  // Проверяем популярные блог-платформы
  if (domain.includes('wordpress') || domain.includes('blogger') || domain.includes('medium')) {
    return 500000;
  }
  
  // Правительственные и образовательные сайты
  if (domain.endsWith('.gov') || domain.endsWith('.edu')) {
    return 300000;
  }
  
  // Проверяем популярные новостные сайты
  if (domain.includes('news') || domain.includes('times') || domain.includes('post')) {
    return 800000;
  }
  
  // Проверяем e-commerce окончания
  if (domain.includes('shop') || domain.includes('store') || domain.includes('market')) {
    return 200000;
  }
  
  // По умолчанию предполагаем средний размер
  return 100000;
};
