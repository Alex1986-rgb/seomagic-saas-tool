
/**
 * Analyzes common paths in the URLs
 */
export function analyzeCommonPaths(urls: string[]): Array<{path: string, count: number}> {
  const pathCounts = new Map<string, number>();
  
  urls.forEach(url => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      // Count occurrences of each path
      if (pathCounts.has(path)) {
        pathCounts.set(path, pathCounts.get(path)! + 1);
      } else {
        pathCounts.set(path, 1);
      }
    } catch (error) {
      // Skip invalid URLs
    }
  });
  
  // Convert to array and sort by count (descending)
  const pathArray = Array.from(pathCounts.entries()).map(([path, count]) => ({
    path,
    count
  }));
  
  return pathArray.sort((a, b) => b.count - a.count);
}

/**
 * Generates SEO recommendations based on scan results
 */
export function getSeoRecommendations(
  brokenLinksCount: number,
  duplicatesCount: number,
  totalUrls: number,
  depthData?: Array<{ level: number; count: number }>
): Array<{title: string, description: string, priority: 'high' | 'medium' | 'low'}> {
  const recommendations: Array<{title: string, description: string, priority: 'high' | 'medium' | 'low'}> = [];
  
  // Broken links recommendations
  if (brokenLinksCount > 0) {
    const priority = brokenLinksCount > totalUrls * 0.05 ? 'high' : 'medium';
    recommendations.push({
      title: 'Исправьте битые ссылки',
      description: `На сайте обнаружено ${brokenLinksCount} битых ссылок. Это негативно влияет на пользовательский опыт и SEO.`,
      priority
    });
  }
  
  // Duplicate content recommendations
  if (duplicatesCount > 0) {
    const priority = duplicatesCount > totalUrls * 0.1 ? 'high' : 'medium';
    recommendations.push({
      title: 'Устраните дублированный контент',
      description: `Обнаружено ${duplicatesCount} страниц с дублирующимся содержимым. Используйте атрибуты canonical и 301-редиректы.`,
      priority
    });
  }
  
  // Site structure recommendations
  if (depthData && depthData.some(d => d.level > 3 && d.count > totalUrls * 0.2)) {
    recommendations.push({
      title: 'Оптимизируйте структуру сайта',
      description: 'Слишком много страниц находятся на большой глубине вложенности. Поисковые роботы могут не индексировать эти страницы эффективно.',
      priority: 'medium'
    });
  }
  
  // Add generic recommendations if list is too short
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Создайте или улучшите файл robots.txt',
      description: 'Правильно настроенный файл robots.txt помогает поисковым системам эффективнее индексировать ваш сайт.',
      priority: 'medium'
    });
    
    recommendations.push({
      title: 'Оптимизируйте скорость загрузки страниц',
      description: 'Скорость загрузки страниц является важным фактором ранжирования и влияет на пользовательский опыт.',
      priority: 'medium'
    });
    
    recommendations.push({
      title: 'Внедрите микроразметку Schema.org',
      description: 'Микроразметка помогает поисковым системам лучше понимать содержимое вашего сайта и может улучшить отображение в результатах поиска.',
      priority: 'low'
    });
  }
  
  return recommendations;
}

/**
 * Generates a summary of the site analysis
 */
export function getSiteSummary(
  score: number,
  brokenLinksCount: number,
  duplicatesCount: number,
  totalUrls: number
): string {
  let summary = '';
  
  if (score >= 90) {
    summary = `Ваш сайт находится в отличном состоянии! Из ${totalUrls} проанализированных страниц, `;
  } else if (score >= 70) {
    summary = `Ваш сайт находится в хорошем состоянии, но есть возможности для улучшения. Из ${totalUrls} проанализированных страниц, `;
  } else if (score >= 50) {
    summary = `Ваш сайт требует некоторой оптимизации. Из ${totalUrls} проанализированных страниц, `;
  } else {
    summary = `Ваш сайт требует значительной оптимизации. Из ${totalUrls} проанализированных страниц, `;
  }
  
  // Add details about issues
  if (brokenLinksCount > 0) {
    summary += `обнаружено ${brokenLinksCount} битых ссылок `;
    
    if (duplicatesCount > 0) {
      summary += `и ${duplicatesCount} дублирующихся страниц. `;
    } else {
      summary += `. `;
    }
  } else if (duplicatesCount > 0) {
    summary += `обнаружено ${duplicatesCount} дублирующихся страниц. `;
  } else {
    summary += `не обнаружено существенных проблем. `;
  }
  
  // Add recommendation
  summary += `Мы рекомендуем выполнить предложенные улучшения для повышения эффективности вашего сайта в поисковых системах и улучшения пользовательского опыта.`;
  
  return summary;
}
