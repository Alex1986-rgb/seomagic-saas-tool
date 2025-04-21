
import jsPDF from 'jspdf';

/**
 * Adds pagination footer to all pages in the PDF
 */
export function addPaginationFooters(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add page number at the bottom
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${pageCount}`, 105, 285, { align: 'center' });
  }
}
