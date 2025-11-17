import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';

/**
 * Добавляет внешнюю ссылку в PDF документ
 */
export function addExternalLink(
  doc: jsPDF,
  text: string,
  url: string,
  x: number,
  y: number,
  options: {
    maxWidth?: number;
    fontSize?: number;
    color?: [number, number, number];
    underline?: boolean;
  } = {}
): number {
  const {
    maxWidth = 100,
    fontSize = 10,
    color = pdfColors.primary,
    underline = true
  } = options;

  // Устанавливаем стиль ссылки
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  
  // Разбиваем текст если нужно
  const lines = doc.splitTextToSize(text, maxWidth);
  let currentY = y;
  
  lines.forEach((line: string, index: number) => {
    const textWidth = doc.getTextWidth(line);
    
    // Рисуем текст
    doc.text(line, x, currentY);
    
    // Добавляем подчеркивание
    if (underline) {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.1);
      doc.line(x, currentY + 0.5, x + textWidth, currentY + 0.5);
    }
    
    // Добавляем кликабельную область (только для первой строки с полным URL)
    if (index === 0) {
      doc.link(x, currentY - fontSize * 0.35, textWidth, fontSize * 0.5, { url });
    }
    
    currentY += fontSize * 0.4;
  });
  
  return currentY;
}

/**
 * Добавляет внутреннюю ссылку на страницу PDF
 */
export function addInternalLink(
  doc: jsPDF,
  text: string,
  pageNumber: number,
  x: number,
  y: number,
  options: {
    fontSize?: number;
    color?: [number, number, number];
    underline?: boolean;
  } = {}
): void {
  const {
    fontSize = 10,
    color = pdfColors.primary,
    underline = true
  } = options;

  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  
  const textWidth = doc.getTextWidth(text);
  
  // Рисуем текст
  doc.text(text, x, y);
  
  // Добавляем подчеркивание
  if (underline) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.1);
    doc.line(x, y + 0.5, x + textWidth, y + 0.5);
  }
  
  // Добавляем кликабельную область
  doc.link(x, y - fontSize * 0.35, textWidth, fontSize * 0.5, { pageNumber });
}

/**
 * Создает список URL с гиперссылками
 */
export function addUrlList(
  doc: jsPDF,
  urls: Array<{ text: string; url: string }>,
  startX: number,
  startY: number,
  options: {
    maxWidth?: number;
    lineHeight?: number;
    fontSize?: number;
    bullet?: string;
  } = {}
): number {
  const {
    maxWidth = 150,
    lineHeight = 5,
    fontSize = 9,
    bullet = '•'
  } = options;

  let currentY = startY;

  urls.forEach(({ text, url }) => {
    // Рисуем буллет
    doc.setFontSize(fontSize);
    doc.setTextColor(100, 100, 100);
    doc.text(bullet, startX, currentY);
    
    // Рисуем ссылку
    currentY = addExternalLink(doc, text, url, startX + 5, currentY, {
      maxWidth: maxWidth - 5,
      fontSize,
      color: pdfColors.primary,
      underline: true
    });
    
    currentY += lineHeight;
  });

  return currentY;
}

/**
 * Форматирует URL для отображения (убирает протокол, обрезает если нужно)
 */
export function formatUrlForDisplay(url: string, maxLength: number = 60): string {
  try {
    const urlObj = new URL(url);
    let displayUrl = urlObj.hostname + urlObj.pathname;
    
    if (urlObj.search) {
      displayUrl += urlObj.search;
    }
    
    if (displayUrl.length > maxLength) {
      return displayUrl.substring(0, maxLength - 3) + '...';
    }
    
    return displayUrl;
  } catch {
    // Если URL невалидный, просто обрезаем
    return url.length > maxLength ? url.substring(0, maxLength - 3) + '...' : url;
  }
}

/**
 * Создает стилизованную ячейку таблицы с гиперссылкой для использования в autoTable
 */
export function createLinkCell(
  text: string,
  url: string,
  options: {
    fontSize?: number;
    maxLength?: number;
  } = {}
): {
  content: string;
  styles: {
    textColor: [number, number, number];
    fontStyle: 'italic';
    fontSize: number;
  };
  link?: string;
} {
  const { fontSize = 8, maxLength = 60 } = options;
  const displayText = maxLength ? formatUrlForDisplay(text, maxLength) : text;
  
  return {
    content: displayText,
    styles: {
      textColor: pdfColors.primary,
      fontStyle: 'italic' as const,
      fontSize
    },
    link: url // Это свойство мы будем обрабатывать отдельно
  };
}

/**
 * Постобработка autoTable для добавления кликабельных ссылок
 * Вызывать после генерации таблицы
 */
export function addLinksToTableCells(
  doc: jsPDF,
  tableCells: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    url: string;
  }>
): void {
  tableCells.forEach(cell => {
    doc.link(cell.x, cell.y, cell.width, cell.height, { url: cell.url });
  });
}

/**
 * Обработчик для didDrawCell в autoTable, добавляющий ссылки
 */
export function createLinkCellHandler(linkData: Map<string, string>) {
  return function(data: any) {
    const cellText = data.cell.text[0];
    const url = linkData.get(cellText);
    
    if (url) {
      const doc = data.doc;
      doc.link(
        data.cell.x,
        data.cell.y,
        data.cell.width,
        data.cell.height,
        { url }
      );
    }
  };
}
