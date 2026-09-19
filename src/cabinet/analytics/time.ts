import { dateShort } from '../format';

/**
 * Даты экранов аналитики, которых нет в общем format.ts: с годом (история аудитов тянется
 * через год) и относительное время уведомлений («18 мин назад», «вчера»).
 */

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

/** «16 сен 2026» — как в таблице истории макета. */
export function dateWithYear(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** Относительное время: до суток — минуты и часы, вчера — словом, дальше — дата. */
export function relativeTime(value: string | null | undefined, now: Date = new Date()): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} мин назад`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (d.getTime() >= startOfToday) return `${Math.floor(diffMin / 60)} ч назад`;
  if (d.getTime() >= startOfToday - 86400000) return 'вчера';
  return dateShort(d, false);
}
