
import jsPDF from 'jspdf';

/**
 * Добавляет обложку к PDF документу
 * @param doc PDF документ
 * @param title Заголовок отчета
 * @param subtitle Подзаголовок отчета
 * @param date Дата создания отчета
 * @param image Опциональное изображение для обложки (base64)
 */
export function addCoverPage(
  doc: jsPDF,
  title: string,
  subtitle: string,
  date: string,
  image?: string
): void {
  // Устанавливаем фон обложки
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Добавляем декоративный элемент вверху страницы
  doc.setFillColor(41, 98, 255);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Создаем градиентную полосу
  for (let i = 0; i < 20; i++) {
    const alpha = 1 - (i / 20);
    doc.setFillColor(41, 98, 255, alpha);
    doc.rect(0, 40 + i, 210, 1, 'F');
  }
  
  // Добавляем заголовок
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 105, 25, { align: 'center' });
  
  // Добавляем центральный блок
  const centerY = 130;
  
  // Если есть изображение, добавляем его
  if (image) {
    try {
      doc.addImage(image, 'PNG', 65, 70, 80, 80);
    } catch (error) {
      console.error('Error adding image to cover page:', error);
    }
  } else {
    // Если изображения нет, рисуем стилизованную иконку
    doc.setFillColor(41, 98, 255, 0.1);
    doc.setDrawColor(41, 98, 255);
    doc.setLineWidth(1);
    doc.circle(105, 100, 30, 'FD');
    
    // Рисуем упрощенный график внутри круга
    doc.setLineWidth(1.5);
    doc.setDrawColor(41, 98, 255);
    doc.line(90, 105, 98, 95);
    doc.line(98, 95, 105, 100);
    doc.line(105, 100, 115, 90);
    doc.line(115, 90, 120, 105);
  }
  
  // Добавляем подзаголовок
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 105, centerY, { align: 'center' });
  
  // Добавляем дату
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Дата создания: ${formattedDate}`, 105, centerY + 15, { align: 'center' });
  
  // Добавляем нижний декоративный элемент
  doc.setFillColor(41, 98, 255, 0.7);
  doc.rect(0, 277, 210, 20, 'F');
  
  // Добавляем информацию о создателе отчета
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Создано с помощью SEO Market', 105, 287, { align: 'center' });
  doc.text('© ' + new Date().getFullYear(), 105, 292, { align: 'center' });
}
