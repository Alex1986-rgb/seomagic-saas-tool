
import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';

/**
 * Генерирует круговую диаграмму в PDF документе
 * @param doc PDF документ
 * @param data Данные для диаграммы в формате {метка: значение}
 * @param centerX Центр диаграммы по оси X
 * @param centerY Центр диаграммы по оси Y
 * @param radius Радиус диаграммы
 * @param options Дополнительные настройки
 */
export function generatePieChart(
  doc: jsPDF,
  data: Record<string, number>, 
  centerX: number, 
  centerY: number, 
  radius: number,
  options: {
    title?: string;
    showLegend?: boolean;
    showValues?: boolean;
    showPercentages?: boolean;
    colors?: Array<[number, number, number]>;
    legendPosition?: 'bottom' | 'right';
  } = {}
): void {
  // Проверяем наличие данных
  const labels = Object.keys(data);
  if (labels.length === 0) return;
  
  // Рассчитываем общую сумму
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  if (total === 0) return;
  
  // Применяем настройки по умолчанию
  const {
    title,
    showLegend = true,
    showValues = true,
    showPercentages = true,
    colors = [
      pdfColors.primary,
      pdfColors.info,
      pdfColors.success,
      pdfColors.warning,
      pdfColors.danger,
      pdfColors.tertiary,
      pdfColors.secondary,
      [131, 56, 236], // Фиолетовый
    ],
    legendPosition = 'bottom'
  } = options;
  
  // Если есть заголовок, отрисовываем его
  if (title) {
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
    doc.text(title, centerX, centerY - radius - 15, { align: 'center' });
  }
  
  // Начальный угол (в радианах)
  let startAngle = -0.5 * Math.PI; // Начинаем с верхней точки круга
  
  // Рисуем каждый сектор
  labels.forEach((label, index) => {
    const value = data[label];
    const percentage = value / total;
    const angle = percentage * 2 * Math.PI;
    
    // Устанавливаем цвет для текущего сектора
    const colorIndex = index % colors.length;
    doc.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
    
    // Рисуем сектор
    doc.setLineWidth(0.1);
    doc.setDrawColor(255, 255, 255);
    
    // Рисуем сектор с помощью нескольких линий для более гладкой дуги
    const endAngle = startAngle + angle;
    const segments = Math.ceil(angle * 30); // Больше сегментов для более гладкой дуги
    
    doc.saveGraphicsState();
    doc.moveTo(centerX, centerY);
    
    for (let i = 0; i <= segments; i++) {
      const currentAngle = startAngle + (angle * i / segments);
      const x = centerX + radius * Math.cos(currentAngle);
      const y = centerY + radius * Math.sin(currentAngle);
      
      if (i === 0) {
        doc.lineTo(x, y);
      } else {
        doc.lineTo(x, y);
      }
    }
    
    // Закрываем путь
    doc.lineTo(centerX, centerY);
    doc.fill();
    doc.restoreGraphicsState();
    
    // Если нужно отображать значения на графике
    if (showValues || showPercentages) {
      // Вычисляем угол для размещения текста (в середине сектора)
      const midAngle = startAngle + (angle / 2);
      
      // Размещаем текст на расстоянии 75% радиуса от центра
      const textRadius = radius * 0.65;
      const textX = centerX + textRadius * Math.cos(midAngle);
      const textY = centerY + textRadius * Math.sin(midAngle);
      
      // Формируем текст (значение и/или процент)
      let text = '';
      if (showValues && showPercentages) {
        text = `${value} (${Math.round(percentage * 100)}%)`;
      } else if (showValues) {
        text = `${value}`;
      } else if (showPercentages) {
        text = `${Math.round(percentage * 100)}%`;
      }
      
      // Отрисовываем текст
      if (text) {
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(text, textX, textY, { align: 'center' });
      }
    }
    
    // Обновляем начальный угол для следующего сектора
    startAngle = endAngle;
  });
  
  // Добавляем легенду, если нужно
  if (showLegend) {
    let legendX: number;
    let legendY: number;
    const itemHeight = 12;
    
    switch (legendPosition) {
      case 'right':
        legendX = centerX + radius + 20;
        legendY = centerY - ((labels.length - 1) * itemHeight) / 2;
        break;
      case 'bottom':
      default:
        legendX = centerX - radius;
        legendY = centerY + radius + 20;
    }
    
    // Отрисовываем элементы легенды
    doc.setFontSize(8);
    
    labels.forEach((label, index) => {
      const colorIndex = index % colors.length;
      const value = data[label];
      const percentage = Math.round((value / total) * 100);
      
      // Отрисовываем цветной квадрат
      doc.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
      doc.rect(legendX, legendY + (index * itemHeight) - 4, 5, 5, 'F');
      
      // Отрисовываем текст легенды
      doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
      doc.text(`${label} - ${value} (${percentage}%)`, legendX + 8, legendY + (index * itemHeight));
    });
  }
}

/**
 * Генерирует гистограмму в PDF документе
 * @param doc PDF документ
 * @param data Данные для гистограммы в формате {метка: значение}
 * @param x Координата X начала гистограммы
 * @param y Координата Y начала гистограммы
 * @param width Ширина гистограммы
 * @param height Высота гистограммы
 * @param options Дополнительные настройки
 */
export function generateBarChart(
  doc: jsPDF,
  data: Record<string, number>,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    title?: string;
    barColor?: [number, number, number];
    gridLines?: boolean;
    showValues?: boolean;
    labelRotation?: number;
    valuePrefix?: string;
    valueSuffix?: string;
  } = {}
): void {
  // Проверяем наличие данных
  const labels = Object.keys(data);
  if (labels.length === 0) return;
  
  // Находим максимальное значение для масштабирования
  const maxValue = Math.max(...Object.values(data));
  if (maxValue === 0) return;
  
  // Применяем настройки по умолчанию
  const {
    title,
    barColor = pdfColors.primary,
    gridLines = true,
    showValues = true,
    labelRotation = 0,
    valuePrefix = '',
    valueSuffix = ''
  } = options;
  
  // Если есть заголовок, отрисовываем его
  if (title) {
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
    doc.text(title, x + width / 2, y - height - 10, { align: 'center' });
  }
  
  // Рассчитываем ширину столбца и промежутка
  const totalItems = labels.length;
  const barWidth = (width * 0.8) / totalItems;
  const spacing = (width * 0.2) / (totalItems + 1);
  
  // Отрисовываем оси
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(x, y, x, y - height); // Y-ось
  doc.line(x, y, x + width, y);  // X-ось
  
  // Отрисовываем горизонтальные линии сетки
  if (gridLines) {
    const gridSteps = 5;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    
    for (let i = 1; i <= gridSteps; i++) {
      const gridY = y - (height * i / gridSteps);
      doc.line(x, gridY, x + width, gridY);
      
      // Отрисовываем значения на оси Y
      const yValue = Math.round(maxValue * i / gridSteps);
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(yValue.toString(), x - 5, gridY, { align: 'right' });
    }
  }
  
  // Отрисовываем столбцы
  labels.forEach((label, index) => {
    const value = data[label];
    const barHeight = (value / maxValue) * height;
    const barX = x + spacing + index * (barWidth + spacing);
    
    // Устанавливаем цвет столбца
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    
    // Рисуем столбец
    doc.rect(barX, y - barHeight, barWidth, barHeight, 'F');
    
    // Добавляем подпись оси X (метка)
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    
    // Сокращаем длинные метки
    let displayLabel = label;
    if (displayLabel.length > 10) {
      displayLabel = displayLabel.substring(0, 8) + '..';
    }
    
    // Применяем поворот, если нужно
    if (labelRotation !== 0) {
      doc.saveGraphicsState();
      doc.translatePoint(barX + barWidth / 2, y + 8);
      doc.rotatePoint(labelRotation * Math.PI / 180);
      doc.text(displayLabel, 0, 0, { align: 'center' });
      doc.restoreGraphicsState();
    } else {
      doc.text(displayLabel, barX + barWidth / 2, y + 8, { align: 'center' });
    }
    
    // Добавляем значение над столбцом
    if (showValues) {
      doc.setFontSize(8);
      doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
      const valueText = `${valuePrefix}${value}${valueSuffix}`;
      doc.text(valueText, barX + barWidth / 2, y - barHeight - 3, { align: 'center' });
    }
  });
}

/**
 * Генерирует линейную диаграмму в PDF документе
 * @param doc PDF документ
 * @param data Массив данных с метками и значениями
 * @param x Координата X начала диаграммы
 * @param y Координата Y начала диаграммы
 * @param width Ширина диаграммы
 * @param height Высота диаграммы
 * @param options Дополнительные настройки
 */
export function generateLineChart(
  doc: jsPDF,
  data: Array<{label: string, value: number}>,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    title?: string;
    lineColor?: [number, number, number];
    fillUnder?: boolean;
    gridLines?: boolean;
    showPoints?: boolean;
    showValues?: boolean;
    labelRotation?: number;
  } = {}
): void {
  // Проверяем наличие данных
  if (data.length === 0) return;
  
  // Находим минимальное и максимальное значение
  const values = data.map(item => item.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue;
  
  // Применяем настройки по умолчанию
  const {
    title,
    lineColor = pdfColors.primary,
    fillUnder = true,
    gridLines = true,
    showPoints = true,
    showValues = true,
    labelRotation = 0
  } = options;
  
  // Если есть заголовок, отрисовываем его
  if (title) {
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
    doc.text(title, x + width / 2, y - height - 10, { align: 'center' });
  }
  
  // Отрисовываем оси
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(x, y, x, y - height); // Y-ось
  doc.line(x, y, x + width, y);  // X-ось
  
  // Отрисовываем горизонтальные линии сетки
  if (gridLines) {
    const gridSteps = 5;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    
    for (let i = 1; i <= gridSteps; i++) {
      const gridY = y - (height * i / gridSteps);
      doc.line(x, gridY, x + width, gridY);
      
      // Отрисовываем значения на оси Y
      const yValue = Math.round(minValue + (valueRange * i / gridSteps));
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(yValue.toString(), x - 5, gridY, { align: 'right' });
    }
  }
  
  // Рассчитываем расстояние между точками данных
  const pointSpacing = width / (data.length - 1);
  
  // Массивы для хранения координат точек
  const points = data.map((item, index) => {
    const pointX = x + (index * pointSpacing);
    const normalizedValue = valueRange ? (item.value - minValue) / valueRange : 0.5;
    const pointY = y - (normalizedValue * height);
    return { x: pointX, y: pointY, value: item.value, label: item.label };
  });
  
  // Если нужно заливать область под линией
  if (fillUnder && points.length > 1) {
    doc.setFillColor(lineColor[0], lineColor[1], lineColor[2], 0.2);
    
    doc.saveGraphicsState();
    doc.moveTo(points[0].x, y);
    doc.lineTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      doc.lineTo(points[i].x, points[i].y);
    }
    
    doc.lineTo(points[points.length - 1].x, y);
    doc.lineTo(points[0].x, y);
    doc.fill();
    doc.restoreGraphicsState();
  }
  
  // Отрисовываем линию
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(1.5);
  
  doc.saveGraphicsState();
  doc.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    doc.lineTo(points[i].x, points[i].y);
  }
  
  doc.stroke();
  doc.restoreGraphicsState();
  
  // Отрисовываем точки
  if (showPoints) {
    points.forEach(point => {
      doc.setFillColor(lineColor[0], lineColor[1], lineColor[2]);
      doc.circle(point.x, point.y, 2, 'F');
      
      // Если нужно показать значения
      if (showValues) {
        doc.setFontSize(8);
        doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
        doc.text(point.value.toString(), point.x, point.y - 5, { align: 'center' });
      }
    });
  }
  
  // Отрисовываем метки оси X
  data.forEach((item, index) => {
    const pointX = x + (index * pointSpacing);
    
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    
    // Сокращаем длинные метки
    let displayLabel = item.label;
    if (displayLabel.length > 10) {
      displayLabel = displayLabel.substring(0, 8) + '..';
    }
    
    // Применяем поворот, если нужно
    if (labelRotation !== 0) {
      doc.saveGraphicsState();
      doc.translatePoint(pointX, y + 8);
      doc.rotatePoint(labelRotation * Math.PI / 180);
      doc.text(displayLabel, 0, 0, { align: 'center' });
      doc.restoreGraphicsState();
    } else {
      doc.text(displayLabel, pointX, y + 8, { align: 'center' });
    }
  });
}

/**
 * Генерирует радарную диаграмму в PDF документе
 * @param doc PDF документ
 * @param data Данные для диаграммы в формате {метка: значение}
 * @param centerX Центр диаграммы по оси X
 * @param centerY Центр диаграммы по оси Y
 * @param radius Радиус диаграммы
 * @param options Дополнительные настройки
 */
export function generateRadarChart(
  doc: jsPDF,
  data: Record<string, number>,
  centerX: number,
  centerY: number,
  radius: number,
  options: {
    title?: string;
    maxValue?: number;
    fillColor?: [number, number, number];
    lineColor?: [number, number, number];
    gridLines?: boolean;
    axisLabels?: boolean;
    showValues?: boolean;
  } = {}
): void {
  // Проверяем наличие данных
  const labels = Object.keys(data);
  if (labels.length < 3) return; // Минимум три измерения
  
  // Применяем настройки по умолчанию
  const {
    title,
    maxValue = Math.max(...Object.values(data)),
    fillColor = [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2], 0.2],
    lineColor = pdfColors.primary,
    gridLines = true,
    axisLabels = true,
    showValues = true
  } = options;
  
  // Если есть заголовок, отрисовываем его
  if (title) {
    doc.setFontSize(12);
    doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
    doc.text(title, centerX, centerY - radius - 10, { align: 'center' });
  }
  
  const numAxes = labels.length;
  const angleStep = (2 * Math.PI) / numAxes;
  
  // Отрисовываем сетку
  if (gridLines) {
    const gridLevels = 5;
    
    for (let level = 1; level <= gridLevels; level++) {
      const gridRadius = radius * (level / gridLevels);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      
      // Рисуем кольцо сетки
      doc.saveGraphicsState();
      doc.moveTo(centerX + gridRadius, centerY);
      
      for (let a = 0; a <= 2 * Math.PI; a += 0.1) {
        const x = centerX + gridRadius * Math.cos(a);
        const y = centerY + gridRadius * Math.sin(a);
        doc.lineTo(x, y);
      }
      
      doc.stroke();
      doc.restoreGraphicsState();
      
      // Рисуем оси
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.1);
        doc.line(centerX, centerY, x, y);
      }
    }
  }
  
  // Вычисляем точки для полигона
  const points = labels.map((label, i) => {
    const value = data[label];
    const adjustedRadius = (value / maxValue) * radius;
    const angle = i * angleStep - Math.PI / 2; // Начинаем с верхней точки
    
    return {
      x: centerX + adjustedRadius * Math.cos(angle),
      y: centerY + adjustedRadius * Math.sin(angle),
      label,
      value
    };
  });
  
  // Рисуем заполненный полигон
  doc.setFillColor(fillColor[0], fillColor[1], fillColor[2], fillColor[3] || 0.2);
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(1.5);
  
  doc.saveGraphicsState();
  doc.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    doc.lineTo(points[i].x, points[i].y);
  }
  
  doc.lineTo(points[0].x, points[0].y);
  doc.fillStroke();
  doc.restoreGraphicsState();
  
  // Отрисовываем точки данных
  points.forEach(point => {
    doc.setFillColor(lineColor[0], lineColor[1], lineColor[2]);
    doc.circle(point.x, point.y, 2, 'F');
    
    // Если нужно показать значения
    if (showValues) {
      doc.setFontSize(8);
      doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
      doc.text(point.value.toString(), point.x, point.y - 3);
    }
  });
  
  // Отрисовываем метки осей
  if (axisLabels) {
    labels.forEach((label, i) => {
      const angle = i * angleStep - Math.PI / 2; // Начинаем с верхней точки
      const labelRadius = radius * 1.1; // Чуть дальше от конца оси
      
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      doc.setFontSize(8);
      doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
      
      // Выравнивание метки в зависимости от положения
      let align: 'center' | 'left' | 'right' = 'center';
      let yOffset = 0;
      
      if (angle < -Math.PI * 0.75 || angle > Math.PI * 0.75) {
        align = 'right';
      } else if (angle > -Math.PI * 0.25 && angle < Math.PI * 0.25) {
        align = 'left';
      } else if (angle >= -Math.PI * 0.75 && angle <= -Math.PI * 0.25) {
        yOffset = -3;
      } else {
        yOffset = 3;
      }
      
      doc.text(label, x, y + yOffset, { align });
    });
  }
}

/**
 * Генерирует градиентную шкалу для визуализации оценок
 * @param doc PDF документ
 * @param score Оценка (0-100)
 * @param x Координата X начала шкалы
 * @param y Координата Y начала шкалы
 * @param width Ширина шкалы
 * @param height Высота шкалы
 */
export function generateScoreGauge(
  doc: jsPDF,
  score: number,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Нормализуем оценку
  const normalizedScore = Math.max(0, Math.min(100, score)) / 100;
  
  // Определяем цвета градиента
  const gradientColors = [
    { pos: 0, color: [239, 68, 68] }, // Красный
    { pos: 0.4, color: [249, 115, 22] }, // Оранжевый
    { pos: 0.7, color: [234, 179, 8] }, // Желтый
    { pos: 1, color: [34, 197, 94] } // Зеленый
  ];
  
  // Рисуем фоновую шкалу (серый фон)
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(x, y, width, height, height / 2, height / 2, 'F');
  
  // Рисуем заполненную часть шкалы
  if (normalizedScore > 0) {
    // Определяем цвет для текущего значения
    let color = gradientColors[0].color;
    
    for (let i = 0; i < gradientColors.length - 1; i++) {
      const curr = gradientColors[i];
      const next = gradientColors[i + 1];
      
      if (normalizedScore >= curr.pos && normalizedScore <= next.pos) {
        const t = (normalizedScore - curr.pos) / (next.pos - curr.pos);
        color = [
          Math.round(curr.color[0] + t * (next.color[0] - curr.color[0])),
          Math.round(curr.color[1] + t * (next.color[1] - curr.color[1])),
          Math.round(curr.color[2] + t * (next.color[2] - curr.color[2]))
        ];
        break;
      }
    }
    
    // Рисуем заполненную часть
    doc.setFillColor(color[0], color[1], color[2]);
    
    // Используем roundedRect только для левого края, если шкала не полная
    if (normalizedScore < 1) {
      doc.roundedRect(x, y, width * normalizedScore, height, height / 2, height / 2, 'F', [1, 0, 1, 0]);
    } else {
      doc.roundedRect(x, y, width, height, height / 2, height / 2, 'F');
    }
  }
  
  // Добавляем процент
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  
  // Если заполненная часть достаточно большая для текста
  if (normalizedScore > 0.2) {
    doc.text(`${score}%`, x + width * normalizedScore * 0.5, y + height * 0.65, {
      align: 'center'
    });
  } else {
    // Иначе размещаем текст справа от шкалы
    doc.setTextColor(60, 60, 60);
    doc.text(`${score}%`, x + width + 5, y + height * 0.65);
  }
}
