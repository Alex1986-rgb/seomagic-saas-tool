import { describe, expect, it } from 'vitest';
import { buildLog, crawlTarget, etaSeconds, formatDuration, normalizeSiteUrl } from './run';

describe('run', () => {
  it('адрес', () => {
    expect(normalizeSiteUrl('shop.ru')).toBe('https://shop.ru/');
    expect(normalizeSiteUrl('http://a.ru/x')).toBe('http://a.ru/x');
    expect(normalizeSiteUrl('localhost')).toBeNull();
    expect(normalizeSiteUrl('  ')).toBeNull();
  });

  it('журнал: новые сверху, ошибки словами', () => {
    const log = buildLog(
      [
        { url: 'https://a.ru/', status_code: 200, load_time: 1.23, created_at: '2026-09-16T10:00:00Z' },
        { url: 'https://a.ru/x', status_code: 404, load_time: 0.2, created_at: '2026-09-16T10:00:02Z' },
      ],
      [{ at: new Date('2026-09-16T10:00:01Z').getTime(), text: 'этап: Обход' }],
    );
    expect(log).toEqual(['ошибка: /x ответ 404', 'этап: Обход', 'GET /  200  1.2 s']);
  });

  it('остаток только по замерам', () => {
    expect(etaSeconds([{ at: 0, scanned: 0 }], 100)).toBeNull();
    expect(etaSeconds([{ at: 0, scanned: 10 }, { at: 10000, scanned: 10 }], 100)).toBeNull();
    expect(etaSeconds([{ at: 0, scanned: 0 }, { at: 10000, scanned: 10 }], 100)).toBe(90);
    expect(formatDuration(90)).toBe('1 мин 30 с');
    expect(formatDuration(null)).toBe('—');
  });

  it('цель обхода', () => {
    expect(crawlTarget(100, 40)).toBe(40);
    expect(crawlTarget(100, 0)).toBe(100);
    expect(crawlTarget(null, 12)).toBe(12);
  });
});
