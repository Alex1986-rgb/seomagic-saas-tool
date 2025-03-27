
import { ErrorReportPdfOptions } from './types';
import { analyzeErrors } from './analyzer';
import { 
  renderCriticalErrorsSection, 
  renderImportantIssuesSection,
  renderMinorIssuesSection,
  renderPageErrorsSection,
  renderRecommendationsSection,
  renderScoresSection,
  renderExecutiveSummarySection
} from './sections';
import jsPDF from 'jspdf';
import { addPaginationFooters } from '../helpers';
import { formatDateString } from '../helpers/formatting';
import { formatReportHeader } from '../styles/formatting';

// Re-export types using "export type" syntax for isolatedModules
export type { AnalyzedErrors, ErrorReportPdfOptions, AnalyzedError } from './types';
export { analyzeErrors } from './analyzer';

/**
 * Generates a PDF error report based on the audit data
 */
export const generateErrorReportPdf = async (options: ErrorReportPdfOptions): Promise<Blob> => {
  const { auditData, url, urls = [], includeScreenshots = false, detailed = false } = options;
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Format date
  const formattedDate = formatDateString(auditData.date);
  
  // Add header
  formatReportHeader(doc, 'Детальный отчет об ошибках', formattedDate);
  
  // Analyze errors
  const errors = analyzeErrors(auditData, urls);
  
  // Executive summary
  let currentY = renderExecutiveSummarySection(doc, errors, auditData, url);
  
  // Add spacing between sections
  currentY += 15;
  
  // Critical errors section
  currentY = renderCriticalErrorsSection(doc, errors, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Important issues section
  currentY = renderImportantIssuesSection(doc, errors, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Minor issues section
  currentY = renderMinorIssuesSection(doc, errors, currentY);
  
  // Page-specific errors section if detailed mode is enabled
  if (detailed && urls && urls.length > 0) {
    renderPageErrorsSection(doc, errors);
  }
  
  // Recommendations section
  renderRecommendationsSection(doc);
  
  // SEO scores section
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
