
/**
 * Primary color palette for PDF reports
 */
export const pdfColors = {
  primary: [155, 135, 245],       // #9b87f5
  secondary: [126, 105, 171],     // #7E69AB
  tertiary: [110, 89, 165],       // #6E59A5
  warning: [249, 115, 22],        // #F97316
  danger: [239, 68, 68],          // #EF4444
  success: [34, 197, 94],         // #22C55E
  info: [14, 165, 233],           // #0EA5E9
  dark: [31, 41, 55],             // #1F2937
  light: [243, 244, 246],         // #F3F4F6
  gray: [156, 163, 175],          // #9CA3AF
  background: [249, 250, 251],    // #F9FAFB
  text: [17, 24, 39],             // #111827
};

/**
 * Returns color for metric visualization based on score
 */
export const getMetricColor = (score: number): number[] => {
  if (score >= 90) return pdfColors.success;
  if (score >= 70) return [75, 180, 80];  // Light green
  if (score >= 50) return pdfColors.warning;
  if (score >= 30) return [255, 170, 50];  // Orange
  return pdfColors.danger;
};

/**
 * Returns text description for score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'отлично';
  if (score >= 70) return 'хорошо';
  if (score >= 50) return 'средне';
  if (score >= 30) return 'плохо';
  return 'критично';
};
