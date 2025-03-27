
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';

/**
 * Генерирует PDF-отчет об аудите
 */
export const generatePDFReport = async (auditData: AuditData, url: string): Promise<Blob> => {
  // Создаем новый документ PDF
  const doc = new jsPDF();
  
  // Добавляем заголовок
  doc.setFontSize(22);
  doc.text('Отчет SEO аудита', 105, 20, { align: 'center' });
  
  // Добавляем информацию о сайте
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 14, 30);
  doc.text(`Дата проверки: ${new Date(auditData.date).toLocaleString('ru-RU')}`, 14, 38);
  doc.text(`Общий балл: ${auditData.score}/100`, 14, 46);
  
  // Добавляем основные метрики
  doc.setFontSize(16);
  doc.text('Основные метрики', 14, 60);
  
  // Таблица с основными метриками
  const metricsData = [
    ['Метрика', 'Значение', 'Оценка'],
    ['Время загрузки', `${auditData.performance?.loadTime || 'Н/Д'} сек`, getScoreText(auditData.performance?.loadScore || 0)],
    ['Мобильная оптимизация', `${auditData.mobile?.score || 'Н/Д'}%`, getScoreText(auditData.mobile?.score || 0)],
    ['SEO оптимизация', `${auditData.seo?.score || 'Н/Д'}%`, getScoreText(auditData.seo?.score || 0)],
    ['Безопасность', `${auditData.security?.score || 'Н/Д'}%`, getScoreText(auditData.security?.score || 0)],
  ];
  
  autoTable(doc, {
    startY: 65,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 60 },
      2: { cellWidth: 60 },
    },
  });
  
  // Добавляем раздел с проблемами
  const currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text('Обнаруженные проблемы', 14, currentY);
  
  // Формируем данные для таблицы проблем
  const issuesData = [
    ['Тип', 'Количество'],
    ['Критические', `${auditData.issues?.critical || 0}`],
    ['Важные', `${auditData.issues?.important || 0}`],
    ['Предупреждения', `${auditData.issues?.warnings || 0}`],
    ['Информационные', `${auditData.issues?.info || 0}`],
  ];
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [issuesData[0]],
    body: issuesData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 80 },
    },
  });
  
  // Добавляем список рекомендаций, если они есть
  if (auditData.recommendations && auditData.recommendations.length > 0) {
    const recY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text('Рекомендации по улучшению', 14, recY);
    
    let startY = recY + 10;
    doc.setFontSize(10);
    
    auditData.recommendations.forEach((rec, index) => {
      // Проверяем, нужно ли добавить новую страницу
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
      
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${rec.title}`, 14, startY);
      doc.setFont(undefined, 'normal');
      doc.text(rec.description, 14, startY + 6, { maxWidth: 180 });
      
      // Вычисляем высоту текста рекомендации
      const textLines = doc.splitTextToSize(rec.description, 180);
      startY += 6 + textLines.length * 5 + 10;
    });
  }
  
  // Добавляем информацию о сгенерированном отчете
  doc.setFontSize(8);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 14, 285);
  
  // Преобразуем документ в Blob и возвращаем
  return doc.output('blob');
};

/**
 * Получает текстовую оценку по числовому значению
 */
const getScoreText = (score: number): string => {
  if (score >= 90) return 'Отлично';
  if (score >= 70) return 'Хорошо';
  if (score >= 50) return 'Удовлетворительно';
  if (score >= 30) return 'Плохо';
  return 'Критично';
};

/**
 * Генерирует сравнительный отчет для двух аудитов
 */
export const generateComparisonReport = async (beforeAudit: AuditData, afterAudit: AuditData, url: string): Promise<Blob> => {
  // Создаем новый документ PDF
  const doc = new jsPDF();
  
  // Добавляем заголовок
  doc.setFontSize(22);
  doc.text('Сравнительный отчет по SEO аудиту', 105, 20, { align: 'center' });
  
  // Добавляем информацию о сайте
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 14, 30);
  doc.text(`Период: ${new Date(beforeAudit.date).toLocaleDateString('ru-RU')} - ${new Date(afterAudit.date).toLocaleDateString('ru-RU')}`, 14, 38);
  
  // Добавляем сравнение баллов
  doc.setFontSize(16);
  doc.text('Сравнение основных показателей', 14, 55);
  
  // Таблица сравнения
  const comparisonData = [
    ['Метрика', 'До', 'После', 'Изменение'],
    ['Общий балл', `${beforeAudit.score}`, `${afterAudit.score}`, getChangeText(afterAudit.score - beforeAudit.score)],
    ['Время загрузки', `${beforeAudit.performance?.loadTime || 'Н/Д'} сек`, `${afterAudit.performance?.loadTime || 'Н/Д'} сек`, 
      getTimeChangeText((beforeAudit.performance?.loadTime || 0) - (afterAudit.performance?.loadTime || 0))],
    ['Мобильная оптимизация', `${beforeAudit.mobile?.score || 'Н/Д'}%`, `${afterAudit.mobile?.score || 'Н/Д'}%`, 
      getChangeText((afterAudit.mobile?.score || 0) - (beforeAudit.mobile?.score || 0))],
    ['SEO оптимизация', `${beforeAudit.seo?.score || 'Н/Д'}%`, `${afterAudit.seo?.score || 'Н/Д'}%`, 
      getChangeText((afterAudit.seo?.score || 0) - (beforeAudit.seo?.score || 0))],
    ['Безопасность', `${beforeAudit.security?.score || 'Н/Д'}%`, `${afterAudit.security?.score || 'Н/Д'}%`, 
      getChangeText((afterAudit.security?.score || 0) - (beforeAudit.security?.score || 0))],
  ];
  
  autoTable(doc, {
    startY: 60,
    head: [comparisonData[0]],
    body: comparisonData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 50 },
    },
  });
  
  // Добавляем сравнение проблем
  const issuesY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text('Динамика проблем', 14, issuesY);
  
  // Формируем данные для таблицы сравнения проблем
  const issuesComparisonData = [
    ['Тип проблем', 'До', 'После', 'Изменение'],
    ['Критические', `${beforeAudit.issues?.critical || 0}`, `${afterAudit.issues?.critical || 0}`, 
      getIssueChangeText(beforeAudit.issues?.critical || 0, afterAudit.issues?.critical || 0)],
    ['Важные', `${beforeAudit.issues?.important || 0}`, `${afterAudit.issues?.important || 0}`, 
      getIssueChangeText(beforeAudit.issues?.important || 0, afterAudit.issues?.important || 0)],
    ['Предупреждения', `${beforeAudit.issues?.warnings || 0}`, `${afterAudit.issues?.warnings || 0}`, 
      getIssueChangeText(beforeAudit.issues?.warnings || 0, afterAudit.issues?.warnings || 0)],
    ['Информационные', `${beforeAudit.issues?.info || 0}`, `${afterAudit.issues?.info || 0}`, 
      getIssueChangeText(beforeAudit.issues?.info || 0, afterAudit.issues?.info || 0)],
  ];
  
  autoTable(doc, {
    startY: issuesY + 5,
    head: [issuesComparisonData[0]],
    body: issuesComparisonData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 50 },
    },
  });
  
  // Добавляем заключение
  const conclusionY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text('Заключение', 14, conclusionY);
  
  doc.setFontSize(10);
  const conclusion = getAuditConclusion(beforeAudit, afterAudit);
  doc.text(conclusion, 14, conclusionY + 10, { maxWidth: 180 });
  
  // Добавляем информацию о сгенерированном отчете
  doc.setFontSize(8);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 14, 285);
  
  // Преобразуем документ в Blob и возвращаем
  return doc.output('blob');
};

/**
 * Генерирует отчет о позициях ключевых слов
 */
export const generateKeywordReport = async (keywordData: any, url: string): Promise<Blob> => {
  // Создаем новый документ PDF
  const doc = new jsPDF();
  
  // Добавляем заголовок
  doc.setFontSize(22);
  doc.text('Отчет по ключевым словам', 105, 20, { align: 'center' });
  
  // Добавляем информацию о сайте
  doc.setFontSize(12);
  doc.text(`URL: ${url}`, 14, 30);
  doc.text(`Дата проверки: ${new Date().toLocaleString('ru-RU')}`, 14, 38);
  
  // Добавляем таблицу с ключевыми словами
  doc.setFontSize(16);
  doc.text('Позиции ключевых слов', 14, 50);
  
  // Проверяем, есть ли данные о ключевых словах
  if (keywordData && keywordData.keywords && keywordData.keywords.length > 0) {
    // Формируем данные для таблицы ключевых слов
    const keywordsTableHead = [['Ключевое слово', 'Позиция', 'Поисковая система', 'URL']];
    const keywordsTableBody = keywordData.keywords.map(kw => [
      kw.keyword,
      kw.position > 0 ? kw.position.toString() : 'Не найдено',
      kw.searchEngine,
      kw.url || 'Н/Д'
    ]);
    
    autoTable(doc, {
      startY: 55,
      head: keywordsTableHead,
      body: keywordsTableBody,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 70 },
      },
    });
  } else {
    doc.setFontSize(10);
    doc.text('Данные о ключевых словах отсутствуют', 14, 55);
  }
  
  // Добавляем информацию о сгенерированном отчете
  doc.setFontSize(8);
  doc.text(`Отчет сгенерирован: ${new Date().toLocaleString('ru-RU')}`, 14, 285);
  
  // Преобразуем документ в Blob и возвращаем
  return doc.output('blob');
};

/**
 * Вспомогательные функции для форматирования текста изменений
 */
const getChangeText = (change: number): string => {
  if (change > 0) return `+${change} 🔼`;
  if (change < 0) return `${change} 🔽`;
  return 'Без изменений';
};

const getTimeChangeText = (change: number): string => {
  if (change > 0) return `-${change.toFixed(2)} сек 🔼`;
  if (change < 0) return `+${Math.abs(change).toFixed(2)} сек 🔽`;
  return 'Без изменений';
};

const getIssueChangeText = (before: number, after: number): string => {
  const change = before - after;
  if (change > 0) return `Исправлено ${change} 🔼`;
  if (change < 0) return `Добавилось ${Math.abs(change)} 🔽`;
  return 'Без изменений';
};

const getAuditConclusion = (beforeAudit: AuditData, afterAudit: AuditData): string => {
  const scoreDiff = afterAudit.score - beforeAudit.score;
  
  if (scoreDiff > 20) {
    return 'Значительное улучшение показателей сайта. Проведенные оптимизации дали существенный результат. Рекомендуется продолжать работу в том же направлении.';
  } else if (scoreDiff > 10) {
    return 'Хорошее улучшение показателей сайта. Проведенные оптимизации оказались эффективными. Рекомендуется обратить внимание на оставшиеся критические проблемы.';
  } else if (scoreDiff > 0) {
    return 'Незначительное улучшение показателей сайта. Оптимизации дали положительный, но небольшой эффект. Рекомендуется более тщательная работа над критическими проблемами.';
  } else if (scoreDiff === 0) {
    return 'Показатели остались без изменений. Возможно, проведенные оптимизации компенсировали появление новых проблем. Рекомендуется пересмотреть стратегию оптимизации.';
  } else {
    return 'Ухудшение показателей сайта. Необходимо срочно обратить внимание на появившиеся проблемы и пересмотреть стратегию оптимизации.';
  }
};
