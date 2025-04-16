
import jsPDF from 'jspdf';
import { ErrorData } from '../types';
import { pdfColors } from '../../styles/colors';
import { applyHeadingStyle } from '../../styles/fonts';
import { checkNewPage } from '../utils';

export async function addBrowserInfoSection(
  doc: jsPDF,
  errors: ErrorData[],
  includeUserAgent: boolean,
  startY: number
): Promise<number> {
  let currentY = startY;

  // Add section heading
  currentY = checkNewPage(doc, currentY);
  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('Информация о браузерах', 14, currentY);
  currentY += 10;

  // Count browser occurrences
  const browserStats = new Map<string, number>();
  errors.forEach(error => {
    if (error.browser) {
      const count = browserStats.get(error.browser) || 0;
      browserStats.set(error.browser, count + 1);
    }
  });

  // Display browser statistics
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  for (const [browser, count] of browserStats) {
    currentY = checkNewPage(doc, currentY);
    const percentage = ((count / errors.length) * 100).toFixed(1);
    doc.text(`${browser}: ${count} (${percentage}%)`, 20, currentY);
    currentY += 6;
  }

  // Add user agent information if requested
  if (includeUserAgent) {
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('User Agents:', 14, currentY);
    currentY += 6;

    const uniqueAgents = new Set(errors.map(e => e.userAgent).filter(Boolean));
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    for (const agent of uniqueAgents) {
      currentY = checkNewPage(doc, currentY);
      doc.text(`• ${agent}`, 20, currentY);
      currentY += 4;
    }
  }

  return currentY;
}
