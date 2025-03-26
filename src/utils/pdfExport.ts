
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { AuditData, AuditHistoryItem, AuditItemData } from '@/types/audit';

// Функция для генерации PDF из данных аудита
export const generateAuditPDF = async (auditData: AuditData, url: string): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  
  // Добавляем заголовок с логотипом и названием
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  pdf.text('SEO Аудит', pageWidth / 2, 15, { align: 'center' });
  
  // Добавляем URL и дату
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`URL: ${url}`, margin, 40);
  pdf.text(`Дата: ${new Date(auditData.date).toLocaleDateString('ru-RU')}`, margin, 47);
  pdf.text(`ID аудита: ${auditData.id}`, margin, 54);
  
  // Добавляем общий рейтинг
  pdf.setFillColor(230, 240, 255);
  pdf.rect(margin, 60, pageWidth - margin * 2, 25, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Общий рейтинг', pageWidth / 2, 70, { align: 'center' });
  pdf.setFontSize(20);
  
  const scoreColor = auditData.score >= 80 ? [46, 204, 113] : 
                    auditData.score >= 60 ? [241, 196, 15] : 
                    [231, 76, 60];
  pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.text(`${auditData.score}/100`, pageWidth / 2, 80, { align: 'center' });
  
  // Добавляем сводку проблем
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Обзор проблем', margin, 95);
  
  const issuesData = [
    ['Критические ошибки', `${auditData.issues.critical}`, auditData.issues.critical > 0 ? 'Высокий' : 'Низкий'],
    ['Важные улучшения', `${auditData.issues.important}`, auditData.issues.important > 0 ? 'Средний' : 'Низкий'],
    ['Возможности', `${auditData.issues.opportunities}`, 'Низкий']
  ];
  
  autoTable(pdf, {
    startY: 100,
    head: [['Тип проблемы', 'Количество', 'Приоритет']],
    body: issuesData,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 40, halign: 'center' }
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: margin, right: margin }
  });
  
  // Добавляем оценки категорий
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Результаты по категориям', margin, 145);
  
  const categoryData = [
    ['SEO', `${auditData.details.seo.score}/100`, getCategoryStatus(auditData.details.seo.score)],
    ['Производительность', `${auditData.details.performance.score}/100`, getCategoryStatus(auditData.details.performance.score)],
    ['Контент', `${auditData.details.content.score}/100`, getCategoryStatus(auditData.details.content.score)],
    ['Технические аспекты', `${auditData.details.technical.score}/100`, getCategoryStatus(auditData.details.technical.score)]
  ];
  
  autoTable(pdf, {
    startY: 150,
    head: [['Категория', 'Оценка', 'Статус']],
    body: categoryData,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 40, halign: 'center' }
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: margin, right: margin }
  });
  
  // Начинаем новую страницу для детального анализа
  pdf.addPage();
  
  // Добавляем детальный анализ для каждой категории
  let yPos = 20;
  
  // SEO Детали
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SEO анализ', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.seo.items, yPos, margin);
  yPos += (auditData.details.seo.items.length * 12) + 20;
  
  // Проверяем, нужна ли новая страница
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Детали производительности
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Анализ производительности', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.performance.items, yPos, margin);
  yPos += (auditData.details.performance.items.length * 12) + 20;
  
  // Проверяем, нужна ли новая страница
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Детали контента
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Анализ контента', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.content.items, yPos, margin);
  yPos += (auditData.details.content.items.length * 12) + 20;
  
  // Проверяем, нужна ли новая страница
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Технические детали
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Технический анализ', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.technical.items, yPos, margin);
  
  // Добавляем колонтитулы с датой и номерами страниц
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Страница ${i} из ${totalPages}`, pageWidth - margin, pageHeight - 10);
    pdf.text(`Отчет создан: ${new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, pageHeight - 10);
  }
  
  // Сохраняем PDF
  pdf.save(`SEO_Аудит_${url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};

// Вспомогательные функции
function getCategoryStatus(score: number): string {
  if (score >= 80) return 'Отлично';
  if (score >= 60) return 'Хорошо';
  if (score >= 40) return 'Удовлетворительно';
  return 'Требует улучшения';
}

function addCategoryDetails(pdf: jsPDF, items: AuditItemData[], startY: number, margin: number): void {
  const itemsData = items.map(item => {
    const statusSymbol = item.status === 'good' ? '✓' : item.status === 'warning' ? '⚠' : '✗';
    const statusText = item.status === 'good' ? 'Хорошо' : item.status === 'warning' ? 'Внимание' : 'Ошибка';
    return [statusSymbol, item.title, item.value || '-', statusText];
  });
  
  autoTable(pdf, {
    startY: startY,
    head: [['', 'Проверка', 'Значение', 'Статус']],
    body: itemsData,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 100 },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' }
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: margin, right: margin }
  });
}

// Функция для генерации снимка графика как изображения
export const generateHistoryChartImage = async (chartContainer: HTMLElement): Promise<string> => {
  const canvas = await html2canvas(chartContainer, {
    scale: 2,
    backgroundColor: null,
    logging: false
  });
  return canvas.toDataURL('image/png');
};

// Функция для генерации PDF с данными истории
export const generateHistoryPDF = async (historyItems: AuditHistoryItem[], url: string, chartContainer?: HTMLElement): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  
  // Добавляем заголовок с логотипом и названием
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  pdf.text('История SEO аудитов', pageWidth / 2, 15, { align: 'center' });
  
  // Добавляем URL
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`URL: ${url}`, margin, 40);
  pdf.text(`Всего аудитов: ${historyItems.length}`, margin, 47);
  pdf.text(`Отчет создан: ${new Date().toLocaleDateString('ru-RU')}`, margin, 54);
  
  // Добавляем изображение графика, если доступно
  let yPos = 65;
  if (chartContainer) {
    try {
      const chartImage = await generateHistoryChartImage(chartContainer);
      pdf.addImage(chartImage, 'PNG', margin, yPos, pageWidth - margin * 2, 60);
      yPos += 70;
    } catch (error) {
      console.error('Ошибка генерации изображения графика:', error);
      yPos += 10;
    }
  }
  
  // Добавляем таблицу данных истории
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('История изменений', margin, yPos);
  yPos += 5;
  
  const sortedItems = [...historyItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const historyData = sortedItems.map((item, index, arr) => {
    const prevItem = index < arr.length - 1 ? arr[index + 1] : null;
    const diff = prevItem ? item.score - prevItem.score : 0;
    const diffText = diff !== 0 ? (diff > 0 ? `+${diff}` : diff.toString()) : '0';
    
    return [
      new Date(item.date).toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      }),
      `${item.score}/100`,
      diffText,
      `${item.issues.critical}`,
      `${item.issues.important}`,
      `${item.issues.opportunities}`
    ];
  });
  
  autoTable(pdf, {
    startY: yPos,
    head: [['Дата', 'Оценка', 'Изменение', 'Критич.', 'Важные', 'Возмож.']],
    body: historyData,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: margin, right: margin }
  });
  
  // Добавляем колонтитулы с номерами страниц
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Страница ${i} из ${totalPages}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10);
  }
  
  // Сохраняем PDF
  pdf.save(`SEO_История_${url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};
