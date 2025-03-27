
/**
 * Returns RGB color for score visualization
 */
export const getScoreColorRGB = (score: number): [number, number, number] => {
  if (score >= 90) return [74, 222, 128]; // green
  if (score >= 70) return [134, 239, 172]; // light green
  if (score >= 50) return [250, 204, 21];  // yellow
  if (score >= 30) return [251, 146, 60];  // orange
  return [239, 68, 68]; // red
};
