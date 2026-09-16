import { pathOf } from './labels';

/**
 * Чистые расчёты экрана «Новый аудит»: нормализация адреса, журнал обхода, оценка остатка.
 * Проверяются тестом run.test.ts.
 */

/** Лимиты страниц, которые принимает audit-start. Больше 300 обработчик не рассчитан обходить. */
export const PAGE_LIMITS = [50, 100, 300] as const;
export type PageLimit = (typeof PAGE_LIMITS)[number];

/** Статусы задачи, при которых обход ещё идёт. */
export const ACTIVE_STATUSES = ['queued', 'pending', 'processing', 'scanning', 'analyzing'];
/** Статусы, из которых audit-resume умеет продолжить обход. */
export const RESUMABLE_STATUSES = ['failed', 'error', 'cancelled'];

/**
 * Адрес из поля ввода → адрес для audit-start. Схему дописываем сами: люди вводят «shop.ru».
 * null — если это не похоже на адрес сайта (сервер всё равно отклонит, но без лишнего запроса).
 */
export function normalizeSiteUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes('.') || /\s/.test(raw)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export interface LogPage {
  url: string;
  status_code: number | null;
  load_time: number | null;
  created_at: string | null;
}

export interface LogEvent {
  at: number;
  text: string;
}

/**
 * Журнал обхода. Строки GET — настоящие разобранные страницы из page_analysis (ответ и время
 * загрузки), события — смена этапа и число найденных адресов из audit-status. Новые сверху:
 * блок в макете развёрнут column-reverse, и свежая строка оказывается внизу.
 */
export function buildLog(pages: LogPage[], events: LogEvent[], limit = 12): string[] {
  const items: { at: number; text: string }[] = [];
  for (const p of pages) {
    const at = p.created_at ? new Date(p.created_at).getTime() : 0;
    const path = pathOf(p.url);
    if (p.status_code !== null && p.status_code >= 400) {
      items.push({ at, text: `ошибка: ${path} ответ ${p.status_code}` });
    } else {
      const t = p.load_time !== null ? `  ${p.load_time.toFixed(1)} s` : '';
      items.push({ at, text: `GET ${path}  ${p.status_code ?? '—'}${t}` });
    }
  }
  for (const e of events) items.push(e);
  return items
    .sort((a, b) => b.at - a.at)
    .slice(0, limit)
    .map((i) => i.text);
}

export interface Sample {
  at: number;
  scanned: number;
}

/**
 * Сколько осталось, по скорости, замеренной на этом экране. Прогнозов «с потолка» не даём:
 * пока нет двух замеров с приростом страниц — null, экран пишет прочерк.
 */
export function etaSeconds(samples: Sample[], target: number): number | null {
  if (samples.length < 2) return null;
  const first = samples[0];
  const last = samples[samples.length - 1];
  const dt = (last.at - first.at) / 1000;
  const dp = last.scanned - first.scanned;
  if (dt <= 0 || dp <= 0) return null;
  const left = Math.max(0, target - last.scanned);
  return Math.round(left / (dp / dt));
}

export function formatDuration(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec)) return '—';
  const s = Math.max(0, Math.round(sec));
  if (s < 60) return `${s} с`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин ${s % 60} с`;
  return `${Math.floor(m / 60)} ч ${m % 60} мин`;
}

/** Цель обхода: найдено адресов, но не больше лимита задачи. */
export function crawlTarget(estimated: number | null, discovered: number | null): number {
  const est = estimated ?? 0;
  const disc = discovered ?? 0;
  if (est > 0 && disc > 0) return Math.min(est, disc);
  return est || disc;
}
