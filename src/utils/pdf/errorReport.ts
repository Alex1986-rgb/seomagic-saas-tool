
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfColors } from './styles/colors';

export interface ErrorReportOptions {
  domain: string;
  errors: Array<{
    url: string;
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  scanDate?: string;
  recommendations?: string[];
  url?: string;
  urls?: string[];
  auditData?: any;
  detailed?: boolean;
  includeScreenshots?: boolean;
}

/**
 * Generates a PDF report focusing on errors found during an audit
 */
export const generateErrorReportPdf = async (options: ErrorReportOptions): Promise<Blob> => {
  const { domain, errors, scanDate = new Date().toISOString(), recommendations = [], url } = options;
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Format the date
  const formattedDate = new Date(scanDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Set document title
  doc.setProperties({
    title: `Отчет об ошибках для ${domain || url}`,
    subject: 'Отчет об ошибках аудита сайта',
    author: 'SEO Analyzer',
    creator: 'SEO Analyzer Tool'
  });
  
  // Add header
  doc.setFillColor(pdfColors.error[0], pdfColors.error[1], pdfColors.error[2]); // Red for error report
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Отчет об ошибках', 15, 15);
  
  doc.setFontSize(14);
  doc.text(`Домен: ${domain || url}`, 15, 22);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add report metadata
  let yPosition = 40;
  doc.setFontSize(12);
  doc.text(`Дата сканирования: ${formattedDate}`, 15, yPosition);
  yPosition += 8;
  doc.text(`Найдено ошибок: ${errors.length}`, 15, yPosition);
  yPosition += 15;
  
  // Sort errors by severity
  const sortedErrors = [...errors].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  // Add errors table
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Обнаруженные ошибки', 15, yPosition);
  yPosition += 10;
  
  const errorRows = sortedErrors.map(error => [
    error.type,
    error.url,
    error.description,
    getSeverityText(error.severity)
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Тип', 'URL', 'Описание', 'Важность']],
    body: errorRows,
    theme: 'grid',
    styles: { 
      overflow: 'linebreak', 
      cellWidth: 'wrap',
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { cellWidth: 80 },
      3: { cellWidth: 20 }
    },
    headStyles: { fillColor: [pdfColors.error[0], pdfColors.error[1], pdfColors.error[2]] }
  });
  
  // Add recommendations
  if (recommendations.length > 0) {
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Рекомендации по исправлению', 15, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 15, yPosition);
      yPosition += 8;
      
      // Check if we need a new page
      if (yPosition > 275 && index < recommendations.length - 1) {
        doc.addPage();
        yPosition = 30;
      }
    });
  }
  
  // Return the PDF as a blob
  return doc.output('blob');
};

function getSeverityText(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high':
      return 'Высокая';
    case 'medium':
      return 'Средняя';
    case 'low':
      return 'Низкая';
    default:
      return 'Средняя';
  }
}
