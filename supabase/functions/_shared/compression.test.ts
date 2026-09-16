import { describe, expect, it } from 'vitest';
import { compressionFromHead, headerValue, statusCode } from './compression.ts';

const gzipHead = [
  'HTTP/1.1 200 OK',
  'Server: nginx/1.30.4',
  'Content-Type: text/html; charset=utf-8',
  'Vary: Accept-Encoding',
  'Content-Encoding: gzip',
  '',
  '',
].join('\r\n');

const plainHead = 'HTTP/1.1 200 OK\r\nServer: nginx\r\nContent-Type: text/html\r\n\r\n';
const redirectHead = 'HTTP/1.1 301 Moved Permanently\r\nLocation: https://example.ru/\r\n\r\n';

describe('проверка сжатия по заголовкам ответа', () => {
  it('видит сжатие', () => {
    expect(compressionFromHead(gzipHead)).toEqual({ compressed: true, type: 'gzip' });
  });

  it('видит его отсутствие', () => {
    expect(compressionFromHead(plainHead)).toEqual({ compressed: false, type: null });
  });

  it('«identity» считает отсутствием сжатия', () => {
    const head = 'HTTP/1.1 200 OK\r\nContent-Encoding: identity\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: false, type: null });
  });

  it('берёт первый способ, если их перечислено несколько', () => {
    const head = 'HTTP/1.1 200 OK\r\nContent-Encoding: br, gzip\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: true, type: 'br' });
  });

  it('не зависит от регистра заголовка', () => {
    const head = 'HTTP/1.1 200 OK\r\ncontent-encoding: BR\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: true, type: 'br' });
  });

  it('читает код ответа и переадресацию', () => {
    expect(statusCode(redirectHead)).toBe(301);
    expect(headerValue(redirectHead, 'location')).toBe('https://example.ru/');
    expect(statusCode(gzipHead)).toBe(200);
  });
});
