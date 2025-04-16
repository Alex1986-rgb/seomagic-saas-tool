
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addPaginationFooters } from './helpers/pagination';
import { applyHeadingStyle, applyBodyStyle } from './styles/fonts';
import { pdfColors } from './styles/colors';
import { pdfTableStyles } from './styles/tables';

interface ErrorData {
  url: string;
  errorType: string;
  errorMessage: string;
  statusCode?: number;
  timestamp: string;
  stackTrace?: string;
  browser?: string;
  device?: string;
  userAgent?: string;
}

interface ErrorReportOptions {
  includeStackTrace?: boolean;
  includeBrowserInfo?: boolean;
  includeUserAgent?: boolean;
  title?: string;
  subtitle?: string;
  groupByType?: boolean;
}

/**
 * Generates a PDF error report from error data
 */
export const generateErrorReportPdf = async (
  errors: ErrorData[],
  options: ErrorReportOptions = {}
): Promise<void> => {
  const {
    includeStackTrace = true,
    includeBrowserInfo = true,
    includeUserAgent = false,
    title = 'Отчет об ошибках',
    subtitle = 'Обнаруженные ошибки и проблемы сайта',
    groupByType = true
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add title
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  applyHeadingStyle(doc, 1);
  doc.text(title, 105, 20, { align: 'center' });

  // Add subtitle
  applyHeadingStyle(doc, 3);
  doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
  doc.text(subtitle, 105, 30, { align: 'center' });

  // Add report generation date
  applyBodyStyle(doc, true);
  doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
  doc.text(
    `Дата создания: ${new Date().toLocaleDateString('ru-RU')}`,
    105,
    38,
    { align: 'center' }
  );

  // Add error summary
  applyHeadingStyle(doc, 2);
  doc.setTextColor(pdfColors.dark[0], pdfColors.dark[1], pdfColors.dark[2]);
  doc.text('Сводка ошибок', 14, 50);

  // Error summary table
  let errorTypes: Record<string, number> = {};
  
  errors.forEach(error => {
    if (!errorTypes[error.errorType]) {
      errorTypes[error.errorType] = 0;
    }
    errorTypes[error.errorType]++;
  });

  const summaryData = Object.entries(errorTypes).map(([type, count]) => [
    type,
    count.toString(),
    ((count / errors.length) * 100).toFixed(1) + '%'
  ]);

  autoTable(doc, {
    startY: 55,
    head: [['Тип ошибки', 'Количество', 'Процент']],
    body: summaryData,
    headStyles: {
      fillColor: pdfColors.primary as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    }
  });

  // Group errors if requested
  let errorList = errors;
  
  if (groupByType) {
    // Sort by error type
    errorList = [...errors].sort((a, b) => 
      a.errorType.localeCompare(b.errorType)
    );
  }

  // Add detailed error list
  const currentY = (doc as any).lastAutoTable.finalY + 15;
  
  applyHeadingStyle(doc, 2);
  doc.text('Детали ошибок', 14, currentY);

  // Generate the detailed error table
  const tableData = errorList.map(error => {
    const row = [
      error.errorType,
      error.url,
      error.errorMessage,
      error.statusCode?.toString() || 'N/A',
      new Date(error.timestamp).toLocaleString('ru-RU')
    ];
    
    return row;
  });

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Тип', 'URL', 'Сообщение', 'Код', 'Время']],
    body: tableData,
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap',
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 60 },
      3: { cellWidth: 15 },
      4: { cellWidth: 30 }
    },
    headStyles: {
      fillColor: pdfColors.primary as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    }
  });

  // Add stack traces if requested
  if (includeStackTrace && errors.some(e => e.stackTrace)) {
    const stacktraceY = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we're getting close to the end of the page
    if (stacktraceY > 240) {
      doc.addPage();
      applyHeadingStyle(doc, 2);
      doc.text('Стек вызовов', 14, 20);
      
      let stackY = 30;
      
      errors.forEach((error, index) => {
        if (error.stackTrace) {
          // Check if we need a new page
          if (stackY > 250) {
            doc.addPage();
            stackY = 20;
          }
          
          applyHeadingStyle(doc, 4);
          doc.text(`Ошибка #${index + 1}: ${error.errorType}`, 14, stackY);
          stackY += 8;
          
          applyBodyStyle(doc, true);
          
          // Format and add the stack trace text
          const stackLines = error.stackTrace.split('\n');
          stackLines.forEach(line => {
            if (stackY > 270) {
              doc.addPage();
              stackY = 20;
            }
            
            doc.text(line, 14, stackY);
            stackY += 5;
          });
          
          stackY += 10;
        }
      });
    } else {
      applyHeadingStyle(doc, 2);
      doc.text('Стек вызовов', 14, stacktraceY);
      
      const stackTraceData = errors
        .filter(e => e.stackTrace)
        .map(e => [
          e.errorType,
          e.stackTrace?.substring(0, 200) + (e.stackTrace && e.stackTrace.length > 200 ? '...' : '')
        ]);
        
      autoTable(doc, {
        startY: stacktraceY + 5,
        head: [['Тип ошибки', 'Стек вызовов']],
        body: stackTraceData,
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 140 }
        },
        headStyles: {
          fillColor: pdfColors.primary as [number, number, number],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        }
      });
    }
  }

  // Add browser info if requested
  if (includeBrowserInfo && errors.some(e => e.browser || e.device)) {
    const browserY = (doc as any).lastAutoTable?.finalY + 15 || 200;
    
    // Check if we need a new page
    if (browserY > 260) {
      doc.addPage();
      
      applyHeadingStyle(doc, 2);
      doc.text('Информация о браузере', 14, 20);
      
      const browserData = errors
        .filter(e => e.browser || e.device)
        .map(e => [
          e.errorType,
          e.browser || 'Неизвестно',
          e.device || 'Неизвестно',
          includeUserAgent ? (e.userAgent || 'Неизвестно') : 'Не включено'
        ]);
        
      autoTable(doc, {
        startY: 25,
        head: [['Тип ошибки', 'Браузер', 'Устройство', 'User-Agent']],
        body: browserData,
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          fontSize: 8
        },
        headStyles: {
          fillColor: pdfColors.primary as [number, number, number],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        }
      });
    } else {
      applyHeadingStyle(doc, 2);
      doc.text('Информация о браузере', 14, browserY);
      
      const browserData = errors
        .filter(e => e.browser || e.device)
        .map(e => [
          e.errorType,
          e.browser || 'Неизвестно',
          e.device || 'Неизвестно',
          includeUserAgent ? (e.userAgent || 'Неизвестно') : 'Не включено'
        ]);
        
      autoTable(doc, {
        startY: browserY + 5,
        head: [['Тип ошибки', 'Браузер', 'Устройство', 'User-Agent']],
        body: browserData,
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          fontSize: 8
        },
        headStyles: {
          fillColor: pdfColors.primary as [number, number, number],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        }
      });
    }
  }

  // Add pagination to all pages
  addPaginationFooters(doc);

  // Save the PDF
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`error-report-${dateStr}.pdf`);
};

// Export simplified function for convenience
export const exportErrorReport = async (
  errors: ErrorData[],
  options?: ErrorReportOptions
): Promise<void> => {
  return generateErrorReportPdf(errors, options);
};
