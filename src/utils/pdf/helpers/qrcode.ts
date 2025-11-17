
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL
 */
export async function generateQRCodeDataUrl(
  data: string,
  size: number = 150
): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Adds a QR code image to the PDF document
 * The QR code should be pre-generated as a data URL
 */
export function addQRCodeImage(
  doc: jsPDF,
  qrCodeDataUrl: string,
  x: number = 170,
  y: number = 20,
  size: number = 30
): void {
  try {
    // Draw white background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x - 2, y - 2, size + 4, size + 4, 2, 2, 'F');
    
    // Add QR code image to PDF
    doc.addImage(qrCodeDataUrl, 'PNG', x, y, size, size);
  } catch (error) {
    console.error('Error adding QR code to PDF:', error);
    
    // Fallback: draw a simple placeholder
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(x, y, size, size, 2, 2, 'FD');
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('QR Code', x + size / 2, y + size / 2, { align: 'center' });
  }
}

/**
 * Legacy function that draws a placeholder QR code
 * Use generateQRCodeDataUrl + addQRCodeImage for real QR codes
 */
export function addQRCodeToPage(
  doc: jsPDF, 
  data: string, 
  x: number = 170, 
  y: number = 20, 
  size: number = 30
): void {
  // Draw a placeholder box for the QR code
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x - 5, y - 5, size + 10, size + 10, 3, 3, 'FD');
  
  // Draw a fake QR code (grid)
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(0, 0, 0);

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
  doc.setFillColor(0, 0, 0);
  // Top left
  doc.rect(x, y, cellSize * 3, cellSize * 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cellSize, y + cellSize, cellSize, cellSize, 'F');
  
  // Top right
  doc.setFillColor(0, 0, 0);
  doc.rect(x + size - cellSize * 3, y, cellSize * 3, cellSize * 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + size - cellSize * 2, y + cellSize, cellSize, cellSize, 'F');
  
  // Bottom left
  doc.setFillColor(0, 0, 0);
  doc.rect(x, y + size - cellSize * 3, cellSize * 3, cellSize * 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cellSize, y + size - cellSize * 2, cellSize, cellSize, 'F');
  
  // Add small label
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Scan for report', x + size / 2, y + size + 8, { align: 'center' });
}

