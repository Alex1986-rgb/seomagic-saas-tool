
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addCoverPage } from './helpers/coverPage';
import { addPaginationFooters, addCopyright } from './helpers/pagination';
import { pdfColors, pdfFonts } from './styles';

export interface ProxyReportData {
  proxies: Array<{
    ip: string;
    port: number;
    type?: string;
    country?: string;
    speed?: number;
    uptime?: number;
    lastChecked?: string;
    status: 'active' | 'inactive';
  }>;
  stats: {
    total: number;
    active: number;
    inactive: number;
    averageSpeed?: number;
    averageUptime?: number;
  };
  date: string;
}

/**
 * Генерирует PDF отчет с информацией о прокси серверах
 */
export const generateProxyReportPdf = async (data: ProxyReportData): Promise<Blob> => {
  // Создаем новый документ PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Устанавливаем свойства документа
  doc.setProperties({
    title: 'Отчет о прокси серверах',
    subject: 'Информация о прокси серверах',
    author: 'SEO Market',
    creator: 'SEO Market Tool',
    keywords: 'proxies, report, seo'
  });
  
  // Добавляем обложку
  addCoverPage(
    doc, 
    'Отчет о прокси серверах', 
    `Всего прокси: ${data.stats.total} | Активных: ${data.stats.active}`, 
    data.date
  );
  
  // Добавляем статистику
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Статистика прокси серверов', 105, 20, { align: 'center' });
  
  // Добавляем данные о дате генерации
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Дата генерации отчета: ${new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 105, 30, { align: 'center' });
  
  // Добавляем таблицу со статистикой
  const statsData = [
    ['Метрика', 'Значение'],
    ['Всего прокси', data.stats.total.toString()],
    ['Активных прокси', data.stats.active.toString()],
    ['Неактивных прокси', data.stats.inactive.toString()],
    ['Процент активности', `${Math.round((data.stats.active / data.stats.total) * 100)}%`],
  ];
  
  // Добавляем среднюю скорость и аптайм если они есть
  if (data.stats.averageSpeed !== undefined) {
    statsData.push(['Средняя скорость', `${data.stats.averageSpeed.toFixed(2)} мс`]);
  }
  
  if (data.stats.averageUptime !== undefined) {
    statsData.push(['Средний аптайм', `${data.stats.averageUptime.toFixed(2)}%`]);
  }
  
  autoTable(doc, {
    startY: 40,
    head: [statsData[0]],
    body: statsData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 70 },
    }
  });
  
  // Добавляем визуализацию активных/неактивных
  const yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  // Рисуем круговую диаграмму
  const centerX = 105;
  const centerY = yPosition + 40;
  const radius = 30;
  
  // Вычисляем угол для активных прокси
  const activeAngle = (data.stats.active / data.stats.total) * 360;
  
  // Рисуем неактивную часть (полный круг)
  doc.setFillColor(...pdfColors.danger);
  doc.circle(centerX, centerY, radius, 'F');
  
  // Рисуем активную часть (сектор)
  if (data.stats.active > 0) {
    doc.setFillColor(...pdfColors.success);
    
    // Рисуем сектор для активных прокси
    const startAngle = 0;
    const endAngle = (activeAngle * Math.PI) / 180;
    
    doc.setLineWidth(0.1);
    doc.setDrawColor(...pdfColors.success);
    
    // Начинаем путь
    doc.setFillColor(...pdfColors.success);
    doc.circle(centerX, centerY, radius, 'F');
    
    // Если есть неактивные прокси, рисуем их сектор
    if (data.stats.inactive > 0) {
      doc.setFillColor(...pdfColors.danger);
      
      // Используем дугу для сектора
      doc.ellipse(centerX, centerY, radius, radius, 'F');
      
      // Заливка сектора
      doc.setFillColor(...pdfColors.danger);
      doc.ellipse(centerX, centerY, radius, radius, 'F');
    }
  }
  
  // Добавляем легенду
  doc.setFontSize(10);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  
  // Легенда для активных прокси
  doc.setFillColor(...pdfColors.success);
  doc.rect(centerX - 60, centerY + 50, 10, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.text(`Активные (${data.stats.active})`, centerX - 45, centerY + 57);
  
  // Легенда для неактивных прокси
  doc.setFillColor(...pdfColors.danger);
  doc.rect(centerX + 20, centerY + 50, 10, 10, 'F');
  doc.text(`Неактивные (${data.stats.inactive})`, centerX + 35, centerY + 57);
  
  // Добавляем список прокси
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Список прокси серверов', 105, 20, { align: 'center' });
  
  // Сортируем прокси по статусу (сначала активные)
  const sortedProxies = [...data.proxies].sort((a, b) => {
    if (a.status === 'active' && b.status === 'inactive') return -1;
    if (a.status === 'inactive' && b.status === 'active') return 1;
    return 0;
  });
  
  // Формируем таблицу с прокси
  const proxyRows = sortedProxies.map(proxy => {
    const row = [
      `${proxy.ip}:${proxy.port}`,
      proxy.type || 'HTTP',
      proxy.country || 'Неизвестно',
      proxy.status === 'active' ? 'Активен' : 'Неактивен',
      proxy.lastChecked || 'Н/Д'
    ];
    
    if (proxy.speed !== undefined) {
      row.push(`${proxy.speed} мс`);
    } else {
      row.push('Н/Д');
    }
    
    return row;
  });
  
  const columns = ['Прокси', 'Тип', 'Страна', 'Статус', 'Посл. проверка', 'Скорость'];
  
  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: proxyRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'ellipsize',
    },
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 40 },
      5: { cellWidth: 25 },
    },
    didDrawPage: (data) => {
      // Добавляем заголовок для каждой новой страницы таблицы
      if (data.pageNumber > 1 && data.pageNumber > 2) {
        doc.setFontSize(14);
        doc.setFont(pdfFonts.primary, pdfFonts.bold);
        doc.setTextColor(...pdfColors.primary);
        doc.text('Список прокси серверов (продолжение)', 105, 15, { align: 'center' });
      }
    },
    bodyStyles: {
      lineColor: [220, 220, 220]
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  // Добавляем информацию об использовании прокси
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.primary);
  doc.text('Рекомендации по использованию прокси', 105, 20, { align: 'center' });
  
  const recommendations = [
    {
      title: 'Оптимальное использование прокси',
      content: 'Для достижения наилучших результатов рекомендуется использовать прокси с высокой скоростью и стабильным аптаймом. Регулярно проверяйте статус прокси и удаляйте неработающие.'
    },
    {
      title: 'Ротация прокси',
      content: 'Используйте ротацию прокси для избежания блокировок со стороны веб-сервисов. Не используйте один и тот же прокси для большого количества запросов подряд.'
    },
    {
      title: 'Географическое распределение',
      content: 'Для более эффективного сканирования используйте прокси из разных географических регионов. Это позволит собирать более точные данные о видимости сайта в разных странах.'
    }
  ];
  
  let y = 40;
  recommendations.forEach(rec => {
    doc.setFontSize(12);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(20, 20, 20);
    doc.text(rec.title, 20, y);
    
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(60, 60, 60);
    
    const splitText = doc.splitTextToSize(rec.content, 170);
    doc.text(splitText, 20, y);
    
    y += splitText.length * 6 + 10;
  });
  
  // Добавляем нумерацию страниц
  addPaginationFooters(doc);
  
  // Добавляем копирайт
  addCopyright(doc, 'SEO Market');
  
  // Возвращаем документ в виде Blob
  return doc.output('blob');
};
