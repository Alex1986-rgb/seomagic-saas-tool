
import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';

/**
 * Adds pagination footer to all pages in the PDF
 */
export function addPaginationFooters(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add page number at the bottom
    doc.setFontSize(9);
    doc.setTextColor(...pdfColors.gray);
    doc.text(`Страница ${i} из ${pageCount}`, 105, 285, { align: 'center' });
    
    // Add stylish footer line
    doc.setDrawColor(...pdfColors.primary);
    doc.setLineWidth(0.5);
    doc.line(15, 280, 195, 280);
  }
}

/**
 * Adds a table of contents to the PDF
 */
export function addTableOfContents(doc: jsPDF, sections: Array<{title: string, page: number}>): void {
  doc.setFontSize(16);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Содержание', 105, 40, { align: 'center' });
  
  // Add decorative line
  doc.setDrawColor(...pdfColors.primary);
  doc.setLineWidth(0.5);
  doc.line(30, 45, 180, 45);
  
  let yPosition = 55;
  
  sections.forEach((section, index) => {
    doc.setFontSize(11);
    doc.setTextColor(...pdfColors.dark);
    
    // Draw dot leaders
    const title = section.title;
    const page = `${section.page}`;
    
    doc.text(`${index + 1}. ${title}`, 25, yPosition);
    doc.text(page, 180, yPosition, { align: 'right' });
    
    // Draw dot leader line between title and page number
    doc.setDrawColor(...pdfColors.gray);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([0.5, 1], 0);
    doc.line(25 + doc.getTextWidth(`${index + 1}. ${title}`) + 5, yPosition - 1, 
             180 - doc.getTextWidth(page) - 5, yPosition - 1);
    doc.setLineDashPattern([0], 0);
    
    yPosition += 10;
  });
}

/**
 * Creates a stylish header for page
 */
export function addPageHeader(doc: jsPDF, title: string, pageNumber?: number): void {
  // Dark header background
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(title, 105, 14, { align: 'center' });
  
  // Optional page number in header
  if (pageNumber) {
    doc.setFontSize(10);
    doc.text(`${pageNumber}`, 195, 14, { align: 'right' });
  }
}
