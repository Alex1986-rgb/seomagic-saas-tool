
import jsPDF from 'jspdf';
import { ErrorReportData, ErrorTypeData } from '../types';
import { pdfColors } from '../../styles/colors';
import { pdfFonts } from '../../styles/fonts';

export function addRecommendationsSection(
  doc: jsPDF,
  data: ErrorReportData,
  yPosition: number
): number {
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Рекомендации по исправлению', 15, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text('Здесь приведены рекомендации по исправлению обнаруженных ошибок в порядке приоритета.', 15, yPosition);
  yPosition += 10;
  
  const addRecommendationGroup = (title: string, errors: ErrorTypeData[], color: [number, number, number]) => {
    if (errors.length === 0) return;
    
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFillColor(...color);
    doc.rect(15, yPosition - 5, 180, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(title, 20, yPosition);
    yPosition += 10;
    
    doc.setTextColor(0, 0, 0);
    
    errors.forEach((error, index) => {
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.text(`${index + 1}. ${error.name}`, 15, yPosition);
      yPosition += 6;
      
      if (error.solution) {
        doc.setFont(pdfFonts.primary, pdfFonts.normal);
        doc.text(error.solution, 20, yPosition, { maxWidth: 175 });
        yPosition += 10;
      }
    });
  };
  
  addRecommendationGroup('Критические исправления', data.critical, pdfColors.error as [number, number, number]);
  addRecommendationGroup('Важные исправления', data.major, pdfColors.warning as [number, number, number]);
  addRecommendationGroup('Улучшения', data.minor, pdfColors.info as [number, number, number]);
  
  return yPosition;
}
