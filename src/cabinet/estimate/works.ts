/**
 * Объёмы работ сметы — из замечаний (таблица issues) последнего завершённого аудита.
 *
 * Работа сметы = строка прайса pricing_rules (одна ставка на один тип замечания). В макете работы
 * укрупнены («Мета-теги title и description» за 35 ₽), но таких ставок в базе нет: прайс ведёт
 * администратор по типам замечаний, и склейка нескольких типов в одну строку потребовала бы
 * выдумать общую ставку. Поэтому строка сметы = тип замечания с его ставкой из прайса.
 *
 * Сопоставление типов замечаний (что пишет supabase/functions/issue-classifier) и строк прайса:
 *  - одноимённые типы (missing_title, short_title, long_title, missing_h1, multiple_h1,
 *    missing_description, short_description, long_description, missing_canonical, wrong_canonical,
 *    not_indexable, thin_content, no_internal_links, too_many_external_links, redirect_301,
 *    redirect_302, redirect_chain, broken_link, server_error, slow_page, large_html,
 *    no_compression, high_ttfb) — один к одному, объём = число замечаний (по одному на страницу);
 *  - missing_alt_text (классификатор) → missing_image_alt (прайс): имена разошлись, а ставка
 *    в прайсе — за изображение. Объём = сумма metadata.missing_alt_count, а не число страниц:
 *    иначе страница с 40 картинками без alt стоила бы как одна картинка;
 *  - missing_viewport, poor_heading_structure, low_text_html_ratio — в прайсе ставок нет. Такие
 *    замечания в смету не входят и показываются отдельной строкой «без ставки», а не по 0 ₽:
 *    нулевая цена выглядела бы как обещание сделать бесплатно.
 * Пакеты прайса (is_bundle) в смету не попадают вовсе: продукт отказался от пакетов со скидками.
 */

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface IssueRow {
  issue_type: string;
  severity: IssueSeverity | string | null;
  can_auto_fix: boolean | null;
  metadata: unknown;
}

/** Тип замечания классификатора → тип строки прайса, если имена разошлись. */
export const ISSUE_ALIASES: Record<string, string> = {
  missing_alt_text: 'missing_image_alt',
};

/** Единица объёма по типу строки прайса. Всё, что не перечислено, считается постранично. */
const UNIT_BY_TYPE: Record<string, string> = {
  missing_image_alt: 'изображение',
  empty_image_alt: 'изображение',
  broken_link: 'адрес',
  server_error: 'адрес',
  redirect_301: 'адрес',
  redirect_302: 'адрес',
  redirect_chain: 'адрес',
  not_indexable: 'адрес',
};

export function priceTypeOf(issueType: string): string {
  return ISSUE_ALIASES[issueType] ?? issueType;
}

export function unitFor(priceType: string): string {
  return UNIT_BY_TYPE[priceType] ?? 'страница';
}

/** Объём одного замечания. Для alt — число картинок из metadata, иначе 1. */
function qtyOf(row: IssueRow): number {
  if (row.issue_type === 'missing_alt_text') {
    const meta = row.metadata as { missing_alt_count?: unknown } | null;
    const n = Number(meta?.missing_alt_count);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 1;
  }
  return 1;
}

export interface IssueVolume {
  /** Тип строки прайса (после сопоставления). */
  priceType: string;
  /** Исходные типы замечаний, сведённые в эту строку. */
  issueTypes: string[];
  /** Объём в единицах работы. */
  qty: number;
  /** Число замечаний (строк issues). */
  issues: number;
  /** Есть замечания critical или high — строка входит в набор «Только критичное». */
  severe: boolean;
  /** Классификатор пометил замечания как исправимые автоматически — набор «Рекомендуемое». */
  autoFix: boolean;
}

export function aggregateIssues(rows: IssueRow[]): IssueVolume[] {
  const map = new Map<string, IssueVolume>();
  for (const row of rows) {
    if (!row.issue_type) continue;
    const priceType = priceTypeOf(row.issue_type);
    let v = map.get(priceType);
    if (!v) {
      v = { priceType, issueTypes: [], qty: 0, issues: 0, severe: false, autoFix: false };
      map.set(priceType, v);
    }
    if (!v.issueTypes.includes(row.issue_type)) v.issueTypes.push(row.issue_type);
    v.qty += qtyOf(row);
    v.issues += 1;
    if (row.severity === 'critical' || row.severity === 'high') v.severe = true;
    if (row.can_auto_fix) v.autoFix = true;
  }
  return Array.from(map.values());
}

export type PresetId = 'critical' | 'recommended' | 'all';

/**
 * Готовые наборы работ. Считаются от настоящих признаков замечаний, а не списком строк, как в
 * макете: состав строк у каждого сайта свой.
 *  - critical — типы, где классификатор нашёл critical/high (мешают индексации и показу);
 *  - recommended — типы, которые классификатор пометил как исправимые автоматически;
 *  - all — всё, на что в прайсе есть ставка.
 */
export function presetPicks(preset: PresetId, volumes: IssueVolume[]): Set<string> {
  const picked = new Set<string>();
  for (const v of volumes) {
    if (preset === 'all' || (preset === 'critical' && v.severe) || (preset === 'recommended' && v.autoFix)) {
      picked.add(v.priceType);
    }
  }
  return picked;
}
