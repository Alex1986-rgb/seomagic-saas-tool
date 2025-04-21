
/**
 * Analyzes common URL path patterns in the crawl results
 */
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

/**
 * Generates SEO recommendations based on crawl data
 */
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
  
  // Additional standard recommendations
  recommendations.push({
    title: 'Оптимизируйте структуру URL',
    description: 'Создайте четкую, понятную структуру URL с использованием ключевых слов для улучшения SEO.',
    priority: 'medium'
  });
  
  recommendations.push({
    title: 'Создайте и обновите XML-карту сайта',
    description: 'Создайте и регулярно обновляйте XML-карту сайта, чтобы улучшить индексацию страниц поисковыми системами.',
    priority: 'medium'
  });
  
  recommendations.push({
    title: 'Проверьте мобильную оптимизацию',
    description: 'Убедитесь, что ваш сайт оптимизирован для мобильных устройств и имеет адаптивный дизайн.',
    priority: 'high'
  });
  
  recommendations.push({
    title: 'Улучшите скорость загрузки страниц',
    description: 'Оптимизируйте изображения, минимизируйте код и используйте кэширование для улучшения скорости загрузки страниц.',
    priority: 'high'
  });
  
  return recommendations;
}

/**
 * Generates a comprehensive site summary based on analysis results
 */
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
