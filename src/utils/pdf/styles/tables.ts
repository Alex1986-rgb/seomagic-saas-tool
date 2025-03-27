
import { pdfColors } from './colors';
import { pdfFonts } from './fonts';

/**
 * Table styles for different PDF report types
 */
export const pdfTableStyles = {
  default: {
    headStyles: {
      fillColor: pdfColors.primary,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
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
  comparison: {
    headStyles: {
      fillColor: pdfColors.secondary,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
  issues: {
    headStyles: {
      fillColor: pdfColors.tertiary,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
  keywords: {
    headStyles: {
      fillColor: pdfColors.info,
      textColor: [255, 255, 255],
      fontSize: pdfFonts.normal.size,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: pdfFonts.normal.size,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  },
};
