import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';

export interface TocSection {
  title: string;
  pageNumber: number;
  level: number; // 1 = main section, 2 = subsection
  id?: string; // для внутренних ссылок
}

interface TocOptions {
  title?: string;
  sections: TocSection[];
  startY?: number;
}

/**
 * Добавляет оглавление (Table of Contents) с кликабельными ссылками
 */
export function addTableOfContents(
  doc: jsPDF,
  options: TocOptions
): number {
  const {
    title = 'Оглавление',
    sections,
    startY = 30
  } = options;

  let currentY = startY;
  const pageWidth = 210;
  const leftMargin = 20;
  const rightMargin = 190;

  // === ЗАГОЛОВОК ОГЛАВЛЕНИЯ ===
  doc.setFillColor(...pdfColors.primary);
  doc.rect(0, 10, pageWidth, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(pdfFonts.heading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.heading.style);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });

  // === РАЗДЕЛЫ ОГЛАВЛЕНИЯ ===
  doc.setTextColor(...pdfColors.dark);

  sections.forEach((section, index) => {
    const isMainSection = section.level === 1;
    const indent = isMainSection ? 0 : 10;

    // Проверяем, нужна ли новая страница
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }

    // Настройки шрифта в зависимости от уровня
    if (isMainSection) {
      doc.setFontSize(pdfFonts.subheading.size);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      currentY += 8; // Больше отступ перед основными разделами
    } else {
      doc.setFontSize(pdfFonts.body.size);
      doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
      currentY += 2;
    }

    // Название раздела
    const textX = leftMargin + indent;
    const textY = currentY;

    // Делаем текст кликабельным (ссылка на страницу)
    doc.setTextColor(...pdfColors.primary);
    doc.textWithLink(section.title, textX, textY, {
      pageNumber: section.pageNumber
    });

    // Точки между названием и номером страницы
    const titleWidth = doc.getTextWidth(section.title);
    const pageNumStr = section.pageNumber.toString();
    const pageNumWidth = doc.getTextWidth(pageNumStr);
    
    // Рисуем точечную линию (имитация пунктира)
    doc.setDrawColor(200, 200, 200);
    const lineY = textY - 2;
    const lineStartX = textX + titleWidth + 3;
    const lineEndX = rightMargin - pageNumWidth - 3;
    
    if (lineEndX > lineStartX) {
      // Рисуем точки вместо пунктирной линии
      const dotSpacing = 2;
      for (let dotX = lineStartX; dotX < lineEndX; dotX += dotSpacing) {
        doc.circle(dotX, lineY, 0.2, 'F');
      }
    }

    // Номер страницы (также кликабельный)
    doc.setTextColor(...pdfColors.dark);
    doc.textWithLink(pageNumStr, rightMargin, textY, {
      pageNumber: section.pageNumber,
      align: 'right'
    });

    currentY += isMainSection ? 7 : 5;
  });

  // Возвращаем финальную Y позицию
  return currentY + 10;
}

/**
 * Автоматически генерирует оглавление на основе структуры отчета
 */
export function generateTocSections(): TocSection[] {
  return [
    { title: 'Исполнительное резюме', pageNumber: 3, level: 1 },
    { title: 'Общая оценка', pageNumber: 3, level: 2 },
    { title: 'Ключевые находки', pageNumber: 4, level: 2 },
    
    { title: 'Детальный анализ оценок', pageNumber: 5, level: 1 },
    { title: 'SEO', pageNumber: 5, level: 2 },
    { title: 'Производительность', pageNumber: 6, level: 2 },
    { title: 'Контент', pageNumber: 7, level: 2 },
    { title: 'Технические аспекты', pageNumber: 8, level: 2 },
    { title: 'Мобильная оптимизация', pageNumber: 9, level: 2 },
    
    { title: 'SEO Анализ', pageNumber: 10, level: 1 },
    { title: 'Meta теги', pageNumber: 10, level: 2 },
    { title: 'Заголовки', pageNumber: 11, level: 2 },
    { title: 'URL структура', pageNumber: 12, level: 2 },
    
    { title: 'Технический анализ', pageNumber: 13, level: 1 },
    { title: 'HTTPS и безопасность', pageNumber: 13, level: 2 },
    { title: 'Статус-коды', pageNumber: 14, level: 2 },
    { title: 'Битые ссылки', pageNumber: 15, level: 2 },
    
    { title: 'Выявленные проблемы', pageNumber: 16, level: 1 },
    { title: 'Критические', pageNumber: 16, level: 2 },
    { title: 'Важные', pageNumber: 17, level: 2 },
    { title: 'Рекомендации', pageNumber: 18, level: 2 },
    
    { title: 'План действий и рекомендации', pageNumber: 19, level: 1 },
    { title: 'Приоритетные исправления', pageNumber: 19, level: 2 },
    { title: 'Долгосрочная стратегия', pageNumber: 20, level: 2 },
    
    { title: 'Смета оптимизации', pageNumber: 21, level: 1 },
    { title: 'Детальная смета работ', pageNumber: 21, level: 2 },
    { title: 'Варианты пакетов', pageNumber: 22, level: 2 },
  ];
}
