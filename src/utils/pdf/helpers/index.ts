
import jsPDF from 'jspdf';

/**
 * Extends jsPDF with additional methods
 */
export function extendJsPDF(doc: jsPDF): void {
  // This function is a placeholder for any extensions
  // In a real implementation, this would extend jsPDF with custom methods
  // But for now we're just using it as a hook for consistency
}

/**
 * Adds pagination footers to all pages
 */
export function addPaginationFooters(doc: jsPDF): void {
  const numPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= numPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${numPages}`, 105, 290, { align: 'center' });
  }
}

/**
 * Adds a timestamp to the document
 */
export function addTimestamp(doc: jsPDF, x: number, y: number): void {
  const now = new Date();
  const timestamp = now.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Отчет создан: ${timestamp}`, x, y, { align: 'left' });
}
