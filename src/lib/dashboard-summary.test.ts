import { describe, expect, it } from 'vitest';
import { buildDashboardSummary, hostOf, type DashboardAudit } from './dashboard-summary';

const NOW = new Date('2026-09-14T12:00:00Z').getTime();
const DAY = 24 * 60 * 60 * 1000;

function audit(overrides: Partial<DashboardAudit> & { id: string }): DashboardAudit {
  return {
    url: 'https://example.com',
    seoScore: 70,
    status: 'completed',
    createdAt: new Date(NOW - DAY).toISOString(),
    completedAt: new Date(NOW - DAY).toISOString(),
    pagesScanned: 10,
    ...overrides,
  };
}

const empty = { positionCheckDates: [], optimizationDates: [], now: NOW };

describe('buildDashboardSummary', () => {
  it('на пустой базе не выдумывает ни одного показателя', () => {
    const summary = buildDashboardSummary({ audits: [], ...empty });
    expect(summary.totalAudits).toBe(0);
    expect(summary.averageScore).toBeNull();
    expect(summary.averageScoreChange).toBeNull();
    expect(summary.sites).toEqual([]);
    expect(summary.scoreTrend).toEqual([]);
  });

  it('считает средний балл только по аудитам, где балл есть', () => {
    const summary = buildDashboardSummary({
      audits: [
        audit({ id: '1', seoScore: 80 }),
        audit({ id: '2', seoScore: 60 }),
        audit({ id: '3', seoScore: null, status: 'scanning' }),
      ],
      ...empty,
    });
    expect(summary.totalAudits).toBe(3);
    expect(summary.averageScore).toBe(70);
  });

  it('считает сайты по домену, не различая www и разные страницы', () => {
    const summary = buildDashboardSummary({
      audits: [
        audit({ id: '1', url: 'https://www.example.com/page' }),
        audit({ id: '2', url: 'https://example.com/other' }),
        audit({ id: '3', url: 'https://shop.example.com/' }),
      ],
      ...empty,
    });
    expect(summary.sites).toEqual(['example.com', 'shop.example.com']);
  });

  it('сравнивает средний балл месяца с предыдущим месяцем', () => {
    const summary = buildDashboardSummary({
      audits: [
        audit({ id: 'сейчас', seoScore: 75, createdAt: new Date(NOW - 5 * DAY).toISOString() }),
        audit({ id: 'раньше', seoScore: 60, createdAt: new Date(NOW - 40 * DAY).toISOString() }),
      ],
      ...empty,
    });
    expect(summary.averageScoreChange).toBe(15);
  });

  it('не показывает изменение, когда сравнивать не с чем', () => {
    const summary = buildDashboardSummary({
      audits: [audit({ id: '1', seoScore: 75 })],
      ...empty,
    });
    expect(summary.averageScoreChange).toBeNull();
  });

  it('не засчитывает в месяц то, что старше месяца', () => {
    const summary = buildDashboardSummary({
      audits: [
        audit({ id: 'свежий', createdAt: new Date(NOW - 2 * DAY).toISOString() }),
        audit({ id: 'старый', createdAt: new Date(NOW - 45 * DAY).toISOString() }),
      ],
      positionCheckDates: [
        new Date(NOW - DAY).toISOString(),
        new Date(NOW - 60 * DAY).toISOString(),
      ],
      optimizationDates: [new Date(NOW - 100 * DAY).toISOString()],
      now: NOW,
    });
    expect(summary.totalAudits).toBe(2);
    expect(summary.auditsLastMonth).toBe(1);
    expect(summary.sitesLastMonth).toBe(1);
    expect(summary.positionChecks).toBe(2);
    expect(summary.positionChecksLastMonth).toBe(1);
    expect(summary.optimizations).toBe(1);
    expect(summary.optimizationsLastMonth).toBe(0);
  });

  it('строит график от старых аудитов к новым', () => {
    const summary = buildDashboardSummary({
      audits: [
        audit({ id: 'новый', seoScore: 90, createdAt: new Date(NOW - DAY).toISOString() }),
        audit({ id: 'старый', seoScore: 50, createdAt: new Date(NOW - 10 * DAY).toISOString() }),
      ],
      ...empty,
    });
    expect(summary.scoreTrend.map((point) => point.score)).toEqual([50, 90]);
  });

  it('переживает записи без даты и с нечитаемым адресом', () => {
    const summary = buildDashboardSummary({
      audits: [audit({ id: '1', url: 'не-адрес', createdAt: null, completedAt: null })],
      ...empty,
    });
    expect(summary.sites).toEqual(['не-адрес']);
    expect(summary.auditsLastMonth).toBe(0);
    expect(summary.scoreTrend[0].date).toBe('—');
  });
});

describe('hostOf', () => {
  it('убирает www и путь', () => {
    expect(hostOf('https://www.seomarket.ru/audit?x=1')).toBe('seomarket.ru');
  });
});
