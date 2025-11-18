import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { generateBarChart } from '../helpers/charts';

export interface IssuePercentagesData {
  pct_missing_title?: number;
  pct_missing_description?: number;
  pct_missing_h1?: number;
  pct_not_indexable?: number;
  pct_slow_pages?: number;
  pct_thin_content?: number;
  pct_pages_with_redirects?: number;
  pct_long_redirect_chains?: number;
  pct_missing_canonical?: number;
}

export function addIssuePercentagesSection(
  doc: jsPDF,
  data: IssuePercentagesData
): void {
  doc.addPage();
  
  // Section header
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Проблемные показатели', 105, 12, { align: 'center' });
  
  let yPos = 35;
  
  // Introduction text
  doc.setTextColor(...pdfColors.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const introText = 'Процент страниц с различными типами проблем. Чем ниже показатель, тем лучше состояние сайта.';
  const splitIntro = doc.splitTextToSize(introText, 170);
  doc.text(splitIntro, 20, yPos);
  yPos += splitIntro.length * 5 + 10;
  
  // Prepare chart data
  const chartData: Record<string, number> = {};
  const labels: Record<string, string> = {
    pct_missing_title: 'Отсутствует Title',
    pct_missing_description: 'Отсутствует Description',
    pct_missing_h1: 'Отсутствует H1',
    pct_not_indexable: 'Не индексируется',
    pct_slow_pages: 'Медленные страницы',
    pct_thin_content: 'Тонкий контент',
    pct_pages_with_redirects: 'С редиректами',
    pct_long_redirect_chains: 'Длинные цепочки',
    pct_missing_canonical: 'Без Canonical'
  };
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && labels[key]) {
      chartData[labels[key]] = Number(value) || 0;
    }
  });
  
  // Generate bar chart
  if (Object.keys(chartData).length > 0) {
    generateBarChart(doc, chartData, 20, yPos, 170, 80, {
      title: 'Распределение проблем (%)',
      showValues: true,
      barColor: pdfColors.danger
    });
    yPos += 95;
  }
  
  // Detailed metrics table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Детализация показателей', 20, yPos);
  yPos += 10;
  
  const tableData = Object.entries(data)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      const percentage = Number(value) || 0;
      const severity = percentage > 50 ? 'Критично' : percentage > 20 ? 'Внимание' : 'Норма';
      return [
        labels[key] || key,
        `${percentage.toFixed(1)}%`,
        severity
      ];
    });
  
  if (tableData.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [['Показатель', 'Процент страниц', 'Статус']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: pdfColors.primary,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: pdfColors.text
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50, halign: 'center' },
        2: { cellWidth: 45, halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Recommendations
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.primary);
  doc.text('💡 Рекомендации', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...pdfColors.text);
  
  const recommendations = [
    'Приоритизируйте исправление критичных показателей (>50%)',
    'Оптимизируйте мета-теги для всех страниц',
    'Устраните медленные страницы для улучшения UX',
    'Проверьте настройки индексации и robots.txt'
  ];
  
  recommendations.forEach((rec, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 5;
  });
}
