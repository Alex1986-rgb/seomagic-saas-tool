
/**
 * Page statistics generation functionality
 */

import { PageStatistics } from './optimization';

/**
 * Generates page statistics based on sample URLs and estimations
 */
export function generatePageStatistics(
  estimatedPageCount: number,
  sampleUrls: string[],
  platform: string
): PageStatistics {
  const pageStats: PageStatistics = {
    totalPages: estimatedPageCount,
    subpages: {},
    levels: {}
  };
  
  // Define page type patterns
  const pagePatterns = {
    'product': ['/product/', '/products/', '/item/', '/goods/', '/p/', '/catalog/', '/товар/', '/товары/'],
    'category': ['/category/', '/categories/', '/collection/', '/collections/', '/c/', '/категория/'],
    'blog': ['/blog/', '/news/', '/article/', '/post/', '/блог/', '/новости/'],
    'contact': ['/contact/', '/contacts/', '/feedback/', '/support/', '/контакты/'],
    'about': ['/about/', '/about-us/', '/company/', '/о-нас/', '/о-компании/'],
    'faq': ['/faq/', '/help/', '/faq-help/', '/вопросы/', '/помощь/'],
    'terms': ['/terms/', '/terms-conditions/', '/terms-of-service/', '/условия/'],
    'privacy': ['/privacy/', '/privacy-policy/', '/политика/']
  };
  
  // Initialize page types with zeros
  Object.keys(pagePatterns).forEach(type => {
    pageStats.subpages[type] = 0;
  });
  
  // Analyze sample URLs to determine distribution
  for (const sampleUrl of sampleUrls) {
    try {
      let path = '';
      try {
        const urlObj = new URL(sampleUrl);
        path = urlObj.pathname;
      } catch {
        path = sampleUrl;
      }
      
      // Determine page type
      let pageType = 'other';
      for (const [type, patterns] of Object.entries(pagePatterns)) {
        if (patterns.some(pattern => path.includes(pattern))) {
          pageType = type;
          break;
        }
      }
      
      // Count page type
      pageStats.subpages[pageType] = (pageStats.subpages[pageType] || 0) + 1;
      
      // Determine depth level based on path segments
      const depth = path.split('/').filter(Boolean).length;
      pageStats.levels[depth] = (pageStats.levels[depth] || 0) + 1;
    } catch (error) {
      // Skip problematic URLs
    }
  }
  
  // Normalize counts to match estimated total
  const totalSampleCount = Object.values(pageStats.subpages).reduce((sum, count) => sum + count, 0);
  
  // Apply distribution from sample to full estimate
  if (totalSampleCount > 0) {
    for (const [type, count] of Object.entries(pageStats.subpages)) {
      const ratio = count / totalSampleCount;
      pageStats.subpages[type] = Math.round(estimatedPageCount * ratio);
    }
    
    // Ensure at least minimal values for common page types
    const minimumPages: Record<string, number> = {
      'contact': 1,
      'about': 1,
      'terms': 1,
      'privacy': 1
    };
    
    for (const [type, minCount] of Object.entries(minimumPages)) {
      pageStats.subpages[type] = Math.max(pageStats.subpages[type] || 0, minCount);
    }
    
    // Adjust total to match estimated page count after rounding
    const currentTotal = Object.values(pageStats.subpages).reduce((sum, count) => sum + count, 0);
    const diff = estimatedPageCount - currentTotal;
    
    // Apply difference to product pages (usually the most numerous)
    if (diff !== 0 && pageStats.subpages['product']) {
      pageStats.subpages['product'] += diff;
    }
  } else {
    // Fallback distribution if no sample URLs were analyzed
    const platformDistribution: Record<string, Record<string, number>> = {
      'WordPress': { 'blog': 0.6, 'page': 0.3, 'product': 0.1 },
      'Shopify': { 'product': 0.7, 'category': 0.2, 'page': 0.1 },
      'WooCommerce': { 'product': 0.75, 'category': 0.15, 'blog': 0.1 },
      'Magento': { 'product': 0.8, 'category': 0.15, 'page': 0.05 },
      'OpenCart': { 'product': 0.8, 'category': 0.15, 'page': 0.05 },
      'PrestaShop': { 'product': 0.75, 'category': 0.2, 'page': 0.05 },
      'Bitrix': { 'product': 0.85, 'category': 0.1, 'page': 0.05 },
      'CustomFurniture': { 'product': 0.9, 'category': 0.08, 'page': 0.02 },
      'Unknown': { 'product': 0.4, 'category': 0.3, 'blog': 0.2, 'page': 0.1 }
    };
    
    const distribution = platformDistribution[platform] || platformDistribution['Unknown'];
    
    for (const [type, ratio] of Object.entries(distribution)) {
      pageStats.subpages[type] = Math.round(estimatedPageCount * ratio);
    }
  }
  
  // Normalize levels distribution
  const totalLevelsCount = Object.values(pageStats.levels).reduce((sum, count) => sum + count, 0);
  
  if (totalLevelsCount > 0) {
    for (const [level, count] of Object.entries(pageStats.levels)) {
      const ratio = count / totalLevelsCount;
      pageStats.levels[level] = Math.round(estimatedPageCount * ratio);
    }
    
    // Ensure sum matches total
    const currentLevelsTotal = Object.values(pageStats.levels).reduce((sum, count) => sum + count, 0);
    const levelsDiff = estimatedPageCount - currentLevelsTotal;
    
    // Distribute difference across levels proportionally
    if (levelsDiff !== 0) {
      const levelKeys = Object.keys(pageStats.levels);
      if (levelKeys.length > 0) {
        const mainLevel = levelKeys[Math.floor(levelKeys.length / 2)];
        pageStats.levels[mainLevel] += levelsDiff;
      }
    }
  } else {
    // Default level distribution if no sample data
    pageStats.levels = {
      1: Math.round(estimatedPageCount * 0.05),
      2: Math.round(estimatedPageCount * 0.15),
      3: Math.round(estimatedPageCount * 0.4),
      4: Math.round(estimatedPageCount * 0.25),
      5: Math.round(estimatedPageCount * 0.15)
    };
  }
  
  return pageStats;
}
