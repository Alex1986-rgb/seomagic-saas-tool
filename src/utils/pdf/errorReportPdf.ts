
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';
import { getScoreColorRGB, addPaginationFooters, getCategoryStatus } from './helpers';

export interface ErrorReportPdfOptions {
  auditData: AuditData;
  url: string;
  urls?: string[];
}

export const generateErrorReportPdf = async (options: ErrorReportPdfOptions): Promise<Blob> => {
  const { auditData, url, urls } = options;
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Format date
  const formattedDate = new Date(auditData.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Add title
  doc.setFontSize(22);
  doc.text('Детальный отчет об ошибках', 105, 20, { align: 'center' });
  
  // Add website information
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 14, 30);
  doc.text(`Дата аудита: ${formattedDate}`, 14, 38);
  
  // Add critical errors section
  doc.setFontSize(16);
  doc.text('Критические ошибки', 14, 50);
  
  // Sample data for critical errors
  const criticalErrors = [
    ['Дубликаты страниц', auditData.issues.critical > 5 ? 'Обнаружено' : 'Не обнаружено'],
    ['Битые ссылки', auditData.issues.critical > 3 ? 'Обнаружено' : 'Не обнаружено'],
    ['Проблемы с индексацией', auditData.issues.critical > 2 ? 'Обнаружено' : 'Не обнаружено'],
    ['Ошибки структуры', auditData.issues.critical > 0 ? 'Обнаружено' : 'Не обнаружено']
  ];
  
  autoTable(doc, {
    startY: 55,
    head: [['Тип ошибки', 'Статус']],
    body: criticalErrors,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [220, 53, 69] }
  });
  
  // Add important issues section
  let currentY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(16);
  doc.text('Важные проблемы', 14, currentY);
  
  // Sample data for important issues
  const importantIssues = [
    ['Медленная загрузка страниц', auditData.issues.important > 4 ? 'Проблема' : 'Нормально'],
    ['Отсутствие мета-тегов', auditData.issues.important > 3 ? 'Проблема' : 'Нормально'],
    ['Проблемы с мобильной версией', auditData.issues.important > 2 ? 'Проблема' : 'Нормально'],
    ['Некорректные редиректы', auditData.issues.important > 1 ? 'Проблема' : 'Нормально'],
    ['Проблемы с контентом', auditData.issues.important > 0 ? 'Проблема' : 'Нормально']
  ];
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Тип проблемы', 'Статус']],
    body: importantIssues,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [255, 193, 7] }
  });
  
  // Add detailed errors page
  doc.addPage();
  
  doc.setFontSize(18);
  doc.text('Детализация ошибок по страницам', 105, 20, { align: 'center' });
  
  // Mock data for page errors
  const pageErrors = [];
  
  if (urls && urls.length > 0) {
    // Generate sample errors for some of the URLs
    for (let i = 0; i < Math.min(10, urls.length); i++) {
      if (Math.random() > 0.7) { // Add errors to some pages
        pageErrors.push([
          urls[i],
          Math.random() > 0.5 ? 'Дубликат контента' : 'Отсутствие метатегов',
          Math.random() > 0.5 ? 'Критическая' : 'Важная'
        ]);
      }
    }
  } else {
    // If no URLs provided, create some sample data
    pageErrors.push(
      [`${url}/page1`, 'Дубликат контента', 'Критическая'],
      [`${url}/page2`, 'Битая ссылка', 'Критическая'],
      [`${url}/page3`, 'Отсутствие метатегов', 'Важная'],
      [`${url}/blog/post1`, 'Низкая скорость загрузки', 'Важная'],
      [`${url}/contact`, 'Проблемы с мобильной версией', 'Важная']
    );
  }
  
  if (pageErrors.length > 0) {
    autoTable(doc, {
      startY: 30,
      head: [['URL страницы', 'Тип ошибки', 'Серьезность']],
      body: pageErrors,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [56, 189, 248] }
    });
  } else {
    doc.setFontSize(14);
    doc.text('Детальных ошибок по страницам не обнаружено', 105, 50, { align: 'center' });
  }
  
  // Add recommendations page
  doc.addPage();
  
  doc.setFontSize(18);
  doc.text('Рекомендации по исправлению', 105, 20, { align: 'center' });
  
  const recommendations = [
    {
      title: 'Устранение дубликатов контента',
      description: 'Используйте канонические URL для страниц с похожим контентом. Реструктурируйте страницы, чтобы избежать повторений.'
    },
    {
      title: 'Исправление битых ссылок',
      description: 'Проведите аудит всех внутренних и внешних ссылок. Настройте корректные 301 редиректы для измененных URL.'
    },
    {
      title: 'Оптимизация метатегов',
      description: 'Добавьте уникальные и содержательные title и description для каждой страницы, не превышая рекомендуемую длину.'
    },
    {
      title: 'Улучшение скорости загрузки',
      description: 'Оптимизируйте изображения, используйте сжатие, кеширование и минимизацию CSS и JavaScript файлов.'
    },
    {
      title: 'Устранение проблем мобильной версии',
      description: 'Убедитесь в корректном отображении на всех устройствах, используйте адаптивный дизайн и подходящие размеры шрифтов.'
    }
  ];
  
  let recY = 40;
  
  recommendations.forEach((rec, index) => {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}. ${rec.title}`, 14, recY);
    recY += 8;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    const descriptionLines = doc.splitTextToSize(rec.description, 180);
    descriptionLines.forEach((line: string) => {
      doc.text(line, 18, recY);
      recY += 6;
    });
    
    recY += 10;
  });
  
  // Add footer information about the generated report
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 14, 285);
  
  // Add pagination footers
  addPaginationFooters(doc);
  
  // Convert the document to a Blob and return it
  return doc.output('blob');
};
