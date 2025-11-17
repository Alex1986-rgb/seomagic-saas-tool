import jsPDF from 'jspdf';
import { pdfColors } from '../styles/colors';
import { addQRCodeToPage } from './qrcode';

interface CoverPageOptions {
  title: string;
  subtitle: string;
  url: string;
  date: string;
  overallScore: number;
  statistics?: {
    pagesScanned?: number;
    issuesFound?: number;
    criticalIssues?: number;
  };
  qrCodeUrl?: string;
  companyLogo?: string; // base64
  companyInfo?: {
    name?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Добавляет профессиональную обложку к PDF документу
 */
export function addCoverPage(
  doc: jsPDF,
  options: CoverPageOptions
): void {
  const {
    title,
    subtitle,
    url,
    date,
    overallScore,
    statistics = {},
    qrCodeUrl,
    companyLogo,
    companyInfo = {}
  } = options;

  const pageHeight = 297;
  const pageWidth = 210;

  // === ВЕРХНИЙ ДЕКОРАТИВНЫЙ БЛОК С ГРАДИЕНТОМ ===
  // Основной цвет фона
  doc.setFillColor(...pdfColors.primary);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Создаем градиентный эффект
  for (let i = 0; i < 30; i++) {
    const alpha = 1 - (i / 40);
    const y = 60 + i;
    doc.setFillColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2], alpha);
    doc.rect(0, y, pageWidth, 1, 'F');
  }

  // Декоративные геометрические элементы
  doc.setFillColor(255, 255, 255, 0.1);
  doc.circle(pageWidth - 30, 20, 40, 'F');
  doc.circle(20, 50, 25, 'F');

  // === ЛОГОТИП (если есть) ===
  if (companyLogo) {
    try {
      doc.addImage(companyLogo, 'PNG', 15, 10, 30, 30);
    } catch (error) {
      console.error('Error adding logo to cover page:', error);
    }
  }

  // === ЗАГОЛОВОК ===
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 30, { align: 'center' });

  // === ПОДЗАГОЛОВОК ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, pageWidth / 2, 42, { align: 'center' });

  // === URL САЙТА ===
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255, 0.9);
  doc.text(url, pageWidth / 2, 52, { align: 'center' });

  // === ЦЕНТРАЛЬНЫЙ БЛОК С ОЦЕНКОЙ ===
  const centerY = 140;

  // Рисуем большой круг для оценки
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, centerY, 45, 'F');

  // Внутренний цветной круг в зависимости от оценки
  const scoreColor = getScoreColor(overallScore);
  doc.setFillColor(...scoreColor);
  doc.circle(pageWidth / 2, centerY, 40, 'F');

  // Белый внутренний круг для текста
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, centerY, 35, 'F');

  // Отображаем оценку
  doc.setTextColor(...scoreColor);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text(overallScore.toString(), pageWidth / 2, centerY + 5, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('из 100', pageWidth / 2, centerY + 15, { align: 'center' });

  // Текст "Общая оценка"
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('Общая оценка SEO', pageWidth / 2, centerY - 55, { align: 'center' });

  // === СТАТИСТИКА В КАРТОЧКАХ ===
  if (statistics.pagesScanned || statistics.issuesFound || statistics.criticalIssues) {
    const cardY = centerY + 50;
    const cardWidth = 50;
    const cardHeight = 25;
    const cardSpacing = 7;
    const totalWidth = (cardWidth * 3) + (cardSpacing * 2);
    let startX = (pageWidth - totalWidth) / 2;

    // Карточка 1: Страниц проверено
    if (statistics.pagesScanned) {
      drawStatCard(doc, startX, cardY, cardWidth, cardHeight, 
        statistics.pagesScanned.toString(), 'Страниц проверено', pdfColors.info);
      startX += cardWidth + cardSpacing;
    }

    // Карточка 2: Найдено проблем
    if (statistics.issuesFound) {
      drawStatCard(doc, startX, cardY, cardWidth, cardHeight,
        statistics.issuesFound.toString(), 'Найдено проблем', pdfColors.warning);
      startX += cardWidth + cardSpacing;
    }

    // Карточка 3: Критические
    if (statistics.criticalIssues) {
      drawStatCard(doc, startX, cardY, cardWidth, cardHeight,
        statistics.criticalIssues.toString(), 'Критические', pdfColors.danger);
    }
  }

  // === ДАТА ===
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Дата создания отчета: ${formattedDate}`, pageWidth / 2, 230, { align: 'center' });

  // === QR КОД (если есть URL) ===
  if (qrCodeUrl) {
    addQRCodeToPage(doc, qrCodeUrl, pageWidth - 50, 240, 25);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Онлайн-версия', pageWidth - 37.5, 272, { align: 'center' });
  }

  // === НИЖНИЙ БЛОК ===
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');

  // Информация о компании
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  
  const companyName = companyInfo.name || 'SEO Market';
  doc.text(`Создано с помощью ${companyName}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

  if (companyInfo.website) {
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text(companyInfo.website, pageWidth / 2, pageHeight - 14, { align: 'center' });
  }

  doc.setFontSize(8);
  doc.text(`© ${new Date().getFullYear()}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
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
 * Рисует карточку статистики
 */
function drawStatCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  label: string,
  color: [number, number, number]
): void {
  // Фон карточки
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(x, y, width, height, 3, 3, 'F');

  // Цветная полоска сверху
  doc.setFillColor(...color);
  doc.roundedRect(x, y, width, 3, 3, 3, 'F');

  // Значение
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...color);
  doc.text(value, x + width / 2, y + 13, { align: 'center' });

  // Метка
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(label, x + width / 2, y + 20, { align: 'center' });
}
