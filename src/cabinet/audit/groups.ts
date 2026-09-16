import { CHECKS, checkAdvice, checkTitle, impactOf, metaNote, sevOf, sevRank, type IssueCategory } from './labels';

/**
 * Сборка таблицы проблем из строк таблицы issues.
 *
 * В базе одна строка = одно замечание на одной странице. Экраны показывают тип замечания с
 * числом затронутых страниц — сводим здесь, в одном месте: Обзор («Что сделать в первую
 * очередь»), Новый аудит (итог) и Результаты должны называть одинаковые числа.
 * Чистые функции — без Supabase и React, проверяются тестом groups.test.ts.
 */

export interface IssueRow {
  id: string;
  issue_type: string;
  category: string;
  severity: string;
  page_id: string | null;
  metadata: unknown;
}

export interface AffectedPage {
  url: string;
  note: string;
}

export interface IssueGroup {
  type: string;
  title: string;
  advice: string;
  category: IssueCategory | string;
  /** Самая тяжёлая важность среди строк группы (классификатор ставит одну на тип, но на всякий случай). */
  severityRaw: string;
  sev: 'critical' | 'warn' | 'ok';
  impact: string;
  /** Число замечаний = число затронутых страниц (классификатор пишет одно замечание на страницу). */
  count: number;
  pages: AffectedPage[];
}

export function groupIssues(rows: IssueRow[], urlByPageId: Map<string, string>): IssueGroup[] {
  const map = new Map<string, IssueGroup>();
  for (const r of rows) {
    let g = map.get(r.issue_type);
    if (!g) {
      g = {
        type: r.issue_type,
        title: checkTitle(r.issue_type),
        advice: checkAdvice(r.issue_type),
        category: r.category,
        severityRaw: r.severity,
        sev: sevOf(r.severity),
        impact: impactOf(r.severity),
        count: 0,
        pages: [],
      };
      map.set(r.issue_type, g);
    } else if (sevRank(r.severity) < sevRank(g.severityRaw)) {
      g.severityRaw = r.severity;
      g.sev = sevOf(r.severity);
      g.impact = impactOf(r.severity);
    }
    g.count += 1;
    const url = r.page_id ? urlByPageId.get(r.page_id) : undefined;
    if (url) g.pages.push({ url, note: metaNote(r.metadata) });
  }
  // Порядок — сначала тяжёлое, внутри уровня — по охвату: так же читается «что делать первым».
  return Array.from(map.values()).sort(
    (a, b) => sevRank(a.severityRaw) - sevRank(b.severityRaw) || b.count - a.count || a.title.localeCompare(b.title),
  );
}

/**
 * Строки «Норма»: проверки из справочника классификатора, которые ничего не нашли.
 * Число страниц — сколько страниц прошли проверку (все проанализированные).
 */
export function normGroups(found: IssueGroup[], pagesChecked: number): IssueGroup[] {
  const seen = new Set(found.map((g) => g.type));
  return CHECKS.filter((c) => !seen.has(c.type)).map((c) => ({
    type: c.type,
    title: checkTitle(c.type),
    advice: checkAdvice(c.type),
    category: c.category,
    severityRaw: c.severity,
    sev: 'ok' as const,
    impact: '—',
    count: pagesChecked,
    pages: [],
  }));
}

export interface SeverityCounts {
  critical: number;
  warn: number;
  total: number;
}

/** Считаем замечания (страница × тип), а не типы: «Критические 37» — это 37 мест на сайте. */
export function countSeverity(groups: IssueGroup[]): SeverityCounts {
  let critical = 0;
  let warn = 0;
  for (const g of groups) {
    if (g.sev === 'critical') critical += g.count;
    else if (g.sev === 'warn') warn += g.count;
  }
  return { critical, warn, total: critical + warn };
}

export interface RateLike {
  id: string;
  rate: number;
}

/**
 * Цена правки типа замечания: ставка × число страниц.
 *
 * Ставка ищется по id === issue_type: ставки сметы (pricing_rules) заведены по типу замечания,
 * так их применяет и issue-classifier. Нет ставки — null, экран пишет «—», а не придумывает цену.
 * Если исполнитель «Сметы» поменяет id ставки на что-то другое — сопоставление нужно поправить
 * здесь, в одном месте.
 */
export function priceOf(group: IssueGroup, rates: RateLike[]): number | null {
  if (group.sev === 'ok') return null;
  const rate = rates.find((r) => r.id === group.type);
  if (!rate || !Number.isFinite(rate.rate)) return null;
  return rate.rate * group.count;
}

/** Сумма по тем группам, у которых есть ставка; priced=false — ни одной ставки не нашлось. */
export function totalPrice(groups: IssueGroup[], rates: RateLike[]): { total: number; priced: boolean } {
  let total = 0;
  let priced = false;
  for (const g of groups) {
    const p = priceOf(g, rates);
    if (p !== null) {
      total += p;
      priced = true;
    }
  }
  return { total, priced };
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * CSV для экспорта. Разделитель «;» — Excel в русской локали открывает такой файл по колонкам
 * без мастера импорта. BOM в начале — иначе кириллица превращается в кракозябры.
 */
export function toCsv(opts: {
  host: string;
  date: string;
  score: number | null;
  categories?: { label: string; score: number | null }[];
  groups?: IssueGroup[];
}): string {
  const lines: string[] = [];
  if (opts.categories) {
    lines.push(['Сайт', 'Дата', 'Показатель', 'Балл'].map(csvCell).join(';'));
    lines.push([opts.host, opts.date, 'Общий балл', opts.score ?? ''].map(csvCell).join(';'));
    for (const c of opts.categories) lines.push([opts.host, opts.date, c.label, c.score ?? ''].map(csvCell).join(';'));
    if (opts.groups) lines.push('');
  }
  if (opts.groups) {
    lines.push(['Проблема', 'Код', 'Уровень', 'Страниц', 'Адрес', 'Пояснение'].map(csvCell).join(';'));
    for (const g of opts.groups) {
      if (g.sev === 'ok') continue;
      const level = g.sev === 'critical' ? 'Критично' : 'Предупреждение';
      if (g.pages.length === 0) {
        lines.push([g.title, g.type, level, g.count, '', ''].map(csvCell).join(';'));
      }
      for (const p of g.pages) lines.push([g.title, g.type, level, g.count, p.url, p.note].map(csvCell).join(';'));
    }
  }
  // BOM — чтобы Excel открыл CSV в UTF-8, а не в cp1251.
  return `\uFEFF${lines.join('\n')}\n`;
}
