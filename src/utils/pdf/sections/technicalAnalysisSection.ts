import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { drawTechnicalIcon, drawCheckIcon, drawErrorIcon, drawWarningIcon } from '../helpers/icons';
import { generatePieChart, generateBarChart } from '../helpers/charts';

interface TechnicalAnalysisData {
  https?: {
    enabled: boolean;
    mixedContent: number;
    issues?: Array<{
      url: string;
      issue: string;
    }>;
  };
  statusCodes?: {
    total: number;
    success: number; // 2xx
    redirects: number; // 3xx
    clientErrors: number; // 4xx
    serverErrors: number; // 5xx
    breakdown?: Record<number, number>;
  };
  redirects?: {
    total: number;
    permanent: number; // 301
    temporary: number; // 302
    chains: number;
    issues?: Array<{
      source: string;
      target: string;
      type: number;
      chainLength?: number;
    }>;
  };
  brokenLinks?: {
    total: number;
    notFound: number; // 404
    serverError: number; // 5xx
    issues?: Array<{
      url: string;
      statusCode: number;
      referrers?: string[];
    }>;
  };
  performance?: {
    avgResponseTime: number;
    slowPages: number;
    fastPages: number;
    issues?: Array<{
      url: string;
      responseTime: number;
    }>;
  };
  indexability?: {
    indexable: number;
    noindex: number;
    robotsBlocked: number;
    issues?: Array<{
      url: string;
      reason: string;
    }>;
  };
}

/**
 * Добавляет раздел технического анализа
 */
export function addTechnicalAnalysisSection(
  doc: jsPDF,
  data: TechnicalAnalysisData,
  startY: number = 30
): number {
  let currentY = startY;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // === ЗАГОЛОВОК РАЗДЕЛА ===
  doc.setFillColor(...pdfColors.secondary);
  doc.rect(0, currentY - 10, pageWidth, 15, 'F');

  // Иконка
  drawTechnicalIcon(doc, margin, currentY - 7, 8, [255, 255, 255]);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Технический Анализ', margin + 12, currentY - 2);

  currentY += 15;

  // === 1. HTTPS И БЕЗОПАСНОСТЬ ===
  if (data.https) {
    currentY = addHttpsAnalysis(doc, data.https, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 2. СТАТУС-КОДЫ ===
  if (data.statusCodes) {
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addStatusCodesAnalysis(doc, data.statusCodes, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 3. РЕДИРЕКТЫ ===
  if (data.redirects) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addRedirectsAnalysis(doc, data.redirects, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 4. БИТЫЕ ССЫЛКИ ===
  if (data.brokenLinks) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addBrokenLinksAnalysis(doc, data.brokenLinks, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 5. ПРОИЗВОДИТЕЛЬНОСТЬ ===
  if (data.performance) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addPerformanceAnalysis(doc, data.performance, currentY, margin, contentWidth);
    currentY += 10;
  }

  // === 6. ИНДЕКСИРУЕМОСТЬ ===
  if (data.indexability) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addIndexabilityAnalysis(doc, data.indexability, currentY, margin, contentWidth);
  }

  return currentY;
}

/**
 * Добавляет анализ HTTPS
 */
function addHttpsAnalysis(
  doc: jsPDF,
  data: TechnicalAnalysisData['https'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('HTTPS и безопасность', margin, currentY);
  currentY += 8;

  // Статус HTTPS
  const httpsColor = data?.enabled ? pdfColors.success : pdfColors.danger;
  const httpsStatus = data?.enabled ? 'Активен' : 'Не активен';

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, currentY, width, 20, 3, 3, 'F');

  if (data?.enabled) {
    drawCheckIcon(doc, margin + 5, currentY + 7, 6, httpsColor);
  } else {
    drawErrorIcon(doc, margin + 5, currentY + 7, 6, httpsColor);
  }

  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...httpsColor);
  doc.text(`HTTPS: ${httpsStatus}`, margin + 15, currentY + 10);

  if (data?.mixedContent && data.mixedContent > 0) {
    doc.setFontSize(9);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(...pdfColors.warning);
    doc.text(`⚠ Найдено ${data.mixedContent} страниц со смешанным контентом`, margin + 15, currentY + 16);
  }

  currentY += 25;

  // Таблица проблем
  if (data?.issues && data.issues.length > 0) {
    const issuesData = data.issues.slice(0, 5).map(issue => [
      { content: issue.url, styles: { textColor: pdfColors.primary, fontStyle: 'italic' as const, fontSize: 8 } },
      issue.issue
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['URL', 'Проблема']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.secondary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 80 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Добавляет анализ статус-кодов
 */
function addStatusCodesAnalysis(
  doc: jsPDF,
  data: TechnicalAnalysisData['statusCodes'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Статус-коды HTTP', margin, currentY);
  currentY += 8;

  // Круговая диаграмма
  const statusData = {
    '2xx (Успешно)': data?.success || 0,
    '3xx (Редиректы)': data?.redirects || 0,
    '4xx (Клиентские ошибки)': data?.clientErrors || 0,
    '5xx (Серверные ошибки)': data?.serverErrors || 0,
  };

  generatePieChart(doc, statusData, width / 2 + margin, currentY + 40, 30, {
    title: 'Распределение статус-кодов',
    showLegend: true,
    showPercentages: true,
    legendPosition: 'right',
    colors: [
      pdfColors.success,
      pdfColors.info,
      pdfColors.warning,
      pdfColors.danger
    ]
  });

  currentY += 90;

  return currentY;
}

/**
 * Добавляет анализ редиректов
 */
function addRedirectsAnalysis(
  doc: jsPDF,
  data: TechnicalAnalysisData['redirects'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Редиректы', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Всего редиректов', value: data?.total || 0, color: pdfColors.info },
    { label: 'Постоянные (301)', value: data?.permanent || 0, color: pdfColors.success },
    { label: 'Временные (302)', value: data?.temporary || 0, color: pdfColors.warning },
    { label: 'Цепочки', value: data?.chains || 0, color: pdfColors.danger },
  ];

  const cardWidth = (width - 15) / 4;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица редиректов
  if (data?.issues && data.issues.length > 0) {
    const issuesData = data.issues.slice(0, 8).map(issue => [
      { content: issue.source, styles: { fontSize: 7, textColor: pdfColors.primary } },
      '→',
      { content: issue.target, styles: { fontSize: 7, textColor: pdfColors.info } },
      issue.type.toString(),
      issue.chainLength ? `${issue.chainLength} звеньев` : '-'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Источник', '', 'Цель', 'Тип', 'Цепочка']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.secondary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 8, halign: 'center' },
        2: { cellWidth: 65 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 27 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Добавляет анализ битых ссылок
 */
function addBrokenLinksAnalysis(
  doc: jsPDF,
  data: TechnicalAnalysisData['brokenLinks'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Битые ссылки', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Всего битых ссылок', value: data?.total || 0, color: pdfColors.danger },
    { label: '404 Not Found', value: data?.notFound || 0, color: pdfColors.warning },
    { label: 'Ошибки сервера (5xx)', value: data?.serverError || 0, color: pdfColors.danger },
  ];

  const cardWidth = (width - 10) / 3;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица битых ссылок
  if (data?.issues && data.issues.length > 0) {
    const issuesData = data.issues.slice(0, 10).map(issue => [
      { content: issue.url, styles: { textColor: pdfColors.danger, fontSize: 7 } },
      issue.statusCode.toString(),
      issue.referrers && issue.referrers.length > 0 ? issue.referrers.length.toString() : '0'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Битый URL', 'Код', 'Ссылок']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.danger,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      columnStyles: {
        0: { cellWidth: 130 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Добавляет анализ производительности
 */
function addPerformanceAnalysis(
  doc: jsPDF,
  data: TechnicalAnalysisData['performance'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Время отклика сервера', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Среднее время', value: `${data?.avgResponseTime || 0}ms`, color: pdfColors.info },
    { label: 'Быстрые (<500ms)', value: data?.fastPages || 0, color: pdfColors.success },
    { label: 'Медленные (>2s)', value: data?.slowPages || 0, color: pdfColors.danger },
  ];

  const cardWidth = (width - 10) / 3;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  // Таблица медленных страниц
  if (data?.issues && data.issues.length > 0) {
    const issuesData = data.issues.slice(0, 8).map(issue => [
      { content: issue.url, styles: { fontSize: 7 } },
      `${issue.responseTime}ms`,
      getPerformanceStatus(issue.responseTime)
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['URL', 'Время', 'Статус']],
      body: issuesData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.secondary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  return currentY;
}

/**
 * Добавляет анализ индексируемости
 */
function addIndexabilityAnalysis(
  doc: jsPDF,
  data: TechnicalAnalysisData['indexability'],
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Подзаголовок
  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Индексируемость', margin, currentY);
  currentY += 8;

  // Статистика
  const stats = [
    { label: 'Индексируемые', value: data?.indexable || 0, color: pdfColors.success },
    { label: 'Noindex', value: data?.noindex || 0, color: pdfColors.warning },
    { label: 'Заблокировано robots.txt', value: data?.robotsBlocked || 0, color: pdfColors.danger },
  ];

  const cardWidth = (width - 10) / 3;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value.toString(), stat.label, stat.color);
  });

  currentY += 25;

  return currentY;
}

/**
 * Вспомогательные функции
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
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');

  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, width, height, 2, 2, 'S');

  doc.setFillColor(...color);
  doc.roundedRect(x, y, width, 2, 2, 2, 'F');

  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...color);
  doc.text(value, x + width / 2, y + 10, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(100, 100, 100);
  const lines = doc.splitTextToSize(label, width - 4);
  doc.text(lines, x + width / 2, y + 15, { align: 'center' });
}

function getPerformanceStatus(responseTime: number): string {
  if (responseTime < 500) return 'Отлично';
  if (responseTime < 1000) return 'Хорошо';
  if (responseTime < 2000) return 'Средне';
  return 'Плохо';
}
