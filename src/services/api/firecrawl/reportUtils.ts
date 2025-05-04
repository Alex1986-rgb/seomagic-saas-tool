
import { saveAs } from 'file-saver';
import { CrawlTask } from './types';

/**
 * Handles the download of a PDF/text report
 */
export const downloadReport = async (
  task: CrawlTask, 
  reportType: 'full' | 'errors' | 'detailed' = 'full'
): Promise<void> => {
  if (task.status !== 'completed') {
    throw new Error('Task is not completed yet');
  }
  
  // In a real application, this would generate an actual PDF
  // For demonstration, create a simple text file
  const reportText = `SEO Report for ${task.url}\n\nScanned ${task.pages_scanned} pages\n\nGenerated on ${new Date().toLocaleString()}`;
  
  let fileName = '';
  switch (reportType) {
    case 'full':
      fileName = 'full-seo-report.txt';
      break;
    case 'errors':
      fileName = 'errors-seo-report.txt';
      break;
    case 'detailed':
      fileName = 'detailed-seo-report.txt';
      break;
  }
  
  // Create and download file
  const blob = new Blob([reportText], { type: 'text/plain' });
  saveAs(blob, fileName);
};
