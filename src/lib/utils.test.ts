import { describe, it, expect } from 'vitest';
import { cn, formatError, withTimeout } from './utils';

describe('cn', () => {
  it('merges class names and dedupes tailwind conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold');
  });
});

describe('formatError', () => {
  it('returns strings as-is', () => {
    expect(formatError('boom')).toBe('boom');
  });
  it('reads Error.message', () => {
    expect(formatError(new Error('nope'))).toBe('nope');
  });
  it('reads message/error fields on plain objects', () => {
    expect(formatError({ message: 'm' })).toBe('m');
    expect(formatError({ error: 'e' })).toBe('e');
  });
  it('falls back for unknown shapes', () => {
    expect(formatError(null)).toBe('An unknown error occurred');
    expect(formatError(42)).toBe('An unknown error occurred');
  });
});

describe('withTimeout', () => {
  it('resolves when the promise beats the timeout', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 50)).resolves.toBe('ok');
  });
  it('rejects when the timeout wins', async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve('late'), 50));
    await expect(withTimeout(slow, 5, 'too slow')).rejects.toThrow('too slow');
  });
});
