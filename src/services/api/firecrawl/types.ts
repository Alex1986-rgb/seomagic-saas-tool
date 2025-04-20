
import { v4 as uuidv4 } from 'uuid';

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
  urls?: string[];
  error?: string;
  isLargeSite?: boolean;
  estimatedUrlCount?: number;
}

export const crawlTasks: CrawlTask[] = [];

export const generateTaskId = (): string => {
  return uuidv4();
};

// Оценка количества страниц на основе домена
export const estimateSiteSize = (domain: string): number => {
  // Большие известные сайты
  const largeSites: Record<string, number> = {
    'wildberries.ru': 1500000,
    'ozon.ru': 2000000,
    'avito.ru': 1800000,
    'dns-shop.ru': 500000,
    'mvideo.ru': 450000,
    'aliexpress.ru': 3000000,
    'kazanexpress.ru': 800000,
    'ikea.com': 350000,
    'amazon.com': 5000000,
    'ebay.com': 2500000
  };
  
  // Проверяем, содержит ли домен ключевые слова, указывающие на крупный сайт
  const sizeMultiplier = 
    domain.includes('shop') || domain.includes('store') ? 150000 :
    domain.includes('catalog') ? 180000 :
    domain.includes('market') ? 250000 :
    domain.includes('mall') ? 200000 :
    domain.includes('products') ? 160000 :
    domain.includes('blog') ? 80000 :
    domain.includes('forum') ? 120000 :
    domain.includes('news') ? 100000 :
    50000; // Значение по умолчанию для неизвестных сайтов
  
  // Если это известный крупный сайт
  for (const [site, count] of Object.entries(largeSites)) {
    if (domain.includes(site)) {
      return count;
    }
  }
  
  return sizeMultiplier;
};
