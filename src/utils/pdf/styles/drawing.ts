
/**
 * Drawing utilities for PDF generation
 */

import jsPDF from 'jspdf';
import { getScoreColorRGB } from './colors';

/**
 * Draws a gauge chart to represent a score
 */
export function drawGauge(
  doc: jsPDF, 
  score: number, 
  x: number, 
  y: number, 
  radius: number
): void {
  // Draw gauge background (grey semi-circle)
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(240, 240, 240);
  doc.circle(x, y, radius, 'FD');
  
  // Calculate angle for score (0-100 mapped to 0-180 degrees)
  const angle = (score / 100) * Math.PI;
  
  // Get color based on score
  const scoreColor = getScoreColorRGB(score);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  
  // Draw score portion of gauge (colored arc)
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.1);
  
  // Create score arc using multiple small sectors
  const segments = 36;
  const stepAngle = Math.PI / segments;
  
  for (let i = 0; i < segments; i++) {
    const startAngle = Math.PI - (i * stepAngle);
    const endAngle = startAngle - stepAngle;
    
    // Only draw if within the score range
    if (startAngle >= Math.PI - angle) {
      const x1 = x + radius * Math.cos(startAngle);
      const y1 = y + radius * Math.sin(startAngle);
      const x2 = x + radius * Math.cos(endAngle);
      const y2 = y + radius * Math.sin(endAngle);
      
      // Draw triangular sector
      doc.triangle(x, y, x1, y1, x2, y2, 'F');
    }
  }
  
  // Draw gauge outline
  doc.setDrawColor(150, 150, 150);
  doc.arc(x, y, radius, 0, Math.PI, 'S');
  
  // Draw gauge needle
  doc.setDrawColor(100, 100, 100);
  doc.setFillColor(100, 100, 100);
  
  const needleAngle = Math.PI - angle;
  const needleLength = radius * 0.9;
  const x1 = x + needleLength * Math.cos(needleAngle);
  const y1 = y + needleLength * Math.sin(needleAngle);
  
  // Draw needle
  doc.setLineWidth(0.5);
  doc.line(x, y, x1, y1);
  
  // Draw center point
  doc.circle(x, y, 1, 'F');
  
  // Draw score text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(score.toString(), x, y + radius + 10, { align: 'center' });
}

/**
 * Draws a simple progress bar
 */
export function drawProgressBar(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  progress: number,
  showText: boolean = true
): void {
  // Ensure progress is between 0-100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  // Draw background
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(x, y, width, height, 1, 1, 'F');
  
  // Draw progress
  const progressWidth = (normalizedProgress / 100) * width;
  const progressColor = getScoreColorRGB(normalizedProgress);
  
  doc.setFillColor(progressColor[0], progressColor[1], progressColor[2]);
  doc.roundedRect(x, y, progressWidth, height, 1, 1, 'F');
  
  // Add text if needed
  if (showText) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${Math.round(normalizedProgress)}%`, x + width / 2, y + height / 2 + 1, { align: 'center', baseline: 'middle' });
  }
}

/**
 * Draws a simple icon for visual indicators
 */
export function drawIcon(
  doc: jsPDF,
  type: 'check' | 'cross' | 'warning' | 'info',
  x: number,
  y: number,
  size: number = 5
): void {
  switch (type) {
    case 'check':
      doc.setFillColor(74, 222, 128); // Green
      doc.circle(x, y, size, 'F');
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      
      // Checkmark
      doc.line(x - size/2 + 1, y, x - size/4, y + size/2 - 1);
      doc.line(x - size/4, y + size/2 - 1, x + size/2 - 1, y - size/3 + 1);
      break;
      
    case 'cross':
      doc.setFillColor(239, 68, 68); // Red
      doc.circle(x, y, size, 'F');
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      
      // X mark
      doc.line(x - size/2 + 1, y - size/2 + 1, x + size/2 - 1, y + size/2 - 1);
      doc.line(x - size/2 + 1, y + size/2 - 1, x + size/2 - 1, y - size/2 + 1);
      break;
      
    case 'warning':
      doc.setFillColor(251, 146, 60); // Orange
      doc.circle(x, y, size, 'F');
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      
      // Exclamation mark
      doc.line(x, y - size/2 + 1, x, y + size/4);
      doc.circle(x, y + size/2 - 1, 0.5, 'F');
      break;
      
    case 'info':
      doc.setFillColor(96, 165, 250); // Blue
      doc.circle(x, y, size, 'F');
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      
      // i letter
      doc.circle(x, y - size/3, 0.5, 'F');
      doc.line(x, y - size/6, x, y + size/2 - 1);
      break;
  }
}
