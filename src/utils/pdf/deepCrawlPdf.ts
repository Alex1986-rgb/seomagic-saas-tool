
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addCoverPage, addPaginationFooters, addCopyright } from './helpers/coverPage';
import { pdfColors, pdfFonts } from './styles';

export interface DeepCrawlOptions {
  domain: string;
  urls: string[];
  stats?: {
    totalPages: number;
    crawlTime: string;
    totalInternalLinks?: number;
    totalExternalLinks?: number;
    avgLoadTime?: string;
    crawlRate?: string;
    totalImages?: number;
  };
  issues?: {
    brokenLinks?: Array<{ url: string; target: string; statusCode?: number }>;
    missingMetaTags?: Array<{ url: string; missingTags: string[] }>;
    slowPages?: Array<{ url: string; loadTime: string }>;
    duplicateContent?: Array<{ url: string; similarity: number; similarTo: string }>;
  };
  date?: string;
}

/**
 * Generates a PDF report for deep crawl results
 */
export const generateDeepCrawlPdf = async (options: DeepCrawlOptions): Promise<Blob> => {
  const { domain, urls, stats, issues, date = new Date().toISOString() } = options;

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set document properties
  doc.setProperties({
    title: `Deep Crawl Report for ${domain}`,
    subject: 'Website Crawl Analysis',
    author: 'SEO Market',
    creator: 'SEO Market'
  });

  // Add cover page
  addCoverPage(
    doc,
    'Отчет о глубоком сканировании сайта',
    `Домен: ${domain}`,
    date
  );

  // Add summary page
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Сводка сканирования', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Отчет сгенерирован: ${formattedDate}`, 105, 30, { align: 'center' });

  // Display key stats in a table
  const statsData = [
    ['Метрика', 'Значение'],
    ['Просканировано страниц', stats?.totalPages?.toString() || urls.length.toString()],
    ['Время сканирования', stats?.crawlTime || 'Н/Д']
  ];

  if (stats?.totalInternalLinks !== undefined) {
    statsData.push(['Внутренние ссылки', stats.totalInternalLinks.toString()]);
  }

  if (stats?.totalExternalLinks !== undefined) {
    statsData.push(['Внешние ссылки', stats.totalExternalLinks.toString()]);
  }

  if (stats?.avgLoadTime !== undefined) {
    statsData.push(['Среднее время загрузки', stats.avgLoadTime]);
  }

  if (stats?.crawlRate !== undefined) {
    statsData.push(['Скорость сканирования', stats.crawlRate]);
  }

  autoTable(doc, {
    startY: 40,
    head: [statsData[0]],
    body: statsData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 80 },
    }
  });

  // Add issues section if available
  if (issues) {
    const issueY = (doc as any).lastAutoTable.finalY + 20;
    
    // Check if we need a new page
    if (issueY > 250) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.setTextColor(...pdfColors.primary);
      doc.text('Обнаруженные проблемы', 105, 20, { align: 'center' });
    } else {
      doc.setFontSize(16);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.setTextColor(...pdfColors.primary);
      doc.text('Обнаруженные проблемы', 15, issueY);
    }

    // List broken links if available
    if (issues.brokenLinks && issues.brokenLinks.length > 0) {
      const currentY = doc.getNumberOfPages() === 1 ? issueY + 10 : 30;

      doc.setFontSize(14);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.setTextColor(60, 60, 60);
      doc.text('Битые ссылки', 15, currentY);

      const brokenLinkRows = issues.brokenLinks.map(link => [
        link.url,
        link.target,
        link.statusCode ? `${link.statusCode}` : 'Н/Д'
      ]);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Страница', 'Целевой URL', 'Код ответа']],
        body: brokenLinkRows,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'ellipsize'
        },
        headStyles: {
          fillColor: pdfColors.danger,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 75 },
          1: { cellWidth: 75 },
          2: { cellWidth: 30 }
        }
      });
    }

    // List missing meta tags if available
    if (issues.missingMetaTags && issues.missingMetaTags.length > 0) {
      const lastY = issues.brokenLinks && issues.brokenLinks.length > 0 ? 
                  (doc as any).lastAutoTable.finalY + 15 : (doc.getNumberOfPages() === 1 ? issueY + 10 : 30);
      
      // Check if we need a new page
      if (lastY > 250) {
        doc.addPage();
        doc.setFontSize(14);
        doc.setFont(pdfFonts.primary, pdfFonts.bold);
        doc.setTextColor(60, 60, 60);
        doc.text('Отсутствующие мета-теги', 15, 20);
      } else {
        doc.setFontSize(14);
        doc.setFont(pdfFonts.primary, pdfFonts.bold);
        doc.setTextColor(60, 60, 60);
        doc.text('Отсутствующие мета-теги', 15, lastY);
      }

      const metaTagRows = issues.missingMetaTags.map(tag => [
        tag.url,
        tag.missingTags.join(', ')
      ]);

      autoTable(doc, {
        startY: lastY + 5,
        head: [['URL', 'Отсутствующие теги']],
        body: metaTagRows,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'ellipsize'
        },
        headStyles: {
          fillColor: pdfColors.warning,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 }
        }
      });
    }

    // List slow pages if available
    if (issues.slowPages && issues.slowPages.length > 0) {
      // Determine where to start based on previous sections
      let lastY = 30;
      if (issues.missingMetaTags && issues.missingMetaTags.length > 0) {
        lastY = (doc as any).lastAutoTable.finalY + 15;
      } else if (issues.brokenLinks && issues.brokenLinks.length > 0) {
        lastY = (doc as any).lastAutoTable.finalY + 15;
      } else {
        lastY = doc.getNumberOfPages() === 1 ? issueY + 10 : 30;
      }
      
      // Check if we need a new page
      if (lastY > 250) {
        doc.addPage();
        doc.setFontSize(14);
        doc.setFont(pdfFonts.primary, pdfFonts.bold);
        doc.setTextColor(60, 60, 60);
        doc.text('Медленно загружающиеся страницы', 15, 20);
        lastY = 20;
      } else {
        doc.setFontSize(14);
        doc.setFont(pdfFonts.primary, pdfFonts.bold);
        doc.setTextColor(60, 60, 60);
        doc.text('Медленно загружающиеся страницы', 15, lastY);
      }

      const slowPageRows = issues.slowPages.map(page => [
        page.url,
        page.loadTime
      ]);

      autoTable(doc, {
        startY: lastY + 5,
        head: [['URL', 'Время загрузки']],
        body: slowPageRows,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'ellipsize'
        },
        headStyles: {
          fillColor: pdfColors.warning,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 150 },
          1: { cellWidth: 30 }
        }
      });
    }
  }

  // Add URLs list
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Список найденных URL', 105, 20, { align: 'center' });

  // If we have a lot of URLs, we'll only include the first 100
  const displayUrls = urls.slice(0, 100);
  const urlRows = displayUrls.map((url, index) => [`${index + 1}`, url]);

  // Add note if we truncated the list
  if (displayUrls.length < urls.length) {
    doc.setFontSize(10);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(100, 100, 100);
    doc.text(`* Показаны первые ${displayUrls.length} из ${urls.length} URL`, 15, 30);
  }

  autoTable(doc, {
    startY: 35,
    head: [['#', 'URL']],
    body: urlRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'ellipsize'
    },
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 165 }
    }
  });

  // Add recommendations page
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Рекомендации по улучшению', 105, 20, { align: 'center' });

  const recommendations = [
    {
      title: 'Исправление битых ссылок',
      content: issues?.brokenLinks && issues.brokenLinks.length > 0
        ? `Обнаружено ${issues.brokenLinks.length} битых ссылок. Исправьте их, чтобы улучшить пользовательский опыт и SEO.`
        : 'Регулярно проверяйте сайт на наличие битых ссылок и своевременно исправляйте их.'
    },
    {
      title: 'Оптимизация мета-тегов',
      content: issues?.missingMetaTags && issues.missingMetaTags.length > 0
        ? `Обнаружено ${issues.missingMetaTags.length} страниц с отсутствующими мета-тегами. Добавьте их для улучшения SEO.`
        : 'Убедитесь, что все страницы имеют оптимизированные мета-теги, включая title и description.'
    },
    {
      title: 'Увеличение скорости загрузки',
      content: issues?.slowPages && issues.slowPages.length > 0
        ? `Обнаружено ${issues.slowPages.length} медленно загружающихся страниц. Оптимизируйте их для улучшения пользовательского опыта.`
        : 'Регулярно оптимизируйте скорость загрузки страниц для улучшения пользовательского опыта и SEO.'
    }
  ];

  let y = 40;
  recommendations.forEach(rec => {
    doc.setFontSize(14);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(60, 60, 60);
    doc.text(rec.title, 15, y);
    
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(80, 80, 80);
    
    const splitText = doc.splitTextToSize(rec.content, 180);
    doc.text(splitText, 15, y);
    
    y += splitText.length * 6 + 15;
  });

  // Add pagination and copyright
  addPaginationFooters(doc);
  addCopyright(doc, 'SEO Market');

  // Return the document as a blob
  return doc.output('blob');
};
