
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ErrorGroupData } from '../types';
import { pdfColors } from '../../styles/colors';
import { applyHeadingStyle } from '../../styles/fonts';

export async function addSummarySection(
  doc: jsPDF,
  groups: ErrorGroupData[],
  totalErrors: number,
  startY: number
): Promise<number> {
  // Add error summary heading
  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('Сводка ошибок', 14, startY);

  // Create summary table data
  const summaryData = groups.map(group => [
    group.type,
    group.count.toString(),
    group.percentage
  ]);

  // Add the summary table
  autoTable(doc, {
    startY: startY + 5,
    head: [['Тип ошибки', 'Количество', 'Процент']],
    body: summaryData,
    headStyles: {
      fillColor: pdfColors.primary as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [0, 0, 0] as [number, number, number]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249] as [number, number, number]
    }
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

