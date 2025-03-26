
import jsPDF from 'jspdf';
import { AuditData } from '@/types/audit';
import { getCategoryStatus, addCategoryDetails, addPaginationFooters } from './helpers';

/**
 * Generates a PDF report from audit data
 */
export const generateAuditPDF = async (auditData: AuditData, url: string): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    // Add header with logo and title
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    pdf.text('SEO Аудит', pageWidth / 2, 15, { align: 'center' });
    
    // Add URL and date
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`URL: ${url}`, margin, 40);
    pdf.text(`Дата: ${new Date(auditData.date).toLocaleDateString('ru-RU')}`, margin, 47);
    pdf.text(`ID аудита: ${auditData.id}`, margin, 54);
    
    // Add overall rating
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
    
    // Add issues summary
    await addIssuesSummary(pdf, auditData, margin);
    
    // Add category scores
    await addCategoryScores(pdf, auditData, margin);
    
    // Start new page for detailed analysis
    pdf.addPage();
    
    // Add detailed analysis for each category
    await addDetailedAnalysis(pdf, auditData, margin);
    
    // Add pagination footers
    addPaginationFooters(pdf, margin);
    
    // Save the PDF
    pdf.save(`SEO_Аудит_${url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Ошибка создания PDF:', error);
    return Promise.reject(error);
  }
};

/**
 * Adds issues summary section to the PDF
 */
async function addIssuesSummary(pdf: jsPDF, auditData: AuditData, margin: number): Promise<void> {
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Обзор проблем', margin, 95);
  
  const issuesData = [
    ['Критические ошибки', `${auditData.issues.critical}`, auditData.issues.critical > 0 ? 'Высокий' : 'Низкий'],
    ['Важные улучшения', `${auditData.issues.important}`, auditData.issues.important > 0 ? 'Средний' : 'Низкий'],
    ['Возможности', `${auditData.issues.opportunities}`, 'Низкий']
  ];
  
  const autoTable = await import('jspdf-autotable');
  autoTable.default(pdf, {
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
}

/**
 * Adds category scores section to the PDF
 */
async function addCategoryScores(pdf: jsPDF, auditData: AuditData, margin: number): Promise<void> {
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Результаты по категориям', margin, 145);
  
  const categoryData = [
    ['SEO', `${auditData.details.seo.score}/100`, getCategoryStatus(auditData.details.seo.score)],
    ['Производительность', `${auditData.details.performance.score}/100`, getCategoryStatus(auditData.details.performance.score)],
    ['Контент', `${auditData.details.content.score}/100`, getCategoryStatus(auditData.details.content.score)],
    ['Технические аспекты', `${auditData.details.technical.score}/100`, getCategoryStatus(auditData.details.technical.score)]
  ];
  
  const autoTable = await import('jspdf-autotable');
  autoTable.default(pdf, {
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
}

/**
 * Adds detailed analysis sections to the PDF
 */
async function addDetailedAnalysis(pdf: jsPDF, auditData: AuditData, margin: number): Promise<void> {
  let yPos = 20;
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // SEO Details
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SEO анализ', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.seo.items, yPos, margin);
  yPos += (auditData.details.seo.items.length * 12) + 20;
  
  // Check if new page is needed
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Performance details
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Анализ производительности', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.performance.items, yPos, margin);
  yPos += (auditData.details.performance.items.length * 12) + 20;
  
  // Check if new page is needed
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Content details
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Анализ контента', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.content.items, yPos, margin);
  yPos += (auditData.details.content.items.length * 12) + 20;
  
  // Check if new page is needed
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Technical details
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Технический анализ', margin, yPos);
  yPos += 10;
  
  addCategoryDetails(pdf, auditData.details.technical.items, yPos, margin);
}
