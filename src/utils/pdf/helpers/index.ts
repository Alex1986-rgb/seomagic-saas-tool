
// Re-export all helpers
export * from './colors';
export * from './pagination';
export * from './formatting';
export * from './qrcode';
export * from './seo';
export * from './charts';

// Adds a timestamp to the document
export const addTimestamp = (doc: any, x: number, y: number): void => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Сгенерировано: ${formattedDate}`, x, y);
};

// Get category status based on score
export const getCategoryStatus = (score: number): string => {
  if (score >= 90) return 'Отлично';
  if (score >= 70) return 'Хорошо';
  if (score >= 50) return 'Удовлетворительно';
  return 'Требует улучшений';
};

// jsPDF helper methods polyfill - used if the methods don't exist
export const extendJsPDF = (doc: any): void => {
  // Add translatePoint if not exists
  if (!doc.translatePoint) {
    doc.translatePoint = function(x: number, y: number) {
      this.text("", x, y);
    };
  }
  
  // Add rotatePoint if not exists
  if (!doc.rotatePoint) {
    doc.rotatePoint = function(angle: number) {
      const rad = angle * (Math.PI / 180);
      this.text("", 0, 0, { angle: rad });
    };
  }
};
