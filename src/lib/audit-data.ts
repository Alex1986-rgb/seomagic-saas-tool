import { toNumber } from '@/lib/numbers';
import { issueTitle, issueRecommendation } from '@/lib/issue-labels';
import type { AuditData, AuditDetailsData, CategoryData } from '@/types/audit';

/**
 * Приведение результата аудита к виду, который понимает интерфейс.
 *
 * Сервер складывает в `audit_data` свою структуру — `scores`, `metrics`,
 * `summary`, `distribution`, — а экраны написаны под другую: `score`,
 * `details.seo.score`, `issues.critical`. Из-за этого панель показывала NaN и
 * нули поверх настоящих данных. Перевод держим в одном месте, чтобы экраны не
 * лезли в сырой ответ сервера каждый по-своему.
 */

interface RawScores {
  global_score?: unknown;
  seo_score?: unknown;
  technical_score?: unknown;
  content_score?: unknown;
  performance_score?: unknown;
}

interface RawSummary {
  url?: string;
  page_count?: unknown;
  timestamp?: string;
  is_partial?: boolean;
  completion_percentage?: unknown;
}

export interface RawAuditData {
  scores?: RawScores;
  metrics?: Record<string, unknown>;
  summary?: RawSummary;
  distribution?: Record<string, unknown>;
  // Старая форма, встречающаяся в ранних записях.
  score?: unknown;
  details?: Partial<AuditDetailsData>;
  issues?: unknown;
  pageCount?: unknown;
}

export interface IssueCounts {
  /** Тип замечания → сколько страниц затронуто. */
  byType: Record<string, number>;
  bySeverity: { critical: number; important: number; minor: number };
}

function category(score: number, failed = 0, warning = 0): CategoryData {
  return { score, passed: 0, warning, failed, items: [] };
}

/**
 * Собирает данные для экранов. `counts` — сводка по таблице замечаний; без неё
 * показываются только оценки, без списка проблем.
 */
export function normalizeAuditData(
  raw: RawAuditData | null | undefined,
  options: { url: string; taskId?: string | null; counts?: IssueCounts } = { url: '' },
): AuditData | null {
  if (!raw) return null;

  const scores = raw.scores ?? {};
  const summary = raw.summary ?? {};
  const counts = options.counts;

  // Оценка могла лежать и в старом поле `score`.
  const globalScore = toNumber(scores.global_score ?? raw.score, 0);

  const details: AuditDetailsData = {
    seo: category(toNumber(scores.seo_score)),
    content: category(toNumber(scores.content_score)),
    performance: category(toNumber(scores.performance_score)),
    technical: category(toNumber(scores.technical_score)),
    // Отдельных оценок мобильной версии и удобства сервер не считает —
    // показываем общую, чтобы не рисовать ноль там, где нет измерения.
    mobile: category(globalScore),
    usability: category(globalScore),
  };

  const critical: string[] = [];
  const important: string[] = [];
  const opportunities: string[] = [];

  if (counts) {
    for (const [issueType, count] of Object.entries(counts.byType)) {
      const line = issueRecommendation(issueType, count);
      // Раскладываем по важности так же, как размечает краулер.
      if (counts.bySeverity.critical > 0 && isCritical(issueType)) critical.push(line);
      else if (isMinor(issueType)) opportunities.push(line);
      else important.push(line);
    }
  }

  return {
    id: options.taskId ?? '',
    url: summary.url || options.url,
    date: summary.timestamp || new Date().toISOString(),
    score: globalScore,
    issues: {
      critical,
      important,
      minor: counts?.bySeverity.minor ?? 0,
      passed: 0,
      opportunities,
    },
    details,
    pageCount: toNumber(summary.page_count ?? raw.pageCount, 0),
    crawledPages: toNumber(summary.page_count, 0),
    status: 'completed',
  };
}

/** Замечания, которые бьют по позициям сильнее прочих. */
function isCritical(issueType: string): boolean {
  return ['slow_page', 'server_error', 'missing_title', 'missing_h1', 'broken_link'].includes(issueType);
}

/** Замечания, которые стоит поправить, но они не горят. */
function isMinor(issueType: string): boolean {
  return ['long_title', 'long_description', 'short_title', 'large_html'].includes(issueType);
}

/** Сводка по замечаниям: сколько страниц затронуто каждым типом. */
export function summarizeIssues(
  rows: Array<{ issue_type: string; severity: string }>,
): IssueCounts {
  const byType: Record<string, number> = {};
  const bySeverity = { critical: 0, important: 0, minor: 0 };

  for (const row of rows) {
    byType[row.issue_type] = (byType[row.issue_type] ?? 0) + 1;
    if (row.severity === 'high' || row.severity === 'critical') bySeverity.critical++;
    else if (row.severity === 'medium') bySeverity.important++;
    else bySeverity.minor++;
  }

  return { byType, bySeverity };
}

/** Человеческое название типа замечания — пригодится спискам проблем. */
export { issueTitle };
