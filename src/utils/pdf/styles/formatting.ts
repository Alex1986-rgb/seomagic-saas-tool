
import { pdfColors } from './colors';
import { pdfFonts } from './fonts';

/**
 * Formats the header section of a PDF report
 */
export const formatReportHeader = (doc: any, title: string, date: string): void => {
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.primary);
  doc.text(title, 105, 20, { align: 'center' });
  
  doc.setFontSize(pdfFonts.small.size);
  doc.setTextColor(...pdfColors.gray);
  doc.text(`Отчет сгенерирован: ${date}`, 105, 27, { align: 'center' });
};
