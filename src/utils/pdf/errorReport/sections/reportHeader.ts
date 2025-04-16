
import jsPDF from 'jspdf';
import { pdfColors } from '../../styles/colors';
import { pdfFonts } from '../../styles/fonts';

export function addReportHeaderSection(
  doc: jsPDF,
  title: string,
  url: string,
  date: string,
  pageCount: number
): number {
  // Header background
  doc.setFillColor(...pdfColors.primary);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text(title, 15, 15);
  
  // Subtitle
  doc.setFontSize(14);
  doc.text(`Домен: ${url}`, 15, 25);
  
  // Reset color
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 45;
  
  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Информация об отчете:', 15, yPosition);
  yPosition += 8;
  
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text(`Дата создания: ${date}`, 15, yPosition);
  yPosition += 6;
  
  if (pageCount) {
    doc.text(`Проверено страниц: ${pageCount}`, 15, yPosition);
    yPosition += 6;
  }
  
  doc.text(`Сгенерировано: ${new Date().toLocaleString('ru-RU')}`, 15, yPosition);
  yPosition += 15;
  
  return yPosition;
}
