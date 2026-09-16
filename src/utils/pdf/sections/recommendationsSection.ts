import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { drawLightbulbIcon, drawPriorityIcon } from '../helpers/icons';

export interface Recommendation {
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  solution: string;
  expectedResult: string;
  /**
   * Срок и стоимость — только настоящие. Раньше каждой рекомендации
   * приписывались «1-2 недели / 15 000 ₽», «2-4 недели / 8 000 ₽» и
   * «1-2 месяца / 5 000 ₽» по одной лишь важности замечания. Нет значения —
   * строка не печатается.
   */
  timeframe?: string;
  cost?: number;
  urls?: string[];
}

interface RecommendationsData {
  critical: Recommendation[];
  important: Recommendation[];
  opportunities: Recommendation[];
}

/**
 * Добавляет раздел рекомендаций и плана действий
 */
export function addRecommendationsSection(
  doc: jsPDF,
  data: RecommendationsData,
  startY: number = 30
): number {
  let currentY = startY;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // === ЗАГОЛОВОК РАЗДЕЛА ===
  doc.setFillColor(...pdfColors.info);
  doc.rect(0, currentY - 10, pageWidth, 15, 'F');

  drawLightbulbIcon(doc, margin, currentY - 7, 8, [255, 255, 255]);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text('Рекомендации', margin + 12, currentY - 2);

  currentY += 15;

  // === КРИТИЧЕСКИЕ ПРОБЛЕМЫ (ПРИОРИТЕТ 1) ===
  if (data.critical && data.critical.length > 0) {
    currentY = addPrioritySection(
      doc,
      'Критические проблемы (Приоритет 1)',
      data.critical,
      'high',
      currentY,
      margin,
      contentWidth
    );
  }

  // === ВАЖНЫЕ УЛУЧШЕНИЯ (ПРИОРИТЕТ 2) ===
  if (data.important && data.important.length > 0) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addPrioritySection(
      doc,
      'Важные улучшения (Приоритет 2)',
      data.important,
      'medium',
      currentY,
      margin,
      contentWidth
    );
  }

  // === ВОЗМОЖНОСТИ ДЛЯ РОСТА (ПРИОРИТЕТ 3) ===
  if (data.opportunities && data.opportunities.length > 0) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    currentY = addPrioritySection(
      doc,
      'Возможности для роста (Приоритет 3)',
      data.opportunities,
      'low',
      currentY,
      margin,
      contentWidth
    );
  }

  // Здесь печатался «Timeline выполнения работ»: фазы «1-2 недели»,
  // «3-4 недели», «5-8 недель» и вехи «Неделя 2 / 4 / 8». Сроки нигде не
  // рассчитываются — это был шаблон для любого сайта, поэтому блок убран.

  return currentY;
}

/**
 * Добавляет секцию для конкретного приоритета
 */
function addPrioritySection(
  doc: jsPDF,
  title: string,
  recommendations: Recommendation[],
  priority: 'high' | 'medium' | 'low',
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Заголовок секции
  const priorityColor = getPriorityColor(priority);
  
  doc.setFillColor(...priorityColor);
  doc.roundedRect(margin, currentY, width, 10, 2, 2, 'F');

  drawPriorityIcon(doc, margin + 3, currentY + 2.5, 5, priority);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.text(title, margin + 12, currentY + 7);

  currentY += 15;

  // Рекомендации
  recommendations.forEach((rec, index) => {
    // Проверка на новую страницу
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    currentY = addRecommendationCard(doc, rec, priority, currentY, margin, width);
    currentY += 5;
  });

  currentY += 5;

  return currentY;
}

/**
 * Добавляет карточку рекомендации
 */
function addRecommendationCard(
  doc: jsPDF,
  rec: Recommendation,
  priority: 'high' | 'medium' | 'low',
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;
  const priorityColor = getPriorityColor(priority);

  // Фон карточки
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...priorityColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, width, 5, 2, 2, 'FD'); // Временная высота, обновится
  
  // Запоминаем стартовую позицию для расчета высоты
  const cardStartY = currentY;

  // Отступ внутри карточки
  currentY += 5;
  const innerMargin = margin + 5;
  const innerWidth = width - 10;

  // === ЗАГОЛОВОК ПРОБЛЕМЫ ===
  doc.setFontSize(11);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  const titleLines = doc.splitTextToSize(rec.title, innerWidth - 10);
  titleLines.forEach((line: string) => {
    doc.text(line, innerMargin, currentY);
    currentY += 5;
  });

  // Иконка приоритета справа от заголовка
  drawPriorityIcon(doc, margin + width - 10, cardStartY + 3, 5, priority);

  currentY += 2;

  // === ОПИСАНИЕ ===
  doc.setFontSize(9);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(60, 60, 60);
  doc.text('Описание:', innerMargin, currentY);
  currentY += 4;
  
  const descLines = doc.splitTextToSize(rec.description, innerWidth);
  descLines.forEach((line: string) => {
    doc.text(line, innerMargin + 3, currentY);
    currentY += 4;
  });

  currentY += 2;

  // === ВЛИЯНИЕ НА SEO ===
  doc.setFontSize(9);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...priorityColor);
  doc.text('⚠ Влияние на SEO:', innerMargin, currentY);
  currentY += 4;

  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(60, 60, 60);
  const impactLines = doc.splitTextToSize(rec.impact, innerWidth);
  impactLines.forEach((line: string) => {
    doc.text(line, innerMargin + 3, currentY);
    currentY += 4;
  });

  currentY += 2;

  // === РЕШЕНИЕ ===
  doc.setFontSize(9);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.success);
  doc.text('✓ Как исправить:', innerMargin, currentY);
  currentY += 4;

  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(60, 60, 60);
  const solutionLines = doc.splitTextToSize(rec.solution, innerWidth);
  solutionLines.forEach((line: string) => {
    doc.text(line, innerMargin + 3, currentY);
    currentY += 4;
  });

  currentY += 2;

  // === ОЖИДАЕМЫЙ РЕЗУЛЬТАТ ===
  doc.setFontSize(9);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.info);
  doc.text('📈 Ожидаемый результат:', innerMargin, currentY);
  currentY += 4;

  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(60, 60, 60);
  const resultLines = doc.splitTextToSize(rec.expectedResult, innerWidth);
  resultLines.forEach((line: string) => {
    doc.text(line, innerMargin + 3, currentY);
    currentY += 4;
  });

  currentY += 3;

  // === НИЖНЯЯ ПАНЕЛЬ С СРОКОМ И СТОИМОСТЬЮ (только если они известны) ===
  if (rec.timeframe || rec.cost) {
    doc.setFillColor(245, 247, 250);
    doc.rect(innerMargin, currentY, innerWidth, 8, 'F');

    doc.setFontSize(8);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(80, 80, 80);

    if (rec.timeframe) {
      doc.text(`Срок: ${rec.timeframe}`, innerMargin + 3, currentY + 5);
    }

    if (rec.cost) {
      doc.text(`Стоимость: ${rec.cost.toLocaleString('ru-RU')} ₽`, innerMargin + innerWidth / 2, currentY + 5);
    }

    currentY += 10;
  }

  // URLs (если есть)
  if (rec.urls && rec.urls.length > 0) {
    doc.setFontSize(7);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(100, 100, 100);
    const urlCount = rec.urls.length;
    doc.text(`Затронуто страниц: ${urlCount}`, innerMargin + 3, currentY);
    currentY += 5;
  }

  // Перерисовываем рамку карточки с правильной высотой
  const cardHeight = currentY - cardStartY;
  doc.setDrawColor(...priorityColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, cardStartY, width, cardHeight, 2, 2, 'S');

  return currentY;
}

/**
 * Возвращает цвет приоритета
 */
function getPriorityColor(priority: 'high' | 'medium' | 'low'): [number, number, number] {
  switch (priority) {
    case 'high': return pdfColors.danger;
    case 'medium': return pdfColors.warning;
    case 'low': return pdfColors.info;
    default: return pdfColors.gray;
  }
}
