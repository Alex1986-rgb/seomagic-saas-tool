import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { generateScoreGauge } from '../helpers/charts';

export interface PerformanceMetricsData {
  avg_load_time_ms?: number;
  success_rate?: number;
  pages_scanned?: number;
  total_urls?: number;
  error_pages_count?: number;
  redirect_pages_count?: number;
}

export function addPerformanceMetricsSection(
  doc: jsPDF,
  data: PerformanceMetricsData
): void {
  doc.addPage();
  
  // Section header
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Производительность сканирования', 105, 12, { align: 'center' });
  
  let yPos = 35;
  
  // Key metrics cards
  const metrics = [
    {
      label: 'Среднее время загрузки',
      value: data.avg_load_time_ms ? `${(data.avg_load_time_ms / 1000).toFixed(2)} сек` : 'N/A',
      color: pdfColors.info
    },
    {
      label: 'Процент успешных запросов',
      value: data.success_rate ? `${(data.success_rate * 100).toFixed(1)}%` : 'N/A',
      color: pdfColors.success
    },
    {
      label: 'Просканировано страниц',
      value: data.pages_scanned?.toString() || '0',
      color: pdfColors.primary
    }
  ];
  
  // Draw metric cards
  const cardWidth = 50;
  const cardHeight = 35;
  const spacing = 8;
  const startX = (210 - (metrics.length * cardWidth + (metrics.length - 1) * spacing)) / 2;
  
  metrics.forEach((metric, index) => {
    const x = startX + index * (cardWidth + spacing);
    
    // Card background
    doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.setDrawColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.roundedRect(x, yPos, cardWidth, cardHeight, 3, 3, 'FD');
    
    // Value
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(metric.value, x + cardWidth / 2, yPos + 15, { align: 'center' });
    
    // Label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const labelLines = doc.splitTextToSize(metric.label, cardWidth - 4);
    doc.text(labelLines, x + cardWidth / 2, yPos + 24, { align: 'center' });
  });
  
  yPos += cardHeight + 20;
  
  // Success rate gauge
  if (data.success_rate !== undefined) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...pdfColors.dark);
    doc.text('Успешность запросов', 105, yPos, { align: 'center' });
    yPos += 10;
    
    const centerX = 105;
    const centerY = yPos + 25;
    const radius = 30;
    const score = data.success_rate * 100;
    
    // Draw gauge manually
    doc.setLineWidth(8);
    doc.setDrawColor(220, 220, 220);
    doc.circle(centerX, centerY, radius, 'S');
    
    const angle = (score / 100) * 2 * Math.PI;
    doc.setDrawColor(...pdfColors.success);
    for (let i = 0; i < score; i++) {
      const a = -Math.PI / 2 + (i / 100) * 2 * Math.PI;
      const x1 = centerX + (radius - 4) * Math.cos(a);
      const y1 = centerY + (radius - 4) * Math.sin(a);
      const x2 = centerX + (radius + 4) * Math.cos(a);
      const y2 = centerY + (radius + 4) * Math.sin(a);
      doc.line(x1, y1, x2, y2);
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...pdfColors.dark);
    doc.text(`${score.toFixed(1)}%`, centerX, centerY + 2, { align: 'center' });
    yPos += 65;
  }
  
  // Detailed statistics table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.dark);
  doc.text('Детальная статистика', 20, yPos);
  yPos += 10;
  
  const tableData = [
    ['Общее количество URL', (data.total_urls || 0).toString()],
    ['Просканировано страниц', (data.pages_scanned || 0).toString()],
    ['Ошибочные страницы', (data.error_pages_count || 0).toString()],
    ['Страницы с редиректами', (data.redirect_pages_count || 0).toString()],
    ['Среднее время загрузки', data.avg_load_time_ms ? `${(data.avg_load_time_ms / 1000).toFixed(2)} сек` : 'N/A'],
    ['Успешных запросов', data.success_rate ? `${(data.success_rate * 100).toFixed(1)}%` : 'N/A']
  ];
  
  doc.autoTable({
    startY: yPos,
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 10,
      textColor: pdfColors.text
    },
    columnStyles: {
      0: { cellWidth: 100, fontStyle: 'bold' },
      1: { cellWidth: 70, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Performance insights
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 240) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(20, yPos, 170, 40, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pdfColors.info);
  doc.text('📊 Анализ производительности', 25, yPos + 8);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...pdfColors.text);
  
  let insight = '';
  if (data.avg_load_time_ms && data.avg_load_time_ms > 3000) {
    insight = 'Среднее время загрузки превышает рекомендуемые 3 секунды. Рассмотрите оптимизацию скорости сервера и кэширования.';
  } else if (data.success_rate && data.success_rate < 0.9) {
    insight = 'Низкий процент успешных запросов может указывать на проблемы с доступностью или настройками сервера.';
  } else {
    insight = 'Показатели производительности в пределах нормы. Продолжайте мониторить эти метрики регулярно.';
  }
  
  const insightLines = doc.splitTextToSize(insight, 160);
  doc.text(insightLines, 25, yPos + 18);
}
