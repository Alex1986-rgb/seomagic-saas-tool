
import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { applyHeadingStyle, applyBodyStyle } from '../styles/fonts';

/**
 * Formats the report header
 */
export function formatHeader(
  doc: jsPDF,
  title: string,
  subtitle: string
): number {
  // Title
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  applyHeadingStyle(doc, 1);
  doc.text(title, 105, 20, { align: 'center' });

  // Subtitle
  applyHeadingStyle(doc, 3);
  doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
  doc.text(subtitle, 105, 30, { align: 'center' });

  // Add report generation date
  applyBodyStyle(doc, true);
  doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
  doc.text(
    `Дата создания: ${new Date().toLocaleDateString('ru-RU')}`,
    105,
    38,
    { align: 'center' }
  );

  return 50; // Return next Y position
}

/**
 * Checks if we need a new page and adds one if necessary
 */
export function checkNewPage(doc: jsPDF, currentY: number, threshold: number = 250): number {
  if (currentY > threshold) {
    doc.addPage();
    return 20;
  }
  return currentY;
}

