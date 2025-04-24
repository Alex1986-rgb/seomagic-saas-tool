
import { CategoryData } from '@/types/audit';

/**
 * Prepares score data for visualization
 */
export const prepareScoreData = (auditData: {
  seo: CategoryData;
  performance: CategoryData;
  content: CategoryData;
  technical: CategoryData;
}) => {
  return [
    { name: 'SEO', score: auditData.seo.score },
    { name: 'Производительность', score: auditData.performance.score },
    { name: 'Контент', score: auditData.content.score },
    { name: 'Технические аспекты', score: auditData.technical.score }
  ];
};

/**
 * Prepares issues data for visualization
 */
export const prepareIssuesData = (auditData: {
  seo: CategoryData;
  performance: CategoryData;
  content: CategoryData;
  technical: CategoryData;
}) => {
  const issuesByCategory = [
    { name: 'SEO', value: countIssues(auditData.seo) },
    { name: 'Производительность', value: countIssues(auditData.performance) },
    { name: 'Контент', value: countIssues(auditData.content) },
    { name: 'Технические аспекты', value: countIssues(auditData.technical) }
  ];
  // Фильтрация категорий с нулевыми значениями
  return issuesByCategory.filter(item => item.value > 0);
};

/**
 * Counts issues by category
 */
export const countIssues = (category: CategoryData) => {
  return category.items.filter(item => item.status !== 'good').length;
};
