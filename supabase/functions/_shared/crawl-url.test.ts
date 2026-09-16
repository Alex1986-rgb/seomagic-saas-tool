import { describe, expect, it } from 'vitest';
import { canonicalizeUrl, isSameSite, normalizeUrl, parseSiteOrigin } from './crawl-url.ts';

const origin = parseSiteOrigin('https://www.example.ru/');

describe('приведение адресов обхода к одному виду', () => {
  it('сводит к одной записи разные написания одной страницы', () => {
    const variants = [
      'https://www.example.ru/catalog/',
      'https://www.example.ru/catalog',
      'http://www.example.ru/catalog',
      'https://example.ru/catalog',
      'https://www.example.ru/catalog#reviews',
      'https://www.example.ru/catalog?utm_source=yandex',
      'https://WWW.EXAMPLE.RU/catalog',
    ];

    const canonical = new Set(variants.map((url) => canonicalizeUrl(url, origin)));
    expect(canonical.size).toBe(1);
    expect([...canonical][0]).toBe('https://www.example.ru/catalog');
  });

  it('разные страницы не сливает', () => {
    const first = canonicalizeUrl('https://example.ru/catalog/reduktor', origin);
    const second = canonicalizeUrl('https://example.ru/catalog/motor', origin);
    expect(first).not.toBe(second);
  });

  it('значимые параметры сохраняет, рекламные метки убирает', () => {
    const withMarks = canonicalizeUrl('https://example.ru/search?q=редуктор&utm_medium=cpc&page=2', origin);
    expect(withMarks).toContain('q=%D1%80%D0%B5%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D1%80');
    expect(withMarks).toContain('page=2');
    expect(withMarks).not.toContain('utm_medium');
  });

  it('порядок параметров не создаёт вторую запись', () => {
    const straight = canonicalizeUrl('https://example.ru/search?a=1&b=2', origin);
    const reversed = canonicalizeUrl('https://example.ru/search?b=2&a=1', origin);
    expect(straight).toBe(reversed);
  });

  it('чужой домен оставляет как есть', () => {
    const foreign = canonicalizeUrl('https://other-site.com/page/', origin);
    expect(foreign).toBe('https://other-site.com/page');
    expect(isSameSite('other-site.com', origin)).toBe(false);
  });

  it('считает своим домен и с «www», и без него', () => {
    expect(isSameSite('example.ru', origin)).toBe(true);
    expect(isSameSite('www.example.ru', origin)).toBe(true);
  });

  it('мусор возвращает без падения', () => {
    expect(normalizeUrl('не адрес')).toBe('не адрес');
    expect(canonicalizeUrl('не адрес', origin)).toBe('не адрес');
  });
});
