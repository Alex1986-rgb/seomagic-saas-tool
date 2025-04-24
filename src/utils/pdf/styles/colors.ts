
/**
 * Color utilities for PDF generation
 */

// Color palette for PDF documents - matched to admin panel
export const pdfColors = {
  primary: [155, 135, 245] as [number, number, number],      // #9b87f5 - Primary purple
  secondary: [126, 105, 171] as [number, number, number],    // #7E69AB - Secondary purple
  tertiary: [110, 89, 165] as [number, number, number],      // #6E59A5 - Tertiary purple
  warning: [249, 115, 22] as [number, number, number],       // #F97316 - Orange
  danger: [239, 68, 68] as [number, number, number],         // #EF4444 - Red
  success: [34, 197, 94] as [number, number, number],        // #22C55E - Green
  info: [14, 165, 233] as [number, number, number],          // #0EA5E9 - Blue
  dark: [26, 31, 44] as [number, number, number],            // #1A1F2C - Dark background
  light: [241, 245, 249] as [number, number, number],        // #F1F5F9 - Light background
  gray: [142, 145, 150] as [number, number, number],         // #8E9196 - Neutral gray
  background: [249, 250, 251] as [number, number, number],   // #F9FAFB - Background color
  text: [17, 24, 39] as [number, number, number],            // #111827 - Text color
  
  // Pastel colors for charts
  chart: {
    purple: [229, 222, 255] as [number, number, number],     // #E5DEFF - Soft purple
    blue: [211, 228, 253] as [number, number, number],       // #D3E4FD - Soft blue
    green: [242, 252, 226] as [number, number, number],      // #F2FCE2 - Soft green
    yellow: [254, 247, 205] as [number, number, number],     // #FEF7CD - Soft yellow
    orange: [254, 198, 161] as [number, number, number],     // #FEC6A1 - Soft orange
    pink: [255, 222, 226] as [number, number, number],       // #FFDEE2 - Soft pink
    peach: [253, 225, 211] as [number, number, number],      // #FDE1D3 - Soft peach
  }
};

/**
 * Converts a numeric score (0-100) to a color on a red-yellow-green gradient
 */
export function getScoreColorRGB(score: number): [number, number, number] {
  // Ensure score is in range 0-100
  const validScore = Math.max(0, Math.min(100, score));
  
  if (validScore >= 80) {
    return pdfColors.success; // Green for high scores
  } else if (validScore >= 60) {
    return pdfColors.warning; // Orange for medium scores
  } else if (validScore >= 40) {
    return [253, 186, 116]; // Light orange (#FDBA74) for moderately low scores
  } else {
    return pdfColors.danger; // Red for poor scores
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

/**
 * Returns chart colors based on index
 */
export function getChartColor(index: number): [number, number, number] {
  const colors = [
    pdfColors.primary,
    pdfColors.secondary,
    pdfColors.tertiary,
    pdfColors.info,
    pdfColors.success,
    pdfColors.warning,
    pdfColors.danger
  ];
  
  return colors[index % colors.length];
}
