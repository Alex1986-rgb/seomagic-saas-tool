import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { drawContentIcon, drawCheckIcon, drawErrorIcon, drawWarningIcon } from '../helpers/icons';
import { formatUrlForDisplay } from '../helpers/links';

export interface PageAnalysisItem {
  url: string;
  statusCode: number;
  loadTime: number;
  pageSize?: number;
  seoScore: number;
  issues: {
    critical: number;
    warning: number;
    info: number;
  };
  metaTitle?: string;
  metaDescription?: string;
  h1Count?: number;
}

interface PageAnalysisData {
  pages: PageAnalysisItem[];
  summary: {
    totalPages: number;
    avgLoadTime: number;
    avgSeoScore: number;
    totalIssues: number;
  };
}

/**
 * Добавляет раздел анализа страниц
 */
export function addPageAnalysisSection(
  doc: jsPDF,
  data: PageAnalysisData,
  startY: number = 30
): number {
  let currentY = startY;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // === ЗАГОЛОВОК РАЗДЕЛА ===
  doc.setFillColor(...pdfColors.info);
  doc.rect(0, currentY - 10, pageWidth, 15, 'F');

  drawContentIcon(doc, margin, currentY - 7, 8, [255, 255, 255]);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Анализ страниц', margin + 12, currentY - 2);

  currentY += 15;

  // === СВОДНАЯ СТАТИСТИКА ===
  const stats = [
    { label: 'Всего страниц', value: data.summary.totalPages.toString(), color: pdfColors.info },
    { label: 'Средний SEO балл', value: data.summary.avgSeoScore.toString(), color: getScoreColor(data.summary.avgSeoScore) },
    { label: 'Среднее время загрузки', value: `${data.summary.avgLoadTime}мс`, color: getLoadTimeColor(data.summary.avgLoadTime) },
    { label: 'Всего проблем', value: data.summary.totalIssues.toString(), color: data.summary.totalIssues > 0 ? pdfColors.danger : pdfColors.success },
  ];

  const cardWidth = (contentWidth - 15) / 4;
  stats.forEach((stat, index) => {
    const x = margin + (cardWidth + 5) * index;
    drawStatCard(doc, x, currentY, cardWidth, 18, stat.value, stat.label, stat.color);
  });

  currentY += 25;

  // === ТАБЛИЦА СТРАНИЦ ===
  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Детальная информация по страницам', margin, currentY);
  currentY += 8;

  // Сортируем страницы по проблемности (больше проблем = выше)
  const sortedPages = [...data.pages].sort((a, b) => {
    const totalA = a.issues.critical + a.issues.warning + a.issues.info;
    const totalB = b.issues.critical + b.issues.warning + b.issues.info;
    return totalB - totalA;
  });

  // Разбиваем на страницы по 10-15 записей
  const pageSize = 12;
  const totalPageChunks = Math.ceil(sortedPages.length / pageSize);

  for (let chunk = 0; chunk < totalPageChunks; chunk++) {
    if (chunk > 0) {
      doc.addPage();
      currentY = 20;
      
      // Заголовок на новой странице
      doc.setFillColor(...pdfColors.info);
      doc.rect(0, 10, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.text('Анализ страниц (продолжение)', pageWidth / 2, 18, { align: 'center' });
      currentY = 30;
    }

    const chunkPages = sortedPages.slice(chunk * pageSize, (chunk + 1) * pageSize);
    
    // Создаем карту для ссылок
    const linkMap = new Map<string, string>();
    
    const tableData = chunkPages.map(page => {
      const totalIssues = page.issues.critical + page.issues.warning + page.issues.info;
      const statusIcon = getStatusCodeIcon(page.statusCode);
      const seoScoreColor = getScoreColor(page.seoScore);
      const displayUrl = shortenUrl(page.url);
      
      linkMap.set(displayUrl, page.url);
      
      return [
        displayUrl,
        `${statusIcon} ${page.statusCode}`,
        page.seoScore.toString(),
        `${page.loadTime}ms`,
        totalIssues > 0 ? formatIssues(page.issues) : '✓'
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['URL страницы', 'Статус', 'SEO', 'Время', 'Проблемы']],
      body: tableData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.info,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold' as const,
        halign: 'center' as const
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 90, halign: 'left' as const, textColor: pdfColors.primary },
        1: { cellWidth: 22, halign: 'center' as const },
        2: { cellWidth: 18, halign: 'center' as const },
        3: { cellWidth: 22, halign: 'center' as const },
        4: { cellWidth: 28, halign: 'center' as const }
      },
      didDrawCell: (data: any) => {
        // Добавляем ссылки только для первой колонки (URL)
        if (data.column.index === 0 && data.section === 'body') {
          const cellText = data.cell.text[0];
          const url = linkMap.get(cellText);
          
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
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  // === ГРУППИРОВКА ПО РАЗДЕЛАМ САЙТА ===
  if (sortedPages.length > 20) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 10;
    }

    doc.setFontSize(12);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Распределение по разделам сайта', margin, currentY);
    currentY += 8;

    const sections = groupPagesBySection(sortedPages);
    
    const sectionData = Object.entries(sections).map(([section, pages]) => {
      const avgScore = pages.reduce((sum, p) => sum + p.seoScore, 0) / pages.length;
      const totalIssues = pages.reduce((sum, p) => 
        sum + p.issues.critical + p.issues.warning + p.issues.info, 0
      );
      
      return [
        section,
        pages.length.toString(),
        Math.round(avgScore).toString(),
        totalIssues.toString()
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Раздел сайта', 'Страниц', 'Средний балл', 'Проблем']],
      body: sectionData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: pdfColors.secondary,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold' as const
      },
      bodyStyles: {
        fontSize: 9,
        textColor: pdfColors.dark
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: 'center' as const },
        2: { cellWidth: 30, halign: 'center' as const },
        3: { cellWidth: 30, halign: 'center' as const }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

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

  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...color);
  doc.text(value, x + width / 2, y + 9, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(100, 100, 100);
  const lines = doc.splitTextToSize(label, width - 4);
  doc.text(lines, x + width / 2, y + 14, { align: 'center' });
}

function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return pdfColors.success;
  if (score >= 60) return pdfColors.warning;
  return pdfColors.danger;
}

function getLoadTimeColor(loadTime: number): [number, number, number] {
  if (loadTime < 500) return pdfColors.success;
  if (loadTime < 2000) return pdfColors.warning;
  return pdfColors.danger;
}

function getStatusCodeIcon(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return '✓';
  if (statusCode >= 300 && statusCode < 400) return '↻';
  if (statusCode >= 400 && statusCode < 500) return '⚠';
  if (statusCode >= 500) return '✗';
  return '?';
}

function getStatusCodeColor(statusCode: number): [number, number, number] {
  if (statusCode >= 200 && statusCode < 300) return pdfColors.success;
  if (statusCode >= 300 && statusCode < 400) return pdfColors.info;
  if (statusCode >= 400 && statusCode < 500) return pdfColors.warning;
  if (statusCode >= 500) return pdfColors.danger;
  return pdfColors.gray;
}

function formatIssues(issues: { critical: number; warning: number; info: number }): string {
  const parts: string[] = [];
  if (issues.critical > 0) parts.push(`${issues.critical}🔴`);
  if (issues.warning > 0) parts.push(`${issues.warning}🟡`);
  if (issues.info > 0) parts.push(`${issues.info}🔵`);
  return parts.join(' ');
}

function shortenUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    
    // Убираем слеши в начале и конце
    path = path.replace(/^\/+|\/+$/g, '');
    
    // Если путь слишком длинный, обрезаем
    if (path.length > 60) {
      const parts = path.split('/');
      if (parts.length > 3) {
        return `/${parts[0]}/.../${parts[parts.length - 1]}`;
      }
      return `/${path.substring(0, 57)}...`;
    }
    
    return path ? `/${path}` : '/';
  } catch {
    return url.length > 60 ? url.substring(0, 57) + '...' : url;
  }
}

function groupPagesBySection(pages: PageAnalysisItem[]): Record<string, PageAnalysisItem[]> {
  const sections: Record<string, PageAnalysisItem[]> = {};
  
  pages.forEach(page => {
    try {
      const urlObj = new URL(page.url);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      const section = pathParts.length > 0 ? `/${pathParts[0]}` : 'Главная';
      
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(page);
    } catch {
      if (!sections['Прочие']) {
        sections['Прочие'] = [];
      }
      sections['Прочие'].push(page);
    }
  });
  
  return sections;
}
