
/**
 * Font utilities for PDF generation
 */

export const pdfFonts = {
  // Font families
  primary: 'helvetica',
  secondary: 'courier',
  
  // Font weights
  normal: 'normal',
  bold: 'bold',
  italic: 'italic',
  
  // Font sizes
  h1: 24,
  h2: 18,
  h3: 16,
  h4: 14,
  body: 12,
  small: 10,
  xsmall: 8,
  
  // For sections formatting
  heading: {
    size: 18,
    weight: 'bold',
    family: 'helvetica'
  },
  
  subheading: {
    size: 14,
    weight: 'bold',
    family: 'helvetica'
  },
  
  normalText: {  // Changed name from 'normal' to 'normalText' to avoid duplicate
    size: 11,
    weight: 'normal',
    family: 'helvetica'
  }
};

/**
 * Applies heading formatting to the PDF document
 */
export function applyHeadingStyle(doc: any, level: 1 | 2 | 3 | 4): void {
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  
  switch (level) {
    case 1:
      doc.setFontSize(pdfFonts.h1);
      break;
    case 2:
      doc.setFontSize(pdfFonts.h2);
      break;
    case 3:
      doc.setFontSize(pdfFonts.h3);
      break;
    case 4:
      doc.setFontSize(pdfFonts.h4);
      break;
  }
}

/**
 * Applies body text formatting to the PDF document
 */
export function applyBodyStyle(doc: any, small: boolean = false): void {
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.setFontSize(small ? pdfFonts.small : pdfFonts.body);
}

/**
 * Applies monospace formatting (for code examples)
 */
export function applyMonospaceStyle(doc: any): void {
  doc.setFont(pdfFonts.secondary, pdfFonts.normal);
  doc.setFontSize(pdfFonts.small);
}
