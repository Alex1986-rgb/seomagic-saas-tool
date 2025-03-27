
/**
 * Color utilities for PDF generation
 */

// Color palette for PDF documents
export const pdfColors = {
  primary: [56, 189, 248] as [number, number, number],       // Sky blue
  secondary: [139, 92, 246] as [number, number, number],     // Purple
  success: [74, 222, 128] as [number, number, number],       // Green
  warning: [251, 146, 60] as [number, number, number],       // Orange
  error: [239, 68, 68] as [number, number, number],          // Red
  info: [96, 165, 250] as [number, number, number],          // Blue
  light: [241, 245, 249] as [number, number, number],        // Light gray
  dark: [30, 41, 59] as [number, number, number],            // Dark blue/gray
  white: [255, 255, 255] as [number, number, number],        // White
  black: [0, 0, 0] as [number, number, number],              // Black
  muted: [148, 163, 184] as [number, number, number],        // Medium gray
  gray: [156, 163, 175] as [number, number, number]          // Additional gray color
};

/**
 * Converts a numeric score (0-100) to a color on a red-yellow-green gradient
 */
export function getScoreColorRGB(score: number): [number, number, number] {
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
export function getColorBrightness(baseColor: [number, number, number], brightness: number): [number, number, number] {
  return baseColor.map(channel => {
    const adjusted = channel * brightness;
    return Math.max(0, Math.min(255, adjusted));
  }) as [number, number, number];
}
