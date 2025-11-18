import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { generateLineChart } from '../helpers/charts';

export interface HistoricalDataPoint {
  date: string;
  globalScore: number;
  seoScore: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  pageCount: number;
}

export function addHistoricalTrendsSection(
  doc: jsPDF,
  historicalData: HistoricalDataPoint[]
): void {
  if (!historicalData || historicalData.length === 0) {
    return;
  }
  
  doc.addPage();
  
  // Section header
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Динамика показателей', 105, 12, { align: 'center' });
  
  let yPos = 35;
  
  // Introduction
  doc.setTextColor(...pdfColors.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const introText = `История изменений основных показателей за ${historicalData.length} аудитов. Графики показывают тренды развития сайта.`;
  const splitIntro = doc.splitTextToSize(introText, 170);
  doc.text(splitIntro, 20, yPos);
  yPos += splitIntro.length * 5 + 10;
  
  // Overall score trend
  const scoreData = historicalData.map(point => ({
    label: new Date(point.date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
    value: point.globalScore
  }));
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Общий балл', 20, yPos);
  yPos += 8;
  
  generateLineChart(doc, scoreData, 20, yPos, 170, 60, {
    title: '',
    lineColor: pdfColors.primary,
    showPoints: true,
    gridLines: true
  });
  yPos += 70;
  
  // Category scores comparison
  if (yPos > 200) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Динамика категорий', 20, yPos);
  yPos += 8;
  
  // Multi-line chart for categories
  const categories = [
    { key: 'seoScore', label: 'SEO', color: pdfColors.success },
    { key: 'technicalScore', label: 'Техническая', color: pdfColors.info },
    { key: 'contentScore', label: 'Контент', color: pdfColors.warning },
    { key: 'performanceScore', label: 'Производительность', color: pdfColors.danger }
  ];
  
  const chartHeight = 70;
  const chartWidth = 170;
  const chartX = 20;
  const chartY = yPos;
  
  // Draw chart background and grid
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.1);
  
  // Horizontal grid lines
  for (let i = 0; i <= 4; i++) {
    const y = chartY + (chartHeight * i / 4);
    doc.line(chartX, y, chartX + chartWidth, y);
  }
  
  // Draw lines for each category
  categories.forEach(category => {
    const data = historicalData.map(point => point[category.key as keyof HistoricalDataPoint] as number);
    
    doc.setDrawColor(category.color[0], category.color[1], category.color[2]);
    doc.setLineWidth(0.8);
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = chartX + (chartWidth * i / (data.length - 1));
      const y1 = chartY + chartHeight - (chartHeight * data[i] / 100);
      const x2 = chartX + (chartWidth * (i + 1) / (data.length - 1));
      const y2 = chartY + chartHeight - (chartHeight * data[i + 1] / 100);
      
      doc.line(x1, y1, x2, y2);
      
      // Draw points
      doc.setFillColor(category.color[0], category.color[1], category.color[2]);
      doc.circle(x1, y1, 1, 'F');
      if (i === data.length - 2) {
        doc.circle(x2, y2, 1, 'F');
      }
    }
  });
  
  // Legend
  yPos += chartHeight + 10;
  const legendX = 25;
  categories.forEach((category, index) => {
    const x = legendX + (index * 45);
    
    doc.setFillColor(category.color[0], category.color[1], category.color[2]);
    doc.rect(x, yPos, 4, 4, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...pdfColors.text);
    doc.text(category.label, x + 6, yPos + 3);
  });
  
  yPos += 15;
  
  // Trend summary table
  if (yPos > 220) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Сводка изменений', 20, yPos);
  yPos += 10;
  
  const firstAudit = historicalData[0];
  const lastAudit = historicalData[historicalData.length - 1];
  
  const tableData = [
    [
      'Общий балл',
      firstAudit.globalScore.toFixed(0),
      lastAudit.globalScore.toFixed(0),
      (lastAudit.globalScore - firstAudit.globalScore).toFixed(0)
    ],
    [
      'SEO',
      firstAudit.seoScore.toFixed(0),
      lastAudit.seoScore.toFixed(0),
      (lastAudit.seoScore - firstAudit.seoScore).toFixed(0)
    ],
    [
      'Техническая часть',
      firstAudit.technicalScore.toFixed(0),
      lastAudit.technicalScore.toFixed(0),
      (lastAudit.technicalScore - firstAudit.technicalScore).toFixed(0)
    ],
    [
      'Контент',
      firstAudit.contentScore.toFixed(0),
      lastAudit.contentScore.toFixed(0),
      (lastAudit.contentScore - firstAudit.contentScore).toFixed(0)
    ],
    [
      'Производительность',
      firstAudit.performanceScore.toFixed(0),
      lastAudit.performanceScore.toFixed(0),
      (lastAudit.performanceScore - firstAudit.performanceScore).toFixed(0)
    ]
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['Категория', 'Первый аудит', 'Последний аудит', 'Изменение']],
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
      0: { cellWidth: 70 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'center' },
      3: { 
        cellWidth: 35, 
        halign: 'center',
        fontStyle: 'bold'
      }
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const value = parseFloat(data.cell.text[0]);
        if (value > 0) {
          data.cell.styles.textColor = pdfColors.success;
        } else if (value < 0) {
          data.cell.styles.textColor = pdfColors.danger;
        }
      }
    },
    margin: { left: 20, right: 20 }
  });
}
