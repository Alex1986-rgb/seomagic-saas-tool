
import jsPDF from 'jspdf';

/**
 * Adds a QR code representation to the PDF page
 * This is a simplified placeholder - in a real implementation, 
 * this would use a QR code generation library
 */
export function addQRCodeToPage(doc: jsPDF, data: string, x: number, y: number, size: number = 30): void {
  // Add a square placeholder for QR code
  doc.setDrawColor(0);
  doc.setFillColor(230, 230, 230);
  doc.rect(x, y, size, size, 'FD');
  
  // Add small text indicating this is a QR code
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text(`QR: ${data.substring(0, 10)}...`, x + size/2, y + size + 5, { align: 'center' });
}
