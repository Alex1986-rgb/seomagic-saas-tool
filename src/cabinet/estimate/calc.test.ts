import { describe, expect, it } from 'vitest';
import { calcEstimate, discountPct, lineSum, TEMPLATE_PRICE } from './calc';
import { aggregateIssues, presetPicks, unitFor } from './works';

describe('discountPct — скидка от количества правок', () => {
  it('пороги 100 / 1 000 / 3 000', () => {
    expect(discountPct(0)).toBe(0);
    expect(discountPct(99)).toBe(0);
    expect(discountPct(100)).toBe(0.2);
    expect(discountPct(999)).toBe(0.2);
    expect(discountPct(1000)).toBe(0.4);
    expect(discountPct(2999)).toBe(0.4);
    expect(discountPct(3000)).toBe(0.55);
  });
});

describe('lineSum', () => {
  it('ставка × объём', () => {
    expect(lineSum(214, 35)).toEqual({ sum: 7490, template: false });
    expect(lineSum(3, 20.5)).toEqual({ sum: 61.5, template: false });
  });
  it('свыше 10 000 правок — шаблон, если он дешевле', () => {
    expect(lineSum(10001, 20)).toEqual({ sum: TEMPLATE_PRICE, template: true });
    expect(lineSum(10000, 20)).toEqual({ sum: 200000, template: false });
    // Ставка настолько мала, что постранично дешевле шаблона — берём постраничную.
    expect(lineSum(20000, 0.1)).toEqual({ sum: 2000, template: false });
  });
  it('мусор не даёт NaN', () => {
    expect(lineSum(Number.NaN, 10).sum).toBe(0);
    expect(lineSum(5, -3).sum).toBe(0);
  });
});

describe('calcEstimate — пример из макета', () => {
  it('набор «Рекомендуемое»: 4 199 правок, скидка 55 %', () => {
    const r = calcEstimate([
      { key: 'meta', qty: 310, rate: 35, picked: true },
      { key: 'alt', qty: 1284, rate: 20, picked: true },
      { key: 'links', qty: 37, rate: 50, picked: true },
      { key: 'canon', qty: 142, rate: 30, picked: true },
      { key: 'inlink', qty: 1636, rate: 50, picked: true },
      { key: 'url', qty: 96, rate: 50, picked: true },
      { key: 'prod', qty: 340, rate: 120, picked: false },
      { key: 'seotext', qty: 48, rate: 600, picked: true },
      { key: 'webp', qty: 640, rate: 15, picked: true },
      { key: 'text', qty: 88, rate: 250, picked: false },
      { key: 'schema', qty: 6, rate: 150, picked: true },
    ]);
    expect(r.units).toBe(4199);
    expect(r.gross).toBe(10850 + 25680 + 1850 + 4260 + 81800 + 4800 + 28800 + 9600 + 900);
    expect(r.pct).toBe(0.55);
    expect(r.discount).toBe(Math.round(r.gross * 0.55));
    expect(r.total).toBe(r.gross - r.discount);
    expect(r.lines.find((l) => l.key === 'prod')?.sum).toBe(0);
  });

  it('пустая смета', () => {
    expect(calcEstimate([])).toMatchObject({ gross: 0, units: 0, pct: 0, discount: 0, total: 0 });
  });
});

describe('works — объёмы из замечаний', () => {
  const rows = [
    { issue_type: 'missing_title', severity: 'critical', can_auto_fix: true, metadata: null },
    { issue_type: 'missing_title', severity: 'critical', can_auto_fix: true, metadata: null },
    { issue_type: 'missing_alt_text', severity: 'medium', can_auto_fix: false, metadata: { missing_alt_count: 12 } },
    { issue_type: 'missing_alt_text', severity: 'medium', can_auto_fix: false, metadata: {} },
    { issue_type: 'broken_link', severity: 'high', can_auto_fix: false, metadata: null },
    { issue_type: 'long_title', severity: 'low', can_auto_fix: true, metadata: null },
  ];

  it('alt считается картинками и сводится к строке прайса missing_image_alt', () => {
    const v = aggregateIssues(rows);
    const alt = v.find((x) => x.priceType === 'missing_image_alt');
    expect(alt).toMatchObject({ qty: 13, issues: 2, issueTypes: ['missing_alt_text'] });
    expect(unitFor('missing_image_alt')).toBe('изображение');
    expect(unitFor('broken_link')).toBe('адрес');
    expect(unitFor('missing_title')).toBe('страница');
  });

  it('наборы считаются от признаков замечаний', () => {
    const v = aggregateIssues(rows);
    expect([...presetPicks('critical', v)].sort()).toEqual(['broken_link', 'missing_title']);
    expect([...presetPicks('recommended', v)].sort()).toEqual(['long_title', 'missing_title']);
    expect(presetPicks('all', v).size).toBe(4);
  });
});
