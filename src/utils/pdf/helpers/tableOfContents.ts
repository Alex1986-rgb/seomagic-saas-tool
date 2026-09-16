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

// Здесь была generateTocSections(): заготовленный список разделов с номерами
// страниц 3–22 («Долгосрочная стратегия», «Варианты пакетов»…), не совпадавший
// с настоящим отчётом. Оглавление теперь собирается по фактически добавленным
// разделам — см. generateAuditPdf в ../auditPdf.ts.
