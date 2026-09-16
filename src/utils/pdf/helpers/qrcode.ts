
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
 * Кладёт готовый QR-код (data URL PNG) в документ.
 *
 * Возвращает false, если картинку вставить не удалось. Раньше на этот случай
 * рисовалась серая заглушка с надписью «QR Code» — в отчёте она выглядела как
 * код, который не сканируется. Теперь не рисуем ничего, а вызывающий не
 * печатает подпись.
 */
export function addQRCodeImage(
  doc: jsPDF,
  qrCodeDataUrl: string,
  x: number = 170,
  y: number = 20,
  size: number = 30
): boolean {
  try {
    // Белая подложка, чтобы код читался на любом фоне.
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x - 2, y - 2, size + 4, size + 4, 2, 2, 'F');

    doc.addImage(qrCodeDataUrl, 'PNG', x, y, size, size);
    return true;
  } catch (error) {
    console.error('Не удалось вставить QR-код в PDF:', error);
    return false;
  }
}

// Здесь была функция addQRCodeToPage: она рисовала «QR-код» из случайно
// закрашенных клеток (Math.random) с подписью «Scan for report». Камера такой
// узор не считывала. Настоящий код строят generateQRCodeDataUrl + addQRCodeImage.
