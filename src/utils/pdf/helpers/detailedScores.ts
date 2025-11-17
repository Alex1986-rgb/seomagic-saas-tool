import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { 
  drawSeoIcon, 
  drawPerformanceIcon, 
  drawContentIcon, 
  drawTechnicalIcon, 
  drawMobileIcon 
} from './icons';

export interface CategoryScore {
  name: string;
  score: number;
  icon: 'seo' | 'performance' | 'content' | 'technical' | 'mobile';
  metrics?: {
    label: string;
    value: string | number;
    status?: 'good' | 'warning' | 'error';
  }[];
  description?: string;
}

/**
 * Рисует детальную шкалу оценки для одной категории
 */
export function drawDetailedCategoryScore(
  doc: jsPDF,
  category: CategoryScore,
  x: number,
  y: number,
  width: number = 180
): number {
  const startY = y;
  let currentY = y;

  // === ФОНОВЫЙ БЛОК ===
  const blockHeight = 55 + (category.metrics ? category.metrics.length * 6 : 0);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(x, y, width, blockHeight, 3, 3, 'F');

  // === ИКОНКА КАТЕГОРИИ ===
  const iconSize = 8;
  const iconX = x + 5;
  const iconY = y + 5;
  
  const iconColor = getScoreColor(category.score);
  drawCategoryIcon(doc, category.icon, iconX, iconY, iconSize, iconColor);

  // === НАЗВАНИЕ КАТЕГОРИИ ===
  doc.setFontSize(pdfFonts.subheading.size);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text(category.name, iconX + iconSize + 5, iconY + 6);

  // === ОЦЕНКА (КРУПНАЯ) ===
  const scoreX = x + width - 35;
  const scoreY = y + 15;
  
  // Круг для оценки
  doc.setFillColor(...iconColor);
  doc.circle(scoreX, scoreY, 12, 'F');
  
  doc.setFillColor(255, 255, 255);
  doc.circle(scoreX, scoreY, 10, 'F');
  
  // Число
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...iconColor);
  doc.text(category.score.toString(), scoreX, scoreY + 2, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.text('из 100', scoreX, scoreY + 8, { align: 'center' });

  currentY = y + 25;

  // === ШКАЛА ПРОГРЕССА ===
  const barX = x + 10;
  const barWidth = width - 20;
  const barHeight = 6;
  
  // Фон шкалы
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(barX, currentY, barWidth, barHeight, 3, 3, 'F');
  
  // Заполненная часть
  const fillWidth = (barWidth * category.score) / 100;
  doc.setFillColor(...iconColor);
  doc.roundedRect(barX, currentY, fillWidth, barHeight, 3, 3, 'F');
  
  // Градиентный эффект
  const gradientSteps = 10;
  for (let i = 0; i < gradientSteps; i++) {
    const alpha = 0.3 - (i / gradientSteps) * 0.3;
    const stepWidth = fillWidth / gradientSteps;
    doc.setFillColor(iconColor[0], iconColor[1], iconColor[2], alpha);
    doc.rect(barX + i * stepWidth, currentY, stepWidth, barHeight / 2, 'F');
  }

  currentY += barHeight + 8;

  // === ОПИСАНИЕ (если есть) ===
  if (category.description) {
    doc.setFontSize(pdfFonts.small.size);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(100, 100, 100);
    
    const lines = doc.splitTextToSize(category.description, width - 20);
    lines.forEach((line: string) => {
      doc.text(line, x + 10, currentY);
      currentY += 4;
    });
    
    currentY += 2;
  }

  // === МЕТРИКИ (если есть) ===
  if (category.metrics && category.metrics.length > 0) {
    doc.setFontSize(pdfFonts.small.size);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    
    category.metrics.forEach((metric) => {
      const metricY = currentY;
      
      // Статус индикатор
      if (metric.status) {
        const statusColor = getStatusColor(metric.status);
        doc.setFillColor(...statusColor);
        doc.circle(x + 12, metricY - 1, 1.5, 'F');
      }
      
      // Метка
      doc.setTextColor(80, 80, 80);
      doc.text(metric.label, x + 17, metricY);
      
      // Значение
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.setTextColor(...pdfColors.dark);
      doc.text(String(metric.value), x + width - 12, metricY, { align: 'right' });
      doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
      
      currentY += 6;
    });
  }

  return currentY + 5 - startY; // Возвращаем высоту блока
}

/**
 * Рисует все категории с детальными шкалами на одной или нескольких страницах
 */
export function drawAllCategoryScores(
  doc: jsPDF,
  categories: CategoryScore[],
  startY: number = 30
): number {
  let currentY = startY;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  const maxY = 270; // Максимальная позиция перед новой страницей

  categories.forEach((category, index) => {
    // Проверяем, нужна ли новая страница
    if (currentY > maxY - 60) {
      doc.addPage();
      currentY = 20;
      
      // Добавляем заголовок раздела на новой странице
      doc.setFillColor(...pdfColors.primary);
      doc.rect(0, 10, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.text('Детальный анализ оценок (продолжение)', pageWidth / 2, 18, { align: 'center' });
      
      currentY = 30;
    }

    const blockHeight = drawDetailedCategoryScore(
      doc,
      category,
      margin,
      currentY,
      contentWidth
    );

    currentY += blockHeight + 8; // Отступ между блоками
  });

  return currentY;
}

/**
 * Определяет цвет на основе оценки
 */
function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return pdfColors.success;
  if (score >= 60) return pdfColors.warning;
  return pdfColors.danger;
}

/**
 * Определяет цвет на основе статуса
 */
function getStatusColor(status: 'good' | 'warning' | 'error'): [number, number, number] {
  switch (status) {
    case 'good': return pdfColors.success;
    case 'warning': return pdfColors.warning;
    case 'error': return pdfColors.danger;
    default: return pdfColors.gray;
  }
}

/**
 * Рисует иконку категории
 */
function drawCategoryIcon(
  doc: jsPDF,
  icon: CategoryScore['icon'],
  x: number,
  y: number,
  size: number,
  color: [number, number, number]
): void {
  switch (icon) {
    case 'seo':
      drawSeoIcon(doc, x, y, size, color);
      break;
    case 'performance':
      drawPerformanceIcon(doc, x, y, size, color);
      break;
    case 'content':
      drawContentIcon(doc, x, y, size, color);
      break;
    case 'technical':
      drawTechnicalIcon(doc, x, y, size, color);
      break;
    case 'mobile':
      drawMobileIcon(doc, x, y, size, color);
      break;
  }
}

/**
 * Создает стандартный набор категорий из AuditData
 */
export function createCategoryScoresFromAudit(auditData: any): CategoryScore[] {
  return [
    {
      name: 'SEO Оптимизация',
      score: auditData.details.seo?.score || 0,
      icon: 'seo',
      description: 'Анализ мета-тегов, заголовков, структуры URL и внутренних ссылок',
      metrics: [
        { label: 'Meta теги', value: 'Проверено', status: 'good' },
        { label: 'Заголовки H1-H6', value: 'Проверено', status: 'good' },
        { label: 'Найдено проблем', value: auditData.details.seo?.issues || 0, status: (auditData.details.seo?.issues || 0) > 0 ? 'warning' : 'good' }
      ]
    },
    {
      name: 'Производительность',
      score: auditData.details.performance?.score || 0,
      icon: 'performance',
      description: 'Скорость загрузки, оптимизация ресурсов, кеширование',
      metrics: [
        { label: 'Время загрузки', value: `${auditData.details.performance?.loadTime || 'N/A'}`, status: 'good' },
        { label: 'Размер страницы', value: `${auditData.details.performance?.pageSize || 'N/A'}`, status: 'good' }
      ]
    },
    {
      name: 'Качество контента',
      score: auditData.details.content?.score || 0,
      icon: 'content',
      description: 'Уникальность, структура, читаемость и релевантность контента',
      metrics: [
        { label: 'Уникальность', value: 'Высокая', status: 'good' },
        { label: 'Читаемость', value: 'Хорошая', status: 'good' }
      ]
    },
    {
      name: 'Технические аспекты',
      score: auditData.details.technical?.score || 0,
      icon: 'technical',
      description: 'HTTPS, статус-коды, редиректы, индексируемость',
      metrics: [
        { label: 'HTTPS', value: 'Активен', status: 'good' },
        { label: 'Статус-коды', value: 'Проверено', status: 'good' },
        { label: 'Битые ссылки', value: auditData.details.technical?.brokenLinks || 0, status: (auditData.details.technical?.brokenLinks || 0) > 0 ? 'error' : 'good' }
      ]
    },
    {
      name: 'Мобильная оптимизация',
      score: auditData.details.usability?.score || 0,
      icon: 'mobile',
      description: 'Адаптивность, viewport, размер элементов для мобильных устройств',
      metrics: [
        { label: 'Viewport', value: 'Настроен', status: 'good' },
        { label: 'Адаптивность', value: 'Да', status: 'good' }
      ]
    }
  ];
}
