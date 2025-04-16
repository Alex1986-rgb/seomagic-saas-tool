
import jsPDF from 'jspdf';
import { ErrorGroupData } from '../types';
import { pdfColors } from '../../styles/colors';
import { applyHeadingStyle } from '../../styles/fonts';
import { checkNewPage } from '../utils';

export async function addErrorDetailsSection(
  doc: jsPDF,
  groups: ErrorGroupData[],
  startY: number
): Promise<number> {
  let currentY = startY;

  // Add section heading
  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('Детали ошибок', 14, currentY);
  currentY += 10;

  // Add each error group
  for (const group of groups) {
    currentY = checkNewPage(doc, currentY);
    
    // Group header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${group.type} (${group.count})`, 14, currentY);
    currentY += 8;

    // List errors in group
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    for (const error of group.errors) {
      currentY = checkNewPage(doc, currentY);
      doc.text(`• ${error.errorMessage}`, 20, currentY);
      currentY += 5;
      
      if (error.url) {
        doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
        doc.text(`  URL: ${error.url}`, 20, currentY);
        doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
        currentY += 5;
      }
    }
    
    currentY += 5;
  }

  return currentY;
}
