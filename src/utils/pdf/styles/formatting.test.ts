import { describe, it, expect } from 'vitest';
import { formatNumber, truncateText } from './formatting';

describe('formatNumber', () => {
  it('groups thousands (locale-independent on the digits)', () => {
    // ru-RU uses a (narrow) no-break space as the group separator; strip any
    // whitespace so the assertion is not tied to the exact separator char.
    expect(formatNumber(1234567).replace(/\s/g, '')).toBe('1234567');
  });
  it('leaves small numbers untouched', () => {
    expect(formatNumber(5)).toBe('5');
  });
});

describe('truncateText', () => {
  it('returns short text unchanged', () => {
    expect(truncateText('hello', 50)).toBe('hello');
  });
  it('truncates and appends an ellipsis', () => {
    expect(truncateText('abcdef', 3)).toBe('abc...');
  });
  it('treats length equal to max as not truncated', () => {
    expect(truncateText('abc', 3)).toBe('abc');
  });
});
