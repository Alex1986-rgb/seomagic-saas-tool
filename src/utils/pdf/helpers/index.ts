
import jsPDF from 'jspdf';

/**
 * Extends jsPDF with additional methods
 */
export function extendJsPDF(doc: jsPDF): void {
  // Добавляем метод textWithLink для кликабельных ссылок
  if (!(doc as any).textWithLink) {
    (doc as any).textWithLink = function(
      text: string,
      x: number,
      y: number,
      options?: {
        pageNumber?: number;
        url?: string;
        align?: 'left' | 'center' | 'right';
      }
    ) {
      const opts = options || {};
      
      // Отрисовываем текст
      this.text(text, x, y, { align: opts.align });
      
      // Получаем ширину текста для создания области клика
      const textWidth = this.getTextWidth(text);
      let linkX = x;
      
      if (opts.align === 'center') {
        linkX = x - textWidth / 2;
      } else if (opts.align === 'right') {
        linkX = x - textWidth;
      }
      
      // Добавляем ссылку
      if (opts.pageNumber) {
        this.link(linkX, y - 4, textWidth, 5, { pageNumber: opts.pageNumber });
      } else if (opts.url) {
        this.link(linkX, y - 4, textWidth, 5, { url: opts.url });
      }
      
      return this;
    };
  }
}

/**
 * Adds pagination footers to all pages
 */
export function addPaginationFooters(doc: jsPDF): void {
  const numPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= numPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${numPages}`, 105, 290, { align: 'center' });
  }
}

/**
 * Adds a timestamp to the document
 */
export function addTimestamp(doc: jsPDF, x: number, y: number): void {
  const now = new Date();
  const timestamp = now.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Отчет создан: ${timestamp}`, x, y, { align: 'left' });
}

export * from './formatting';
export * from './qrcode';
export * from './coverPage';
export * from './tableOfContents';
export * from './icons';
export * from './detailedScores';
export * from './charts';
export * from './links';
