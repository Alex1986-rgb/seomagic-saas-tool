
/**
 * Drawing utilities for PDF generation
 */

import jsPDF from 'jspdf';
import { getScoreColorRGB } from './colors';

/**
 * Draws a gauge for visualizing scores (0-100)
 */
export function drawGauge(
  doc: jsPDF, 
  score: number, 
  x: number, 
  y: number, 
  radius: number = 25
): void {
  // Draw background circle
  doc.setFillColor(240, 240, 240);
  doc.circle(x, y, radius, 'F');
  
  // Calculate angles for the arc (0-100 maps to 0-180 degrees)
  const startAngle = 180;
  const endAngle = 180 + (score * 1.8); // 1.8 degrees per unit of score
  
  // Draw score arc
  const scoreColor = getScoreColorRGB(score);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.ellipse(x, y, radius, radius, 'F', undefined, {
    start: startAngle * Math.PI / 180,
    end: endAngle * Math.PI / 180
  });
  
  // Cut out inner circle to create a gauge shape
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y, radius * 0.7, 'F');
  
  // Add score text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(radius * 0.8);
  doc.setTextColor(0, 0, 0);
  doc.text(score.toString(), x, y + radius * 0.3, { align: 'center' });
  
  // Add indicator marks
  drawGaugeMarkers(doc, x, y, radius);
}

/**
 * Draws markers on the gauge
 */
function drawGaugeMarkers(
  doc: jsPDF, 
  x: number, 
  y: number, 
  radius: number
): void {
  // Draw major markers
  const markerPositions = [0, 25, 50, 75, 100];
  const markerColors = [
    [239, 68, 68],   // Red (0)
    [251, 146, 60],  // Orange (25)
    [251, 191, 36],  // Yellow (50)
    [163, 230, 53],  // Light green (75)
    [74, 222, 128]   // Green (100)
  ];
  
  // Draw small dots for the markers
  markerPositions.forEach((pos, index) => {
    const angle = 180 + (pos * 1.8); // 1.8 degrees per unit
    const radians = angle * Math.PI / 180;
    
    // Calculate position on the gauge
    const markerX = x + Math.cos(radians) * (radius * 0.85);
    const markerY = y + Math.sin(radians) * (radius * 0.85);
    
    // Draw colored marker
    doc.setFillColor(markerColors[index][0], markerColors[index][1], markerColors[index][2]);
    doc.circle(markerX, markerY, radius * 0.08, 'F');
  });
}

/**
 * Draws a simple horizontal bar
 */
export function drawHorizontalBar(
  doc: jsPDF, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  percentage: number, 
  color: number[] = [56, 189, 248]
): void {
  // Draw background
  doc.setFillColor(240, 240, 240);
  doc.rect(x, y, width, height, 'F');
  
  // Draw filled portion
  const fillWidth = width * (percentage / 100);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(x, y, fillWidth, height, 'F');
  
  // Add percentage text
  doc.setFontSize(height * 0.7);
  doc.setTextColor(0, 0, 0);
  doc.text(`${Math.round(percentage)}%`, x + width + 5, y + height * 0.7);
}

/**
 * Draws a simple vertical bar
 */
export function drawVerticalBar(
  doc: jsPDF, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  percentage: number, 
  color: number[] = [56, 189, 248],
  showLabel: boolean = true
): void {
  // Calculate dimensions based on percentage
  const fillHeight = height * (percentage / 100);
  
  // Draw background
  doc.setFillColor(240, 240, 240);
  doc.rect(x, y, width, height, 'F');
  
  // Draw filled portion (from bottom)
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(x, y + height - fillHeight, width, fillHeight, 'F');
  
  // Add percentage text
  if (showLabel) {
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`${Math.round(percentage)}%`, x + width / 2, y - 3, { align: 'center' });
  }
}

/**
 * Draws a simple pie chart
 */
export function drawPieChart(
  doc: jsPDF, 
  x: number, 
  y: number, 
  radius: number, 
  segments: Array<{ value: number; color: number[]; label?: string }>
): void {
  // Calculate total value
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  
  // Draw segments
  let startAngle = 0;
  segments.forEach(segment => {
    // Calculate angles
    const angle = (segment.value / total) * 360;
    const endAngle = startAngle + angle;
    
    // Draw segment
    doc.setFillColor(segment.color[0], segment.color[1], segment.color[2]);
    doc.ellipse(x, y, radius, radius, 'F', undefined, {
      start: startAngle * Math.PI / 180,
      end: endAngle * Math.PI / 180
    });
    
    // Update start angle for next segment
    startAngle = endAngle;
  });
  
  // Add labels if needed (outside the chart)
  let labelY = y + radius + 10;
  segments.forEach(segment => {
    if (segment.label) {
      doc.setFillColor(segment.color[0], segment.color[1], segment.color[2]);
      doc.rect(x - radius - 10, labelY - 4, 8, 8, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`${segment.label} (${Math.round((segment.value / total) * 100)}%)`, x - radius, labelY);
      
      labelY += 10;
    }
  });
}
