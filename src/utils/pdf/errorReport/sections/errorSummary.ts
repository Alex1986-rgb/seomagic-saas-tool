
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ErrorReportData } from '../types';
import { pdfColors } from '../../styles/colors';
import { pdfFonts } from '../../styles/fonts';

export function addErrorSummarySection(
  doc: jsPDF,
  data: ErrorReportData,
  yPosition: number
): number {
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Сводка ошибок', 15, yPosition);
  yPosition += 10;
  
  const totalErrors = data.critical.length + data.major.length + data.minor.length;
  
  const tableData = [
    ['Критические ошибки', data.critical.length.toString(), `${((data.critical.length / totalErrors) * 100).toFixed(1)}%`],
    ['Основные ошибки', data.major.length.toString(), `${((data.major.length / totalErrors) * 100).toFixed(1)}%`],
    ['Незначительные ошибки', data.minor.length.toString(), `${((data.minor.length / totalErrors) * 100).toFixed(1)}%`]
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Тип ошибки', 'Количество', 'Процент']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: pdfColors.primary as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    foot: [['Всего ошибок', totalErrors.toString(), '100%']],
    footStyles: {
      fillColor: [240, 240, 240],
      fontStyle: 'bold'
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 15;
}
