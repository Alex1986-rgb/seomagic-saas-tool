
/**
 * Formats a date string for display
 */
export const formatDateString = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats a Date object for display
 */
export const formatDate = (date: Date | undefined): string => {
  if (!date) return 'Н/Д';
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Gets category status based on score
 */
export const getCategoryStatus = (score: number): string => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'good';
  if (score >= 50) return 'warning';
  return 'error';
};
