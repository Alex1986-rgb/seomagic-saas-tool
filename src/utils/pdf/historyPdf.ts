
import jsPDF from 'jspdf';
import { AuditHistoryItem } from '@/types/audit';
import { generateHistoryChartImage, addPaginationFooters } from './helpers';

/**
 * Generates a PDF with audit history data
 */
export const generateHistoryPDF = async (historyItems: AuditHistoryItem[], url: string, chartContainer?: HTMLElement): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    
    // Add header with logo and title
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    pdf.text('История SEO аудитов', pageWidth / 2, 15, { align: 'center' });
    
    // Add URL and general info
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`URL: ${url}`, margin, 40);
    pdf.text(`Всего аудитов: ${historyItems.length}`, margin, 47);
    pdf.text(`Отчет создан: ${new Date().toLocaleDateString('ru-RU')}`, margin, 54);
    
    // Add chart image if available
    let yPos = 65;
    if (chartContainer) {
      try {
        const chartImage = await generateHistoryChartImage(chartContainer);
        pdf.addImage(chartImage, 'PNG', margin, yPos, pageWidth - margin * 2, 60);
        yPos += 70;
      } catch (error) {
        console.error('Ошибка генерации изображения графика:', error);
        yPos += 10;
      }
    }
    
    // Add history data table
    await addHistoryTable(pdf, historyItems, yPos, margin);
    
    // Add pagination footers
    addPaginationFooters(pdf, margin);
    
    // Save the PDF
    pdf.save(`SEO_История_${url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Ошибка создания PDF истории:', error);
    return Promise.reject(error);
  }
};

/**
 * Adds history data table to the PDF
 */
async function addHistoryTable(pdf: jsPDF, historyItems: AuditHistoryItem[], yPos: number, margin: number): Promise<void> {
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('История изменений', margin, yPos);
  yPos += 5;
  
  const sortedItems = [...historyItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const historyData = sortedItems.map((item, index, arr) => {
    const prevItem = index < arr.length - 1 ? arr[index + 1] : null;
    const diff = prevItem ? item.score - prevItem.score : 0;
    const diffText = diff !== 0 ? (diff > 0 ? `+${diff}` : diff.toString()) : '0';
    
    return [
      new Date(item.date).toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      }),
      `${item.score}/100`,
      diffText,
      `${item.issues?.critical || 0}`,
      `${item.issues?.important || 0}`,
      `${item.issues?.opportunities || 0}`
    ];
  });
  
  const autoTable = await import('jspdf-autotable');
  autoTable.default(pdf, {
    startY: yPos,
    head: [['Дата', 'Оценка', 'Изменение', 'Критич.', 'Важные', 'Возмож.']],
    body: historyData,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: margin, right: margin }
  });
}
