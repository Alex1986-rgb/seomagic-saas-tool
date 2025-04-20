
import { PageContent, PageStatistics } from './optimization/types';

export const calculatePageStatistics = (pages: PageContent[]): PageStatistics => {
  const stats: PageStatistics = {
    totalPages: pages.length,
    indexablePages: 0,
    blockedPages: 0,
    brokenLinks: 0,
    averageLoadTime: 0,
    totalWordCount: 0,
    averageWordCount: 0
  };

  pages.forEach(page => {
    // Подсчет индексируемых страниц
    if (page.meta && !page.meta.description?.includes('noindex')) {
      stats.indexablePages++;
    } else {
      stats.blockedPages++;
    }

    // Подсчет слов
    const wordCount = page.wordCount || 0;
    stats.totalWordCount += wordCount;
  });

  // Вычисление средних значений
  stats.averageWordCount = stats.totalPages > 0 ? 
    Math.round(stats.totalWordCount / stats.totalPages) : 0;

  return stats;
};
