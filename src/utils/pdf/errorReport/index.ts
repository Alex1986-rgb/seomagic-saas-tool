
import { ErrorReportPdfOptions } from './types';
import { analyzeErrors } from './analyzer';
import { 
  renderCriticalErrorsSection, 
  renderImportantIssuesSection,
  renderMinorIssuesSection,
  renderPageErrorsSection,
  renderRecommendationsSection,
  renderScoresSection
} from './sections';
import jsPDF from 'jspdf';
import { addPaginationFooters } from '../helpers';

// Re-export types using "export type" syntax for isolatedModules
export type { AnalyzedErrors, ErrorReportPdfOptions, AnalyzedError } from './types';
export { analyzeErrors } from './analyzer';

/**
 * Generates a PDF error report based on the audit data
 */
export const generateErrorReportPdf = async (options: ErrorReportPdfOptions): Promise<Blob> => {
  const { auditData, url, urls } = options;
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Format date
  const formattedDate = new Date(auditData.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Add title
  doc.setFontSize(22);
  doc.text('Детальный отчет об ошибках', 105, 20, { align: 'center' });
  
  // Add website information
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 14, 30);
  doc.text(`Дата аудита: ${formattedDate}`, 14, 38);
  
  // Analyze errors
  const errors = analyzeErrors(auditData);
  
  // Render error sections
  let currentY = 50;
  
  // Render critical errors section
  currentY = renderCriticalErrorsSection(doc, errors, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Render important issues section
  currentY = renderImportantIssuesSection(doc, errors, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Render minor issues section
  renderMinorIssuesSection(doc, errors, currentY);
  
  // Render URL-specific errors section if URLs are provided
  renderPageErrorsSection(doc, urls);
  
  // Render recommendations section
  renderRecommendationsSection(doc);
  
  // Render SEO scores section
  renderScoresSection(doc, auditData);
  
  // Add footer information about the generated report
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 14, 285);
  
  // Add pagination footers
  addPaginationFooters(doc);
  
  // Convert the document to a Blob and return it
  return doc.output('blob');
};
