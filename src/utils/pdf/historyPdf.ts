
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditHistoryItem } from '@/types/audit';
import { pdfColors } from './styles/colors';
import { formatDateString } from './helpers/formatting';

/**
 * Generates a PDF report for audit history
 */
export const generateHistoryPDF = async (historyItems: AuditHistoryItem[], domain: string): Promise<Blob> => {
  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set document properties
  doc.setProperties({
    title: `История аудитов для ${domain}`,
    subject: 'Отчет по истории SEO аудитов',
    author: 'SEO Analyzer',
    creator: 'SEO Analyzer Tool'
  });
  
  // Add header
  doc.setFillColor(pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('История аудитов', 15, 15);
  
  doc.setFontSize(14);
  doc.text(`Домен: ${domain}`, 15, 22);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add report information
  let yPosition = 40;
  doc.setFontSize(12);
  doc.text(`Дата создания: ${new Date().toLocaleDateString('ru-RU')}`, 15, yPosition);
  yPosition += 8;
  doc.text(`Количество аудитов: ${historyItems.length}`, 15, yPosition);
  yPosition += 15;
  
  // Create history summary table
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Сводка по аудитам', 15, yPosition);
  yPosition += 10;
  
  // Sort history items by date (newest first)
  const sortedHistory = [...historyItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format data for table
  const historyData = sortedHistory.map(item => [
    formatDateString(item.date),
    String(item.score),
    getScoreStatus(item.score),
    item.changes ? (item.changes > 0 ? `+${item.changes}` : String(item.changes)) : 'N/A'
  ]);
  
  // Create table
  autoTable(doc, {
    startY: yPosition,
    head: [['Дата', 'Оценка', 'Статус', 'Изменение']],
    body: historyData,
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 50 },
      3: { cellWidth: 30, halign: 'center' }
    },
    headStyles: { fillColor: [pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]] }
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  // Add category scores breakdown if there's enough data
  if (sortedHistory.length > 0 && sortedHistory[0].categoryScores) {
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 40;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Последний аудит: Оценки по категориям', 15, yPosition);
    yPosition += 10;
    
    const latestAudit = sortedHistory[0];
    const categoryData = Object.entries(latestAudit.categoryScores).map(([category, score]) => [
      formatCategoryName(category),
      String(score),
      getCategoryStatus(score)
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Категория', 'Оценка', 'Статус']],
      body: categoryData,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 50 }
      },
      headStyles: { fillColor: [pdfColors.success[0], pdfColors.success[1], pdfColors.success[2]] }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Add trend analysis
  if (sortedHistory.length >= 2) {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 40;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Анализ тенденций', 15, yPosition);
    yPosition += 10;
    
    // Calculate overall trend
    const firstScore = sortedHistory[sortedHistory.length - 1].score;
    const latestScore = sortedHistory[0].score;
    const scoreDifference = latestScore - firstScore;
    const percentChange = ((scoreDifference) / firstScore) * 100;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let trendText = '';
    if (scoreDifference > 0) {
      trendText = `Улучшение на ${scoreDifference.toFixed(1)} пунктов (${percentChange.toFixed(1)}%)`;
      doc.setTextColor(pdfColors.success[0], pdfColors.success[1], pdfColors.success[2]);
    } else if (scoreDifference < 0) {
      trendText = `Снижение на ${Math.abs(scoreDifference).toFixed(1)} пунктов (${Math.abs(percentChange).toFixed(1)}%)`;
      doc.setTextColor(pdfColors.error[0], pdfColors.error[1], pdfColors.error[2]);
    } else {
      trendText = 'Без изменений (0%)';
      doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
    }
    
    doc.text(`Изменение оценки с первого аудита: ${trendText}`, 15, yPosition);
    yPosition += 15;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add recommendations based on trend
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Рекомендации', 15, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    let recommendations = [];
    
    if (scoreDifference > 5) {
      recommendations = [
        'Продолжайте применять успешные стратегии оптимизации.',
        'Обратите внимание на категории с наименьшим прогрессом.',
        'Регулярно обновляйте контент для поддержания позитивной динамики.',
        'Документируйте успешные изменения для будущих проектов.'
      ];
    } else if (scoreDifference < -5) {
      recommendations = [
        'Проведите детальный анализ упущений и технических проблем.',
        'Сравните изменения на сайте с падением оценок.',
        'Уделите внимание категориям с наибольшим снижением.',
        'Рассмотрите возможность возврата к предыдущим стратегиям.'
      ];
    } else {
      recommendations = [
        'Экспериментируйте с новыми стратегиями оптимизации.',
        'Обратите внимание на конкурентов и передовые практики в отрасли.',
        'Фокусируйтесь на улучшении пользовательского опыта.',
        'Регулярно обновляйте и расширяйте контент.'
      ];
    }
    
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 15, yPosition);
      yPosition += 8;
    });
  }
  
  // Add footer with page numbers
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Add page number at the bottom center
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Страница ${i} из ${totalPages}`, 105, 285, { align: 'center' });
    
    // Add timestamp at the bottom left
    doc.text(`Сгенерировано: ${new Date().toLocaleString('ru-RU')}`, 15, 285);
    
    // Add copyright notice at the bottom right
    doc.text('© SEO Analyzer', 195, 285, { align: 'right' });
  }
  
  return doc.output('blob');
};

/**
 * Helper function to get a status text based on the score
 */
function getScoreStatus(score: number): string {
  if (score >= 90) return 'Отлично';
  if (score >= 70) return 'Хорошо';
  if (score >= 50) return 'Удовлетворительно';
  return 'Требует улучшения';
}

/**
 * Helper function for category score status
 */
function getCategoryStatus(score: number): string {
  if (score >= 90) return 'Отлично';
  if (score >= 70) return 'Хорошо';
  if (score >= 50) return 'Удовлетворительно';
  return 'Требует улучшения';
}

/**
 * Format category name for display
 */
function formatCategoryName(category: string): string {
  switch (category.toLowerCase()) {
    case 'seo': return 'SEO';
    case 'performance': return 'Производительность';
    case 'content': return 'Контент';
    case 'technical': return 'Технические аспекты';
    case 'mobile': return 'Мобильная оптимизация';
    case 'security': return 'Безопасность';
    case 'usability': return 'Удобство использования';
    default: return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
