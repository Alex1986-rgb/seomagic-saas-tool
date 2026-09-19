import { describe, expect, it } from 'vitest';
import {
  buildKeywordRows,
  normalizeYandexRegion,
  parseKeywords,
  positionDelta,
  positionLabel,
  sortRows,
  sparkPoints,
  topCounts,
  type CheckRow,
  type ResultRow,
} from './positions-model';
import { chartPoints, describeChange, signed, toggleSelection } from './history-model';
import { relativeTime } from './time';

const check = (id: string, engine: string, created: string, region: string | null = '213'): CheckRow => ({
  id,
  domain: 'site.ru',
  search_engine: engine,
  region,
  depth: 100,
  status: 'completed',
  keywords_total: 0,
  keywords_checked: 0,
  error: null,
  created_at: created,
  completed_at: created,
});

const res = (checkId: string, engine: string, keyword: string, position: number): ResultRow => ({
  check_id: checkId,
  keyword,
  search_engine: engine,
  position,
  url: position ? `https://site.ru/${keyword}/` : null,
  checked_at: '2026-09-10T06:00:00Z',
});

describe('позиции', () => {
  const checks = [
    check('y1', 'yandex', '2026-09-01T06:00:00Z'),
    check('y2', 'yandex', '2026-09-10T06:00:00Z'),
    check('s1', 'yandex', '2026-09-12T06:00:00Z', '2'),
    check('g1', 'google', '2026-09-10T06:00:00Z', null),
  ];
  const results = [
    res('y1', 'yandex', 'диван', 8),
    res('y2', 'yandex', 'диван', 4),
    res('y1', 'yandex', 'стол', 0),
    res('y2', 'yandex', 'стол', 12),
    res('y1', 'yandex', 'старый', 5), // выпал из трекера — не в последней проверке
    res('s1', 'yandex', 'питер', 3),
    res('g1', 'google', 'диван', 7),
  ];

  it('берёт запросы последней проверки региона и считает динамику между двумя последними', () => {
    const rows = buildKeywordRows(checks, results, 'msk');
    expect(rows.map((r) => r.keyword).sort()).toEqual(['диван', 'стол']);
    const divan = rows.find((r) => r.keyword === 'диван')!;
    expect(divan.ya?.position).toBe(4);
    expect(divan.ya?.previous).toBe(8);
    expect(positionDelta(divan.ya)).toEqual({ label: '↑4', up: true });
    expect(divan.gg?.position).toBe(7);
    const stol = rows.find((r) => r.keyword === 'стол')!;
    expect(positionDelta(stol.ya)).toEqual({ label: '↑ вошёл', up: true });
  });

  it('регион фильтрует Яндекс, но не Google', () => {
    const rows = buildKeywordRows(checks, results, 'spb');
    expect(rows.map((r) => r.keyword).sort()).toEqual(['диван', 'питер']);
    expect(rows.find((r) => r.keyword === 'диван')!.ya).toBeNull();
  });

  it('падение — стрелка вниз, «нет в выдаче» — >глубины', () => {
    const cell = { position: 0, previous: 9, depth: 100, url: null, checkedAt: '', series: [] };
    expect(positionDelta(cell)).toEqual({ label: '↓ выпал', up: false });
    expect(positionLabel(cell)).toBe('>100');
    expect(positionDelta({ ...cell, position: 12, previous: 9 })).toEqual({ label: '↓3', up: false });
  });

  it('сортировка: меньшая позиция выше, ненайденные всегда внизу', () => {
    const rows = buildKeywordRows(checks, [...results, res('y2', 'yandex', 'шкаф', 0)], 'msk');
    expect(sortRows(rows, 'ya', 1).map((r) => r.keyword)).toEqual(['диван', 'стол', 'шкаф']);
    expect(sortRows(rows, 'ya', -1).map((r) => r.keyword)).toEqual(['стол', 'диван', 'шкаф']);
  });

  it('ТОП считается по одной системе', () => {
    const t = topCounts(buildKeywordRows(checks, results, 'msk'));
    expect(t).toEqual({ engine: 'yandex', top3: 0, top10: 1, top50: 2, tracked: 2 });
  });

  it('спарклайн: лучшая позиция выше, одна точка — пусто', () => {
    const pts = sparkPoints(
      [
        { at: '2026-09-01T00:00:00Z', position: 10 },
        { at: '2026-09-10T00:00:00Z', position: 2 },
      ],
      0,
    );
    expect(pts).toBe('0,19 80,3');
    expect(sparkPoints([{ at: '2026-09-01T00:00:00Z', position: 3 }], 0)).toBe('');
  });

  it('регион старых проверок текстом и ввод запросов', () => {
    expect(normalizeYandexRegion('Москва')).toBe('213');
    expect(normalizeYandexRegion(null)).toBe('213');
    expect(normalizeYandexRegion('Казань')).toBeNull();
    expect(parseKeywords(' диван \nДиван\n\nстол  обеденный;шкаф')).toEqual(['диван', 'стол обеденный', 'шкаф']);
  });
});

describe('история аудитов', () => {
  const a = { id: 'a', createdAt: '2026-08-01', score: 68, pages: 100, issues: 318, critical: 12 };
  const b = { id: 'b', createdAt: '2026-09-01', score: 74, pages: 100, issues: 251, critical: 9 };

  it('что изменилось — из измеренных чисел', () => {
    expect(describeChange(null, a)).toBe('Первый аудит проекта');
    expect(describeChange(a, b)).toBe('Балл +6, проблем −67');
    expect(describeChange(a, { ...b, issues: null, pages: 120 })).toBe('Балл +6, страниц +20');
    expect(signed(0)).toBe('0');
  });

  it('график в масштабе 0–100 и выбор двух аудитов', () => {
    expect(chartPoints([0, 100])).toEqual([
      { x: 20, y: 160 },
      { x: 580, y: 20 },
    ]);
    expect(toggleSelection(['a', 'b'], 'c')).toEqual(['b', 'c']);
    expect(toggleSelection(['a', 'b'], 'a')).toEqual(['b']);
  });
});

describe('время уведомлений', () => {
  const now = new Date(2026, 8, 16, 12, 0);
  it('минуты, часы, вчера, дата', () => {
    expect(relativeTime(new Date(2026, 8, 16, 11, 42).toISOString(), now)).toBe('18 мин назад');
    expect(relativeTime(new Date(2026, 8, 16, 6, 0).toISOString(), now)).toBe('6 ч назад');
    expect(relativeTime(new Date(2026, 8, 15, 20, 0).toISOString(), now)).toBe('вчера');
    expect(relativeTime(new Date(2026, 8, 14, 9, 0).toISOString(), now)).toBe('14 сен');
  });
});
