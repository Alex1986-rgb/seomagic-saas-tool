import { describe, it, expect } from 'vitest';
import { formatScoreText, sanitizeTextForPDF, truncateText } from './formatting';

describe('formatScoreText', () => {
  it('maps score ranges to Russian labels', () => {
    expect(formatScoreText(95)).toBe('Отлично');
    expect(formatScoreText(82)).toBe('Очень хорошо');
    expect(formatScoreText(72)).toBe('Хорошо');
    expect(formatScoreText(65)).toBe('Удовлетворительно');
    expect(formatScoreText(45)).toBe('Требует улучшений');
    expect(formatScoreText(20)).toBe('Критично');
  });
});

describe('sanitizeTextForPDF', () => {
  it('returns empty string for falsy input', () => {
    expect(sanitizeTextForPDF('')).toBe('');
  });
  it('keeps cyrillic and ascii', () => {
    expect(sanitizeTextForPDF('Привет world')).toBe('Привет world');
  });
  it('normalizes smart punctuation', () => {
    expect(sanitizeTextForPDF('“hi”')).toBe('"hi"');
    expect(sanitizeTextForPDF('a…')).toBe('a...');
  });
  it('strips control characters', () => {
    expect(sanitizeTextForPDF('ab')).toBe('ab');
  });
});

describe('truncateText (pdf helper)', () => {
  it('leaves short text untouched', () => {
    expect(truncateText('short', 10)).toBe('short');
  });
  it('truncates leaving room for the ellipsis (maxLength-3)', () => {
    expect(truncateText('abcdefgh', 6)).toBe('abc...');
  });
});
