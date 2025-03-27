
import { getMetricColor } from './colors';
import { pdfColors } from './colors';
import { pdfFonts } from './fonts';

/**
 * Draws a gauge chart for score visualization
 */
export const drawGauge = (doc: any, score: number, x: number, y: number, radius: number): void => {
  // Draw gray circle (background)
  doc.setDrawColor(...pdfColors.gray);
  doc.setFillColor(...pdfColors.light);
  doc.circle(x, y, radius, 'FD');
  
  // Draw filled part (colored sector)
  const angle = (score / 100) * 360;
  doc.setFillColor(...getMetricColor(score));
  
  // Create sector
  if (score > 0) {
    doc.ellipse(x, y, radius, radius, 'F');
  }
  
  // Draw inner white circle (creates ring effect)
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y, radius * 0.8, 'F');
  
  // Add numeric value in center
  doc.setFontSize(pdfFonts.heading.size);
  doc.setTextColor(...pdfColors.dark);
  doc.text(score.toString(), x, y + 2, { align: 'center' });
  
  // Add caption
  doc.setFontSize(pdfFonts.small.size);
  doc.text('из 100', x, y + radius + 5, { align: 'center' });
};
