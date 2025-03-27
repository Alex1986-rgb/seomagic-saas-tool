
/**
 * Color utilities for PDF generation
 */

// Color palette for PDF documents
export const pdfColors = {
  primary: [56, 189, 248],       // Sky blue
  secondary: [139, 92, 246],     // Purple
  success: [74, 222, 128],       // Green
  warning: [251, 146, 60],       // Orange
  error: [239, 68, 68],          // Red
  info: [96, 165, 250],          // Blue
  light: [241, 245, 249],        // Light gray
  dark: [30, 41, 59],            // Dark blue/gray
  white: [255, 255, 255],        // White
  black: [0, 0, 0],              // Black
  muted: [148, 163, 184]         // Medium gray
};

/**
 * Converts a numeric score (0-100) to a color on a red-yellow-green gradient
 */
export function getScoreColorRGB(score: number): number[] {
  // Ensure score is in range 0-100
  const validScore = Math.max(0, Math.min(100, score));
  
  if (validScore >= 80) {
    return pdfColors.success; // Green for high scores
  } else if (validScore >= 50) {
    return pdfColors.warning; // Orange for medium scores
  } else {
    return pdfColors.error; // Red for poor scores
  }
}

/**
 * Returns a color brightness variant
 */
export function getColorBrightness(baseColor: number[], brightness: number): number[] {
  return baseColor.map(channel => {
    const adjusted = channel * brightness;
    return Math.max(0, Math.min(255, adjusted));
  });
}
