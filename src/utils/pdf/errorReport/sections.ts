
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalyzedError, AnalyzedErrors, ErrorReportSection } from './types';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { formatReportHeader } from '../styles/formatting';

/**
 * Renders the critical errors section
 */
export const renderCriticalErrorsSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  startY: number
): number => {
  if (errors.critical.length === 0) {
    return startY;
  }
  
  const section: ErrorReportSection = {
    title: 'Критические ошибки',
    errors: errors.critical,
    color: pdfColors.error
  };
  
  return renderErrorSection(doc, section, startY);
};

/**
 * Renders the important issues section
 */
export const renderImportantIssuesSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  startY: number
): number => {
  if (errors.important.length === 0) {
    return startY;
  }
  
  const section: ErrorReportSection = {
    title: 'Важные проблемы',
    errors: errors.important,
    color: pdfColors.warning
  };
  
  return renderErrorSection(doc, section, startY);
};

/**
 * Renders the minor issues section
 */
export const renderMinorIssuesSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  startY: number
): number => {
  if (errors.minor.length === 0) {
    return startY;
  }
  
  const section: ErrorReportSection = {
    title: 'Незначительные проблемы',
    errors: errors.minor,
    color: pdfColors.info
  };
  
  return renderErrorSection(doc, section, startY);
};

/**
 * Renders a generic error section
 */
const renderErrorSection = (
  doc: jsPDF, 
  section: ErrorReportSection, 
  startY: number
): number => {
  // Add section title
  doc.setFontSize(pdfFonts.subheading.size);
  doc.setTextColor(...section.color);
  doc.text(section.title, 14, startY);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Create error table
  const tableData = section.errors.map(error => [
    error.title,
    error.description,
    error.solution || '',
    error.category || ''
  ]);
  
  autoTable(doc, {
    startY: startY + 5,
    head: [['Ошибка', 'Описание', 'Решение', 'Категория']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: section.color,
      textColor: [255, 255, 255]
    },
    styles: {
      fontSize: pdfFonts.normal.size,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 70 },
      2: { cellWidth: 50 },
      3: { cellWidth: 20 }
    }
  });
  
  // Get the Y position after the table
  return (doc as any).lastAutoTable.finalY + 10;
};

/**
 * Renders page-specific errors section
 */
export const renderPageErrorsSection = (
  doc: jsPDF, 
  errors: AnalyzedErrors
): number => {
  if (!errors.byPage || Object.keys(errors.byPage).length === 0) {
    return 0;
  }
  
  // Add a new page for page-specific errors
  doc.addPage();
  
  // Add title
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Ошибки по страницам', 105, 20, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let currentY = 40;
  
  // Render errors for each page
  Object.entries(errors.byPage).forEach(([url, pageErrors], index) => {
    // Check if we need to add a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 40;
    }
    
    // Add URL
    doc.setFontSize(pdfFonts.subheading.size);
    doc.setTextColor(...pdfColors.primary);
    doc.text(`${index + 1}. ${url}`, 14, currentY);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Create error table for this page
    const tableData = pageErrors.map(error => [
      getImpactIcon(error.impact || 'low'),
      error.title,
      error.category || ''
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Важность', 'Ошибка', 'Категория']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: pdfColors.gray,
        textColor: [255, 255, 255]
      },
      styles: {
        fontSize: pdfFonts.normal.size,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 130 },
        2: { cellWidth: 40 }
      }
    });
    
    // Get the Y position after the table
    currentY = (doc as any).lastAutoTable.finalY + 20;
  });
  
  return currentY;
};

/**
 * Returns an icon representation for impact level
 */
const getImpactIcon = (impact: 'high' | 'medium' | 'low'): string => {
  switch (impact) {
    case 'high': return '⚠️ Высокий';
    case 'medium': return '⚠ Средний';
    case 'low': return 'ℹ️ Низкий';
    default: return 'ℹ️ Низкий';
  }
};

/**
 * Renders recommendations section
 */
export const renderRecommendationsSection = (doc: jsPDF): number => {
  // Add a new page for recommendations
  doc.addPage();
  
  // Add title
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Рекомендации по оптимизации', 105, 20, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  const recommendations = [
    {
      title: 'SEO оптимизация',
      items: [
        'Добавьте уникальные мета-теги для каждой страницы',
        'Улучшите структуру URL для лучшей индексации',
        'Настройте правильную структуру заголовков (H1-H6)',
        'Создайте и отправьте XML sitemap в Google Search Console',
        'Оптимизируйте изображения и добавьте alt-атрибуты'
      ]
    },
    {
      title: 'Производительность',
      items: [
        'Минимизируйте JavaScript и CSS файлы',
        'Используйте кэширование браузера для статических ресурсов',
        'Оптимизируйте размеры изображений и используйте современные форматы',
        'Реализуйте ленивую загрузку изображений и контента',
        'Уменьшите время до первого содержательного рендеринга'
      ]
    },
    {
      title: 'Контент',
      items: [
        'Создавайте уникальный, полезный контент для пользователей',
        'Правильно структурируйте контент с помощью заголовков',
        'Добавляйте внутренние ссылки между связанными страницами',
        'Регулярно обновляйте и расширяйте контент',
        'Используйте ключевые слова естественным образом'
      ]
    }
  ];
  
  let currentY = 40;
  
  // Render each recommendation section
  recommendations.forEach((section, index) => {
    // Check if we need to add a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 40;
    }
    
    // Add section title
    doc.setFontSize(pdfFonts.subheading.size);
    doc.setTextColor(...pdfColors.primary);
    doc.text(`${index + 1}. ${section.title}`, 14, currentY);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add items
    doc.setFontSize(pdfFonts.normal.size);
    
    currentY += 10;
    
    section.items.forEach((item, i) => {
      doc.text(`${index + 1}.${i + 1}. ${item}`, 20, currentY);
      currentY += 8;
    });
    
    currentY += 10;
  });
  
  return currentY;
};

/**
 * Renders SEO scores section
 */
export const renderScoresSection = (doc: jsPDF, auditData: any): number => {
  // Add a new page for scores
  doc.addPage();
  
  // Add title
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Общие показатели SEO', 105, 20, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Create a table with scores
  const scoresData = [
    ['Общий балл SEO', `${auditData.score}/100`],
    ['SEO', `${auditData.details.seo.score}/100`],
    ['Производительность', `${auditData.details.performance.score}/100`],
    ['Контент', `${auditData.details.content.score}/100`],
    ['Технические аспекты', `${auditData.details.technical.score}/100`],
    ['Мобильная оптимизация', `${auditData.details.mobile.score}/100`]
  ];
  
  autoTable(doc, {
    startY: 40,
    body: scoresData,
    theme: 'grid',
    styles: {
      fontSize: pdfFonts.normal.size,
      cellPadding: 5
    },
    columnStyles: {
      0: { 
        font: 'bold',
        cellWidth: 100
      },
      1: { 
        halign: 'center',
        cellWidth: 60
      }
    }
  });
  
  // Get the Y position after the table
  return (doc as any).lastAutoTable.finalY + 10;
};

/**
 * Renders executive summary section
 */
export const renderExecutiveSummarySection = (
  doc: jsPDF, 
  errors: AnalyzedErrors, 
  auditData: any,
  url: string
): number => {
  // Add title
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Сводка по ошибкам', 105, 20, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(pdfFonts.normal.size);
  doc.text(`Сайт: ${url}`, 14, 40);
  doc.text(`Дата проверки: ${new Date(auditData.date).toLocaleDateString('ru-RU')}`, 14, 48);
  doc.text(`Общий SEO балл: ${auditData.score}/100`, 14, 56);
  
  // Create summary table
  const summaryData = [
    ['Критические ошибки', errors.critical.length.toString(), 'Высокий приоритет - требуют немедленного исправления'],
    ['Важные проблемы', errors.important.length.toString(), 'Средний приоритет - следует исправить в ближайшее время'],
    ['Незначительные проблемы', errors.minor.length.toString(), 'Низкий приоритет - можно исправить в плановом порядке']
  ];
  
  autoTable(doc, {
    startY: 65,
    head: [['Тип проблем', 'Количество', 'Приоритет']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255]
    },
    styles: {
      fontSize: pdfFonts.normal.size,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 100 }
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 10;
};
