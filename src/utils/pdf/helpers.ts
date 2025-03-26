
import jsPDF from 'jspdf';
import { AuditItemData } from '@/types/audit';
import html2canvas from 'html2canvas';

/**
 * Determines the status text based on a score
 */
export function getCategoryStatus(score: number): string {
  if (score >= 80) return 'Отлично';
  if (score >= 60) return 'Хорошо';
  if (score >= 40) return 'Удовлетворительно';
  return 'Требует улучшения';
}

/**
 * Adds category details to the PDF document
 */
export function addCategoryDetails(pdf: jsPDF, items: AuditItemData[], startY: number, margin: number): void {
  const itemsData = items.map(item => {
    const statusSymbol = item.status === 'good' ? '✓' : item.status === 'warning' ? '⚠' : '✗';
    const statusText = item.status === 'good' ? 'Хорошо' : item.status === 'warning' ? 'Внимание' : 'Ошибка';
    return [statusSymbol, item.title, item.value || '-', statusText];
  });
  
  import('jspdf-autotable').then(autoTable => {
    autoTable.default(pdf, {
      startY: startY,
      head: [['', 'Проверка', 'Значение', 'Статус']],
      body: itemsData,
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 100 },
        2: { cellWidth: 40, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' }
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: margin, right: margin }
    });
  });
}

/**
 * Generates a screenshot of a chart component
 */
export const generateHistoryChartImage = async (chartContainer: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(chartContainer, {
      scale: 2,
      backgroundColor: null,
      logging: false
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Ошибка создания снимка графика:', error);
    throw error;
  }
};

/**
 * Adds pagination footers to all pages of the PDF
 */
export function addPaginationFooters(pdf: jsPDF, margin: number): void {
  const totalPages = pdf.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Страница ${i} из ${totalPages}`, pageWidth - margin, pageHeight - 10);
    pdf.text(`Отчет создан: ${new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, pageHeight - 10);
  }
}
