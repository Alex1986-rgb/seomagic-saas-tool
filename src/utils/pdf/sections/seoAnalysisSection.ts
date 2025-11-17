import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { drawCheckIcon, drawErrorIcon, drawWarningIcon, drawSeoIcon } from '../helpers/icons';
import { formatUrlForDisplay, createLinkCellHandler } from '../helpers/links';

interface SeoAnalysisData {
  metaTags?: {
    checked: number;
    missing: number;
    duplicate: number;
    tooLong: number;
    tooShort: number;
    issues?: Array<{
      url: string;
      issue: string;
      type: 'title' | 'description';
    }>;
  };
  headings?: {
    checked: number;
    missingH1: number;
    duplicateH1: number;
    brokenStructure: number;
    issues?: Array<{
      url: string;
      issue: string;
    }>;
  };
  urlStructure?: {
    checked: number;
    tooLong: number;
    withParameters: number;
    nonSeoFriendly: number;
    issues?: Array<{
      url: string;
      issue: string;
      length?: number;
    }>;
  };
  internalLinks?: {
    total: number;
    broken: number;
    noFollow: number;
    issues?: Array<{
      sourceUrl: string;
      targetUrl: string;
      issue: string;
    }>;
  };
}

/**
 * Добавляет раздел детального SEO анализа
 */
export function addSeoAnalysisSection(
  doc: jsPDF,
  data: SeoAnalysisData,
  startY: number = 30
): number {
  let currentY = startY;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // === ЗАГОЛОВОК РАЗДЕЛА ===
  doc.setFillColor(...pdfColors.primary);
  doc.rect(0, currentY - 10, pageWidth, 15, 'F');

  // Иконка SEO
  drawSeoIcon(doc, margin, currentY - 7, 8, [255, 255, 255]);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Детальный SEO Анализ', margin + 12, currentY - 2);

  currentY += 15;

  // === 1. META ТЕГИ ===
  if (data.metaTags) {
    currentY = addMetaTagsAnalysis(doc, data.metaTags, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 2. ЗАГОЛОВКИ ===
  if (data.headings) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addHeadingsAnalysis(doc, data.headings, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 3. URL СТРУКТУРА ===
  if (data.urlStructure) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addUrlStructureAnalysis(doc, data.urlStructure, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 4. ВНУТРЕННИЕ ССЫЛКИ ===
  if (data.internalLinks) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addInternalLinksAnalysis(doc, data.internalLinks, currentY, margin, contentWidth);
  }

  return currentY;
}

/**
 * Добавляет анализ мета-тегов
 */
function addMetaTagsAnalysis(
  doc: jsPDF,
  data: SeoAnalysisData['metaTags'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Meta теги (Title & Description)', margin, currentY);
  currentY += 8;

  // Статистические карточки
  const stats = [
    { label: 'Проверено', value: data?.checked || 0, color: pdfColors.info },
    { label: 'Отсутствуют', value: data?.missing || 0, color: pdfColors.danger },
    { label: 'Дубликаты', value: data?.duplicate || 0, color: pdfColors.warning },
    { label: 'Слишком длинные', value: data?.tooLong || 0, color: pdfColors.warning },
  ];

  const cardWidth = (width - 15) / 4;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица с проблемами
  if (data?.issues && data.issues.length > 0) {
    // Создаем карту URL -> полный URL для ссылок
    const linkMap = new Map<string, string>();
    
    const issuesData = data.issues.slice(0, 10).map(issue => {
      const displayUrl = formatUrlForDisplay(issue.url, 70);
      linkMap.set(displayUrl, issue.url);
      
      return [
        displayUrl,
        issue.type === 'title' ? 'Title' : 'Description',
        issue.issue
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['URL страницы', 'Тип', 'Проблема']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.primary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 80, textColor: pdfColors.primary },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 }
      },
      didDrawCell: createLinkCellHandler(linkMap)
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;

    if (data.issues.length > 10) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`... и еще ${data.issues.length - 10} проблем`, margin, currentY);
      currentY += 5;
    }
  }

  return currentY;
}

/**
 * Добавляет анализ заголовков
 */
function addHeadingsAnalysis(
  doc: jsPDF,
  data: SeoAnalysisData['headings'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Структура заголовков (H1-H6)', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Проверено страниц', value: data?.checked || 0, color: pdfColors.info },
    { label: 'Без H1', value: data?.missingH1 || 0, color: pdfColors.danger },
    { label: 'Дублирующиеся H1', value: data?.duplicateH1 || 0, color: pdfColors.warning },
    { label: 'Неправильная структура', value: data?.brokenStructure || 0, color: pdfColors.warning },
  ];

  const cardWidth = (width - 15) / 4;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица проблемных страниц
  if (data?.issues && data.issues.length > 0) {
    const linkMap = new Map<string, string>();
    
    const issuesData = data.issues.slice(0, 10).map(issue => {
      const displayUrl = formatUrlForDisplay(issue.url, 80);
      linkMap.set(displayUrl, issue.url);
      
      return [
        displayUrl,
        issue.issue
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['URL страницы', 'Проблема']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.primary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 90, textColor: pdfColors.primary },
        1: { cellWidth: 90 }
      },
      didDrawCell: createLinkCellHandler(linkMap)
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Добавляет анализ URL структуры
 */
function addUrlStructureAnalysis(
  doc: jsPDF,
  data: SeoAnalysisData['urlStructure'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('URL Структура', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Проверено', value: data?.checked || 0, color: pdfColors.info },
    { label: 'Слишком длинные', value: data?.tooLong || 0, color: pdfColors.warning },
    { label: 'С параметрами', value: data?.withParameters || 0, color: pdfColors.warning },
    { label: 'Не SEO-friendly', value: data?.nonSeoFriendly || 0, color: pdfColors.danger },
  ];

  const cardWidth = (width - 15) / 4;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица проблемных URL
  if (data?.issues && data.issues.length > 0) {
    const linkMap = new Map<string, string>();
    
    const issuesData = data.issues.slice(0, 10).map(issue => {
      const displayUrl = formatUrlForDisplay(issue.url, 100);
      linkMap.set(displayUrl, issue.url);
      
      return [
        displayUrl,
        issue.length ? `${issue.length} символов` : '-',
        issue.issue
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['URL', 'Длина', 'Проблема']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.primary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 110, textColor: pdfColors.primary },
        1: { cellWidth: 20 },
        2: { cellWidth: 50 }
      },
      didDrawCell: createLinkCellHandler(linkMap)
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Добавляет анализ внутренних ссылок
 */
function addInternalLinksAnalysis(
  doc: jsPDF,
  data: SeoAnalysisData['internalLinks'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Внутренние ссылки', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Всего ссылок', value: data?.total || 0, color: pdfColors.info },
    { label: 'Битые ссылки', value: data?.broken || 0, color: pdfColors.danger },
    { label: 'NoFollow', value: data?.noFollow || 0, color: pdfColors.warning },
  ];

  const cardWidth = (width - 15) / 3;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица битых ссылок
  if (data?.issues && data.issues.length > 0) {
    const linkMapSource = new Map<string, string>();
    const linkMapTarget = new Map<string, string>();
    
    const issuesData = data.issues.slice(0, 8).map(issue => {
      const displaySource = formatUrlForDisplay(issue.sourceUrl, 65);
      const displayTarget = formatUrlForDisplay(issue.targetUrl, 65);
      linkMapSource.set(displaySource, issue.sourceUrl);
      linkMapTarget.set(displayTarget, issue.targetUrl);
      
      return [
        displaySource,
        displayTarget,
        issue.issue
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Страница источник', 'Целевой URL', 'Проблема']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.primary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 70, textColor: pdfColors.primary },
        1: { cellWidth: 70, textColor: pdfColors.danger },
        2: { cellWidth: 40 }
      },
      didDrawCell: (data: any) => {
        const cellText = data.cell.text[0];
        const sourceUrl = linkMapSource.get(cellText);
        const targetUrl = linkMapTarget.get(cellText);
        const url = sourceUrl || targetUrl;
        
        if (url) {
          data.doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            { url }
          );
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Вспомогательная функция для рисования статистической карточки
 */
function drawStatCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  label: string,
  color: [number, number, number]
): void {
  // Фон
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');

  // Рамка
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, width, height, 2, 2, 'S');

  // Цветная полоска сверху
  doc.setFillColor(...color);
  doc.roundedRect(x, y, width, 2, 2, 2, 'F');

  // Значение
  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...color);
  doc.text(value, x + width / 2, y + 10, { align: 'center' });

  // Метка
  doc.setFontSize(7);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(100, 100, 100);
  const lines = doc.splitTextToSize(label, width - 4);
  doc.text(lines, x + width / 2, y + 15, { align: 'center' });
}
