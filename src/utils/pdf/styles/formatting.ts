
/**
 * Formatting utilities for PDF generation
 */

import jsPDF from 'jspdf';
import { pdfColors } from './colors';
import { pdfFonts } from './fonts';
import { addTimestamp } from '../helpers';

/**
 * Formats the report header with logo and title
 */
export function formatReportHeader(
  doc: jsPDF, 
  title: string, 
  subtitle: string, 
  useGradient: boolean = false
): void {
  // Create header background
  if (useGradient) {
    // Simplified gradient effect
    doc.setFillColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add some visual elements
    doc.setFillColor(
      pdfColors.primary[0] + 20, 
      pdfColors.primary[1] + 20, 
      pdfColors.primary[2] + 20
    );
    doc.circle(180, 20, 15, 'F');
    
    doc.setFillColor(
      pdfColors.primary[0] + 40, 
      pdfColors.primary[1] + 40, 
      pdfColors.primary[2] + 40
    );
    doc.circle(190, 10, 8, 'F');
  } else {
    // Simple header
    doc.setFillColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]);
    doc.rect(0, 0, 210, 30, 'F');
  }
  
  // Add title
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setFontSize(pdfFonts.h1);
  doc.setTextColor(pdfColors.white[0], pdfColors.white[1], pdfColors.white[2]);
  doc.text(title, 15, useGradient ? 20 : 15);
  
  // Add subtitle
  doc.setFontSize(pdfFonts.h4);
  doc.text(subtitle, 15, useGradient ? 30 : 22);
  
  // Reset text color for rest of document
  doc.setTextColor(pdfColors.black[0], pdfColors.black[1], pdfColors.black[2]);
}

/**
 * Formats a section header with optional line
 */
export function formatSectionHeader(
  doc: jsPDF, 
  title: string, 
  yPosition: number, 
  drawLine: boolean = true
): number {
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setFontSize(pdfFonts.h3);
  doc.text(title, 15, yPosition);
  
  if (drawLine) {
    const textWidth = doc.getTextWidth(title);
    doc.setDrawColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition + 1, 15 + textWidth, yPosition + 1);
  }
  
  // Return updated Y position
  return yPosition + 8;
}

/**
 * Formats the report footer with page numbers
 */
export function formatReportFooter(doc: jsPDF, pageNumber: number, totalPages: number): void {
  const footerY = 285;
  
  doc.setFont(pdfFonts.primary, pdfFonts.normal);
  doc.setFontSize(pdfFonts.xsmall);
  doc.setTextColor(pdfColors.muted[0], pdfColors.muted[1], pdfColors.muted[2]);
  
  // Add page number
  doc.text(`Страница ${pageNumber} из ${totalPages}`, 105, footerY, { align: 'center' });
  
  // Add timestamp
  addTimestamp(doc, 15, footerY);
}

/**
 * Formats key-value pairs in a two-column layout
 */
export function formatKeyValuePairs(
  doc: jsPDF, 
  data: { key: string; value: string }[], 
  startY: number, 
  fontSize: number = pdfFonts.body
): number {
  doc.setFontSize(fontSize);
  let yPos = startY;
  
  data.forEach(item => {
    doc.setFont(pdfFonts.primary, pdfFonts.bold);
    doc.text(`${item.key}:`, 15, yPos);
    
    doc.setFont(pdfFonts.primary, pdfFonts.normal);
    doc.text(item.value, 80, yPos);
    
    yPos += 6;
  });
  
  return yPos;
}
