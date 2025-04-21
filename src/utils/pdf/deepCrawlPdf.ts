
import jsPDF from 'jspdf';
import { addQRCodeToPage } from './helpers/qrcode';
import { addCoverPage } from './helpers/coverPage';
import { addPaginationFooters } from './helpers';
import { formatTitle, formatSubtitle, formatHeading, formatParagraph } from './styles/formatting';
import { generatePieChart } from './helpers/charts';

export interface DeepCrawlPdfOptions {
  domain: string;
  scanDate: string;
  pagesScanned: number;
  totalPages: number;
  urls: string[];
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
  includeFullDetails?: boolean;
  enhancedStyling?: boolean;
  maxUrlsPerPage?: number;
}

export async function generateDeepCrawlPdf(options: DeepCrawlPdfOptions): Promise<Blob> {
  const {
    domain,
    scanDate,
    pagesScanned,
    totalPages,
    urls,
    pageTypes = {},
    depthData = [],
    brokenLinks = [],
    duplicatePages = [],
    includeFullDetails = true,
    enhancedStyling = true,
    maxUrlsPerPage = 50
  } = options;

  // Создаем PDF документ
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Создаем обложку
  addCoverPage(doc, `Отчет о структуре сайта ${domain}`, 'Результаты глубокого сканирования', scanDate);

  // Добавляем QR-код
  addQRCodeToPage(doc, domain);

  // Добавляем общую информацию
  doc.addPage();
  let yPos = 20;
  formatTitle(doc, 'Общая информация о сайте', yPos);
  yPos += 15;

  // Форматируем строки общей информации
  formatParagraph(doc, `Домен: ${domain}`, yPos);
  yPos += 10;
  formatParagraph(doc, `Дата сканирования: ${new Date(scanDate).toLocaleDateString('ru-RU')}`, yPos);
  yPos += 10;
  formatParagraph(doc, `Количество страниц: ${pagesScanned.toLocaleString('ru-RU')}`, yPos);
  yPos += 10;
  
  // Если есть данные о типах страниц, добавляем график
  if (Object.keys(pageTypes).length > 0) {
    yPos += 10;
    formatSubtitle(doc, 'Распределение типов страниц', yPos);
    yPos += 15;
    
    // Генерируем и добавляем круговую диаграмму
    generatePieChart(doc, pageTypes, 105, yPos + 40, 70);
    yPos += 100;
  }

  // Добавляем раздел с данными о глубине страниц
  if (depthData.length > 0) {
    yPos += 10;
    formatSubtitle(doc, 'Распределение по глубине', yPos);
    yPos += 15;
    
    // Добавляем таблицу с данными о глубине
    doc.setFontSize(10);
    doc.text('Уровень', 20, yPos);
    doc.text('Количество страниц', 100, yPos);
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    depthData.forEach(item => {
      doc.text(`Уровень ${item.level}`, 20, yPos);
      doc.text(item.count.toString(), 100, yPos);
      yPos += 8;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  }

  // Добавляем раздел с неработающими ссылками
  if (brokenLinks.length > 0) {
    doc.addPage();
    yPos = 20;
    formatTitle(doc, 'Неработающие ссылки', yPos);
    yPos += 15;
    formatParagraph(doc, `Обнаружено ${brokenLinks.length} неработающих ссылок:`, yPos);
    yPos += 10;
    
    brokenLinks.forEach((link, index) => {
      const urlText = typeof link === 'string' ? link : `${link.url} (код: ${link.statusCode})`;
      formatParagraph(doc, `${index + 1}. ${urlText}`, yPos);
      yPos += 8;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  }

  // Добавляем раздел с дублирующимися страницами
  if (duplicatePages.length > 0) {
    doc.addPage();
    yPos = 20;
    formatTitle(doc, 'Дублирующиеся страницы', yPos);
    yPos += 15;
    formatParagraph(doc, `Обнаружено ${duplicatePages.length} групп дублирующихся страниц:`, yPos);
    yPos += 10;
    
    duplicatePages.forEach((group, index) => {
      formatSubtitle(doc, `Группа ${index + 1}`, yPos);
      yPos += 10;
      formatParagraph(doc, `Основная страница: ${group.url}`, yPos);
      yPos += 8;
      formatParagraph(doc, 'Похожие страницы:', yPos);
      yPos += 8;
      
      (group.similarUrls || []).forEach((url, i) => {
        formatParagraph(doc, `- ${url}`, yPos);
        yPos += 6;
        
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      yPos += 10;
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });
  }

  // Если включен полный отчет, добавляем полный список URL
  if (includeFullDetails && urls.length > 0) {
    doc.addPage();
    yPos = 20;
    formatTitle(doc, 'Полный список URL', yPos);
    yPos += 15;
    
    // Разбиваем URLs на страницы для лучшей читаемости
    const totalUrls = urls.length;
    let currentPage = 1;
    const totalPages = Math.ceil(totalUrls / maxUrlsPerPage);
    
    formatParagraph(doc, `Всего URL: ${totalUrls.toLocaleString('ru-RU')}`, yPos);
    yPos += 10;
    
    for (let i = 0; i < totalUrls; i++) {
      const pageNumber = Math.floor(i / maxUrlsPerPage) + 1;
      
      // Если начинаем новую страницу в списке
      if (pageNumber > currentPage) {
        doc.addPage();
        yPos = 20;
        formatSubtitle(doc, `Список URL (страница ${pageNumber} из ${totalPages})`, yPos);
        yPos += 15;
        currentPage = pageNumber;
      }
      
      // Добавляем URL с номером
      doc.setFontSize(8);
      doc.text(`${i+1}. ${urls[i]}`, 20, yPos);
      yPos += 6;
      
      // Если достигли конца страницы
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
        formatSubtitle(doc, `Список URL (продолжение страницы ${pageNumber} из ${totalPages})`, yPos);
        yPos += 15;
      }
    }
  }

  // Добавляем последнюю страницу с выводами
  doc.addPage();
  yPos = 20;
  formatTitle(doc, 'Выводы и рекомендации', yPos);
  yPos += 15;
  
  // Добавляем выводы на основе данных сканирования
  if (pagesScanned > 5000) {
    formatParagraph(doc, '1. У вас крупный сайт с большим количеством страниц. Рекомендуется регулярный аудит структуры.', yPos);
    yPos += 10;
  } else if (pagesScanned > 1000) {
    formatParagraph(doc, '1. У вас сайт среднего размера. Важно поддерживать оптимальную структуру.', yPos);
    yPos += 10;
  } else {
    formatParagraph(doc, '1. У вас сайт небольшого размера. Это упрощает поддержку и оптимизацию структуры.', yPos);
    yPos += 10;
  }
  
  if (brokenLinks.length > 0) {
    formatParagraph(doc, `2. Необходимо исправить ${brokenLinks.length} неработающих ссылок для улучшения SEO и пользовательского опыта.`, yPos);
    yPos += 10;
  } else {
    formatParagraph(doc, '2. Неработающих ссылок не обнаружено - отличный результат!', yPos);
    yPos += 10;
  }
  
  if (duplicatePages.length > 0) {
    formatParagraph(doc, `3. Рекомендуется устранить дублирование контента (${duplicatePages.length} групп дублирующихся страниц).`, yPos);
    yPos += 10;
  } else {
    formatParagraph(doc, '3. Дублирующихся страниц не обнаружено - это положительно влияет на SEO.', yPos);
    yPos += 10;
  }
  
  // Добавляем информацию о дате создания отчета
  yPos = 270;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Отчет создан: ${new Date().toLocaleString('ru-RU')}`, 20, yPos);
  
  // Добавляем нумерацию страниц
  addPaginationFooters(doc);
  
  // Возвращаем PDF как Blob
  return doc.output('blob');
}
