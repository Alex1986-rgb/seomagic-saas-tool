
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';
import type { OptimizationItem } from '@/components/audit/results/components/optimization';
import { addPaginationFooters, addTimestamp } from './helpers';
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

// Функция для генерации полного PDF-отчета
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
  
  // Создаем новый PDF документ
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Форматирование даты
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Добавляем заголовок с градиентным баннером
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Добавляем логотип или название продукта
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('SEO Аудит', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 105, 30, { align: 'center' });
  
  // Добавляем блок с основной информацией
  doc.setFillColor(...pdfColors.light);
  doc.roundedRect(15, 50, 180, 50, 3, 3, 'F');
  
  doc.setTextColor(...pdfColors.dark);
  doc.setFontSize(14);
  doc.text('Общая информация о сайте', 105, 60, { align: 'center' });
  
  // Добавляем линию под заголовком секции
  doc.setDrawColor(...pdfColors.primary);
  doc.setLineWidth(0.5);
  doc.line(30, 64, 180, 64);
  
  // Добавляем основную информацию
  doc.setFontSize(10);
  doc.text(`Дата аудита: ${formattedDate}`, 25, 72);
  doc.text(`Проанализировано страниц: ${auditData.pageCount || 'N/A'}`, 25, 80);
  
  // Общая SEO оценка с визуализацией
  doc.setFontSize(12);
  doc.text('Общая SEO оценка:', 25, 90);
  
  // Рисуем градиентную шкалу для общей оценки
  generateScoreGauge(doc, auditData.score, 90, 86, 80, 8);
  
  // Добавляем категории аудита с визуализацией в виде радарной диаграммы
  doc.setFontSize(16);
  doc.text('Категории аудита', 105, 115, { align: 'center' });
  
  // Подготовка данных для радарной диаграммы
  const categoryScores = {
    'SEO': auditData.details.seo.score || 0,
    'Производительность': auditData.details.performance.score || 0,
    'Контент': auditData.details.content.score || 0,
    'Технические аспекты': auditData.details.technical.score || 0,
    'Юзабилити': auditData.details.usability?.score || 70 // Примерное значение, если нет данных
  };
  
  // Создаем радарную диаграмму с категориями
  generateRadarChart(doc, categoryScores, 105, 160, 50, {
    title: 'Оценки по категориям',
    maxValue: 100,
    fillColor: [...pdfColors.primary, 0.3],
    lineColor: pdfColors.primary,
    showValues: true
  });
  
  // Добавляем страницу для распределения проблем
  doc.addPage();
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Распределение проблем', 105, 14, { align: 'center' });
  
  // Распределение проблем по категориям
  const issuesByCategory = {
    'Критические': auditData.issues.critical.length,
    'Важные': auditData.issues.important.length,
    'Рекомендации': auditData.issues.opportunities.length
  };
  
  // Рисуем круговую диаграмму с распределением проблем
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
  
  // Далее распределение страниц по типам, если доступно
  if (pageStats && pageStats.subpages) {
    // Создаем гистограмму с распределением страниц по типам
    generateBarChart(doc, pageStats.subpages, 30, 170, 150, 60, {
      title: 'Распределение страниц по типам',
      barColor: pdfColors.info,
      showValues: true
    });
  }
  
  // Добавляем детальный анализ проблем
  doc.addPage();
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Детальный анализ проблем', 105, 14, { align: 'center' });
  
  // Рассчет общего количества проблем
  const totalIssues = auditData.issues.critical.length + auditData.issues.important.length + auditData.issues.opportunities.length;
  
  doc.setTextColor(...pdfColors.dark);
  doc.setFontSize(12);
  doc.text(`Всего обнаружено проблем: ${totalIssues}`, 20, 30);
  
  // Таблица с критическими проблемами
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.danger);
  doc.text('Критические проблемы', 20, 45);
  
  if (auditData.issues.critical.length > 0) {
    const criticalIssuesData = auditData.issues.critical.map(issue => [
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
  
  // Получаем Y-позицию после таблицы или текста
  let currentY = auditData.issues.critical.length > 0 ? 
    (doc as any).lastAutoTable.finalY + 15 : 60;
  
  // Проверяем, достаточно ли места для следующей таблицы
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }
  
  // Таблица с важными проблемами
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.warning);
  doc.text('Важные проблемы', 20, currentY);
  
  if (auditData.issues.important.length > 0) {
    const importantIssuesData = auditData.issues.important.map(issue => [
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
  
  // Проверяем, достаточно ли места для следующей таблицы
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }
  
  // Таблица с рекомендациями
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.info);
  doc.text('Рекомендации по улучшению', 20, currentY);
  
  if (auditData.issues.opportunities.length > 0) {
    const opportunitiesData = auditData.issues.opportunities.map(issue => [
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
  
  // Добавляем отчет о стоимости оптимизации, если данные доступны
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
    
    // Создаем данные для круговой диаграммы распределения стоимости
    const costDistribution: Record<string, number> = {};
    
    optimizationItems.forEach(item => {
      costDistribution[item.type] = item.totalPrice;
    });
    
    // Рисуем круговую диаграмму с распределением стоимости
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
    
    // Добавляем список что включено
    const includesY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Оптимизация включает:', 20, includesY);
    
    const includedItems = [
      'Оптимизация всех мета-тегов',
      'Исправление проблем с изображениями',
      'Улучшение скорости загрузки',
      'Исправление технических проблем',
      'Оптимизация контента для SEO'
    ];
    
    let yPos = includesY + 10;
    includedItems.forEach(item => {
      doc.setFontSize(12);
      doc.text(`• ${item}`, 30, yPos);
      yPos += 8;
    });
  }
  
  // Добавляем информацию о сгенерированном отчете
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  
  // Добавляем время генерации и другую информацию в футер
  addTimestamp(doc, 20, 285);
  
  // Add pagination footers
  addPaginationFooters(doc);
  
  // Преобразуем документ в Blob и возвращаем
  return doc.output('blob');
};
