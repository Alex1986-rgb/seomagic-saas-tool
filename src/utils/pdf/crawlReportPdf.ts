
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '../pdf/helpers/formatting';
import { drawHeader } from '../pdf/styles/drawing';
import { addPageNumbers } from '../pdf/helpers/pagination';

interface CrawlReportData {
  domain: string;
  pageCount: number;
  urls: string[];
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
  scanDate?: Date;
}

export const generateCrawlReportPdf = (data: CrawlReportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  
  // Add title and header
  drawHeader(doc, `Отчет о сканировании: ${data.domain}`);
  
  // Add summary section
  doc.setFontSize(12);
  doc.text('Сводка о сканировании', 14, 40);
  
  const summaryData = [
    ['Домен', data.domain],
    ['Дата сканирования', formatDate(data.scanDate || now)],
    ['Количество страниц', data.pageCount.toString()],
    ['Уникальных URL адресов', data.urls.length.toString()]
  ];
  
  (doc as any).autoTable({
    startY: 45,
    head: [['Параметр', 'Значение']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [66, 135, 245], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });
  
  // Add page types if available
  if (data.pageTypes && Object.keys(data.pageTypes).length > 0) {
    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Типы страниц', 14, currentY);
    
    const pageTypesData = Object.entries(data.pageTypes).map(([type, count]) => [
      type, count.toString()
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 5,
      head: [['Тип страницы', 'Количество']],
      body: pageTypesData,
      theme: 'grid',
      headStyles: { fillColor: [66, 135, 245], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
  }
  
  // Add broken links if available
  if (data.brokenLinks && data.brokenLinks.length > 0) {
    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Неработающие ссылки', 14, currentY);
    
    const brokenLinksData = data.brokenLinks.map(item => [
      item.url, item.statusCode.toString()
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 5,
      head: [['URL', 'Код ответа']],
      body: brokenLinksData,
      theme: 'grid',
      headStyles: { fillColor: [66, 135, 245], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
  }
  
  // Add URLs on a new page
  doc.addPage();
  doc.text('Список URL адресов (до 100)', 14, 20);
  
  const urlsToShow = data.urls.slice(0, 100);
  const urlsData = urlsToShow.map(url => [url]);
  
  (doc as any).autoTable({
    startY: 25,
    head: [['URL']],
    body: urlsData,
    theme: 'grid',
    headStyles: { fillColor: [66, 135, 245], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: pageWidth - 28 }
    }
  });
  
  // Add page numbers
  addPageNumbers(doc);
  
  return doc;
};

export default generateCrawlReportPdf;
