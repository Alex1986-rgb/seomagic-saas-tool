import { describe, it, expect } from 'vitest';
import {
  buildApiActivity,
  buildMonthWindows,
  buildRoleDistribution,
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

  it('нулевую длительность за замер не принимает', () => {
    expect(buildApiActivity([log({ duration_ms: 0 })], NOW).averageDuration).toBeNull();
    expect(buildApiActivity([log({ duration_ms: 0 }), log({ duration_ms: 300 })], NOW).averageDuration).toBe(300);
    expect(buildApiActivity([log({ duration_ms: 0 })], NOW).byFunction[0].averageDuration).toBeNull();
  });

  it('помнит, по скольким записям построены разбивки', () => {
    expect(buildApiActivity([log({}), log({})], NOW).sampleSize).toBe(2);
    expect(buildApiActivity([], NOW).sampleSize).toBe(0);
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

describe('buildMonthWindows', () => {
  it('отдаёт 12 месяцев подряд без дыр и перекрытий', () => {
    const windows = buildMonthWindows(NOW);
    expect(windows).toHaveLength(12);
    for (let i = 1; i < windows.length; i += 1) {
      expect(windows[i].from).toBe(windows[i - 1].to);
    }
  });

  it('последнее окно содержит текущий момент', () => {
    const windows = buildMonthWindows(NOW);
    const last = windows[windows.length - 1];
    expect(new Date(last.from).getTime()).toBeLessThanOrEqual(NOW);
    expect(new Date(last.to).getTime()).toBeGreaterThan(NOW);
  });
});

describe('buildRoleDistribution', () => {
  it('добавляет группу без роли только когда её удалось посчитать и она не пустая', () => {
    expect(buildRoleDistribution({ admin: 1, user: 2 }, 0).map((b) => b.name)).not.toContain(
      'Без назначенной роли',
    );
    expect(buildRoleDistribution({ admin: 1 }, null).map((b) => b.name)).not.toContain(
      'Без назначенной роли',
    );
    expect(buildRoleDistribution({ admin: 1 }, 4)).toContainEqual({ name: 'Без назначенной роли', value: 4 });
  });

  it('пустые роли не рисует', () => {
    expect(buildRoleDistribution({ admin: 0, user: 3 }, null)).toEqual([{ name: 'Пользователи', value: 3 }]);
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
