import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { generateBarChart } from '../helpers/charts';

export interface ComparisonData {
  current: {
    globalScore: number;
    seoScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    pctMissingTitle: number;
    pctSlowPages: number;
    issuesCount: number;
  };
  previous: {
    globalScore: number;
    seoScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    pctMissingTitle: number;
    pctSlowPages: number;
    issuesCount: number;
  } | null;
  changes: {
    globalScore: number;
    seoScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    pctMissingTitle: number;
    pctSlowPages: number;
  };
}

export function addComparisonSection(
  doc: jsPDF,
  comparison: ComparisonData
): void {
  if (!comparison.previous) {
    return;
  }
  
  doc.addPage();
  
  // Section header
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Сравнение с предыдущим аудитом', 105, 12, { align: 'center' });
  
  let yPos = 35;
  
  // Summary cards
  const summaryMetrics = [
    {
      label: 'Изменение общего балла',
      value: comparison.changes.globalScore,
      current: comparison.current.globalScore,
      previous: comparison.previous.globalScore
    },
    {
      label: 'Изменение SEO',
      value: comparison.changes.seoScore,
      current: comparison.current.seoScore,
      previous: comparison.previous.seoScore
    },
    {
      label: 'Изменение технической части',
      value: comparison.changes.technicalScore,
      current: comparison.current.technicalScore,
      previous: comparison.previous.technicalScore
    }
  ];
  
  summaryMetrics.forEach((metric, index) => {
    const cardY = yPos + (index * 35);
    const isPositive = metric.value > 0;
    const color = isPositive ? pdfColors.success : metric.value < 0 ? pdfColors.danger : pdfColors.info;
    
    // Card background
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, cardY, 170, 28, 2, 2, 'F');
    
    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...pdfColors.dark);
    doc.text(metric.label, 25, cardY + 8);
    
    // Values
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...pdfColors.text);
    doc.text(`Предыдущий: ${metric.previous.toFixed(0)}`, 25, cardY + 16);
    doc.text(`Текущий: ${metric.current.toFixed(0)}`, 25, cardY + 23);
    
    // Change indicator
    const changeText = `${isPositive ? '+' : ''}${metric.value.toFixed(0)}`;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(changeText, 185, cardY + 16, { align: 'right' });
    
    // Arrow
    const arrow = isPositive ? '↑' : metric.value < 0 ? '↓' : '→';
    doc.text(arrow, 175, cardY + 16, { align: 'right' });
  });
  
  yPos += 115;
  
  // Detailed comparison chart
  if (yPos > 200) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Сравнение категорий', 20, yPos);
  yPos += 10;
  
  const chartData = {
    'SEO': {
      previous: comparison.previous.seoScore,
      current: comparison.current.seoScore
    },
    'Техническая': {
      previous: comparison.previous.technicalScore,
      current: comparison.current.technicalScore
    },
    'Контент': {
      previous: comparison.previous.contentScore,
      current: comparison.current.contentScore
    },
    'Производ.': {
      previous: comparison.previous.performanceScore,
      current: comparison.current.performanceScore
    }
  };
  
  // Draw grouped bar chart
  const chartWidth = 170;
  const chartHeight = 70;
  const chartX = 20;
  const chartY = yPos;
  const barWidth = 10;
  const groupSpacing = 15;
  const categories = Object.keys(chartData);
  const maxValue = 100;
  
  // Draw grid
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.1);
  for (let i = 0; i <= 4; i++) {
    const y = chartY + (chartHeight * i / 4);
    doc.line(chartX, y, chartX + chartWidth, y);
    
    // Y-axis labels
    doc.setFontSize(8);
    doc.setTextColor(...pdfColors.text);
    doc.text((100 - i * 25).toString(), chartX - 5, y + 2, { align: 'right' });
  }
  
  // Draw bars
  categories.forEach((category, index) => {
    const x = chartX + 10 + (index * (chartWidth / categories.length));
    const data = chartData[category as keyof typeof chartData];
    
    // Previous bar (lighter)
    const prevHeight = (data.previous / maxValue) * chartHeight;
    doc.setFillColor(180, 180, 180);
    doc.rect(x, chartY + chartHeight - prevHeight, barWidth, prevHeight, 'F');
    
    // Current bar (darker)
    const currHeight = (data.current / maxValue) * chartHeight;
    doc.setFillColor(...pdfColors.primary);
    doc.rect(x + barWidth + 2, chartY + chartHeight - currHeight, barWidth, currHeight, 'F');
    
    // Category label
    doc.setFontSize(8);
    doc.setTextColor(...pdfColors.text);
    doc.text(category, x + barWidth, chartY + chartHeight + 5, { align: 'center' });
  });
  
  // Legend
  yPos += chartHeight + 15;
  doc.setFillColor(180, 180, 180);
  doc.rect(chartX + 20, yPos, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...pdfColors.text);
  doc.text('Предыдущий', chartX + 26, yPos + 3);
  
  doc.setFillColor(...pdfColors.primary);
  doc.rect(chartX + 60, yPos, 4, 4, 'F');
  doc.text('Текущий', chartX + 66, yPos + 3);
  
  yPos += 15;
  
  // Issues comparison
  if (yPos > 230) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Изменение проблемных показателей', 20, yPos);
  yPos += 10;
  
  const issuesData = [
    [
      'Отсутствует Title',
      `${comparison.previous.pctMissingTitle.toFixed(1)}%`,
      `${comparison.current.pctMissingTitle.toFixed(1)}%`,
      `${comparison.changes.pctMissingTitle > 0 ? '+' : ''}${comparison.changes.pctMissingTitle.toFixed(1)}%`
    ],
    [
      'Медленные страницы',
      `${comparison.previous.pctSlowPages.toFixed(1)}%`,
      `${comparison.current.pctSlowPages.toFixed(1)}%`,
      `${comparison.changes.pctSlowPages > 0 ? '+' : ''}${comparison.changes.pctSlowPages.toFixed(1)}%`
    ],
    [
      'Всего проблем',
      comparison.previous.issuesCount.toString(),
      comparison.current.issuesCount.toString(),
      (comparison.current.issuesCount - comparison.previous.issuesCount).toString()
    ]
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['Показатель', 'Было', 'Стало', 'Изменение']],
    body: issuesData,
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
      0: { cellWidth: 70 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 35, halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const text = data.cell.text[0];
        const isIncrease = text.includes('+') || (!text.includes('-') && parseFloat(text) > 0);
        data.cell.styles.textColor = isIncrease ? pdfColors.danger : pdfColors.success;
      }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Conclusion
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 240) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFillColor(240, 255, 240);
  doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.success);
  doc.text('✅ Итоговая оценка', 25, yPos + 8);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...pdfColors.text);
  
  const overallChange = comparison.changes.globalScore;
  let conclusion = '';
  if (overallChange > 5) {
    conclusion = 'Отличная работа! Сайт показывает значительное улучшение. Продолжайте в том же духе.';
  } else if (overallChange > 0) {
    conclusion = 'Позитивная динамика. Сайт движется в правильном направлении, но есть возможности для дальнейшего роста.';
  } else if (overallChange === 0) {
    conclusion = 'Показатели остались на прежнем уровне. Рекомендуем внедрить новые улучшения.';
  } else {
    conclusion = 'Показатели ухудшились. Необходимо проанализировать причины и принять меры для исправления ситуации.';
  }
  
  const conclusionLines = doc.splitTextToSize(conclusion, 160);
  doc.text(conclusionLines, 25, yPos + 18);
}
