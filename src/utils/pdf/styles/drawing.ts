
import { pdfFonts } from './fonts';
import { pdfColors } from './colors';

/**
 * Draws a gauge chart for visualizing scores
 */
export function drawGauge(doc: any, score: number, x: number, y: number, radius: number = 15, options: any = {}): void {
  // Background circle
  doc.setDrawColor(...pdfColors.light);
  doc.setFillColor(...pdfColors.light);
  doc.circle(x, y, radius, 'FD');
  
  // Color based on score
  const scoreColor = getScoreColor(score);
  doc.setFillColor(...scoreColor);
  
  // Draw arc based on score percentage
  const startAngle = 0;
  const endAngle = (score / 100) * Math.PI * 2;
  doc.ellipse(x, y, radius, radius, 'F');
  
  // White inner circle to create gauge effect
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y, radius * 0.7, 'F');
  
  // Score text
  doc.setFont(pdfFonts.primary, pdfFonts.bold);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(score.toString(), x, y + 1, { align: 'center' });
  
  // "out of 100" text
  doc.setFont(pdfFonts.primary, pdfFonts.normalStyle);
  doc.setFontSize(6);
  doc.text('из 100', x, y + 7, { align: 'center' });
}

/**
 * Gets color based on score value - fix error reference
 */
function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return pdfColors.success;
  if (score >= 60) return pdfColors.warning;
  return pdfColors.danger; // Use danger instead of error
}

/**
 * Draws a section divider
 */
export function drawSectionDivider(doc: any, y: number, width: number = 180): number {
  doc.setDrawColor(...pdfColors.light);
  doc.line(15, y, 15 + width, y);
  return y + 5; // Return next Y position
}
