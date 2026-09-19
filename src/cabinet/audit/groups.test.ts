import { describe, expect, it } from 'vitest';
import { countSeverity, groupIssues, normGroups, priceOf, toCsv, totalPrice, type IssueRow } from './groups';
import { CHECKS, metaNote, pathOf, sevOf } from './labels';

const row = (id: string, type: string, severity: string, page: string | null, metadata: unknown = null): IssueRow => ({
  id,
  issue_type: type,
  category: 'seo',
  severity,
  page_id: page,
  metadata,
});

describe('groupIssues', () => {
  const pages = new Map([
    ['p1', 'https://a.ru/'],
    ['p2', 'https://a.ru/x'],
  ]);
  const groups = groupIssues(
    [
      row('1', 'short_title', 'medium', 'p1', { title_length: 12 }),
      row('2', 'missing_title', 'critical', 'p2'),
      row('3', 'short_title', 'medium', 'p2', { title_length: 20 }),
      row('4', 'missing_description', 'high', 'нет-такой'),
    ],
    pages,
  );

  it('сводит по типу и считает страницы', () => {
    const st = groups.find((g) => g.type === 'short_title')!;
    expect(st.count).toBe(2);
    expect(st.pages.map((p) => p.note)).toEqual(['title 12 знаков', 'title 20 знаков']);
  });

  it('тяжёлое идёт первым', () => {
    expect(groups.map((g) => g.type)).toEqual(['missing_title', 'missing_description', 'short_title']);
  });

  it('адрес без страницы не выдумывается, но замечание считается', () => {
    const md = groups.find((g) => g.type === 'missing_description')!;
    expect(md.count).toBe(1);
    expect(md.pages).toEqual([]);
  });

  it('считает замечания по уровням', () => {
    expect(countSeverity(groups)).toEqual({ critical: 2, warn: 2, total: 4 });
  });

  it('норма — проверки без находок', () => {
    const norm = normGroups(groups, 10);
    expect(norm).toHaveLength(CHECKS.length - 3);
    expect(norm.every((g) => g.sev === 'ok' && g.count === 10)).toBe(true);
  });

  it('цена только при ставке', () => {
    const st = groups.find((g) => g.type === 'short_title')!;
    expect(priceOf(st, [])).toBeNull();
    expect(priceOf(st, [{ id: 'short_title', rate: 35 }])).toBe(70);
    expect(totalPrice(groups, [])).toEqual({ total: 0, priced: false });
    expect(totalPrice(groups, [{ id: 'short_title', rate: 35 }])).toEqual({ total: 70, priced: true });
  });

  it('CSV с BOM и разделителем ;', () => {
    const csv = toCsv({ host: 'a.ru', date: '1', score: 70, groups });
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv).toContain('https://a.ru/x');
    expect(csv.split('\n')[0]).toContain(';');
  });
});

describe('labels', () => {
  it('уровни', () => {
    expect(sevOf('high')).toBe('critical');
    expect(sevOf('low')).toBe('warn');
  });
  it('пояснения и пути', () => {
    expect(metaNote({ load_time: 3.456 })).toBe('загрузка 3,5 с');
    expect(metaNote(null)).toBe('');
    expect(pathOf('https://a.ru/b/?c=1')).toBe('/b/?c=1');
  });
});
