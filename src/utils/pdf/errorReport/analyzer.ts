
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
      solution: getSolutionForItem(item)
    };
    
    if (item.status === 'error') {
      errors.critical.push(error);
    } else if (item.status === 'warning') {
      errors.important.push(error);
    } else if (item.status === 'good' && item.trend === 'down') {
      // Items with good status but negative trend are considered minor issues
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
