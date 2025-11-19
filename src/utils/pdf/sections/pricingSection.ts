import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors } from '../styles/colors';
import { pdfFonts } from '../styles/fonts';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

export interface PricingData {
  url: string;
  date: string;
  validUntil?: string;
  items: OptimizationItem[];
  discount?: number;
  recommendedPackage?: 'basic' | 'standard' | 'premium';
  isPartial?: boolean;
  completionPercentage?: number;
}

interface WorkPackage {
  name: string;
  description: string;
  includes: string[];
  price: number;
  recommended?: boolean;
}

/**
 * Добавляет раздел сметы оптимизации
 */
export function addPricingSection(
  doc: jsPDF,
  data: PricingData,
  startY: number = 30
): number {
  let currentY = startY;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // === ЗАГОЛОВОК РАЗДЕЛА ===
  doc.setFillColor(...pdfColors.success);
  doc.rect(0, currentY - 10, pageWidth, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  const title = data.isPartial ? '💰 Предварительная смета оптимизации' : '💰 Смета оптимизации';
  doc.text(title, pageWidth / 2, currentY - 2, { align: 'center' });

  currentY += 15;

  // Add partial data notice if applicable
  if (data.isPartial) {
    doc.setFillColor(255, 243, 205);
    doc.roundedRect(margin, currentY, contentWidth, 15, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(
      `⚠️ Смета составлена на основе ${data.completionPercentage || 0}% отсканированных страниц`,
      pageWidth / 2,
      currentY + 10,
      { align: 'center' }
    );
    
    currentY += 20;
  }

  // === ОБЩАЯ ИНФОРМАЦИЯ ===
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(...pdfColors.dark);
  
  doc.text(`Сайт: ${data.url}`, margin + 5, currentY + 6);
  doc.text(`Дата составления: ${new Date(data.date).toLocaleDateString('ru-RU')}`, margin + 5, currentY + 11);
  
  if (data.validUntil) {
    doc.text(`Действительно до: ${new Date(data.validUntil).toLocaleDateString('ru-RU')}`, margin + 5, currentY + 16);
  } else {
    doc.text('Действительно: 30 дней', margin + 5, currentY + 16);
  }

  currentY += 28;

  // === ДЕТАЛЬНАЯ ТАБЛИЦА РАБОТ ===
  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Детальная смета работ', margin, currentY);
  currentY += 8;

  // Группируем работы по категориям
  const categories = groupByCategory(data.items);
  
  let subtotal = 0;

  Object.entries(categories).forEach(([category, items]) => {
    // Проверка на новую страницу
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    // Заголовок категории
    const categoryColor = getCategoryColor(category);
    doc.setFillColor(...categoryColor);
    doc.rect(margin, currentY, contentWidth, 8, 'F');

    doc.setFontSize(10);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(255, 255, 255);
    doc.text(getCategoryName(category), margin + 3, currentY + 5);

    currentY += 10;

    // Таблица работ категории
    const tableData = items.map(item => {
      const itemTotal = (item.price || 0) * (item.count || 1);
      subtotal += itemTotal;
      
      return [
        item.name,
        item.count?.toString() || '1',
        `${(item.price || 0).toLocaleString('ru-RU')} ₽`,
        `${itemTotal.toLocaleString('ru-RU')} ₽`,
        getPriorityBadge(item.priority || 'medium')
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Наименование работы', 'Кол-во', 'Цена', 'Сумма', 'Приоритет']],
      body: tableData,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: categoryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold' as const
      },
      bodyStyles: {
        fontSize: 8,
        textColor: pdfColors.dark
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 20, halign: 'center' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 3;

    // Промежуточный итог категории
    const categoryTotal = items.reduce((sum, item) => 
      sum + ((item.price || 0) * (item.count || 1)), 0
    );

    doc.setFontSize(9);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(...categoryColor);
    doc.text(
      `Итого по категории "${getCategoryName(category)}": ${categoryTotal.toLocaleString('ru-RU')} ₽`,
      margin + contentWidth,
      currentY,
      { align: 'right' }
    );

    currentY += 8;
  });

  // === ИТОГОВЫЙ БЛОК ===
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  currentY += 5;

  // Блок итогов
  const totalBlockHeight = 35;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, currentY, contentWidth, totalBlockHeight, 3, 3, 'F');

  currentY += 8;

  // Промежуточный итог
  doc.setFontSize(10);
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Промежуточный итог:', margin + 5, currentY);
  doc.text(`${subtotal.toLocaleString('ru-RU')} ₽`, margin + contentWidth - 5, currentY, { align: 'right' });

  currentY += 6;

  // Скидка (если есть)
  if (data.discount && data.discount > 0) {
    const discountAmount = subtotal * (data.discount / 100);
    doc.setTextColor(...pdfColors.success);
    doc.text(`Скидка (${data.discount}%):`, margin + 5, currentY);
    doc.text(`-${discountAmount.toLocaleString('ru-RU')} ₽`, margin + contentWidth - 5, currentY, { align: 'right' });
    currentY += 6;
  }

  // Линия разделителя
  doc.setDrawColor(...pdfColors.dark);
  doc.setLineWidth(0.5);
  doc.line(margin + 5, currentY, margin + contentWidth - 5, currentY);

  currentY += 6;

  // ИТОГО К ОПЛАТЕ
  const finalTotal = data.discount 
    ? subtotal * (1 - data.discount / 100)
    : subtotal;

  doc.setFontSize(14);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.success);
  doc.text('ИТОГО К ОПЛАТЕ:', margin + 5, currentY);
  doc.text(`${finalTotal.toLocaleString('ru-RU')} ₽`, margin + contentWidth - 5, currentY, { align: 'right' });

  currentY += totalBlockHeight - 14;

  // === ВАРИАНТЫ ПАКЕТОВ ===
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  } else {
    currentY += 10;
  }

  currentY = addWorkPackages(doc, data, finalTotal, currentY, margin, contentWidth);

  return currentY;
}

/**
 * Добавляет варианты пакетов работ
 */
function addWorkPackages(
  doc: jsPDF,
  data: PricingData,
  currentTotal: number,
  startY: number,
  margin: number,
  width: number
): number {
  let currentY = startY;

  // Заголовок
  doc.setFontSize(12);
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Варианты пакетов работ', margin, currentY);
  currentY += 8;

  // Определяем пакеты
  const packages: WorkPackage[] = [
    {
      name: 'Базовый',
      description: 'Исправление критических проблем',
      includes: [
        'Исправление критических ошибок SEO',
        'Базовая оптимизация meta-тегов',
        'Устранение битых ссылок',
        '1 месяц поддержки'
      ],
      price: Math.round(currentTotal * 0.4),
      recommended: data.recommendedPackage === 'basic'
    },
    {
      name: 'Стандартный',
      description: 'Критические + важные улучшения',
      includes: [
        'Все из базового пакета',
        'Оптимизация структуры сайта',
        'Улучшение контента',
        'Техническая оптимизация',
        '3 месяца поддержки',
        'Ежемесячные отчеты'
      ],
      price: Math.round(currentTotal * 0.7),
      recommended: data.recommendedPackage === 'standard' || !data.recommendedPackage
    },
    {
      name: 'Премиум',
      description: 'Полная оптимизация + рост',
      includes: [
        'Все из стандартного пакета',
        'Продвинутая аналитика',
        'Контент-маркетинг',
        'Конкурентный анализ',
        'Стратегия продвижения',
        '6 месяцев поддержки',
        'Еженедельные консультации'
      ],
      price: currentTotal,
      recommended: data.recommendedPackage === 'premium'
    }
  ];

  const cardWidth = (width - 10) / 3;
  const cardHeight = 70;

  packages.forEach((pkg, index) => {
    const x = margin + (cardWidth + 5) * index;
    
    // Рамка карточки
    const cardColor = pkg.recommended ? pdfColors.success : pdfColors.gray;
    doc.setDrawColor(...cardColor);
    doc.setLineWidth(pkg.recommended ? 1 : 0.5);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 3, 3, 'S');

    // Бейдж "Рекомендуем"
    if (pkg.recommended) {
      doc.setFillColor(...pdfColors.success);
      doc.roundedRect(x + 2, currentY + 2, cardWidth - 4, 6, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont(pdfFonts.primary, pdfFonts.bold);
      doc.setTextColor(255, 255, 255);
      doc.text('★ РЕКОМЕНДУЕМ', x + cardWidth / 2, currentY + 5.5, { align: 'center' });
    }

    let cardY = pkg.recommended ? currentY + 10 : currentY + 4;

    // Название пакета
    doc.setFontSize(11);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(...pdfColors.dark);
    doc.text(pkg.name, x + cardWidth / 2, cardY, { align: 'center' });
    cardY += 5;

    // Описание
    doc.setFontSize(7);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(pkg.description, cardWidth - 8);
    descLines.forEach((line: string) => {
      doc.text(line, x + cardWidth / 2, cardY, { align: 'center' });
      cardY += 3;
    });

    cardY += 2;

    // Цена
    doc.setFontSize(14);
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.setTextColor(...cardColor);
    doc.text(`${pkg.price.toLocaleString('ru-RU')} ₽`, x + cardWidth / 2, cardY, { align: 'center' });

    cardY += 6;

    // Что входит (первые 3 пункта)
    doc.setFontSize(6);
    doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
    doc.setTextColor(80, 80, 80);
    pkg.includes.slice(0, 3).forEach(item => {
      const itemLines = doc.splitTextToSize(`✓ ${item}`, cardWidth - 8);
      itemLines.forEach((line: string) => {
        doc.text(line, x + 4, cardY);
        cardY += 3;
      });
    });

    if (pkg.includes.length > 3) {
      doc.setTextColor(100, 100, 100);
      doc.text(`+ еще ${pkg.includes.length - 3}...`, x + 4, cardY);
    }
  });

  currentY += cardHeight + 10;

  return currentY;
}

/**
 * Группирует работы по категориям
 */
function groupByCategory(items: OptimizationItem[]): Record<string, OptimizationItem[]> {
  const grouped: Record<string, OptimizationItem[]> = {};

  items.forEach(item => {
    const category = item.category || 'other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  return grouped;
}

/**
 * Возвращает цвет категории
 */
function getCategoryColor(category: string): [number, number, number] {
  const colors: Record<string, [number, number, number]> = {
    seo: pdfColors.primary,
    technical: pdfColors.secondary,
    content: pdfColors.info,
    performance: pdfColors.warning,
    other: pdfColors.gray
  };

  return colors[category] || pdfColors.gray;
}

/**
 * Возвращает название категории
 */
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    seo: 'SEO Оптимизация',
    technical: 'Технические работы',
    content: 'Контент и структура',
    performance: 'Производительность',
    other: 'Прочие работы'
  };

  return names[category] || 'Прочие работы';
}

/**
 * Возвращает текстовый бейдж приоритета
 */
function getPriorityBadge(priority: string): string {
  const badges: Record<string, string> = {
    high: '⬆ Высокий',
    medium: '→ Средний',
    low: '⬇ Низкий'
  };

  return badges[priority] || '→ Средний';
}
