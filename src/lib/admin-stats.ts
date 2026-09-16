/**
 * Расчёты для административных разделов.
 *
 * Вынесены из компонентов: считать метрики и рисовать карточки — разные
 * задачи. Здесь только чистые функции над строками из базы, никаких
 * вписанных в код «показателей».
 */

export interface ApiLogRow {
  function_name: string;
  status_code: number | null;
  duration_ms: number | null;
  created_at: string | null;
}

export interface HourBucket {
  hour: string;
  calls: number;
  errors: number;
}

export interface FunctionBucket {
  name: string;
  calls: number;
  errors: number;
  averageDuration: number | null;
}

export interface StatusGroup {
  name: string;
  value: number;
  color: string;
}

export interface ApiActivityStats {
  /** Сколько строк реально пришло из api_logs за окно расчёта. */
  total: number;
  errors: number;
  averageDuration: number | null;
  byHour: HourBucket[];
  byFunction: FunctionBucket[];
  statusGroups: StatusGroup[];
  /** Время самого свежего вызова — честная замена «uptime сервера». */
  lastCallAt: string | null;
}

export const EMPTY_API_ACTIVITY: ApiActivityStats = {
  total: 0,
  errors: 0,
  averageDuration: null,
  byHour: [],
  byFunction: [],
  statusGroups: [],
  lastCallAt: null,
};

const HOUR_MS = 60 * 60 * 1000;
const HOURS_IN_WINDOW = 24;

/** Ошибкой считаем ответ 4xx/5xx; строки без кода статуса в ошибки не записываем. */
export function isErrorStatus(status: number | null): boolean {
  return typeof status === 'number' && status >= 400;
}

function hourLabel(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:00`;
}

/**
 * Разбор строк api_logs за последние сутки.
 *
 * Пустой массив на входе даёт пустую статистику, а не нули, выданные за
 * измерение: интерфейс по `total === 0` показывает «данных пока нет».
 */
export function buildApiActivity(rows: ApiLogRow[], now = Date.now()): ApiActivityStats {
  if (rows.length === 0) return EMPTY_API_ACTIVITY;

  const durations = rows
    .map((row) => row.duration_ms)
    .filter((value): value is number => typeof value === 'number');

  const buckets = new Map<number, HourBucket>();
  const currentHourStart = Math.floor(now / HOUR_MS) * HOUR_MS;
  for (let i = HOURS_IN_WINDOW - 1; i >= 0; i -= 1) {
    const start = currentHourStart - i * HOUR_MS;
    buckets.set(start, { hour: hourLabel(new Date(start)), calls: 0, errors: 0 });
  }

  const functions = new Map<string, { calls: number; errors: number; durations: number[] }>();
  let errors = 0;
  let lastCallAt: string | null = null;

  for (const row of rows) {
    const failed = isErrorStatus(row.status_code);
    if (failed) errors += 1;

    if (row.created_at) {
      const time = new Date(row.created_at).getTime();
      if (!Number.isNaN(time)) {
        if (lastCallAt === null || time > new Date(lastCallAt).getTime()) lastCallAt = row.created_at;
        const bucket = buckets.get(Math.floor(time / HOUR_MS) * HOUR_MS);
        if (bucket) {
          bucket.calls += 1;
          if (failed) bucket.errors += 1;
        }
      }
    }

    const fn = functions.get(row.function_name) ?? { calls: 0, errors: 0, durations: [] };
    fn.calls += 1;
    if (failed) fn.errors += 1;
    if (typeof row.duration_ms === 'number') fn.durations.push(row.duration_ms);
    functions.set(row.function_name, fn);
  }

  const success = rows.filter((row) => typeof row.status_code === 'number' && row.status_code < 400).length;
  const clientErrors = rows.filter(
    (row) => typeof row.status_code === 'number' && row.status_code >= 400 && row.status_code < 500,
  ).length;
  const serverErrors = rows.filter(
    (row) => typeof row.status_code === 'number' && row.status_code >= 500,
  ).length;

  const statusGroups: StatusGroup[] = [
    { name: 'Успешные', value: success, color: '#22c55e' },
    { name: 'Ошибки запроса (4xx)', value: clientErrors, color: '#f97316' },
    { name: 'Сбои функции (5xx)', value: serverErrors, color: '#ef4444' },
  ].filter((group) => group.value > 0);

  return {
    total: rows.length,
    errors,
    averageDuration: durations.length
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : null,
    byHour: [...buckets.values()],
    byFunction: [...functions.entries()]
      .map(([name, value]) => ({
        name,
        calls: value.calls,
        errors: value.errors,
        averageDuration: value.durations.length
          ? Math.round(value.durations.reduce((sum, item) => sum + item, 0) / value.durations.length)
          : null,
      }))
      .sort((a, b) => b.calls - a.calls),
    statusGroups,
    lastCallAt,
  };
}

const MONTH_NAMES = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export interface MonthBucket {
  month: string;
  count: number;
}

/** Регистрации по месяцам за последний год — из дат создания профилей. */
export function buildMonthlyCounts(dates: (string | null)[], now = Date.now(), months = 12): MonthBucket[] {
  const reference = new Date(now);
  const buckets = new Map<string, MonthBucket>();

  for (let i = months - 1; i >= 0; i -= 1) {
    const point = new Date(reference.getFullYear(), reference.getMonth() - i, 1);
    buckets.set(`${point.getFullYear()}-${point.getMonth()}`, {
      month: MONTH_NAMES[point.getMonth()],
      count: 0,
    });
  }

  for (const value of dates) {
    if (!value) continue;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) continue;
    const bucket = buckets.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (bucket) bucket.count += 1;
  }

  return [...buckets.values()];
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Администраторы',
  moderator: 'Модераторы',
  support: 'Поддержка',
  editor: 'Редакторы',
  user: 'Пользователи',
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

export interface RoleBucket {
  name: string;
  value: number;
}

/**
 * Распределение по ролям. Профили без записи в user_roles — обычные клиенты,
 * поэтому они попадают в отдельную группу, а не растворяются в статистике.
 */
export function buildRoleDistribution(roles: string[], totalProfiles: number): RoleBucket[] {
  const counts = new Map<string, number>();
  for (const role of roles) {
    counts.set(role, (counts.get(role) ?? 0) + 1);
  }

  const buckets = [...counts.entries()].map(([role, value]) => ({ name: roleLabel(role), value }));
  const withoutRole = totalProfiles - roles.length;
  if (withoutRole > 0) buckets.push({ name: 'Без назначенной роли', value: withoutRole });

  return buckets.sort((a, b) => b.value - a.value);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Сколько дат попало в последние `days` суток. */
export function countSince(dates: (string | null)[], days: number, now = Date.now()): number {
  const from = now - days * DAY_MS;
  return dates.filter((value) => {
    if (!value) return false;
    const time = new Date(value).getTime();
    return !Number.isNaN(time) && time >= from;
  }).length;
}

/** Дата-время по-русски; пустое значение не превращаем в «сегодня». */
export function formatDateTime(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
