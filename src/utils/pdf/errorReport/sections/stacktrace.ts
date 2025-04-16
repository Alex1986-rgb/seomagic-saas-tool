
import jsPDF from 'jspdf';
import { ErrorData } from '../types';
import { pdfColors } from '../../styles/colors';
import { applyHeadingStyle } from '../../styles/fonts';
import { checkNewPage } from '../utils';

export async function addStackTraceSection(
  doc: jsPDF,
  errors: ErrorData[],
  startY: number
): Promise<number> {
  let currentY = startY;

  const errorsWithStack = errors.filter(e => e.stackTrace);
  if (errorsWithStack.length === 0) return currentY;

  // Add section heading
  currentY = checkNewPage(doc, currentY);
  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('Stack Traces', 14, currentY);
  currentY += 10;

  // Add each stack trace
  for (const error of errorsWithStack) {
    currentY = checkNewPage(doc, currentY);
    
    // Error header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${error.errorType}: ${error.errorMessage}`, 14, currentY);
    currentY += 6;

    // Stack trace
    if (error.stackTrace) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const stackLines = error.stackTrace.split('\n');
      
      for (const line of stackLines) {
        currentY = checkNewPage(doc, currentY);
        doc.text(line, 20, currentY);
        currentY += 4;
      }
      
      currentY += 5;
    }
  }

  return currentY;
}
