
import jsPDF from 'jspdf';
import { ErrorData, ErrorReportOptions } from './types';
import { analyzeErrors } from './analyzer';
import { addSummarySection } from './sections/summary';
import { addErrorDetailsSection } from './sections/details';
import { addStackTraceSection } from './sections/stacktrace';
import { addBrowserInfoSection } from './sections/browserInfo';
import { addPaginationFooters } from '../helpers/pagination';
import { formatHeader } from './utils';

/**
 * Generates the complete PDF report
 */
export async function generatePdfReport(
  errors: ErrorData[],
  options: ErrorReportOptions = {}
): Promise<void> {
  const {
    includeStackTrace = true,
    includeBrowserInfo = true,
    includeUserAgent = false,
    title = 'Отчет об ошибках',
    subtitle = 'Обнаруженные ошибки и проблемы сайта',
    groupByType = true
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add header
  let currentY = formatHeader(doc, title, subtitle);

  // Analyze errors
  const { groups, totalErrors } = analyzeErrors(errors);

  // Add summary section
  currentY = await addSummarySection(doc, groups, totalErrors, currentY);

  // Add error details
  currentY = await addErrorDetailsSection(doc, groups, currentY);

  // Add stack traces if requested
  if (includeStackTrace) {
    currentY = await addStackTraceSection(doc, errors, currentY);
  }

  // Add browser info if requested
  if (includeBrowserInfo) {
    currentY = await addBrowserInfoSection(doc, errors, includeUserAgent, currentY);
  }

  // Add pagination footers
  addPaginationFooters(doc);

  // Save the PDF
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`error-report-${dateStr}.pdf`);
}

