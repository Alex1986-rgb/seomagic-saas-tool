
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';
import type { OptimizationItem } from '@/components/audit/results/components/optimization';
import { addPaginationFooters } from './helpers';
import { getScoreColorRGB } from './styles/colors'; // Updated import path

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
  
  // Добавляем заголовок
  doc.setFontSize(22);
  doc.text('SEO Аудит', 105, 20, { align: 'center' });
  
  // Добавляем информацию о сайте
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 14, 30);
  doc.text(`Дата аудита: ${formattedDate}`, 14, 38);
  
  // Добавляем основную информацию
  doc.text(`Общая SEO оценка: ${auditData.score}/100`, 14, 46);
  
  // Рисуем цветной индикатор оценки
  const scoreColor = getScoreColorRGB(auditData.score);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.circle(170, 44, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(auditData.score.toString(), 170, 44, { align: 'center' });
  
  // Возвращаемся к основному цвету текста
  doc.setTextColor(0, 0, 0);
  
  // Добавляем статистику сайта
  doc.setFontSize(16);
  doc.text('Статистика сайта', 14, 60);
  
  // Расчет общего количества проблем
  const totalIssues = auditData.issues.critical + auditData.issues.important + auditData.issues.opportunities;
  
  // Таблица статистики
  const statsData = [
    ['Проанализировано страниц', auditData.pageCount?.toString() || '0'],
    ['Обнаружено проблем', totalIssues.toString()],
    ['Критические ошибки', auditData.issues.critical.toString()],
    ['Средние проблемы', auditData.issues.important.toString()],
    ['Незначительные проблемы', auditData.issues.opportunities.toString()]
  ];
  
  autoTable(doc, {
    startY: 65,
    head: [['Параметр', 'Значение']],
    body: statsData,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [56, 189, 248] }
  });
  
  // Get the Y position after the table
  let currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // Добавляем детали распределения страниц по типам, если доступно
  if (pageStats && pageStats.subpages) {
    doc.setFontSize(16);
    doc.text('Распределение страниц', 14, currentY);
    
    const pageTypesData = Object.entries(pageStats.subpages).map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Тип страницы', 'Количество']],
      body: pageTypesData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [56, 189, 248] }
    });
    
    // Update Y position
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Добавляем категории аудита
  doc.setFontSize(16);
  doc.text('Категории аудита', 14, currentY);
  
  const categories = [
    ['SEO', auditData.details?.seo?.score || 0],
    ['Производительность', auditData.details?.performance?.score || 0],
    ['Контент', auditData.details?.content?.score || 0],
    ['Технические аспекты', auditData.details?.technical?.score || 0]
  ];
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Категория', 'Оценка']],
    body: categories,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [56, 189, 248] }
  });
  
  // Добавляем рекомендации, если они есть
  if (recommendations) {
    doc.addPage();
    
    doc.setFontSize(18);
    doc.text('Рекомендации по оптимизации', 105, 20, { align: 'center' });
    
    let recY = 40;
    
    Object.entries(recommendations).forEach(([category, categoryData]: [string, any], index) => {
      // Проверяем, нужно ли добавить новую страницу
      if (recY > 250) {
        doc.addPage();
        recY = 40;
      }
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${category}`, 14, recY);
      recY += 10;
      
      if (categoryData.issues && categoryData.issues.length > 0) {
        categoryData.issues.slice(0, 5).forEach((issue: any, issueIndex: number) => {
          // Добавляем проблему
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}.${issueIndex + 1}. ${issue.title}`, 20, recY);
          recY += 7;
          
          // Добавляем описание проблемы
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          
          if (issue.description) {
            const descriptionLines = doc.splitTextToSize(issue.description, 170);
            descriptionLines.forEach((line: string) => {
              doc.text(line, 25, recY);
              recY += 5;
            });
          }
          
          recY += 5;
        });
      } else {
        doc.setFontSize(12);
        doc.text('Нет обнаруженных проблем в этой категории', 20, recY);
        recY += 10;
      }
      
      recY += 5;
    });
  }
  
  // Добавляем отчет о стоимости оптимизации, если данные доступны
  if (optimizationCost && optimizationItems) {
    doc.addPage();
    
    doc.setFontSize(18);
    doc.text('Стоимость оптимизации', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Общая стоимость: ${new Intl.NumberFormat('ru-RU').format(optimizationCost)} ₽`, 14, 40);
    doc.text(`Количество страниц: ${auditData.pageCount}`, 14, 48);
    
    doc.setFontSize(14);
    doc.text('Детализация стоимости:', 14, 60);
    
    const costDetailsData = optimizationItems.map(item => [
      item.type,
      item.count.toString(),
      `${new Intl.NumberFormat('ru-RU').format(item.pricePerUnit)} ₽`,
      `${new Intl.NumberFormat('ru-RU').format(item.totalPrice)} ₽`
    ]);
    
    autoTable(doc, {
      startY: 65,
      head: [['Тип оптимизации', 'Количество', 'Цена за единицу', 'Итого']],
      body: costDetailsData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [56, 189, 248] }
    });
    
    // Добавляем список что включено
    const includesY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Оптимизация включает:', 14, includesY);
    
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
      doc.text(`• ${item}`, 20, yPos);
      yPos += 8;
    });
  }
  
  // Добавляем информацию о сгенерированном отчете
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 14, 285);
  
  // Add pagination footers
  addPaginationFooters(doc);
  
  // Преобразуем документ в Blob и возвращаем
  return doc.output('blob');
};
