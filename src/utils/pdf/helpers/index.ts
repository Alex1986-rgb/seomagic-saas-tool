
// Re-export all helpers
export * from './colors';
export * from './pagination';
export * from './formatting';
export * from './qrcode';
export * from './seo';

// Adds a timestamp to the document
export const addTimestamp = (doc: any, x: number, y: number): void => {
  doc.text(`Generated: ${new Date().toLocaleString()}`, x, y);
};

// Get category status based on score
export const getCategoryStatus = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
};
