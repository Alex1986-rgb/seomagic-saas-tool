import { describe, it, expect } from 'vitest';
import {
  buildApiActivity,
  buildMonthlyCounts,
  buildRoleDistribution,
  countSince,
  formatDateTime,
  isErrorStatus,
  type ApiLogRow,
} from './admin-stats';

const NOW = new Date('2026-09-16T12:30:00Z').getTime();

function log(partial: Partial<ApiLogRow>): ApiLogRow {
  return {
    function_name: 'audit-start',
    status_code: 200,
    duration_ms: 100,
    created_at: new Date(NOW - 10 * 60 * 1000).toISOString(),
    ...partial,
  };
}

describe('buildApiActivity', () => {
  it('на пустом журнале не выдумывает нулевую статистику', () => {
    const stats = buildApiActivity([], NOW);
    expect(stats.total).toBe(0);
    expect(stats.byHour).toEqual([]);
    expect(stats.statusGroups).toEqual([]);
    expect(stats.lastCallAt).toBeNull();
  });

  it('считает ошибками только ответы 4xx и 5xx', () => {
    const stats = buildApiActivity(
      [log({}), log({ status_code: 404 }), log({ status_code: 500 }), log({ status_code: null })],
      NOW,
    );
    expect(stats.total).toBe(4);
    expect(stats.errors).toBe(2);
  });

  it('усредняет длительность только по замеренным вызовам', () => {
    const stats = buildApiActivity([log({ duration_ms: 100 }), log({ duration_ms: 300 }), log({ duration_ms: null })], NOW);
    expect(stats.averageDuration).toBe(200);
  });

  it('не показывает среднее, если время нигде не замерялось', () => {
    const stats = buildApiActivity([log({ duration_ms: null })], NOW);
    expect(stats.averageDuration).toBeNull();
  });

  it('раскладывает вызовы по 24 часовым корзинам', () => {
    const stats = buildApiActivity([log({}), log({ created_at: new Date(NOW - 3 * 60 * 60 * 1000).toISOString() })], NOW);
    expect(stats.byHour).toHaveLength(24);
    expect(stats.byHour.reduce((sum, bucket) => sum + bucket.calls, 0)).toBe(2);
  });

  it('пустые группы кодов в диаграмму не попадают', () => {
    const stats = buildApiActivity([log({}), log({})], NOW);
    expect(stats.statusGroups.map((group) => group.name)).toEqual(['Успешные']);
  });

  it('берёт самый свежий вызов, а не первый в списке', () => {
    const fresh = new Date(NOW - 60 * 1000).toISOString();
    const stats = buildApiActivity([log({ created_at: new Date(NOW - 5 * 60 * 60 * 1000).toISOString() }), log({ created_at: fresh })], NOW);
    expect(stats.lastCallAt).toBe(fresh);
  });

  it('группирует по имени функции и сортирует по числу вызовов', () => {
    const stats = buildApiActivity(
      [log({ function_name: 'a' }), log({ function_name: 'b' }), log({ function_name: 'b' })],
      NOW,
    );
    expect(stats.byFunction[0]).toMatchObject({ name: 'b', calls: 2 });
  });
});

describe('buildMonthlyCounts', () => {
  it('отдаёт ровно 12 месяцев и считает попадания', () => {
    const buckets = buildMonthlyCounts([new Date(NOW).toISOString(), new Date(NOW).toISOString()], NOW);
    expect(buckets).toHaveLength(12);
    expect(buckets[buckets.length - 1].count).toBe(2);
  });

  it('не падает на пустых и битых датах', () => {
    const buckets = buildMonthlyCounts([null, 'не дата'], NOW);
    expect(buckets.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(0);
  });
});

describe('buildRoleDistribution', () => {
  it('добавляет группу без роли только когда такие профили есть', () => {
    expect(buildRoleDistribution(['admin', 'admin', 'user'], 3).map((b) => b.name)).not.toContain(
      'Без назначенной роли',
    );
    expect(buildRoleDistribution(['admin'], 5)).toContainEqual({ name: 'Без назначенной роли', value: 4 });
  });
});

describe('countSince', () => {
  it('считает только даты внутри окна', () => {
    const inside = new Date(NOW - 5 * 24 * 60 * 60 * 1000).toISOString();
    const outside = new Date(NOW - 40 * 24 * 60 * 60 * 1000).toISOString();
    expect(countSince([inside, outside, null], 30, NOW)).toBe(1);
  });
});

describe('formatDateTime', () => {
  it('пустое значение не превращает в дату', () => {
    expect(formatDateTime(null)).toBe('—');
    expect(formatDateTime('мусор')).toBe('—');
  });
});

describe('isErrorStatus', () => {
  it('без кода статуса ошибкой не считает', () => {
    expect(isErrorStatus(null)).toBe(false);
    expect(isErrorStatus(200)).toBe(false);
    expect(isErrorStatus(503)).toBe(true);
  });
});
