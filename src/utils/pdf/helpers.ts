
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

/**
 * Adds a formatted timestamp to the PDF
 */
export function addTimestamp(doc: jsPDF, x: number, y: number): void {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Сгенерировано: ${formattedDate}`, x, y);
}

/**
 * Adds a table of contents to the PDF
 */
export function addTableOfContents(doc: jsPDF, sections: Array<{title: string, page: number}>): void {
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Содержание', 15, 40);
  
  let yPosition = 50;
  
  sections.forEach((section, index) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Draw dot leaders
    const title = section.title;
    const page = `${section.page}`;
    
    doc.text(`${index + 1}. ${title}`, 15, yPosition);
    doc.text(page, 195, yPosition, { align: 'right' });
    
    yPosition += 8;
  });
}

/**
 * Adds copyright notice to the PDF
 */
export function addCopyright(doc: jsPDF, companyName: string = 'SEO Analyzer'): void {
  const year = new Date().getFullYear();
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`© ${year} ${companyName}. Все права защищены.`, 105, 290, { align: 'center' });
}
