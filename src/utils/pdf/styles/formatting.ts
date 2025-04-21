
/**
 * Formats a date string to a human-readable format
 */
export function formatDateString(dateStr: string, locale: string = 'ru-RU'): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateStr;
  }
}

/**
 * Formats a number with thousands separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

/**
 * Truncates text to specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats the report header with standardized styling
 */
export function formatReportHeader(
  doc: any,
  title: string,
  date: string
): void {
  // Set background color for header
  doc.setFillColor(56, 189, 248); // Primary color
  doc.rect(0, 0, 210, 30, 'F');
  
  // Set title
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 15, 15);
  
  // Set date
  doc.setFontSize(14);
  doc.text(`Дата: ${date}`, 15, 22);
  
  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);
}

/**
 * Formats a title in the PDF document
 */
export function formatTitle(doc: any, text: string, yPos: number): void {
  doc.setFontSize(18);
  doc.setTextColor(41, 98, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 20, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
}

/**
 * Formats a subtitle in the PDF document
 */
export function formatSubtitle(doc: any, text: string, yPos: number): void {
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 20, yPos);
  doc.setFont('helvetica', 'normal');
}

/**
 * Formats a heading in the PDF document
 */
export function formatHeading(doc: any, text: string, yPos: number): void {
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 20, yPos);
  doc.setFont('helvetica', 'normal');
}

/**
 * Formats a paragraph in the PDF document
 */
export function formatParagraph(doc: any, text: string, yPos: number): void {
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(text, 20, yPos);
}

export default {
  formatDateString,
  formatNumber,
  truncateText,
  formatReportHeader,
  formatTitle,
  formatSubtitle,
  formatHeading,
  formatParagraph
};
