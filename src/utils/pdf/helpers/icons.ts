import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';

/**
 * Набор векторных иконок для PDF отчетов
 */

/**
 * Рисует иконку галочки (успех)
 */
export function drawCheckIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.success
): void {
  doc.setDrawColor(...color);
  doc.setLineWidth(size / 8);
  
  // Галочка
  doc.line(x, y + size / 2, x + size / 3, y + size * 0.75);
  doc.line(x + size / 3, y + size * 0.75, x + size, y + size / 4);
}

/**
 * Рисует иконку крестика (ошибка)
 */
export function drawErrorIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.danger
): void {
  doc.setDrawColor(...color);
  doc.setLineWidth(size / 8);
  
  // Крестик
  doc.line(x, y, x + size, y + size);
  doc.line(x + size, y, x, y + size);
}

/**
 * Рисует иконку предупреждения (треугольник с восклицательным знаком)
 */
export function drawWarningIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.warning
): void {
  const centerX = x + size / 2;
  
  // Треугольник
  doc.setFillColor(...color);
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  
  // Рисуем треугольник
  doc.triangle(centerX, y, x, y + size, x + size, y + size, 'FD');
  
  // Восклицательный знак (белым)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  
  // Линия восклицательного знака
  doc.setLineWidth(size / 10);
  doc.line(centerX, y + size * 0.3, centerX, y + size * 0.65);
  
  // Точка восклицательного знака
  doc.circle(centerX, y + size * 0.78, size / 15, 'F');
}

/**
 * Рисует иконку информации (круг с буквой i)
 */
export function drawInfoIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.info
): void {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  
  // Круг
  doc.setFillColor(...color);
  doc.circle(centerX, centerY, size / 2, 'F');
  
  // Буква "i" (белым)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  
  // Точка над i
  doc.circle(centerX, centerY - size * 0.2, size / 12, 'F');
  
  // Линия i
  doc.setLineWidth(size / 10);
  doc.line(centerX, centerY, centerX, centerY + size * 0.3);
}

/**
 * Рисует иконку лампочки (рекомендация)
 */
export function drawLightbulbIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.warning
): void {
  const centerX = x + size / 2;
  
  // Верхняя часть (круг лампочки)
  doc.setFillColor(...color);
  doc.circle(centerX, y + size * 0.35, size * 0.35, 'F');
  
  // Цоколь
  doc.setFillColor(color[0] * 0.7, color[1] * 0.7, color[2] * 0.7);
  doc.rect(centerX - size * 0.15, y + size * 0.6, size * 0.3, size * 0.25, 'F');
  
  // Нижняя часть (контакт)
  doc.rect(centerX - size * 0.1, y + size * 0.85, size * 0.2, size * 0.1, 'F');
}

/**
 * Рисует иконку SEO (лупа)
 */
export function drawSeoIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.primary
): void {
  const centerX = x + size * 0.4;
  const centerY = y + size * 0.4;
  
  // Круг лупы
  doc.setDrawColor(...color);
  doc.setLineWidth(size / 12);
  doc.circle(centerX, centerY, size * 0.3, 'S');
  
  // Ручка лупы
  doc.setLineWidth(size / 10);
  doc.line(
    centerX + size * 0.2,
    centerY + size * 0.2,
    x + size * 0.9,
    y + size * 0.9
  );
}

/**
 * Рисует иконку производительности (молния)
 */
export function drawPerformanceIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.warning
): void {
  doc.setFillColor(...color);
  
  // Молния (полигон)
  doc.setDrawColor(...color);
  doc.setLineWidth(0.1);
  
  const points: [number, number][] = [
    [x + size * 0.5, y],
    [x + size * 0.2, y + size * 0.45],
    [x + size * 0.5, y + size * 0.45],
    [x + size * 0.3, y + size],
    [x + size * 0.7, y + size * 0.55],
    [x + size * 0.4, y + size * 0.55],
  ];
  
  doc.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([px, py]) => doc.lineTo(px, py));
  doc.lineTo(points[0][0], points[0][1]);
  doc.fill();
}

/**
 * Рисует иконку контента (документ)
 */
export function drawContentIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.info
): void {
  // Прямоугольник документа
  doc.setDrawColor(...color);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(size / 15);
  doc.roundedRect(x + size * 0.15, y, size * 0.7, size, size * 0.1, size * 0.1, 'FD');
  
  // Линии текста
  doc.setDrawColor(...color);
  doc.setLineWidth(size / 20);
  const lineY1 = y + size * 0.25;
  const lineY2 = y + size * 0.45;
  const lineY3 = y + size * 0.65;
  
  doc.line(x + size * 0.25, lineY1, x + size * 0.75, lineY1);
  doc.line(x + size * 0.25, lineY2, x + size * 0.75, lineY2);
  doc.line(x + size * 0.25, lineY3, x + size * 0.6, lineY3);
}

/**
 * Рисует иконку технических аспектов (шестеренка)
 */
export function drawTechnicalIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.secondary
): void {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const innerRadius = size * 0.2;
  const outerRadius = size * 0.45;
  
  // Зубья шестеренки
  doc.setFillColor(...color);
  doc.setDrawColor(...color);
  
  const teeth = 8;
  for (let i = 0; i < teeth; i++) {
    const angle = (i * 2 * Math.PI) / teeth;
    const nextAngle = ((i + 0.4) * 2 * Math.PI) / teeth;
    
    const x1 = centerX + innerRadius * Math.cos(angle);
    const y1 = centerY + innerRadius * Math.sin(angle);
    const x2 = centerX + outerRadius * Math.cos(angle);
    const y2 = centerY + outerRadius * Math.sin(angle);
    const x3 = centerX + outerRadius * Math.cos(nextAngle);
    const y3 = centerY + outerRadius * Math.sin(nextAngle);
    const x4 = centerX + innerRadius * Math.cos(nextAngle);
    const y4 = centerY + innerRadius * Math.sin(nextAngle);
    
    doc.moveTo(x1, y1);
    doc.lineTo(x2, y2);
    doc.lineTo(x3, y3);
    doc.lineTo(x4, y4);
    doc.lineTo(x1, y1);
    doc.fill();
  }
  
  // Центральный круг
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, centerY, innerRadius * 0.7, 'F');
}

/**
 * Рисует иконку мобильного устройства
 */
export function drawMobileIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  color: [number, number, number] = pdfColors.primary
): void {
  // Корпус телефона
  doc.setDrawColor(...color);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(size / 15);
  doc.roundedRect(x + size * 0.25, y, size * 0.5, size, size * 0.08, size * 0.08, 'FD');
  
  // Экран
  doc.setFillColor(color[0], color[1], color[2], 0.2);
  doc.rect(x + size * 0.3, y + size * 0.15, size * 0.4, size * 0.6, 'F');
  
  // Кнопка home
  doc.setFillColor(...color);
  doc.circle(x + size * 0.5, y + size * 0.85, size * 0.06, 'F');
}

/**
 * Рисует иконку приоритета (стрелка вверх)
 */
export function drawPriorityIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number = 5,
  priority: 'high' | 'medium' | 'low' = 'high'
): void {
  const colors = {
    high: pdfColors.danger,
    medium: pdfColors.warning,
    low: pdfColors.info
  };
  
  const color = colors[priority];
  doc.setFillColor(...color);
  doc.setDrawColor(...color);
  
  const centerX = x + size / 2;
  
  // Стрелка
  if (priority === 'high') {
    // Двойная стрелка вверх
    doc.triangle(centerX, y, x, y + size * 0.4, x + size, y + size * 0.4, 'F');
    doc.triangle(centerX, y + size * 0.3, x, y + size * 0.7, x + size, y + size * 0.7, 'F');
  } else if (priority === 'medium') {
    // Одна стрелка вправо
    doc.triangle(x + size, centerX, x, y, x, y + size, 'F');
  } else {
    // Стрелка вниз
    doc.triangle(centerX, y + size, x, y + size * 0.6, x + size, y + size * 0.6, 'F');
  }
}

/**
 * Вспомогательная функция для рисования треугольника
 */
declare module 'jspdf' {
  interface jsPDF {
    triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style?: string): void;
  }
}

// Расширяем jsPDF для поддержки треугольников
if (typeof jsPDF !== 'undefined') {
  (jsPDF.API as any).triangle = function(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    style?: string
  ) {
    this.lines([[x2 - x1, y2 - y1], [x3 - x2, y3 - y2], [x1 - x3, y1 - y3]], x1, y1, [1, 1], style);
    return this;
  };
}
