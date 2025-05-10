import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { addPaginationFooters, addTimestamp, extendJsPDF } from './helpers/index';
import { pdfColors, getScoreColorRGB } from './styles/colors';
import { generatePieChart, generateBarChart, generateScoreGauge, generateRadarChart } from './helpers/charts';

export interface GenerateAuditPdfOptions {
  auditData: AuditData;
  url: string;
  recommendations?: any;
  pageStats?: any;
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  date?: string;
}

interface AuditIssue {
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  url?: string;
  urls?: string[];
  solution?: string;
}

export const generateAuditPdf = async (options: GenerateAuditPdfOptions): Promise<Blob> => {
  const { 
    auditData, 
    url, 
    recommendations, 
    pageStats, 
    optimizationCost, 
    optimizationItems, 
    date = auditData.date
  } = options;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  extendJsPDF(doc);
  
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('SEO Аудит', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 105, 30, { align: 'center' });
  
  doc.setFillColor(...pdfColors.light);
  doc.roundedRect(15, 50, 180, 50, 3, 3, 'F');
  
  doc.setTextColor(...pdfColors.dark);
  doc.setFontSize(14);
  doc.text('Общая информация о сайте', 105, 60, { align: 'center' });
  
  doc.setDrawColor(...pdfColors.primary);
  doc.setLineWidth(0.5);
  doc.line(30, 64, 180, 64);
  
  doc.setFontSize(10);
  doc.text(`Дата аудита: ${formattedDate}`, 25, 72);
  doc.text(`Проанализировано страниц: ${auditData.pageCount || 'N/A'}`, 25, 80);
  
  doc.setFontSize(12);
  doc.text('Общая SEO оценка:', 25, 90);
  
  generateScoreGauge(doc, auditData.score, 90, 86, 80, 8);
  
  doc.setFontSize(16);
  doc.text('Категории аудита', 105, 115, { align: 'center' });
  
  const categoryScores = {
    'SEO': auditData.details.seo.score || 0,
    'Производительность': auditData.details.performance.score || 0,
    'Контент': auditData.details.content.score || 0,
    'Технические аспекты': auditData.details.technical.score || 0,
    'Юзабилити': auditData.details.usability?.score || 0
  };
  
  generateRadarChart(doc, categoryScores, 105, 160, 50, {
    title: 'Оценки по категориям',
    maxValue: 100,
    fillColor: [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2], 0.3] as [number, number, number, number],
    lineColor: pdfColors.primary,
    showValues: true
  });
  
  doc.addPage();
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Распределение проблем', 105, 14, { align: 'center' });
  
  const issuesByCategory = {
    'Критические': auditData.issues.critical.length,
    'Важные': auditData.issues.important.length,
    'Рекомендации': auditData.issues.opportunities.length
  };
  
  generatePieChart(doc, issuesByCategory, 105, 70, 40, {
    title: 'Распределение проблем по важности',
    showLegend: true,
    showValues: true,
    showPercentages: true,
    colors: [
      pdfColors.danger,
      pdfColors.warning,
      pdfColors.info
    ]
  });
  
  if (pageStats && pageStats.subpages) {
    generateBarChart(doc, pageStats.subpages, 30, 170, 150, 60, {
      title: 'Распределение страниц по типам',
      barColor: pdfColors.info,
      showValues: true
    });
  }
  
  doc.addPage();
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Детальный анализ проблем', 105, 14, { align: 'center' });
  
  const totalIssues = auditData.issues.critical.length + auditData.issues.important.length + auditData.issues.opportunities.length;
  
  doc.setTextColor(...pdfColors.dark);
  doc.setFontSize(12);
  doc.text(`Всего обнаружено проблем: ${totalIssues}`, 20, 30);
  
  const getCriticalIssues = (): AuditIssue[] => {
    if (!auditData.issues.critical || auditData.issues.critical.length === 0) return [];
    
    if (typeof auditData.issues.critical[0] === 'string') {
      return auditData.issues.critical.map((issue: string) => ({
        title: issue,
        description: issue,
        impact: 'Высокий',
        recommendation: 'Рекомендуется исправить'
      }));
    }
    
    return auditData.issues.critical as unknown as AuditIssue[];
  };
  
  const criticalIssues = getCriticalIssues();
  
  if (criticalIssues.length > 0) {
    const criticalIssuesData = criticalIssues.map(issue => [
      issue.title,
      issue.impact || 'Высокий',
      issue.recommendation || 'Рекомендуется исправить'
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['Проблема', 'Влияние', 'Рекомендация']],
      body: criticalIssuesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [pdfColors.danger[0], pdfColors.danger[1], pdfColors.danger[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [250, 235, 235]
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Критических проблем не обнаружено', 20, 55);
  }
  
  let currentY = criticalIssues.length > 0 ? 
    (doc as any).lastAutoTable.finalY + 15 : 60;
  
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.warning);
  doc.text('Важные проблемы', 20, currentY);
  
  const getImportantIssues = (): AuditIssue[] => {
    if (!auditData.issues.important || auditData.issues.important.length === 0) return [];
    
    if (typeof auditData.issues.important[0] === 'string') {
      return auditData.issues.important.map((issue: string) => ({
        title: issue,
        description: issue,
        impact: 'Средний',
        recommendation: 'Рекомендуется исправить'
      }));
    }
    
    return auditData.issues.important as unknown as AuditIssue[];
  };
  
  const importantIssues = getImportantIssues();
  
  if (importantIssues.length > 0) {
    const importantIssuesData = importantIssues.map(issue => [
      issue.title,
      issue.impact || 'Средний',
      issue.recommendation || 'Рекомендуется исправить'
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Проблема', 'Влияние', 'Рекомендация']],
      body: importantIssuesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [pdfColors.warning[0], pdfColors.warning[1], pdfColors.warning[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [253, 246, 227]
      }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Важных проблем не обнаружено', 20, currentY + 10);
    currentY += 20;
  }
  
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.info);
  doc.text('Рекомендации по улучшению', 20, currentY);
  
  const getOpportunityIssues = (): AuditIssue[] => {
    if (!auditData.issues.opportunities || auditData.issues.opportunities.length === 0) return [];
    
    if (typeof auditData.issues.opportunities[0] === 'string') {
      return auditData.issues.opportunities.map((issue: string) => ({
        title: issue,
        description: issue,
        impact: 'Низкий',
        recommendation: 'Рекомендуется улучшить'
      }));
    }
    
    return auditData.issues.opportunities as unknown as AuditIssue[];
  };
  
  const opportunityIssues = getOpportunityIssues();
  
  if (opportunityIssues.length > 0) {
    const opportunitiesData = opportunityIssues.map(issue => [
      issue.title,
      issue.impact || 'Низкий',
      issue.recommendation || 'Рекомендуется улучшить'
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Рекомендация', 'Влияние', 'Описание']],
      body: opportunitiesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [235, 245, 255]
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Рекомендаций не обнаружено', 20, currentY + 10);
  }
  
  if (optimizationCost && optimizationItems) {
    doc.addPage();
    
    doc.setFillColor(...pdfColors.dark);
    doc.rect(0, 0, 210, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Стоимость оптимизации', 105, 14, { align: 'center' });
    
    doc.setTextColor(...pdfColors.dark);
    doc.setFontSize(12);
    doc.text(`Общая стоимость: ${new Intl.NumberFormat('ru-RU').format(optimizationCost)} ₽`, 20, 30);
    doc.text(`Количество страниц: ${auditData.pageCount}`, 20, 40);
    
    const costDistribution: Record<string, number> = {};
    
    optimizationItems.forEach(item => {
      costDistribution[item.type] = item.totalPrice;
    });
    
    generatePieChart(doc, costDistribution, 105, 80, 40, {
      title: 'Распределение затрат на оптимизацию',
      showLegend: true,
      legendPosition: 'right',
      colors: [
        pdfColors.primary,
        pdfColors.secondary,
        pdfColors.tertiary,
        pdfColors.info,
        pdfColors.success
      ]
    });
    
    doc.setFontSize(14);
    doc.text('Детализация стоимости:', 20, 130);
    
    const costDetailsData = optimizationItems.map(item => [
      item.type,
      item.count.toString(),
      `${new Intl.NumberFormat('ru-RU').format(item.pricePerUnit)} ₽`,
      `${new Intl.NumberFormat('ru-RU').format(item.totalPrice)} ₽`
    ]);
    
    autoTable(doc, {
      startY: 135,
      head: [['Тип оптимизации', 'Количество', 'Цена за единицу', 'Итого']],
      body: costDetailsData,
      theme: 'striped',
      styles: { halign: 'left' },
      headStyles: { 
        fillColor: [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    });
    
    doc.setFontSize(14);
    doc.text('Оптимизация включает:', 20, (doc as any).lastAutoTable.finalY + 15);
    
    const includedItems = [
      'Оптими��ация всех мета-те��ов',
      'Исправление проблем с изображениями',
      'Улучшение скорости загрузки',
      'Исправление технических проблем',
      'Оптимизация контента для SEO'
    ];
    
    let yPos = (doc as any).lastAutoTable.finalY + 20;
    includedItems.forEach(item => {
      doc.setFontSize(12);
      doc.text(`• ${item}`, 30, yPos);
      yPos += 8;
    });
  }
  
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  
  addTimestamp(doc, 20, 285);
  
  addPaginationFooters(doc);
  
  return doc.output('blob');
};
