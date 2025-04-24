/**
 * Formats date string for PDF reports
 */
export function formatDateString(dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  try {
    const date = new Date(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('ru-RU');
      case 'long':
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'medium':
      default:
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    }
  } catch (e) {
    return dateString;
  }
}

/**
 * Formats number as currency
 */
export function formatCurrency(amount: number, currency: string = '₽'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: currency ? 'currency' : 'decimal',
    currency: currency === '₽' ? 'RUB' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats score text based on value
 */
export function formatScoreText(score: number): string {
  if (score >= 90) return 'Отлично';
  if (score >= 80) return 'Очень хорошо';
  if (score >= 70) return 'Хорошо';
  if (score >= 60) return 'Удовлетворительно';
  if (score >= 40) return 'Требует улучшений';
  return 'Критично';
}

/**
 * Processes text for PDF by removing or replacing characters that might cause rendering issues
 */
export function sanitizeTextForPDF(text: string): string {
  if (!text) return '';
  
  // Remove or replace problematic characters
  return text
    .replace(/[\u2028\u2029]/g, ' ') // Line terminators
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
    .replace(/[^\x00-\x7F]/g, char => { 
      // Try to keep cyrillics and common special characters, replace others
      if (/[\u0400-\u04FF]/.test(char)) return char; // Cyrillic
      if (/[\u2010-\u2015\u2212]/.test(char)) return '-'; // Various hyphens and minus
      if (/[\u2018\u2019]/.test(char)) return "'"; // Single quotes
      if (/[\u201C\u201D]/.test(char)) return '"'; // Double quotes
      if (/[\u2026]/.test(char)) return '...'; // Ellipsis
      return char;
    });
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
