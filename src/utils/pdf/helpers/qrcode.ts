
import jsPDF from 'jspdf';

/**
 * Adds a QR code to the specified page of the PDF document
 * This is a simplified implementation - in a real application, 
 * we would use a QR code generation library
 */
export function addQRCodeToPage(
  doc: jsPDF, 
  data: string, 
  x: number = 170, 
  y: number = 20, 
  size: number = 30
): void {
  // Draw a placeholder box for the QR code
  doc.setDrawColor('#000000');
  doc.setFillColor('#FFFFFF');
  doc.roundedRect(x - 5, y - 5, size + 10, size + 10, 3, 3, 'FD');
  
  // Draw a fake QR code (grid)
  doc.setDrawColor('#000000');
  doc.setFillColor('#000000');
  
  const cellSize = size / 10;
  
  // Create a simple pattern to mimic a QR code
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Random fill to simulate QR code pattern
      if (Math.random() > 0.5) {
        doc.rect(x + i * cellSize, y + j * cellSize, cellSize, cellSize, 'F');
      }
    }
  }
  
  // Add corners (typical QR code markers)
  doc.setFillColor('#000000');
  // Top left
  doc.rect(x, y, cellSize * 3, cellSize * 3, 'F');
  doc.setFillColor('#FFFFFF');
  doc.rect(x + cellSize, y + cellSize, cellSize, cellSize, 'F');
  
  // Top right
  doc.setFillColor('#000000');
  doc.rect(x + size - cellSize * 3, y, cellSize * 3, cellSize * 3, 'F');
  doc.setFillColor('#FFFFFF');
  doc.rect(x + size - cellSize * 2, y + cellSize, cellSize, cellSize, 'F');
  
  // Bottom left
  doc.setFillColor('#000000');
  doc.rect(x, y + size - cellSize * 3, cellSize * 3, cellSize * 3, 'F');
  doc.setFillColor('#FFFFFF');
  doc.rect(x + cellSize, y + size - cellSize * 2, cellSize, cellSize, 'F');
  
  // Add small label
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Scan for report', x + size / 2, y + size + 8, { align: 'center' });
}
