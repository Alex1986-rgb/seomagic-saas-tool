
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors, pdfFonts } from '../styles';
import { ErrorReportData, ErrorTypeData } from './types';

/**
 * Adds the report header section
 */
export function addReportHeaderSection(
  doc: jsPDF,
  title: string,
  url: string,
  date: string,
  pageCount: number
): number {
  // Header background
  doc.setFillColor(...pdfColors.primary as [number, number, number]);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text(title, 15, 15);
  
  // Subtitle
  doc.setFontSize(14);
  doc.text(`Домен: ${url}`, 15, 25);
  
  // Reset color
  doc.setTextColor(0, 0, 0);
  
  // Report info
  let yPosition = 45;
  
  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Информация об отчете:', 15, yPosition);
  yPosition += 8;
  
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text(`Дата создания: ${date}`, 15, yPosition);
  yPosition += 6;
  
  if (pageCount) {
    doc.text(`Проверено страниц: ${pageCount}`, 15, yPosition);
    yPosition += 6;
  }
  
  doc.text(`Сгенерировано: ${new Date().toLocaleString('ru-RU')}`, 15, yPosition);
  yPosition += 15;
  
  return yPosition;
}

/**
 * Adds the error summary section
 */
export function addErrorSummarySection(
  doc: jsPDF,
  data: ErrorReportData,
  yPosition: number
): number {
  // Section header
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Сводка ошибок', 15, yPosition);
  yPosition += 10;
  
  // Create summary table
  const totalErrors = data.critical.length + data.major.length + data.minor.length;
  
  const tableData = [
    ['Критические ошибки', data.critical.length.toString(), `${((data.critical.length / totalErrors) * 100).toFixed(1)}%`],
    ['Основные ошибки', data.major.length.toString(), `${((data.major.length / totalErrors) * 100).toFixed(1)}%`],
    ['Незначительные ошибки', data.minor.length.toString(), `${((data.minor.length / totalErrors) * 100).toFixed(1)}%`],
    ['Всего ошибок', totalErrors.toString(), '100%']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Тип ошибки', 'Количество', 'Процент']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: pdfColors.primary as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    foot: [['Всего ошибок', totalErrors.toString(), '100%']],
    footStyles: {
      fillColor: [240, 240, 240],
      fontStyle: 'bold'
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 15;
}

/**
 * Adds critical error section
 */
export function addCriticalErrorsSection(
  doc: jsPDF, 
  errors: ErrorTypeData[],
  yPosition: number
): number {
  if (errors.length === 0) {
    return yPosition;
  }
  
  // Check if we need a new page
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Section header
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Критические ошибки', 15, yPosition);
  yPosition += 10;
  
  // Description
  doc.setFontSize(11);
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text('Эти ошибки требуют немедленного внимания и могут серьезно влиять на работу сайта.', 15, yPosition);
  yPosition += 8;
  
  // Create errors table
  const tableData = errors.map(error => [
    error.name,
    error.description,
    error.urls.length.toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Ошибка', 'Описание', 'Страниц']],
    body: tableData,
    theme: 'grid',
    styles: { cellPadding: 4 },
    headStyles: {
      fillColor: pdfColors.error as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 20, halign: 'center' }
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 15;
}

/**
 * Adds major error section
 */
export function addMajorErrorsSection(
  doc: jsPDF, 
  errors: ErrorTypeData[],
  yPosition: number
): number {
  if (errors.length === 0) {
    return yPosition;
  }
  
  // Check if we need a new page
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Section header
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Основные ошибки', 15, yPosition);
  yPosition += 10;
  
  // Description
  doc.setFontSize(11);
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text('Эти ошибки важны и должны быть исправлены, но они не нарушают работу сайта.', 15, yPosition);
  yPosition += 8;
  
  // Create errors table
  const tableData = errors.map(error => [
    error.name,
    error.description,
    error.urls.length.toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Ошибка', 'Описание', 'Страниц']],
    body: tableData,
    theme: 'grid',
    styles: { cellPadding: 4 },
    headStyles: {
      fillColor: pdfColors.warning as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 20, halign: 'center' }
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 15;
}

/**
 * Adds minor error section
 */
export function addMinorErrorsSection(
  doc: jsPDF, 
  errors: ErrorTypeData[],
  yPosition: number
): number {
  if (errors.length === 0) {
    return yPosition;
  }
  
  // Check if we need a new page
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Section header
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Незначительные ошибки', 15, yPosition);
  yPosition += 10;
  
  // Description
  doc.setFontSize(11);
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text('Эти ошибки не критичны, но их исправление улучшит качество сайта.', 15, yPosition);
  yPosition += 8;
  
  // Create errors table
  const tableData = errors.map(error => [
    error.name,
    error.description,
    error.urls.length.toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Ошибка', 'Описание', 'Страниц']],
    body: tableData,
    theme: 'grid',
    styles: { cellPadding: 4 },
    headStyles: {
      fillColor: pdfColors.info as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 20, halign: 'center' }
    }
  });
  
  return (doc as any).lastAutoTable.finalY + 15;
}

/**
 * Adds the error details section
 */
export function addErrorDetailsSection(
  doc: jsPDF,
  data: ErrorReportData,
  yPosition: number
): number {
  // Check if we need a new page
  if (yPosition > 100) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Section header
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Детали ошибок', 15, yPosition);
  yPosition += 10;
  
  // Combine all errors
  const allErrors = [...data.critical, ...data.major, ...data.minor];
  
  for (const error of allErrors) {
    // Check if we need a new page
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Error header with color indication
    let errorColor: [number, number, number];
    if (data.critical.includes(error)) {
      errorColor = pdfColors.error as [number, number, number];
    } else if (data.major.includes(error)) {
      errorColor = pdfColors.warning as [number, number, number];
    } else {
      errorColor = pdfColors.info as [number, number, number];
    }
    
    doc.setFillColor(...errorColor);
    doc.rect(15, yPosition - 5, 180, 7, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(error.name, 20, yPosition);
    yPosition += 8;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Error description
    doc.setFontSize(11);
    doc.setFont(pdfFonts.primary, pdfFonts.normal);
    doc.text(error.description, 15, yPosition);
    yPosition += 8;
    
    // Impact/priority
    const priority = data.critical.includes(error) 
      ? 'Высокий' 
      : data.major.includes(error) 
        ? 'Средний' 
        : 'Низкий';
        
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(`Приоритет: ${priority}`, 15, yPosition);
    yPosition += 6;
    
    // Solution
    if (error.solution) {
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.text('Решение:', 15, yPosition);
      yPosition += 6;
      
      doc.setFont(pdfFonts.primary, pdfFonts.normal);
      doc.text(error.solution, 15, yPosition, { maxWidth: 180 });
      yPosition += 10;
    }
    
    // Affected URLs
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(`Затронутые URL (${error.urls.length}):`, 15, yPosition);
    yPosition += 6;
    
    // List URLs - limited to first 5 with option to note there are more
    const displayUrls = error.urls.slice(0, 5);
    
    for (const url of displayUrls) {
      doc.setFont(pdfFonts.primary, pdfFonts.normal);
      doc.text(`• ${url}`, 20, yPosition);
      yPosition += 5;
    }
    
    if (error.urls.length > 5) {
      doc.setFont(pdfFonts.primary, pdfFonts.italic);
      doc.text(`...и ещё ${error.urls.length - 5} URL(s)`, 20, yPosition);
      yPosition += 5;
    }
    
    yPosition += 10;
  }
  
  return yPosition;
}

/**
 * Adds the recommendations section
 */
export function addRecommendationsSection(
  doc: jsPDF,
  data: ErrorReportData,
  yPosition: number
): number {
  // Check if we need a new page
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Section header
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Рекомендации по исправлению', 15, yPosition);
  yPosition += 10;
  
  // Description
  doc.setFontSize(11);
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.text('Здесь приведены рекомендации по исправлению обнаруженных ошибок в порядке приоритета.', 15, yPosition);
  yPosition += 10;
  
  // Recommendations based on priority
  const addRecommendationGroup = (title: string, errors: ErrorTypeData[], color: [number, number, number]) => {
    if (errors.length === 0) return;
    
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFillColor(...color);
    doc.rect(15, yPosition - 5, 180, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(title, 20, yPosition);
    yPosition += 10;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    errors.forEach((error, index) => {
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.text(`${index + 1}. ${error.name}`, 15, yPosition);
      yPosition += 6;
      
      if (error.solution) {
        doc.setFont(pdfFonts.primary, pdfFonts.normal);
        doc.text(error.solution, 20, yPosition, { maxWidth: 175 });
        yPosition += 10;
      } else {
        doc.setFont(pdfFonts.primary, pdfFonts.normal);
        doc.text(`Исправьте ошибку "${error.name}" на всех затронутых страницах.`, 20, yPosition);
        yPosition += 10;
      }
    });
  };
  
  // Add recommendations by priority
  addRecommendationGroup('Критические исправления', data.critical, pdfColors.error as [number, number, number]);
  addRecommendationGroup('Важные исправления', data.major, pdfColors.warning as [number, number, number]);
  addRecommendationGroup('Улучшения', data.minor, pdfColors.info as [number, number, number]);
  
  return yPosition;
}
