
import { pdfColors } from './colors';

/**
 * Table styles for PDF documents
 */
export const pdfTableStyles = {
  default: {
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
      fontStyle: 'normal',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    footStyles: {
      fillColor: [243, 244, 246],
      textColor: pdfColors.dark,
      fontStyle: 'bold',
    },
  },
  
  secondary: {
    headStyles: {
      fillColor: pdfColors.secondary,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
  
  warning: {
    headStyles: {
      fillColor: pdfColors.warning,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
  
  error: {
    headStyles: {
      fillColor: pdfColors.danger, // Changed from error to danger
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
};
