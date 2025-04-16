
import { ErrorReportPdfOptions } from './types';
import { analyzeErrors } from './analyzer';
import { 
  addCriticalErrorsSection, 
  addMajorErrorsSection,
  addMinorErrorsSection,
  addErrorDetailsSection,
  addRecommendationsSection,
  addErrorSummarySection,
  addReportHeaderSection
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
  
  // Convert analyzed errors to the expected format for the section functions
  const errorReportData: ErrorReportData = {
    critical: errors.critical.map(e => ({
      name: e.title,
      description: e.description,
      urls: e.url ? [e.url] : [],
      solution: e.solution
    })),
    major: errors.important.map(e => ({
      name: e.title,
      description: e.description,
      urls: e.url ? [e.url] : [],
      solution: e.solution
    })),
    minor: errors.minor.map(e => ({
      name: e.title,
      description: e.description,
      urls: e.url ? [e.url] : [],
      solution: e.solution
    }))
  };
  
  // Executive summary
  let currentY = addReportHeaderSection(doc, 'Детальный отчет об ошибках', url, formattedDate, auditData.pageCount || 0);
  
  // Add summary section
  currentY = addErrorSummarySection(doc, errorReportData, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Critical errors section
  currentY = addCriticalErrorsSection(doc, errorReportData.critical, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Important issues section
  currentY = addMajorErrorsSection(doc, errorReportData.major, currentY);
  
  // Add spacing between sections
  currentY += 15;
  
  // Minor issues section
  currentY = addMinorErrorsSection(doc, errorReportData.minor, currentY);
  
  // Page-specific errors section if detailed mode is enabled
  if (detailed && urls && urls.length > 0) {
    currentY = addErrorDetailsSection(doc, errorReportData, currentY);
  }
  
  // Recommendations section
  currentY = addRecommendationsSection(doc, errorReportData, currentY);
  
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

// Define ErrorReportData interface locally to resolve the import issue
interface ErrorReportData {
  critical: ErrorTypeData[];
  major: ErrorTypeData[];
  minor: ErrorTypeData[];
}

interface ErrorTypeData {
  name: string;
  description: string;
  urls: string[];
  solution?: string;
}
