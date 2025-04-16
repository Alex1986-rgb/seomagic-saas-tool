import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addPaginationFooters } from './helpers/pagination';
import { pdfColors } from './styles/colors';
import { applyHeadingStyle } from './styles/fonts';
import { formatHeader, checkNewPage } from './errorReport/utils';

interface CrawlData {
  url: string;
  internalLinks: number;
  externalLinks: number;
  images: number;
  scripts: number;
  styles: number;
  size: string;
  loadTime: string;
}

export async function generateDeepCrawlPdf(data: any): Promise<Blob> {
  const doc = new jsPDF();
  let currentY = formatHeader(doc, 'Deep Crawl Report', 'Site Structure Analysis');

  // Add the sections
  currentY = await addCrawlSummarySection(doc, data, currentY);
  currentY = await addUrlAnalysisSection(doc, data, currentY);

  // Add pagination
  addPaginationFooters(doc);

  // Convert to Blob and return
  return doc.output('blob');
}

async function addCrawlSummarySection(doc: jsPDF, data: any, startY: number): Promise<number> {
  let currentY = startY;

  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('Crawl Summary', 14, currentY);
  currentY += 10;

  const summaryData = [
    ['Total URLs', data.length.toString()],
    ['Internal Links', data.reduce((sum: number, page: any) => sum + page.internalLinks, 0).toString()],
    ['External Links', data.reduce((sum: number, page: any) => sum + page.externalLinks, 0).toString()],
    ['Total Images', data.reduce((sum: number, page: any) => sum + page.images, 0).toString()],
    ['Total Scripts', data.reduce((sum: number, page: any) => sum + page.scripts, 0).toString()],
    ['Total Styles', data.reduce((sum: number, page: any) => sum + page.styles, 0).toString()],
  ];

  autoTable(doc, {
    startY: currentY + 5,
    body: summaryData,
    theme: 'plain',
    columnStyles: { 0: { fontStyle: 'bold' } },
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

async function addUrlAnalysisSection(doc: jsPDF, data: any, startY: number): Promise<number> {
  let currentY = startY;

  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('URL Analysis', 14, currentY);
  currentY += 10;

  const tableData = data.map((item: CrawlData) => [
    item.url,
    item.internalLinks,
    item.externalLinks,
    item.images,
    item.scripts,
    item.styles,
    item.size,
    item.loadTime,
  ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [['URL', 'Internal Links', 'External Links', 'Images', 'Scripts', 'Styles', 'Size', 'Load Time']],
    body: tableData,
    headStyles: {
      fillColor: pdfColors.primary as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [0, 0, 0] as [number, number, number]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249] as [number, number, number]
    }
  });

  return (doc as any).lastAutoTable.finalY + 15;
}
