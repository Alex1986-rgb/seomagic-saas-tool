/**
 * Форматирование чисел, денег и дат кабинета.
 *
 * Одна точка на все экраны: смета, шапка и обзор показывают одну и ту же сумму, и если каждый
 * экран форматирует сам, «12 400 ₽» в одном месте становится «12400 руб.» в другом.
 */

/** Неразрывный пробел между разрядами — как в макете, чтобы «3 412» не переносилось по строкам. */
export function num(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Math.round(n).toLocaleString('ru-RU');
}

export function rub(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `${num(n)} ₽`;
}

/** «48 т₽» — короткая сумма для шапки и плиток, где полная не помещается. */
export function rubShort(n: number): string {
  if (n < 1000) return rub(n);
  return `${Math.round(n / 1000).toLocaleString('ru-RU')} т₽`;
}

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** «14 сен, 09:42» — для таблиц. */
export function dateShort(value: string | Date | null | undefined, withTime = true): string {
  const d = toDate(value);
  if (!d) return '—';
  const base = `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  if (!withTime) return base;
  return `${base}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** «14 сентября, 09:42» — для шапки и подзаголовков. */
export function dateLong(value: string | Date | null | undefined, withTime = true): string {
  const d = toDate(value);
  if (!d) return '—';
  const base = `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
  if (!withTime) return base;
  return `${base}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function monthShort(value: string | Date): string {
  const d = toDate(value);
  return d ? MONTHS_SHORT[d.getMonth()] : '—';
}

/** plural(5, ['страница', 'страницы', 'страниц']) → «страниц». */
export function plural(n: number, forms: [string, string, string]): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

/** Хост без www и схемы: так проект называется в сайдбаре и таблицах. */
export function hostOf(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(withScheme).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//i, '').replace(/^www\./, '').split('/')[0];
  }
}
