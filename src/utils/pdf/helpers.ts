
import jsPDF from 'jspdf';

// Добавляет нумерацию страниц в PDF
export const addPaginationFooters = (doc: jsPDF, bottomMargin = 10): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Проходим по всем страницам
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${pageCount}`, 105, 297 - bottomMargin, { align: 'center' });
  }
};

// Получает цветовой код статуса на основе оценки
export const getCategoryStatus = (score: number): string => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'good';
  if (score >= 50) return 'warning';
  return 'error';
};

// Форматирует дату для отображения
export const formatDateString = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Возвращает цвет для оценки
export const getScoreColor = (score: number): [number, number, number] => {
  if (score >= 90) return [74, 222, 128]; // зеленый
  if (score >= 70) return [134, 239, 172]; // светло-зеленый
  if (score >= 50) return [250, 204, 21];  // желтый
  if (score >= 30) return [251, 146, 60];  // оранжевый
  return [239, 68, 68]; // красный
};
