
/**
 * Стили для PDF отчетов
 */

// Основные цвета
export const pdfColors = {
  primary: [155, 135, 245],       // #9b87f5
  secondary: [126, 105, 171],     // #7E69AB
  tertiary: [110, 89, 165],       // #6E59A5
  warning: [249, 115, 22],        // #F97316
  danger: [239, 68, 68],          // #EF4444
  success: [34, 197, 94],         // #22C55E
  info: [14, 165, 233],           // #0EA5E9
  dark: [31, 41, 55],             // #1F2937
  light: [243, 244, 246],         // #F3F4F6
  gray: [156, 163, 175],          // #9CA3AF
  background: [249, 250, 251],    // #F9FAFB
  text: [17, 24, 39],             // #111827
};

// Шрифты и размеры
export const pdfFonts = {
  heading: {
    size: 18,
    style: 'bold',
  },
  subheading: {
    size: 14,
    style: 'bold',
  },
  normal: {
    size: 10,
    style: 'normal',
  },
  small: {
    size: 8,
    style: 'normal',
  },
  tiny: {
    size: 6,
    style: 'normal',
  },
};

// Стили таблиц
export const pdfTableStyles = {
  default: {
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
      fontStyle: 'normal',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    footStyles: {
      fillColor: [243, 244, 246],
      textColor: pdfColors.dark,
      fontStyle: 'bold',
    },
  },
  comparison: {
    headStyles: {
      fillColor: pdfColors.secondary,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
  issues: {
    headStyles: {
      fillColor: pdfColors.tertiary,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
  keywords: {
    headStyles: {
      fillColor: pdfColors.info,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
};

// Форматирование для метрик
export const getMetricColor = (score: number): number[] => {
  if (score >= 90) return pdfColors.success;
  if (score >= 70) return [75, 180, 80];  // Светло-зеленый
  if (score >= 50) return pdfColors.warning;
  if (score >= 30) return [255, 170, 50];  // Оранжевый
  return pdfColors.danger;
};

// Помощники для стилизации текста
export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'отлично';
  if (score >= 70) return 'хорошо';
  if (score >= 50) return 'средне';
  if (score >= 30) return 'плохо';
  return 'критично';
};

// Форматирование заголовка отчета
export const formatReportHeader = (doc: any, title: string, date: string): void => {
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.primary);
  doc.text(title, 105, 20, { align: 'center' });
  
  doc.setFontSize(pdfFonts.small.size);
  doc.setTextColor(...pdfColors.gray);
  doc.text(`Отчет сгенерирован: ${date}`, 105, 27, { align: 'center' });
};

// Форматирование итоговой оценки
export const drawGauge = (doc: any, score: number, x: number, y: number, radius: number): void => {
  // Рисуем серый круг (фон)
  doc.setDrawColor(...pdfColors.gray);
  doc.setFillColor(...pdfColors.light);
  doc.circle(x, y, radius, 'FD');
  
  // Рисуем заполненную часть (цветной сектор)
  const angle = (score / 100) * 360;
  doc.setFillColor(...getMetricColor(score));
  
  // Создаем сектор
  if (score > 0) {
    doc.ellipse(x, y, radius, radius, 'F');
  }
  
  // Рисуем внутренний белый круг (создает эффект кольца)
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y, radius * 0.8, 'F');
  
  // Добавляем числовое значение в центр
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.dark);
  doc.text(score.toString(), x, y + 2, { align: 'center' });
  
  // Добавляем подпись
  doc.setFontSize(pdfFonts.small.size);
  doc.text('из 100', x, y + radius + 5, { align: 'center' });
};
