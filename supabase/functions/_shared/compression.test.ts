import { describe, expect, it } from 'vitest';
import { completeHead, compressionFromHead, headerValue, statusCode } from './compression.ts';

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
const unknown = { compressed: null, type: null };

describe('проверка сжатия по заголовкам ответа', () => {
  it('видит сжатие', () => {
    expect(compressionFromHead(gzipHead)).toEqual({ compressed: true, type: 'gzip' });
  });

  it('видит его отсутствие', () => {
    expect(compressionFromHead(plainHead)).toEqual({ compressed: false, type: null });
  });

  it('«identity» считает отсутствием сжатия', () => {
    const head = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Encoding: identity\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: false, type: null });
  });

  it('берёт первый способ, если их перечислено несколько', () => {
    const head = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Encoding: br, gzip\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: true, type: 'br' });
  });

  it('не зависит от регистра заголовка', () => {
    const head = 'HTTP/1.1 200 OK\r\ncontent-type: TEXT/HTML\r\ncontent-encoding: BR\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: true, type: 'br' });
  });

  it('принимает XHTML как страницу', () => {
    const head = 'HTTP/1.1 200 OK\r\nContent-Type: application/xhtml+xml\r\n\r\n';
    expect(compressionFromHead(head)).toEqual({ compressed: false, type: null });
  });

  it('читает код ответа и переадресацию', () => {
    expect(statusCode(redirectHead)).toBe(301);
    expect(headerValue(redirectHead, 'location')).toBe('https://example.ru/');
    expect(statusCode(gzipHead)).toBe(200);
  });
});

describe('по неподходящему ответу «сжатия нет» не ставит', () => {
  it('переадресация — неизвестно', () => {
    expect(compressionFromHead(redirectHead)).toEqual(unknown);
  });

  it('отказ защиты от ботов и ошибки — неизвестно', () => {
    expect(compressionFromHead('HTTP/1.1 403 Forbidden\r\nContent-Type: text/html\r\n\r\n')).toEqual(unknown);
    expect(compressionFromHead('HTTP/1.1 405 Method Not Allowed\r\nContent-Type: text/html\r\n\r\n')).toEqual(unknown);
    expect(compressionFromHead('HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/html\r\n\r\n')).toEqual(unknown);
  });

  it('не HTML (карта сайта, картинка) или без типа — неизвестно', () => {
    expect(compressionFromHead('HTTP/1.1 200 OK\r\nContent-Type: application/xml\r\n\r\n')).toEqual(unknown);
    expect(compressionFromHead('HTTP/1.1 200 OK\r\nContent-Type: text/xml\r\n\r\n')).toEqual(unknown);
    expect(compressionFromHead('HTTP/1.1 200 OK\r\nServer: nginx\r\n\r\n')).toEqual(unknown);
  });

  it('заголовки пришли не целиком — неизвестно', () => {
    const cut = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nSet-Cookie: session=abc';
    expect(completeHead(cut)).toBeNull();
    expect(compressionFromHead(cut)).toEqual(unknown);
  });

  it('заголовки собираются из нескольких порций', () => {
    const parts = ['HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n', 'Content-Encoding: gzip\r\n', '\r\n<!doctype html>'];
    let received = '';
    let head: string | null = null;
    for (const part of parts) {
      received += part;
      head = completeHead(received);
      if (head) break;
    }
    expect(head).not.toBeNull();
    expect(head).not.toContain('<!doctype');
    expect(compressionFromHead(head!)).toEqual({ compressed: true, type: 'gzip' });
  });
});
