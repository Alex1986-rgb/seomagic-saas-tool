import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditHistoryItem } from '@/types/audit';
import { pdfColors } from './styles';
import { formatDateString } from './helpers/formatting';
import { addPaginationFooters, addTimestamp } from './helpers';

/**
 * Generates a PDF report for audit history
 */
export const generateHistoryPDF = async (history: AuditHistoryItem[], domain: string): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set document properties
  doc.setProperties({
    title: `История аудитов для ${domain}`,
    subject: 'История изменений SEO аудита',
    author: 'SEO Analyzer',
    creator: 'SEO Analyzer Tool'
  });
  
  // Add header
  doc.setFillColor(...pdfColors.primary);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('История SEO аудитов', 15, 15);
  
  doc.setFontSize(14);
  doc.text(`Домен: ${domain}`, 15, 22);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add report metadata
  let yPosition = 40;
  doc.setFontSize(12);
  doc.text(`Всего аудитов: ${history.length}`, 15, yPosition);
  yPosition += 8;
  doc.text(`Последнее обновление: ${formatDateString(history[0].date)}`, 15, yPosition);
  yPosition += 15;
  
  // Add history table
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('История оценок', 15, yPosition);
  yPosition += 10;
  
  const historyRows = history.map(item => [
    formatDateString(item.date, 'short'),
    item.score.toString(),
    item.changes ? item.changes.toString() : 'N/A'
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Дата', 'Оценка', 'Изменения']],
    body: historyRows,
    theme: 'grid',
    styles: { 
      overflow: 'linebreak', 
      cellWidth: 'wrap',
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 }
    },
    headStyles: { fillColor: pdfColors.primary }
  });
  
  // Add category scores trends
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Add category scores trends section
  createCategoryTrendsSection(doc, history, yPosition);
  
  // Add error trends section
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }
  
  createErrorTrendsSection(doc, history);
  
  // Add information about the generated report
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  
  // Add generation time and other information to the footer
  addTimestamp(doc, 20, 285);
  
  // Add pagination footers
  addPaginationFooters(doc);
  
  // Convert the document to a Blob and return it
  return doc.output('blob');
};

// Function to create category trends section
function createCategoryTrendsSection(doc: jsPDF, history: AuditHistoryItem[], startY: number): void {
  let yPosition = startY;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Тренды категорий', 15, yPosition);
  yPosition += 10;
  
  // Category trends - SEO, Performance, Content, Technical
  const categoryData = history.map(item => ({
    date: formatDateString(item.date, 'short'),
    seo: item.details?.seo?.score || 0,
    performance: item.details?.performance?.score || 0,
    content: item.details?.content?.score || 0,
    technical: item.details?.technical?.score || 0
  }));
  
  const categoryRows = categoryData.map(item => [
    item.date,
    item.seo.toString(),
    item.performance.toString(),
    item.content.toString(),
    item.technical.toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Дата', 'SEO', 'Производительность', 'Контент', 'Технический']],
    body: categoryRows,
    theme: 'striped',
    styles: { 
      overflow: 'linebreak', 
      cellWidth: 'wrap',
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 }
    },
    headStyles: { fillColor: pdfColors.secondary }
  });
}

// Fix color references in createErrorTrendsSection
function createErrorTrendsSection(doc: jsPDF, history: AuditHistoryItem[]): void {
  let yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Тренды ошибок', 15, yPosition);
  yPosition += 10;
  
  // Error trends - critical, important, opportunities
  const errorData = history.map(item => ({
    date: formatDateString(item.date, 'short'),
    critical: item.issues?.critical || 0,
    important: item.issues?.important || 0,
    opportunities: item.issues?.opportunities || 0
  }));
  
  // Colors for each issue type - fix the error/muted references
  const criticalColor = pdfColors.danger; // Use danger instead of error
  const importantColor = pdfColors.warning;
  const opportunityColor = pdfColors.gray; // Use gray instead of muted
  
  const errorRows = errorData.map(item => [
    item.date,
    item.critical.toString(),
    item.important.toString(),
    item.opportunities.toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Дата', 'Критические', 'Важные', 'Рекомендации']],
    body: errorRows,
    theme: 'striped',
    styles: { 
      overflow: 'linebreak', 
      cellWidth: 'wrap',
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 35 }
    },
    headStyles: { fillColor: pdfColors.tertiary }
  });
}
