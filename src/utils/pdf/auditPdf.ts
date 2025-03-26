
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';
import html2canvas from 'html2canvas';
import { OptimizationItem } from '@/components/audit/results/components/OptimizationCost';

interface GeneratePdfReportOptions {
  auditData: AuditData;
  url: string;
  recommendations?: any;
  pageStats?: any;
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  date: string;
}

// Функция для генерации полного PDF-отчета
export const generateAuditPdf = async (options: GeneratePdfReportOptions): Promise<Blob> => {
  const { auditData, url, recommendations, pageStats, optimizationCost, optimizationItems, date } = options;
  
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Добавляем логотип и заголовок
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('SEO Аудит', 15, 15);
  
  doc.setFontSize(14);
  doc.text(`Сайт: ${url}`, 15, 22);
  
  // Добавляем основную информацию
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Дата аудита: ${formattedDate}`, 15, 40);
  doc.text(`Общая SEO оценка: ${auditData.score}/100`, 15, 48);
  
  // Рисуем цветной индикатор оценки
  const scoreColor = auditData.score >= 80 ? '#4ade80' : auditData.score >= 60 ? '#facc15' : '#ef4444';
  doc.setFillColor(scoreColor.replace('#', '0x'));
  doc.circle(170, 44, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(auditData.score.toString(), 170, 44, { align: 'center' });
  
  // Возвращаемся к основному цвету текста
  doc.setTextColor(0, 0, 0);
  
  // Добавляем информацию о страницах
  doc.setFontSize(16);
  doc.text('Статистика сайта', 15, 60);
  
  // Таблица статистики
  const statsData = [
    ['Проанализировано страниц', auditData.pageCount?.toString() || '0'],
    ['Обнаружено проблем', auditData.issues.total.toString()],
    ['Критические ошибки', auditData.issues.critical.toString()],
    ['Средние проблемы', auditData.issues.medium.toString()],
    ['Незначительные проблемы', auditData.issues.minor.toString()]
  ];
  
  autoTable(doc, {
    startY: 65,
    head: [['Параметр', 'Значение']],
    body: statsData,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [56, 189, 248] }
  });
  
  // Добавляем детали распределения страниц по типам, если доступно
  if (pageStats && pageStats.subpages) {
    doc.setFontSize(16);
    doc.text('Распределение страниц', 15, doc.lastAutoTable.finalY + 15);
    
    const pageTypesData = Object.entries(pageStats.subpages).map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Тип страницы', 'Количество']],
      body: pageTypesData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [56, 189, 248] }
    });
  }
  
  // Добавляем анализ проблем
  doc.setFontSize(16);
  doc.text('Анализ обнаруженных проблем', 15, doc.lastAutoTable.finalY + 15);
  
  if (recommendations) {
    const recommendationsData = Object.entries(recommendations).map(([category, categoryData]: [string, any]) => [
      category,
      categoryData.issues?.length || 0,
      categoryData.score
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Категория', 'Количество проблем', 'Оценка']],
      body: recommendationsData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [56, 189, 248] }
    });
  }
  
  // Добавляем страницу для калькуляции стоимости оптимизации
  if (optimizationCost && optimizationItems) {
    doc.addPage();
    
    doc.setFillColor(56, 189, 248);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Стоимость оптимизации', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Общая стоимость: ${new Intl.NumberFormat('ru-RU').format(optimizationCost)} ₽`, 15, 30);
    doc.text(`Количество страниц: ${auditData.pageCount}`, 15, 38);
    doc.text(`Стоимость за страницу: ${new Intl.NumberFormat('ru-RU').format(Math.round(optimizationCost / (auditData.pageCount || 1)))} ₽`, 15, 46);
    
    doc.setFontSize(14);
    doc.text('Детализация стоимости:', 15, 54);
    
    const costDetailsData = optimizationItems.map(item => [
      item.type,
      item.count.toString(),
      `${new Intl.NumberFormat('ru-RU').format(item.pricePerUnit)} ₽`,
      `${new Intl.NumberFormat('ru-RU').format(item.totalPrice)} ₽`
    ]);
    
    autoTable(doc, {
      startY: 58,
      head: [['Тип оптимизации', 'Количество', 'Цена за единицу', 'Итого']],
      body: costDetailsData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [56, 189, 248] }
    });
    
    // Добавляем перечень что включено
    doc.setFontSize(14);
    doc.text('Оптимизация включает:', 15, doc.lastAutoTable.finalY + 15);
    
    const includedItems = [
      'Оптимизация всех мета-тегов',
      'Исправление проблем с изображениями',
      'Оптимизация контента для SEO',
      'Улучшение скорости загрузки',
      'Исправление технических проблем',
      'Удаление дублей и создание уникального контента',
      'Исправление URL (замена подчеркиваний на дефисы)'
    ];
    
    let yPos = doc.lastAutoTable.finalY + 20;
    includedItems.forEach(item => {
      doc.setFontSize(12);
      doc.text(`• ${item}`, 20, yPos);
      yPos += 8;
    });
  }
  
  // Добавляем информацию о рекомендациях
  doc.addPage();
  
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Рекомендации по оптимизации', 15, 15);
  
  doc.setTextColor(0, 0, 0);
  let yPosition = 30;
  
  if (recommendations) {
    Object.entries(recommendations).forEach(([category, categoryData]: [string, any], index) => {
      // Проверяем, нужно ли добавить новую страницу
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${category} (Оценка: ${categoryData.score}/100)`, 15, yPosition);
      yPosition += 10;
      
      if (categoryData.issues && categoryData.issues.length > 0) {
        categoryData.issues.slice(0, 5).forEach((issue: any, issueIndex: number) => {
          doc.setFontSize(12);
          doc.text(`${index + 1}.${issueIndex + 1}. ${issue.title}`, 20, yPosition);
          yPosition += 7;
          
          doc.setFontSize(10);
          const descriptionLines = doc.splitTextToSize(issue.description, 170);
          descriptionLines.forEach((line: string) => {
            doc.text(line, 25, yPosition);
            yPosition += 5;
          });
          
          yPosition += 5;
        });
      } else {
        doc.setFontSize(12);
        doc.text('Нет обнаруженных проблем в этой категории', 20, yPosition);
        yPosition += 10;
      }
      
      yPosition += 5;
    });
  } else {
    doc.text('Нет доступных рекомендаций', 15, yPosition);
  }
  
  // Добавляем информацию о контактах
  doc.setFontSize(10);
  doc.text('SEO Market - профессиональная оптимизация сайтов', 15, 280);
  doc.text('Контакты: support@seomarket.ru | +7 (XXX) XXX-XX-XX', 15, 285);
  
  // Возвращаем PDF как Blob
  return doc.output('blob');
};
