/**
 * Расчёт сводки личного кабинета.
 *
 * Вынесен из хука отдельно и не знает ни про Supabase, ни про React: считать
 * метрики и загружать данные — разные задачи, и считать нужно проверяемо.
 */

export interface DashboardAudit {
  id: string;
  url: string;
  seoScore: number | null;
  status: string;
  createdAt: string | null;
  completedAt: string | null;
  pagesScanned: number | null;
}

export interface DashboardSummary {
  audits: DashboardAudit[];
  /** Завершённые аудиты от старых к новым — для графика динамики. */
  scoreTrend: { date: string; score: number }[];
  totalAudits: number;
  auditsLastMonth: number;
  averageScore: number | null;
  /** На сколько средний балл за последний месяц отличается от предыдущего. */
  averageScoreChange: number | null;
  sites: string[];
  sitesLastMonth: number;
  positionChecks: number;
  positionChecksLastMonth: number;
  optimizations: number;
  optimizationsLastMonth: number;
}

export const EMPTY_SUMMARY: DashboardSummary = {
  audits: [],
  scoreTrend: [],
  totalAudits: 0,
  auditsLastMonth: 0,
  averageScore: null,
  averageScoreChange: null,
  sites: [],
  sitesLastMonth: 0,
  positionChecks: 0,
  positionChecksLastMonth: 0,
  optimizations: 0,
  optimizationsLastMonth: 0,
};

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const TREND_POINTS = 12;

/** Домен без www; неразбираемый адрес остаётся как есть, чтобы не терять запись. */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export interface SummaryInput {
  audits: DashboardAudit[];
  positionCheckDates: (string | null)[];
  optimizationDates: (string | null)[];
  /** Момент расчёта; параметром — чтобы тесты не зависели от текущего времени. */
  now?: number;
}

export function buildDashboardSummary({
  audits,
  positionCheckDates,
  optimizationDates,
  now = Date.now(),
}: SummaryInput): DashboardSummary {
  const monthAgo = now - MONTH_MS;
  const twoMonthsAgo = now - 2 * MONTH_MS;
  const since = (value: string | null | undefined, from: number) =>
    !!value && new Date(value).getTime() >= from;

  // Аудит без балла ещё не даёт материала для средних и графика.
  const scored = audits.filter((audit) => typeof audit.seoScore === 'number');
  const thisMonth = scored.filter((audit) => since(audit.createdAt, monthAgo));
  const previousMonth = scored.filter(
    (audit) => since(audit.createdAt, twoMonthsAgo) && !since(audit.createdAt, monthAgo),
  );

  const currentAverage = average(thisMonth.map((a) => a.seoScore as number));
  const previousAverage = average(previousMonth.map((a) => a.seoScore as number));

  const sites = [...new Set(audits.map((audit) => hostOf(audit.url)))];
  const sitesThisMonth = new Set(
    audits.filter((audit) => since(audit.createdAt, monthAgo)).map((audit) => hostOf(audit.url)),
  );

  return {
    audits,
    scoreTrend: scored
      .slice(0, TREND_POINTS)
      .reverse()
      .map((audit) => ({
        date: audit.createdAt
          ? new Date(audit.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
          : '—',
        score: audit.seoScore as number,
      })),
    totalAudits: audits.length,
    auditsLastMonth: audits.filter((audit) => since(audit.createdAt, monthAgo)).length,
    averageScore: average(scored.map((audit) => audit.seoScore as number)),
    averageScoreChange:
      currentAverage !== null && previousAverage !== null ? currentAverage - previousAverage : null,
    sites,
    sitesLastMonth: sitesThisMonth.size,
    positionChecks: positionCheckDates.length,
    positionChecksLastMonth: positionCheckDates.filter((date) => since(date, monthAgo)).length,
    optimizations: optimizationDates.length,
    optimizationsLastMonth: optimizationDates.filter((date) => since(date, monthAgo)).length,
  };
}
