
import { AuditData, AuditItemData } from '@/types/audit';
import { AnalyzedError, AnalyzedErrors } from './types';

/**
 * Analyzes the audit data and extracts all errors categorized by severity
 */
export const analyzeErrors = (auditData: AuditData): AnalyzedErrors => {
  const errors: AnalyzedErrors = {
    critical: [],
    important: [],
    minor: []
  };
  
  // Process SEO items
  processCategory(auditData.details.seo.items, errors);
  
  // Process performance items
  processCategory(auditData.details.performance.items, errors);
  
  // Process content items
  processCategory(auditData.details.content.items, errors);
  
  // Process technical items
  processCategory(auditData.details.technical.items, errors);
  
  // Process mobile items
  processCategory(auditData.details.mobile.items, errors);
  
  return errors;
};

/**
 * Processes items from a category and adds them to appropriate error lists
 */
const processCategory = (items: AuditItemData[], errors: AnalyzedErrors): void => {
  for (const item of items) {
    const error: AnalyzedError = {
      title: item.title,
      description: item.description
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
