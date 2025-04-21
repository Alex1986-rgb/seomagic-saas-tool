
import jsPDF from 'jspdf';

/**
 * Генерирует круговую диаграмму в PDF документе
 * @param doc PDF документ
 * @param data Данные для диаграммы в формате {метка: значение}
 * @param centerX Центр диаграммы по оси X
 * @param centerY Центр диаграммы по оси Y
 * @param radius Радиус диаграммы
 */
export function generatePieChart(
  doc: jsPDF,
  data: Record<string, number>, 
  centerX: number, 
  centerY: number, 
  radius: number
): void {
  // Проверяем наличие данных
  const labels = Object.keys(data);
  if (labels.length === 0) return;
  
  // Рассчитываем общую сумму
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  if (total === 0) return;
  
  // Определяем цвета для секторов
  const colors = [
    [41, 98, 255],   // Синий
    [0, 200, 83],    // Зеленый
    [255, 61, 0],    // Красный
    [255, 187, 0],   // Желтый
    [131, 56, 236],  // Фиолетовый
    [0, 176, 255],   // Голубой
    [255, 109, 0],   // Оранжевый
    [0, 150, 136],   // Бирюзовый
  ];
  
  // Начальный угол (в радианах)
  let startAngle = 0;
  
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
    
    // Начинаем путь
    doc.moveTo(centerX, centerY);
    
    // Рисуем дугу
    const endAngle = startAngle + angle;
    const segments = Math.max(5, Math.ceil(angle * 20)); // Больше сегментов для более гладкой дуги
    
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
    
    // Закрываем путь и заливаем цветом
    doc.lineTo(centerX, centerY);
    doc.fill();
    
    // Обновляем начальный угол для следующего сектора
    startAngle = endAngle;
  });
  
  // Добавляем легенду
  doc.setFontSize(10);
  let legendY = centerY + radius + 20;
  
  // Определяем количество колонок в легенде
  const columns = labels.length > 4 ? 2 : 1;
  const itemsPerColumn = Math.ceil(labels.length / columns);
  
  labels.forEach((label, index) => {
    const columnIndex = Math.floor(index / itemsPerColumn);
    const rowIndex = index % itemsPerColumn;
    
    // Рассчитываем координаты элемента легенды
    const legendX = centerX - radius + (columnIndex * 80);
    const itemY = legendY + (rowIndex * 12);
    
    // Отрисовываем цветной квадрат
    const colorIndex = index % colors.length;
    doc.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
    doc.rect(legendX, itemY - 4, 5, 5, 'F');
    
    // Отрисовываем текст легенды
    const value = data[label];
    const percentage = Math.round((value / total) * 100);
    doc.setTextColor(60, 60, 60);
    doc.text(`${label} (${percentage}%)`, legendX + 8, itemY);
  });
}

/**
 * Генерирует гистограмму в PDF документе
 * @param doc PDF документ
 * @param data Данные для гистограммы в формате {метка: значение}
 * @param x Координата X начала гистограммы
 * @param y Координата Y начала гистограммы
 * @param width Ширина гистограммы
 * @param height Высота гистограммы
 */
export function generateBarChart(
  doc: jsPDF,
  data: Record<string, number>,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Проверяем наличие данных
  const labels = Object.keys(data);
  if (labels.length === 0) return;
  
  // Находим максимальное значение для масштабирования
  const maxValue = Math.max(...Object.values(data));
  if (maxValue === 0) return;
  
  // Рассчитываем ширину столбца и промежутка
  const barWidth = width / (labels.length * 2);
  
  // Отрисовываем оси
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(x, y, x, y - height);
  doc.line(x, y, x + width, y);
  
  // Отрисовываем столбцы
  labels.forEach((label, index) => {
    const value = data[label];
    const barHeight = (value / maxValue) * height;
    const barX = x + (index * barWidth * 2) + barWidth / 2;
    
    // Устанавливаем цвет столбца
    doc.setFillColor(41, 98, 255);
    
    // Рисуем столбец
    doc.rect(barX, y - barHeight, barWidth, barHeight, 'F');
    
    // Добавляем подпись оси X
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    
    // Сокращаем длинные метки
    let displayLabel = label;
    if (displayLabel.length > 10) {
      displayLabel = displayLabel.substring(0, 8) + '..';
    }
    
    doc.text(displayLabel, barX, y + 8, { align: 'center' });
    
    // Добавляем значение над столбцом
    doc.setFontSize(7);
    doc.text(value.toString(), barX + barWidth / 2, y - barHeight - 2, { align: 'center' });
  });
}
