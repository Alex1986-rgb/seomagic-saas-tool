
import { ErrorData, ErrorReportOptions } from './types';
import { generatePdfReport } from './generator';
import { analyzeErrors } from './analyzer';

/**
 * Generates a PDF error report from error data
 */
export const generateErrorReportPdf = async (
  errors: ErrorData[],
  options: ErrorReportOptions = {}
): Promise<void> => {
  // Process the errors and generate the report
  await generatePdfReport(errors, options);
};

// Export simplified function for convenience
export const exportErrorReport = generateErrorReportPdf;

// Re-export types
export type { ErrorData, ErrorReportOptions } from './types';
export { analyzeErrors } from './analyzer';

