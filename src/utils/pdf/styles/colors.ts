
/**
 * Color definitions for PDF reports
 */

export const pdfColors = {
  primary: [56, 189, 248] as [number, number, number], // sky blue
  secondary: [139, 92, 246] as [number, number, number], // purple
  error: [239, 68, 68] as [number, number, number], // red
  warning: [251, 146, 60] as [number, number, number], // orange
  success: [74, 222, 128] as [number, number, number], // green
  info: [96, 165, 250] as [number, number, number], // blue
  gray: [100, 116, 139] as [number, number, number], // slate
  lightGray: [203, 213, 225] as [number, number, number], // light slate
  darkGray: [51, 65, 85] as [number, number, number], // dark slate
  black: [15, 23, 42] as [number, number, number], // slate black
  white: [255, 255, 255] as [number, number, number], // white
};

/**
 * Returns RGB color for score visualization
 */
export const getScoreColorRGB = (score: number): [number, number, number] => {
  if (score >= 90) return pdfColors.success;
  if (score >= 70) return [134, 239, 172]; // light green
  if (score >= 50) return [250, 204, 21];  // yellow
  if (score >= 30) return pdfColors.warning;
  return pdfColors.error;
};
