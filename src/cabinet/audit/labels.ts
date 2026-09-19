import { issueAdvice, issueTitle } from '@/lib/issue-labels';
import type { Severity } from '../ui';

/**
 * Справочник проверок аудита для экранов кабинета.
 *
 * Источник правды — edge-функция issue-classifier: какие типы замечаний она пишет, в какой
 * категории и с какой важностью. Здесь тот же список, чтобы строки «Норма» в Результатах
 * означали «проверка была и ничего не нашла», а не выдуманную галочку. Добавили проверку в
 * классификатор — добавьте строку сюда, иначе она будет видна только когда что-то нашла.
 */

export type IssueCategory = 'seo' | 'content' | 'technical' | 'performance' | 'accessibility' | 'security';
export type IssueSeverityRaw = 'critical' | 'high' | 'medium' | 'low';

export interface CheckDef {
  type: string;
  category: IssueCategory;
  severity: IssueSeverityRaw;
}

export const CHECKS: CheckDef[] = [
  { type: 'missing_title', category: 'seo', severity: 'critical' },
  { type: 'short_title', category: 'seo', severity: 'medium' },
  { type: 'long_title', category: 'seo', severity: 'low' },
  { type: 'missing_description', category: 'seo', severity: 'high' },
  { type: 'short_description', category: 'seo', severity: 'medium' },
  { type: 'long_description', category: 'seo', severity: 'low' },
  { type: 'missing_h1', category: 'seo', severity: 'high' },
  { type: 'multiple_h1', category: 'seo', severity: 'medium' },
  { type: 'missing_canonical', category: 'seo', severity: 'medium' },
  { type: 'wrong_canonical', category: 'seo', severity: 'medium' },
  { type: 'not_indexable', category: 'seo', severity: 'critical' },
  { type: 'slow_page', category: 'performance', severity: 'high' },
  { type: 'high_ttfb', category: 'performance', severity: 'medium' },
  { type: 'no_compression', category: 'performance', severity: 'medium' },
  { type: 'large_html', category: 'performance', severity: 'medium' },
  { type: 'redirect_301', category: 'technical', severity: 'low' },
  { type: 'redirect_302', category: 'technical', severity: 'medium' },
  { type: 'redirect_chain', category: 'technical', severity: 'medium' },
  { type: 'broken_link', category: 'technical', severity: 'high' },
  { type: 'server_error', category: 'technical', severity: 'critical' },
  { type: 'missing_viewport', category: 'accessibility', severity: 'medium' },
  { type: 'thin_content', category: 'content', severity: 'medium' },
  { type: 'missing_alt_text', category: 'content', severity: 'medium' },
  { type: 'no_internal_links', category: 'content', severity: 'medium' },
  { type: 'too_many_external_links', category: 'content', severity: 'low' },
  { type: 'poor_heading_structure', category: 'content', severity: 'low' },
  { type: 'low_text_html_ratio', category: 'content', severity: 'low' },
];

/** Названия, которых нет в общем справочнике src/lib/issue-labels.ts (его не правим — он чужой). */
const EXTRA: Record<string, { title: string; advice: string }> = {
  redirect_301: {
    title: 'Постоянная переадресация 301',
    advice: 'Заменить ссылки на конечный адрес, чтобы не тратить обход на переходы.',
  },
  redirect_302: {
    title: 'Временная переадресация 302',
    advice: 'Если переезд окончательный — заменить на 301, иначе вес страницы не передаётся.',
  },
  missing_viewport: {
    title: 'Нет meta viewport',
    advice: 'Добавить viewport, иначе телефон показывает страницу в масштабе компьютера.',
  },
  too_many_external_links: {
    title: 'Много внешних ссылок',
    advice: 'Проверить, нужны ли ссылки наружу; лишние закрыть или убрать.',
  },
  poor_heading_structure: {
    title: 'Нет подзаголовков H2',
    advice: 'Разбить текст подзаголовками H2 — так его читают и люди, и поиск.',
  },
  low_text_html_ratio: {
    title: 'Мало текста относительно кода',
    advice: 'Убрать лишнюю разметку или дополнить страницу текстом.',
  },
};

export function checkTitle(type: string): string {
  return EXTRA[type]?.title ?? issueTitle(type);
}

export function checkAdvice(type: string): string {
  return EXTRA[type]?.advice ?? issueAdvice(type);
}

/** Категории так, как они названы в макете. accessibility/security макет отдельно не показывает. */
export const CATEGORY_LABEL: Record<IssueCategory, string> = {
  seo: 'SEO',
  technical: 'Техническое',
  content: 'Контент',
  performance: 'Скорость',
  accessibility: 'Доступность',
  security: 'Безопасность',
};

/**
 * Три уровня макета из четырёх уровней классификатора: critical и high — «Критично» (красным),
 * medium и low — «Предупреждение». Та же граница в src/lib/audit-data.ts (summarizeIssues) —
 * чтобы старый отчёт и кабинет называли критичным одно и то же.
 */
export function sevOf(raw: string): Exclude<Severity, 'ok'> {
  return raw === 'critical' || raw === 'high' ? 'critical' : 'warn';
}

/** «Влияние» в таблице — это важность из классификатора словами, не отдельная оценка. */
export function impactOf(raw: string): string {
  if (raw === 'critical' || raw === 'high') return 'Высокое';
  if (raw === 'medium') return 'Среднее';
  return 'Низкое';
}

export function sevRank(raw: string): number {
  return raw === 'critical' ? 0 : raw === 'high' ? 1 : raw === 'medium' ? 2 : 3;
}

/**
 * Этапы задачи обхода (audit_tasks.stage/status) словами. После status=completed у задачи ещё
 * работает scoring-processor: балл и замечания появляются позже, поэтому отдельный этап «Оценка».
 */
export function stageLabel(status: string, stage: string | null): string {
  if (status === 'completed') return 'Оценка';
  switch (stage) {
    case 'queued':
      return 'Очередь';
    case 'initialization':
      return 'Подготовка';
    case 'crawling':
      return 'Обход';
    case 'complete':
      return 'Оценка';
    default:
      return status === 'queued' || status === 'pending' ? 'Очередь' : 'Обход';
  }
}

/** Пояснение к адресу из metadata замечания: только то, что классификатор реально записал. */
export function metaNote(meta: unknown): string {
  if (!meta || typeof meta !== 'object') return '';
  const m = meta as Record<string, unknown>;
  const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  const s = (v: unknown) => (typeof v === 'string' && v ? v : null);
  if (n(m.title_length) !== null) return `title ${m.title_length} знаков`;
  if (n(m.description_length) !== null) return `description ${m.description_length} знаков`;
  if (n(m.h1_count) !== null) return `H1: ${m.h1_count}`;
  if (n(m.load_time) !== null) return `загрузка ${(m.load_time as number).toFixed(1).replace('.', ',')} с`;
  if (n(m.ttfb) !== null) return `ответ сервера ${(m.ttfb as number).toFixed(1).replace('.', ',')} с`;
  if (n(m.status_code) !== null) return `ответ ${m.status_code}`;
  if (n(m.word_count) !== null) return `${m.word_count} слов`;
  if (n(m.missing_alt_count) !== null) return `без alt: ${m.missing_alt_count}`;
  if (n(m.content_length) !== null) return `HTML ${Math.round((m.content_length as number) / 1024)} КБ`;
  if (s(m.canonical_url)) return `canonical → ${m.canonical_url}`;
  if (s(m.final_url)) return `→ ${m.final_url}`;
  if (n(m.external_links) !== null) return `внешних ссылок ${m.external_links}`;
  if (n(m.text_html_ratio) !== null) return `текст ${Math.round((m.text_html_ratio as number) * 100)} % кода`;
  return '';
}

/** Путь адреса без схемы и хоста — так адреса показаны в макете. */
export function pathOf(url: string): string {
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return `${u.pathname}${u.search}` || '/';
  } catch {
    return url;
  }
}

/** Порог «красной» шкалы категории. В макете 46 — красная, 58 — нет; берём границу 50. */
export const CRITICAL_SCORE = 50;
