
import jsPDF from 'jspdf';

/**
 * Adds page numbers to the bottom of each page in a PDF
 */
export const addPageNumbers = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Go through all pages
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${pageCount}`, 105, 285, { align: 'center' });
  }
};

/**
 * Adds pagination footers to the PDF with a bottom margin
 */
export const addPaginationFooters = (doc: jsPDF, bottomMargin = 10): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Go through all pages
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${pageCount}`, 105, 297 - bottomMargin, { align: 'center' });
  }
};
