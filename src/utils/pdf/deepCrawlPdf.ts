import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addPaginationFooters, addQRCodeToPage } from './helpers';

export interface DeepCrawlPdfOptions {
  domain: string;
  scanDate?: string;
  urls: string[];
  pagesScanned: number;
  totalPages: number;
  pageTypes?: Record<string, number>;
  depthData?: Array<{ level: number; count: number }>;
  brokenLinks?: Array<{ url: string; statusCode: number }>;
  duplicatePages?: Array<{ url: string; similarUrls: string[] }>;
  enhancedStyling?: boolean;
  includeFullDetails?: boolean;
}

/**
 * Generates a PDF report from deep crawl data
 */
export const generateDeepCrawlPdf = async (options: DeepCrawlPdfOptions): Promise<Blob> => {
  const { 
    domain, 
    scanDate, 
    pagesScanned, 
    totalPages, 
    urls, 
    pageTypes = {}, 
    depthData = [],
    brokenLinks = [],
    duplicatePages = [],
    includeFullDetails = false,
    enhancedStyling = false
  } = options;
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Format the date
  const formattedDate = new Date(scanDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Set the title of the document (for metadata)
  doc.setProperties({
    title: `Аудит сайта ${domain}`,
    subject: 'Отчет о глубоком сканировании сайта',
    author: 'SEO Analyzer',
    keywords: 'SEO, аудит, анализ, сканирование',
    creator: 'SEO Analyzer Tool'
  });
  
  // Add enhanced header with graphics
  if (enhancedStyling) {
    // Background gradient for header
    doc.setFillColor(56, 189, 248);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add header graphic elements
    doc.setFillColor(70, 203, 255);
    doc.circle(180, 20, 15, 'F');
    doc.setFillColor(90, 217, 255);
    doc.circle(190, 10, 8, 'F');
    
    // Header text with enhanced styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('Глубокий аудит сайта', 15, 20);
    
    doc.setFontSize(14);
    doc.text(`Домен: ${domain}`, 15, 30);
  } else {
    // Simple header
    doc.setFillColor(56, 189, 248);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('Глубокий анализ сайта', 15, 15);
    
    doc.setFontSize(14);
    doc.text(`Сайт: ${domain}`, 15, 22);
  }
  
  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  // Add audit information
  let yPosition = enhancedStyling ? 50 : 40;
  
  doc.setFontSize(12);
  doc.text(`Дата сканирования: ${formattedDate}`, 15, yPosition);
  yPosition += 8;
  doc.text(`Обработано страниц: ${pagesScanned} из ${totalPages}`, 15, yPosition);
  yPosition += 15;
  
  // Add overall score visualization if available
  const score = calculateOverallScore(brokenLinks.length, duplicatePages.length, urls.length);
  
  if (enhancedStyling) {
    // Add score gauge visualization
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Общая оценка сайта', 15, yPosition);
    yPosition += 10;
    
    drawGauge(doc, score, 50, yPosition + 20, 20);
    
    // Add score explanation
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let scoreExplanation = '';
    
    if (score >= 90) {
      scoreExplanation = 'Отлично! Ваш сайт хорошо оптимизирован.';
    } else if (score >= 70) {
      scoreExplanation = 'Хорошо. Есть некоторые моменты для улучшения.';
    } else if (score >= 50) {
      scoreExplanation = 'Удовлетворительно. Требуется работа над оптимизацией.';
    } else {
      scoreExplanation = 'Требуется значительная оптимизация сайта.';
    }
    
    doc.text(scoreExplanation, 80, yPosition + 20);
    yPosition += 50;
  }
  
  // Add summary section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Общая информация', 15, yPosition);
  yPosition += 10;
  
  // Create summary table
  const summaryData = [
    ['Всего уникальных URL', urls.length.toString()],
    ['Обработано страниц', pagesScanned.toString()],
    ['Найдено проблем', brokenLinks.length.toString()],
    ['Найдено дубликатов', duplicatePages.length.toString()]
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Параметр', 'Значение']],
    body: summaryData,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]] }
  });
  
  // Update current position after table
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Add page types distribution if available
  if (Object.keys(pageTypes).length > 0) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Распределение типов страниц', 15, yPosition);
    yPosition += 10;
    
    const pageTypesData = Object.entries(pageTypes).map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count.toString(),
      ((count / urls.length) * 100).toFixed(1) + '%'
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Тип страницы', 'Количество', 'Процент']],
      body: pageTypesData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]] }
    });
    
    // Update current Y position
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add page depth distribution if available
  if (depthData.length > 0) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Глубина вложенности страниц', 15, yPosition);
    yPosition += 10;
    
    const depthTableData = depthData.map(item => [
      `Уровень ${item.level}`,
      item.count.toString(),
      ((item.count / urls.length) * 100).toFixed(1) + '%'
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Уровень вложенности', 'Количество страниц', 'Процент']],
      body: depthTableData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [pdfColors.secondary[0], pdfColors.secondary[1], pdfColors.secondary[2]] }
    });
    
    // Update current Y position
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add URL structure analysis
  if (includeFullDetails) {
    doc.addPage();
    
    doc.setFillColor(96, 165, 250); // Blue
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Структура URL-адресов', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    yPosition = 30;
    
    // Calculate URL structure metrics
    const urlLengths = urls.map(url => url.length);
    const avgUrlLength = urlLengths.reduce((sum, len) => sum + len, 0) / urlLengths.length;
    const maxUrlLength = Math.max(...urlLengths);
    const urlsWithParams = urls.filter(url => url.includes('?')).length;
    const urlsWithHashes = urls.filter(url => url.includes('#')).length;
    
    const mostCommonPaths = analyzeCommonPaths(urls);
    
    // Add URL structure metrics
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Метрики URL-адресов', 15, yPosition);
    yPosition += 10;
    
    const urlMetricsData = [
      ['Средняя длина URL', avgUrlLength.toFixed(1) + ' символов'],
      ['Максимальная длина URL', maxUrlLength + ' символов'],
      ['URL с параметрами', urlsWithParams + ' (' + ((urlsWithParams / urls.length) * 100).toFixed(1) + '%)'],
      ['URL с якорями', urlsWithHashes + ' (' + ((urlsWithHashes / urls.length) * 100).toFixed(1) + '%)']
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Параметр', 'Значение']],
      body: urlMetricsData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: [pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]] }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    
    // Add most common paths
    if (mostCommonPaths.length > 0) {
      // Check if we need a new page
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Наиболее распространенные пути URL', 15, yPosition);
      yPosition += 10;
      
      const pathsData = mostCommonPaths.slice(0, 10).map(item => [
        item.path,
        item.count.toString(),
        ((item.count / urls.length) * 100).toFixed(1) + '%'
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Путь', 'Количество', 'Процент']],
        body: pathsData,
        theme: 'grid',
        styles: { 
          halign: 'left',
          fontSize: 8,
          cellWidth: 'wrap',
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 }
        },
        headStyles: { fillColor: [pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]] }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
  }
  
  // Add URL list page
  doc.addPage();
  
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Список URL (до 100)', 15, 15);
  
  doc.setTextColor(0, 0, 0);
  
  // Format URLs for table
  const urlsToShow = urls.slice(0, 100);
  const urlTableData = urlsToShow.map((url, index) => [`${index + 1}`, url]);
  
  autoTable(doc, {
    startY: 30,
    head: [['#', 'URL']],
    body: urlTableData,
    theme: 'grid',
    styles: { 
      overflow: 'linebreak', 
      cellWidth: 'wrap',
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 'auto' }
    },
    headStyles: { fillColor: [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]] }
  });
  
  // Add note if there are more URLs
  if (urls.length > 100) {
    const noteY = (doc as any).lastAutoTable.finalY + 5;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Показано 100 из ${urls.length} URL. Полный список доступен в экспортированных данных.`, 15, noteY);
  }
  
  // Add broken links page if any found
  if (brokenLinks.length > 0) {
    doc.addPage();
    
    doc.setFillColor(pdfColors.error[0], pdfColors.error[1], pdfColors.error[2]); // Red color for errors
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Обнаруженные проблемы', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Битые ссылки', 15, 30);
    
    const brokenLinksToShow = brokenLinks.slice(0, 50);
    const brokenLinkData = brokenLinksToShow.map((link, index) => [
      `${index + 1}`,
      link.url,
      link.statusCode.toString(),
      getErrorDescription(link.statusCode)
    ]);
    
    autoTable(doc, {
      startY: 35,
      head: [['#', 'URL', 'Код', 'Описание ошибки']],
      body: brokenLinkData,
      theme: 'grid',
      styles: { 
        overflow: 'linebreak', 
        cellWidth: 'wrap',
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 15 },
        3: { cellWidth: 50 }
      },
      headStyles: { fillColor: [pdfColors.error[0], pdfColors.error[1], pdfColors.error[2]] }
    });
    
    // Add note if there are more broken links
    if (brokenLinks.length > 50) {
      const noteY = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Показано 50 из ${brokenLinks.length} проблемных URL.`, 15, noteY);
    }
    
    // Add recommendations for fixing broken links
    const brokenLinksY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Рекомендации по исправлению', 15, brokenLinksY);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const recommendations = [
      '• Проверьте и исправьте все ссылки с кодами ошибок 404 (Страница не найдена)',
      '• Для страниц, которые были перемещены, настройте 301 редиректы',
      '• Исправьте серверные ошибки (5xx) и обратитесь к хостинг-провайдеру при необходимости',
      '• Регулярно проверяйте сайт на наличие битых ссылок с помощью инструментов мониторинга'
    ];
    
    let recY = brokenLinksY + 10;
    recommendations.forEach(rec => {
      doc.text(rec, 15, recY);
      recY += 7;
    });
  }
  
  // Add duplicate pages if any found
  if (duplicatePages.length > 0) {
    doc.addPage();
    
    doc.setFillColor(pdfColors.warning[0], pdfColors.warning[1], pdfColors.warning[2]); // Orange color for warnings
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Дубликаты страниц', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    
    // Add introduction text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Дубликаты страниц могут негативно влиять на SEO-производительность вашего сайта. ' +
      'Поисковые системы могут не понимать, какую версию страницы индексировать, что приводит к снижению рейтинга.',
      15, 30, { maxWidth: 180 }
    );
    
    // We'll show a few examples of duplicates
    const duplicatesToShow = duplicatePages.slice(0, 15);
    
    let dupeY = 45;
    duplicatesToShow.forEach((dupe, index) => {
      // Check if we need a new page
      if (dupeY > 250) {
        doc.addPage();
        dupeY = 30;
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. Оригинал: ${dupe.url}`, 15, dupeY);
      dupeY += 7;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Похожие страницы:', 20, dupeY);
      dupeY += 6;
      
      // Show similar URLs (limited to 3)
      const similarToShow = dupe.similarUrls.slice(0, 3);
      similarToShow.forEach(similar => {
        doc.setFontSize(9);
        doc.text(`• ${similar}`, 25, dupeY);
        dupeY += 5;
      });
      
      // If there are more similar URLs
      if (dupe.similarUrls.length > 3) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`... и еще ${dupe.similarUrls.length - 3} похожих URL`, 25, dupeY);
        doc.setTextColor(0, 0, 0);
      }
      
      dupeY += 10;
    });
    
    // Add note if there are more duplicates
    if (duplicatePages.length > 15) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Показано 15 из ${duplicatePages.length} групп дубликатов.`, 15, dupeY);
      dupeY += 10;
    }
    
    // Add recommendations for handling duplicates
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Рекомендации по устранению дубликатов', 15, dupeY);
    dupeY += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const dupeRecs = [
      '• Используйте тег rel="canonical" для указания предпочтительного URL',
      '• Настройте 301 редиректы с дубликатов на оригинальные страницы',
      '• Используйте параметр hreflang для многоязычных версий одной страницы',
      '• Консолидируйте содержимое похожих страниц',
      '• Включите правильные директивы в файл robots.txt для дублированного контента'
    ];
    
    dupeRecs.forEach(rec => {
      doc.text(rec, 15, dupeY);
      dupeY += 7;
    });
  }
  
  // Add SEO recommendations page
  doc.addPage();
  
  doc.setFillColor(pdfColors.success[0], pdfColors.success[1], pdfColors.success[2]); // Green color for recommendations
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Рекомендации по SEO', 15, 15);
  
  doc.setTextColor(0, 0, 0);
  
  let recY = 30;
  const allRecommendations = getSeoRecommendations(brokenLinks.length, duplicatePages.length, urls.length, depthData);
  
  allRecommendations.forEach((rec, index) => {
    // Check if we need a new page
    if (recY > 250) {
      doc.addPage();
      recY = 30;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${rec.title}`, 15, recY);
    recY += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Split long descriptions into multiple lines
    const descLines = doc.splitTextToSize(rec.description, 180);
    descLines.forEach((line: string) => {
      doc.text(line, 20, recY);
      recY += 5;
    });
    
    // Add priority indicator
    doc.setFontSize(9);
    applyRecommendationPriorityColor(doc, rec.priority);
    doc.text(`Приоритет: ${getRecommendationPriorityText(rec.priority)}`, 20, recY);
    doc.setTextColor(0, 0, 0);
    
    recY += 10;
  });
  
  // Add checklist for implementation if we have detailed report
  if (includeFullDetails) {
    // Check if we need a new page
    if (recY > 200) {
      doc.addPage();
      recY = 30;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('План внедрения рекомендаций', 15, recY);
    recY += 10;
    
    // Create checklist table
    const checklistData = allRecommendations.map((rec, index) => [
      `${index + 1}. ${rec.title}`,
      getRecommendationPriorityText(rec.priority),
      ''  // Empty column for checkbox
    ]);
    
    autoTable(doc, {
      startY: recY,
      head: [['Задача', 'Приоритет', 'Выполнено']],
      body: checklistData,
      theme: 'grid',
      styles: { 
        halign: 'left',
        fontSize: 9,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 130 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 }
      },
      headStyles: { fillColor: [pdfColors.success[0], pdfColors.success[1], pdfColors.success[2]] }
    });
    
    recY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add final summary and contact
  doc.addPage();
  
  if (enhancedStyling) {
    // Add summary header with style
    doc.setFillColor(pdfColors.secondary[0], pdfColors.secondary[1], pdfColors.secondary[2]); // Purple for summary
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Итоги и следующие шаги', 15, 15);
    
    // Add graphical elements
    doc.setFillColor(155, 135, 245, 0.3); // Light purple with transparency
    doc.rect(160, 30, 40, 40, 'F');
    doc.setFillColor(155, 135, 245, 0.5); // Light purple with transparency
    doc.circle(170, 60, 10, 'F');
  } else {
    // Simple header
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Итоги и следующие шаги', 15, 15);
  }
  
  doc.setTextColor(0, 0, 0);
  
  let summaryY = 30;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Краткий итог анализа', 15, summaryY);
  summaryY += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const summaryText = getSiteSummary(score, brokenLinks.length, duplicatePages.length, urls.length);
  const summaryLines = doc.splitTextToSize(summaryText, 180);
  
  summaryLines.forEach((line: string) => {
    doc.text(line, 15, summaryY);
    summaryY += 6;
  });
  
  summaryY += 10;
  
  // Add next steps
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Следующие шаги', 15, summaryY);
  summaryY += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const nextSteps = [
    '1. Исправьте критические ошибки и битые ссылки',
    '2. Решите проблему дублированного содержимого',
    '3. Оптимизируйте структуру URL и глубину вложенности',
    '4. Обновите или создайте карту сайта и файл robots.txt',
    '5. Проведите повторный аудит для отслеживания прогресса'
  ];
  
  nextSteps.forEach(step => {
    doc.text(step, 15, summaryY);
    summaryY += 7;
  });
  
  summaryY += 10;
  
  // Add expected benefits
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Ожидаемые результаты', 15, summaryY);
  summaryY += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const benefits = [
    '• Улучшение позиций в поисковых системах',
    '• Более эффективное сканирование сайта поисковыми роботами',
    '• Повышение пользовательского опыта и конверсии',
    '• Более четкая и понятная структура сайта',
    '• Лучшее распределение \"весомости\" страниц'
  ];
  
  benefits.forEach(benefit => {
    doc.text(benefit, 15, summaryY);
    summaryY += 7;
  });
  
  // Add contact information and branding
  summaryY = 230;
  doc.setFillColor(245, 245, 245);
  doc.rect(0, summaryY, 210, 40, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SEO Analyzer', 15, summaryY + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Профессиональный инструмент анализа и оптимизации сайтов', 15, summaryY + 16);
  doc.text('support@seo-analyzer.com', 15, summaryY + 22);
  doc.text('www.seo-analyzer.com', 15, summaryY + 28);
  
  // Add report generation info
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 105, summaryY + 28, { align: 'center' });
  
  // Add pagination to all pages
  addPaginationFooters(doc);
  
  // Return the PDF as a blob
  return doc.output('blob');
};

// Helper functions

/**
 * Calculate overall score based on site metrics
 */
function calculateOverallScore(
  brokenLinksCount: number,
  duplicatesCount: number,
  totalUrls: number
): number {
  // Base score
  let score = 100;
  
  // Penalize for broken links (more severe)
  if (totalUrls > 0) {
    const brokenLinkPercentage = (brokenLinksCount / totalUrls) * 100;
    if (brokenLinkPercentage > 5) {
      score -= 30;
    } else if (brokenLinkPercentage > 2) {
      score -= 20;
    } else if (brokenLinkPercentage > 0) {
      score -= 10;
    }
  }
  
  // Penalize for duplicates
  if (totalUrls > 0) {
    const duplicatePercentage = (duplicatesCount / totalUrls) * 100;
    if (duplicatePercentage > 10) {
      score -= 25;
    } else if (duplicatePercentage > 5) {
      score -= 15;
    } else if (duplicatePercentage > 0) {
      score -= 5;
    }
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get error description based on status code
 */
function getErrorDescription(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Некорректный запрос';
    case 401:
      return 'Требуется авторизация';
    case 403:
      return 'Доступ запрещен';
    case 404:
      return 'Страница не найдена';
    case 405:
      return 'Метод не разрешен';
    case 408:
      return 'Истекло время ожидания';
    case 410:
      return 'Ресурс удален';
    case 500:
      return 'Внутренняя ошибка сервера';
    case 502:
      return 'Ошибка шлюза';
    case 503:
      return 'Сервис недоступен';
    case 504:
      return 'Истекло время ожидания шлюза';
    default:
      return 'Ошибка соединения';
  }
}

// Additional helper functions copied from other modules to ensure functionality
function applyRecommendationPriorityColor(doc: jsPDF, priority: string): void {
  switch (priority) {
    case 'high':
      doc.setTextColor(pdfColors.error[0], pdfColors.error[1], pdfColors.error[2]);
      break;
    case 'medium':
      doc.setTextColor(pdfColors.warning[0], pdfColors.warning[1], pdfColors.warning[2]);
      break;
    case 'low':
      doc.setTextColor(pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]);
      break;
    default:
      doc.setTextColor(0, 0, 0);
  }
}

function getRecommendationPriorityText(priority: string): string {
  switch (priority) {
    case 'high':
      return 'Высокий';
    case 'medium':
      return 'Средний';
    case 'low':
      return 'Низкий';
    default:
      return 'Средний';
  }
}
