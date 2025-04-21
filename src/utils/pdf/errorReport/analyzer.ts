
import { AuditData, AuditItemData } from '@/types/audit';
import { AnalyzedError, AnalyzedErrors } from './types';

/**
 * Analyzes the audit data and extracts all errors categorized by severity
 */
export const analyzeErrors = (auditData: AuditData, urls?: string[]): AnalyzedErrors => {
  const errors: AnalyzedErrors = {
    critical: [],
    important: [],
    minor: [],
    byPage: {}
  };
  
  // Process SEO items
  processCategory(auditData.details.seo.items, errors, 'SEO');
  
  // Process performance items
  processCategory(auditData.details.performance.items, errors, 'Performance');
  
  // Process content items
  processCategory(auditData.details.content.items, errors, 'Content');
  
  // Process technical items
  processCategory(auditData.details.technical.items, errors, 'Technical');
  
  // Process mobile items
  processCategory(auditData.details.mobile.items, errors, 'Mobile');
  
  // Process page-specific errors if URLs are provided
  if (urls && urls.length > 0) {
    organizeErrorsByPage(errors, urls);
  }
  
  return errors;
};

/**
 * Processes items from a category and adds them to appropriate error lists
 */
const processCategory = (items: AuditItemData[], errors: AnalyzedErrors, category: string): void => {
  for (const item of items) {
    const error: AnalyzedError = {
      title: item.title,
      description: item.description,
      category: category,
      impact: getImpactLevel(item),
      solution: getSolutionForItem(item),
      severity: 'important' // Default severity
    };
    
    if (item.status === 'error') {
      error.severity = 'critical';
      errors.critical.push(error);
    } else if (item.status === 'warning') {
      error.severity = 'important';
      errors.important.push(error);
    } else if (item.status === 'good' && item.trend === 'down') {
      // Items with good status but negative trend are considered minor issues
      error.severity = 'minor';
      errors.minor.push(error);
    }
  }
};

/**
 * Maps error status to impact level
 */
const getImpactLevel = (item: AuditItemData): 'high' | 'medium' | 'low' => {
  if (item.status === 'error') return 'high';
  if (item.status === 'warning') return 'medium';
  return 'low';
};

/**
 * Provides solution suggestions based on the audit item
 */
const getSolutionForItem = (item: AuditItemData): string => {
  // If the item already has a solution, return it
  if (item.solution) return item.solution;
  
  // Generic solutions based on item title or category
  if (item.title.toLowerCase().includes('meta')) {
    return 'Add or update meta tags with relevant, unique content for each page.';
  }
  
  if (item.title.toLowerCase().includes('speed') || item.title.toLowerCase().includes('performance')) {
    return 'Optimize images, minimize JS and CSS, implement lazy loading, and consider using a CDN.';
  }
  
  if (item.title.toLowerCase().includes('mobile')) {
    return 'Ensure responsive design, appropriate font sizes, and touch-friendly navigation.';
  }
  
  if (item.title.toLowerCase().includes('content')) {
    return 'Create unique, valuable content with proper headings structure and relevant keywords.';
  }
  
  // Default solution
  return 'Review this issue and implement appropriate fixes based on best practices.';
};

/**
 * Organizes errors by specific pages
 */
const organizeErrorsByPage = (errors: AnalyzedErrors, urls: string[]): void => {
  // Mock implementation - in a real scenario, you'd have page-specific errors
  const allErrors = [...errors.critical, ...errors.important, ...errors.minor];
  
  // Distribute errors randomly across pages for demonstration
  urls.forEach((url, index) => {
    // Associate some errors with each page
    const pageErrors = allErrors.filter((_, i) => i % urls.length === index);
    
    if (pageErrors.length > 0) {
      if (!errors.byPage) errors.byPage = {};
      errors.byPage[url] = pageErrors.map(error => ({
        ...error,
        url: url
      }));
    }
  });
};

export function analyzeCommonPaths(urls: string[]): { path: string; count: number }[] {
  const pathCounts: Record<string, number> = {};
  
  urls.forEach(url => {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      
      // Skip empty paths
      if (!path || path === '/') return;
      
      if (pathCounts[path]) {
        pathCounts[path]++;
      } else {
        pathCounts[path] = 1;
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
    }
  });
  
  // Convert to array and sort by count (descending)
  return Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSeoRecommendations(
  brokenLinksCount: number,
  duplicatesCount: number,
  totalUrls: number,
  depthData: { level: number; count: number }[] = []
): Array<{ title: string; description: string; priority: string }> {
  const recommendations = [];
  
  // Broken links recommendations
  if (brokenLinksCount > 0) {
    const priority = brokenLinksCount > 10 ? 'high' : (brokenLinksCount > 5 ? 'medium' : 'low');
    recommendations.push({
      title: 'Исправьте битые ссылки',
      description: `Обнаружено ${brokenLinksCount} битых ссылок. Исправьте их для улучшения пользовательского опыта и SEO.`,
      priority
    });
  }
  
  // Duplicates recommendations
  if (duplicatesCount > 0) {
    const priority = duplicatesCount > 10 ? 'high' : (duplicatesCount > 5 ? 'medium' : 'low');
    recommendations.push({
      title: 'Устраните дубликаты страниц',
      description: `Обнаружено ${duplicatesCount} групп дублирующихся страниц. Используйте каноническую ссылку или редиректы для улучшения SEO.`,
      priority
    });
  }
  
  // Depth recommendations
  if (depthData.length > 0) {
    const deepPages = depthData.filter(d => d.level > 4).reduce((sum, d) => sum + d.count, 0);
    if (deepPages > 0) {
      const percentage = (deepPages / totalUrls) * 100;
      const priority = percentage > 30 ? 'high' : (percentage > 15 ? 'medium' : 'low');
      recommendations.push({
        title: 'Оптимизируйте глубину вложенности',
        description: `${deepPages} страниц (${percentage.toFixed(1)}%) находятся на глубине более 4 уровней. Упростите структуру сайта для улучшения индексации.`,
        priority
      });
    }
  }
  
  // URL structure recommendation
  recommendations.push({
    title: 'Оптимизируйте структуру URL',
    description: 'Создайте четкую, понятную структуру URL с использованием ключевых слов для улучшения SEO.',
    priority: 'medium'
  });
  
  // Sitemap recommendation
  recommendations.push({
    title: 'Создайте и обновите XML-карту сайта',
    description: 'Создайте и регулярно обновляйте XML-карту сайта, чтобы улучшить индексацию страниц поисковыми системами.',
    priority: 'medium'
  });
  
  // Mobile optimization
  recommendations.push({
    title: 'Проверьте мобильную оптимизацию',
    description: 'Убедитесь, что ваш сайт оптимизирован для мобильных устройств и имеет адаптивный дизайн.',
    priority: 'high'
  });
  
  // Page speed
  recommendations.push({
    title: 'Улучшите скорость з��грузки страниц',
    description: 'Оптимизируйте изображения, минимизируйте код и используйте кэширование для улучшения скорости загрузки страниц.',
    priority: 'high'
  });
  
  return recommendations;
}

export function getSiteSummary(
  score: number,
  brokenLinksCount: number,
  duplicatesCount: number,
  totalUrls: number
): string {
  let summary = '';
  
  if (score >= 90) {
    summary = `Общая оценка сайта: ${score}/100. Отличный результат! `;
  } else if (score >= 70) {
    summary = `Общая оценка сайта: ${score}/100. Хороший результат, но есть возможности для улучшения. `;
  } else if (score >= 50) {
    summary = `Общая оценка сайта: ${score}/100. Удовлетворительный результат, требуется работа над оптимизацией. `;
  } else {
    summary = `Общая оценка сайта: ${score}/100. Требуется значительная оптимизация. `;
  }
  
  if (brokenLinksCount > 0) {
    const percentage = (brokenLinksCount / totalUrls) * 100;
    summary += `Обнаружено ${brokenLinksCount} битых ссылок (${percentage.toFixed(1)}% от общего числа URL). `;
  } else {
    summary += 'Битых ссылок не обнаружено. ';
  }
  
  if (duplicatesCount > 0) {
    const percentage = (duplicatesCount / totalUrls) * 100;
    summary += `Обнаружено ${duplicatesCount} групп дублирующихся страниц (затрагивает примерно ${percentage.toFixed(1)}% контента). `;
  } else {
    summary += 'Дублирующихся страниц не обнаружено. ';
  }
  
  summary += `Всего просканировано ${totalUrls} уникальных URL.`;
  
  return summary;
}
