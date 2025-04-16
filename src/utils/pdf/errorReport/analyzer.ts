
import { ErrorData, ErrorGroupData } from './types';

/**
 * Analyzes and groups error data for the report
 */
export function analyzeErrors(errors: ErrorData[]): {
  groups: ErrorGroupData[];
  totalErrors: number;
} {
  const errorGroups = new Map<string, ErrorData[]>();

  // Group errors by type
  errors.forEach(error => {
    const group = errorGroups.get(error.errorType) || [];
    group.push(error);
    errorGroups.set(error.errorType, group);
  });

  // Convert to array and calculate statistics
  const groups: ErrorGroupData[] = Array.from(errorGroups.entries()).map(([type, typeErrors]) => ({
    type,
    count: typeErrors.length,
    percentage: ((typeErrors.length / errors.length) * 100).toFixed(1) + '%',
    errors: typeErrors
  }));

  return {
    groups: groups.sort((a, b) => b.count - a.count),
    totalErrors: errors.length
  };
}

