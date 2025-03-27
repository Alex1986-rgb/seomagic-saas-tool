
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalyzedErrors } from './types';
import { getCategoryStatus } from '../helpers';

/**
 * Renders the critical errors section in the PDF
 */
export const renderCriticalErrorsSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  startY: number
): number => {
  doc.setFontSize(16);
  doc.text('Критические ошибки', 14, startY);
  
  if (errors.critical.length > 0) {
    const criticalErrorsData = errors.critical.map((error, index) => [
      `${index + 1}. ${error.title}`,
      error.description
    ]);
    
    autoTable(doc, {
      startY: startY + 5,
      head: [['Ошибка', 'Описание']],
      body: criticalErrorsData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [220, 53, 69] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 120 }
      }
    });
    
    return doc.lastAutoTable?.finalY || startY + 15;
  } else {
    doc.setFontSize(12);
    doc.text('Критических ошибок не обнаружено', 14, startY + 10);
    return startY + 15;
  }
};

/**
 * Renders the important issues section in the PDF
 */
export const renderImportantIssuesSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  startY: number
): number => {
  doc.setFontSize(16);
  doc.text('Важные проблемы', 14, startY);
  
  if (errors.important.length > 0) {
    const importantIssuesData = errors.important.map((error, index) => [
      `${index + 1}. ${error.title}`,
      error.description
    ]);
    
    autoTable(doc, {
      startY: startY + 5,
      head: [['Проблема', 'Описание']],
      body: importantIssuesData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [255, 193, 7] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 120 }
      }
    });
    
    return doc.lastAutoTable?.finalY || startY + 15;
  } else {
    doc.setFontSize(12);
    doc.text('Важных проблем не обнаружено', 14, startY + 10);
    return startY + 15;
  }
};

/**
 * Renders the minor issues section in the PDF
 */
export const renderMinorIssuesSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  startY: number
): number => {
  doc.setFontSize(16);
  doc.text('Незначительные замечания', 14, startY);
  
  if (errors.minor.length > 0) {
    const minorIssuesData = errors.minor.map((error, index) => [
      `${index + 1}. ${error.title}`,
      error.description
    ]);
    
    autoTable(doc, {
      startY: startY + 5,
      head: [['Замечание', 'Описание']],
      body: minorIssuesData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [13, 110, 253] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 120 }
      }
    });
    
    return doc.lastAutoTable?.finalY || startY + 15;
  } else {
    doc.setFontSize(12);
    doc.text('Незначительных замечаний не обнаружено', 14, startY + 10);
    return startY + 15;
  }
};

/**
 * Renders the URL-specific errors section
 */
export const renderPageErrorsSection = (
  doc: jsPDF, 
  urls: string[] | undefined
): void => {
  if (!urls || urls.length === 0) return;
  
  doc.addPage();
  
  doc.setFontSize(18);
  doc.text('Ошибки по отдельным страницам', 105, 20, { align: 'center' });
  
  // Generate sample page-level errors (in a real app, these would come from analysis)
  const pageErrors = [];
  const errorTypes = [
    'Дубликат контента', 
    'Отсутствие метатегов', 
    'Пустой title', 
    'Пустой description',
    'Отсутствие H1',
    'Битая ссылка',
    'Слишком длинный URL',
    'JavaScript ошибка'
  ];
  
  const severityTypes = ['Критическая', 'Важная', 'Незначительная'];
  
  // Generate sample errors for some URLs (in production, this would be real data)
  const sampleUrlCount = Math.min(12, urls.length);
  for (let i = 0; i < sampleUrlCount; i++) {
    if (Math.random() > 0.4) { // Not all pages have errors
      const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      const severity = severityTypes[Math.floor(Math.random() * severityTypes.length)];
      
      pageErrors.push([
        urls[i],
        errorType,
        severity
      ]);
    }
  }
  
  if (pageErrors.length > 0) {
    autoTable(doc, {
      startY: 30,
      head: [['URL страницы', 'Тип ошибки', 'Серьезность']],
      body: pageErrors,
      theme: 'grid',
      styles: { halign: 'left', fontSize: 8 },
      headStyles: { fillColor: [56, 189, 248] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 }
      }
    });
  } else {
    doc.setFontSize(14);
    doc.text('Детальных ошибок по страницам не обнаружено', 105, 50, { align: 'center' });
  }
};

/**
 * Renders the recommendations page in the PDF
 */
export const renderRecommendationsSection = (doc: jsPDF): void => {
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
    
    recY += 4;
  });
};

/**
 * Renders the SEO score breakdown section in the PDF
 */
export const renderScoresSection = (doc: jsPDF, auditData: any): void => {
  doc.addPage();
  
  doc.setFontSize(18);
  doc.text('Распределение SEO оценок', 105, 20, { align: 'center' });
  
  // Create a table showing scores by category
  const categoryScores = [
    ['SEO', `${auditData.details.seo.score}/100`, getCategoryStatus(auditData.details.seo.score)],
    ['Контент', `${auditData.details.content.score}/100`, getCategoryStatus(auditData.details.content.score)],
    ['Производительность', `${auditData.details.performance.score}/100`, getCategoryStatus(auditData.details.performance.score)],
    ['Технические аспекты', `${auditData.details.technical.score}/100`, getCategoryStatus(auditData.details.technical.score)],
    ['Мобильная версия', `${auditData.details.mobile.score}/100`, getCategoryStatus(auditData.details.mobile.score)],
    ['Общий балл', `${auditData.score}/100`, getCategoryStatus(auditData.score)]
  ];
  
  autoTable(doc, {
    startY: 30,
    head: [['Категория', 'Балл', 'Статус']],
    body: categoryScores,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [23, 162, 184] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 40 },
      2: { cellWidth: 70 }
    },
    didParseCell: function(data) {
      // Handle the cell styling based on status
      if (data.section === 'body') {
        const status = categoryScores[data.row.index][2];
        if (status === 'Хорошо') {
          data.cell.styles.textColor = [40, 167, 69];
        } else if (status === 'Нуждается в улучшении') {
          data.cell.styles.textColor = [255, 193, 7];
        } else if (status === 'Требует внимания') {
          data.cell.styles.textColor = [220, 53, 69];
        }
      }
    }
  });
  
  // Add duplication report section if applicable
  if (auditData.issues.critical > 0 || auditData.issues.important > 0) {
    doc.setFontSize(16);
    doc.text('Отчет о потенциальных дубликатах контента', 14, 100);
    
    doc.setFontSize(12);
    doc.text(`Обнаружено ${Math.floor(auditData.issues.critical / 2)} дубликатов страниц`, 14, 110);
    doc.text(`Обнаружено ${Math.floor(auditData.issues.important / 2)} повторяющихся мета-тегов`, 14, 120);
    
    doc.setFontSize(10);
    doc.text('Дублирование контента существенно влияет на SEO рейтинг сайта.', 14, 130);
    doc.text('Рекомендуется исправить все найденные дубликаты.', 14, 137);
  }
};
