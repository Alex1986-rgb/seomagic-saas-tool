
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addPaginationFooters } from './helpers';
import { getScoreColorRGB } from './styles/colors';
import { pdfColors } from './styles/colors';
import { pdfFonts } from './styles/fonts';
import { pdfTableStyles } from './styles/tables';
import { formatReportHeader } from './styles/formatting';
import { drawGauge } from './styles/drawing';

interface DeepCrawlPdfOptions {
  domain: string;
  scanDate: string;
  pagesScanned: number;
  totalPages: number;
  urls: string[];
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
}

/**
 * Generates a detailed PDF report from deep crawl analysis data
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
    duplicatePages = []
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
  
  // Add header
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Глубокий анализ сайта', 15, 15);
  
  doc.setFontSize(14);
  doc.text(`Сайт: ${domain}`, 15, 22);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Дата сканирования: ${formattedDate}`, 15, 40);
  doc.text(`Обработано страниц: ${pagesScanned} из ${totalPages}`, 15, 48);
  
  // Add summary section
  doc.setFontSize(16);
  doc.text('Общая информация', 15, 60);
  
  // Create summary table
  const summaryData = [
    ['Всего уникальных URL', urls.length.toString()],
    ['Обработано страниц', pagesScanned.toString()],
    ['Найдено проблем', brokenLinks.length.toString()],
    ['Найдено дубликатов', duplicatePages.length.toString()]
  ];
  
  autoTable(doc, {
    startY: 65,
    head: [['Параметр', 'Значение']],
    body: summaryData,
    theme: 'grid',
    styles: { halign: 'left' },
    headStyles: { fillColor: pdfColors.primary }
  });
  
  // Get current Y position after table
  let currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // Add page types distribution if available
  if (Object.keys(pageTypes).length > 0) {
    doc.setFontSize(16);
    doc.text('Распределение типов страниц', 15, currentY);
    
    const pageTypesData = Object.entries(pageTypes).map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count.toString()
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Тип страницы', 'Количество']],
      body: pageTypesData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: pdfColors.primary }
    });
    
    // Update current Y position
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add page depth distribution if available
  if (depthData.length > 0) {
    doc.setFontSize(16);
    doc.text('Глубина вложенности страниц', 15, currentY);
    
    const depthTableData = depthData.map(item => [
      `Уровень ${item.level}`,
      item.count.toString()
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Уровень вложенности', 'Количество страниц']],
      body: depthTableData,
      theme: 'grid',
      styles: { halign: 'left' },
      headStyles: { fillColor: pdfColors.secondary }
    });
    
    // Update current Y position
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add new page for URL list
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
    headStyles: { fillColor: pdfColors.primary }
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
    
    doc.setFillColor(239, 68, 68); // Red color for errors
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Обнаруженные проблемы', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Битые ссылки', 15, 30);
    
    const brokenLinksToShow = brokenLinks.slice(0, 50);
    const brokenLinkData = brokenLinksToShow.map((link, index) => [
      `${index + 1}`,
      link.url,
      link.statusCode.toString()
    ]);
    
    autoTable(doc, {
      startY: 35,
      head: [['#', 'URL', 'Код ошибки']],
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
        2: { cellWidth: 20 }
      },
      headStyles: { fillColor: pdfColors.error }
    });
    
    // Add note if there are more broken links
    if (brokenLinks.length > 50) {
      const noteY = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Показано 50 из ${brokenLinks.length} проблемных URL.`, 15, noteY);
    }
  }
  
  // Add duplicate pages if any found
  if (duplicatePages.length > 0) {
    doc.addPage();
    
    doc.setFillColor(251, 146, 60); // Orange color for warnings
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Дубликаты страниц', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    
    // We'll show a few examples of duplicates
    const duplicatesToShow = duplicatePages.slice(0, 20);
    
    let dupeY = 30;
    duplicatesToShow.forEach((dupe, index) => {
      // Check if we need a new page
      if (dupeY > 260) {
        doc.addPage();
        dupeY = 30;
      }
      
      doc.setFontSize(12);
      doc.text(`${index + 1}. Оригинал: ${dupe.url}`, 15, dupeY);
      dupeY += 8;
      
      doc.setFontSize(10);
      doc.text('Похожие страницы:', 20, dupeY);
      dupeY += 6;
      
      // Show similar URLs (limited to 3)
      const similarToShow = dupe.similarUrls.slice(0, 3);
      similarToShow.forEach(similar => {
        doc.setFontSize(8);
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
    if (duplicatePages.length > 20) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Показано 20 из ${duplicatePages.length} групп дубликатов.`, 15, dupeY);
    }
  }
  
  // Add recommendations page
  doc.addPage();
  
  doc.setFillColor(74, 222, 128); // Green color for recommendations
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Рекомендации', 15, 15);
  
  doc.setTextColor(0, 0, 0);
  
  let recY = 30;
  const recommendations = [
    {
      title: "Оптимизация структуры сайта",
      description: "Уменьшите глубину вложенности страниц. Идеально, чтобы важные страницы находились на глубине не более 3 уровней от главной страницы."
    },
    {
      title: "Исправление битых ссылок",
      description: `Обнаружено ${brokenLinks.length} битых ссылок. Рекомендуется исправить все ссылки, возвращающие ошибки 404, 500 и другие.`
    },
    {
      title: "Удаление дубликатов",
      description: `Найдено ${duplicatePages.length} групп дублирующихся страниц. Используйте каноническую ссылку (rel="canonical") для указания предпочтительного URL.`
    },
    {
      title: "Оптимизация мета-тегов",
      description: "Убедитесь, что все страницы имеют уникальные и информативные заголовки (title) и описания (description)."
    },
    {
      title: "Создание карты сайта",
      description: "Создайте и добавьте файл sitemap.xml, включив в него все важные страницы сайта."
    }
  ];
  
  recommendations.forEach((rec, index) => {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}. ${rec.title}`, 15, recY);
    recY += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    // Split long descriptions into multiple lines
    const descLines = doc.splitTextToSize(rec.description, 180);
    descLines.forEach((line: string) => {
      doc.text(line, 20, recY);
      recY += 5;
    });
    
    recY += 8;
  });
  
  // Add final summary and contact
  recY += 10;
  doc.setFontSize(12);
  doc.text("Дополнительные рекомендации:", 15, recY);
  recY += 8;
  doc.setFontSize(10);
  doc.text("• Регулярно проводите сканирование сайта для выявления новых проблем", 20, recY);
  recY += 6;
  doc.text("• Следите за тенденциями роста количества страниц и типов контента", 20, recY);
  recY += 6;
  doc.text("• Оптимизируйте скорость загрузки страниц для улучшения позиций в поисковых системах", 20, recY);
  
  // Add pagination
  addPaginationFooters(doc);
  
  // Add report generation info
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 15, 285);
  
  // Return the PDF as a blob
  return doc.output('blob');
};
