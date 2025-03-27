
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditHistoryItem } from '@/types/audit';
import { addPaginationFooters, getCategoryStatus } from './helpers';

export const generateHistoryPDF = async (historyItems: AuditHistoryItem[], domain: string): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Заголовок отчета
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('История SEO аудитов', 15, 15);
  
  doc.setFontSize(14);
  doc.text(`Сайт: ${domain}`, 15, 22);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Создано: ${new Date().toLocaleDateString('ru-RU')}`, 15, 40);
  
  // Таблица с историей аудитов
  const tableData = historyItems.map(item => {
    const date = new Date(item.date).toLocaleDateString('ru-RU', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return [
      date,
      item.score,
      item.issues ? `${item.issues.critical + item.issues.important + item.issues.opportunities}` : 'Н/Д',
      item.pageCount || 'Н/Д',
      item.details?.seo?.score || 'Н/Д',
      item.details?.performance?.score || 'Н/Д'
    ];
  });
  
  autoTable(doc, {
    startY: 50,
    head: [['Дата', 'Общий балл', 'Проблемы', 'Страницы', 'SEO', 'Performance']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [56, 189, 248], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' }
    }
  });
  
  // Таблица с динамикой баллов
  if (historyItems.length > 1) {
    doc.addPage();
    
    doc.setFillColor(56, 189, 248);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Динамика изменений', 15, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Прогресс показателей по аудитам', 15, 30);
    
    const progressData = [];
    
    for (let i = 0; i < historyItems.length - 1; i++) {
      const current = historyItems[i];
      const previous = historyItems[i+1];
      
      const dateCurrent = new Date(current.date).toLocaleDateString('ru-RU', {
        month: 'short', 
        day: 'numeric'
      });
      
      const datePrevious = new Date(previous.date).toLocaleDateString('ru-RU', {
        month: 'short', 
        day: 'numeric'
      });
      
      const scoreDiff = current.score - previous.score;
      const seoDiff = (current.details?.seo?.score || 0) - (previous.details?.seo?.score || 0);
      const perfDiff = (current.details?.performance?.score || 0) - (previous.details?.performance?.score || 0);
      
      progressData.push([
        `${datePrevious} → ${dateCurrent}`,
        current.score,
        scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff,
        current.details?.seo?.score || 'Н/Д',
        seoDiff >= 0 ? `+${seoDiff}` : seoDiff,
        current.details?.performance?.score || 'Н/Д',
        perfDiff >= 0 ? `+${perfDiff}` : perfDiff
      ]);
    }
    
    autoTable(doc, {
      startY: 40,
      head: [['Период', 'Общий балл', 'Изменение', 'SEO', 'Изменение', 'Производительность', 'Изменение']],
      body: progressData,
      theme: 'grid',
      headStyles: { fillColor: [56, 189, 248], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        2: { halign: 'center' },
        4: { halign: 'center' },
        6: { halign: 'center' }
      }
    });
    
    // Рекомендации
    const yPosition = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Рекомендации', 15, yPosition);
    
    const recommendations = [
      'Регулярно выполняйте аудит сайта для отслеживания прогресса',
      'Обращайте внимание на критические ошибки в первую очередь',
      'Исправляйте технические проблемы для повышения производительности',
      'Оптимизируйте метатеги и контент для улучшения SEO-показателей',
      'Используйте историю аудитов для анализа эффективности внесенных изменений'
    ];
    
    let recY = yPosition + 10;
    recommendations.forEach(rec => {
      doc.setFontSize(11);
      doc.text(`• ${rec}`, 20, recY);
      recY += 7;
    });
  }
  
  // Добавляем нумерацию страниц
  addPaginationFooters(doc, 15);
  
  // Возвращаем PDF как Blob
  return doc.output('blob');
};
