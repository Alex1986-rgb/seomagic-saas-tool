import { describe, it, expect } from 'vitest';
import { getScoreColorRGB } from './colors';

describe('getScoreColorRGB', () => {
  it('returns green for excellent scores (>= 90)', () => {
    expect(getScoreColorRGB(95)).toEqual([74, 222, 128]);
    expect(getScoreColorRGB(90)).toEqual([74, 222, 128]);
  });
  it('returns light green for good scores (70-89)', () => {
    expect(getScoreColorRGB(70)).toEqual([134, 239, 172]);
    expect(getScoreColorRGB(89)).toEqual([134, 239, 172]);
  });
  it('returns yellow for medium scores (50-69)', () => {
    expect(getScoreColorRGB(55)).toEqual([250, 204, 21]);
  });
  it('returns orange for low scores (30-49)', () => {
    expect(getScoreColorRGB(35)).toEqual([251, 146, 60]);
  });
  it('returns red for critical scores (< 30)', () => {
    expect(getScoreColorRGB(10)).toEqual([239, 68, 68]);
    expect(getScoreColorRGB(0)).toEqual([239, 68, 68]);
  });
});
