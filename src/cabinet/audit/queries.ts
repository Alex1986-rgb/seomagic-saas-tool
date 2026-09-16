import { supabase } from '@/integrations/supabase/client';
import type { IssueRow } from './groups';

/**
 * Запросы экранов аудита.
 *
 * Каждый запрос явно ограничен user_id: политики чтения audit_tasks/issues/page_analysis
 * отдают гостевые записи всем (а audit_tasks — вообще всё), и без фильтра в кабинет попали бы
 * чужие сайты. RLS здесь не защита, а только первая линия.
 */

const PAGE = 1000;

/**
 * Supabase отдаёт не больше 1000 строк за запрос. Аудит на 300 страниц даёт несколько тысяч
 * замечаний — без постраничной выборки таблица молча обрезалась бы, и числа страниц врали.
 */
async function fetchAll<T>(
  run: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  cap = 20000,
): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < cap; from += PAGE) {
    const { data, error } = await run(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    const chunk = data ?? [];
    out.push(...chunk);
    if (chunk.length < PAGE) break;
  }
  return out;
}

export interface TaskRow {
  id: string;
  audit_id: string | null;
  url: string;
  status: string;
  stage: string | null;
  progress: number | null;
  pages_scanned: number | null;
  estimated_pages: number | null;
  discovered_urls_count: number | null;
  current_url: string | null;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const TASK_COLS =
  'id, audit_id, url, status, stage, progress, pages_scanned, estimated_pages, discovered_urls_count, current_url, error_message, created_at, updated_at';

/** Последняя задача аудита: у одного аудита их может быть несколько (перезапуски). */
export async function fetchTaskForAudit(userId: string, auditId: string): Promise<TaskRow | null> {
  const { data, error } = await supabase
    .from('audit_tasks')
    .select(TASK_COLS)
    .eq('user_id', userId)
    .eq('audit_id', auditId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchTask(userId: string, taskId: string): Promise<TaskRow | null> {
  const { data, error } = await supabase
    .from('audit_tasks')
    .select(TASK_COLS)
    .eq('user_id', userId)
    .eq('id', taskId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchRecentTasks(userId: string, limit = 30): Promise<TaskRow[]> {
  const { data, error } = await supabase
    .from('audit_tasks')
    .select(TASK_COLS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface ResultRow {
  task_id: string | null;
  audit_id: string | null;
  global_score: number | null;
  score: number | null;
  seo_score: number | null;
  technical_score: number | null;
  content_score: number | null;
  performance_score: number | null;
  page_count: number | null;
  is_partial: boolean | null;
  completion_percentage: number | null;
  partial_data_note: string | null;
  created_at: string | null;
}

export async function fetchResult(userId: string, taskId: string): Promise<ResultRow | null> {
  // user_id обработчики не пишут, его проставляет триггер fill_owner_from_audit (миграция
  // 20260916120000) — поэтому фильтр по владельцу работает и здесь.
  const { data, error } = await supabase
    .from('audit_results')
    .select(
      'task_id, audit_id, global_score, score, seo_score, technical_score, content_score, performance_score, page_count, is_partial, completion_percentage, partial_data_note, created_at',
    )
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchIssues(userId: string, taskId: string): Promise<IssueRow[]> {
  return fetchAll<IssueRow>((from, to) =>
    supabase
      .from('issues')
      .select('id, issue_type, category, severity, page_id, metadata')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .order('id', { ascending: true })
      .range(from, to),
  );
}

export interface PageRow {
  id: string;
  url: string;
  final_url: string | null;
  status_code: number | null;
  load_time: number | null;
  ttfb: number | null;
  title: string | null;
  meta_description: string | null;
  h1_text: string | null;
  page_type: string | null;
  word_count: number | null;
  transfer_size: number | null;
  content_length: number | null;
  internal_links_count: number | null;
  external_links_count: number | null;
  image_count: number | null;
  missing_alt_images_count: number | null;
  is_indexable: boolean | null;
  canonical_url: string | null;
  depth: number | null;
  created_at: string | null;
}

const PAGE_COLS =
  'id, url, final_url, status_code, load_time, ttfb, title, meta_description, h1_text, page_type, word_count, transfer_size, content_length, internal_links_count, external_links_count, image_count, missing_alt_images_count, is_indexable, canonical_url, depth, created_at';

export async function fetchPageUrls(userId: string, taskId: string): Promise<{ id: string; url: string }[]> {
  return fetchAll<{ id: string; url: string }>((from, to) =>
    supabase
      .from('page_analysis')
      .select('id, url')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .order('id', { ascending: true })
      .range(from, to),
  );
}

export async function fetchPages(userId: string, taskId: string): Promise<PageRow[]> {
  return fetchAll<PageRow>((from, to) =>
    supabase
      .from('page_analysis')
      .select(PAGE_COLS)
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .order('depth', { ascending: true })
      .order('url', { ascending: true })
      .range(from, to),
  );
}

/** Страница по адресу: сначала точное совпадение, потом конечный адрес после переадресаций. */
export async function fetchPageByUrl(userId: string, taskId: string, url: string): Promise<PageRow | null> {
  const exact = await supabase
    .from('page_analysis')
    .select(PAGE_COLS)
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .eq('url', url)
    .limit(1)
    .maybeSingle();
  if (exact.error) throw new Error(exact.error.message);
  if (exact.data) return exact.data;
  const fin = await supabase
    .from('page_analysis')
    .select(PAGE_COLS)
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .eq('final_url', url)
    .limit(1)
    .maybeSingle();
  if (fin.error) throw new Error(fin.error.message);
  return fin.data;
}

export async function fetchPageIssues(userId: string, taskId: string, pageId: string): Promise<IssueRow[]> {
  const { data, error } = await supabase
    .from('issues')
    .select('id, issue_type, category, severity, page_id, metadata')
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .eq('page_id', pageId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Число критичных замечаний задачи без выгрузки строк — для плиток и таблицы проектов. */
export async function countCritical(userId: string, taskId: string): Promise<number> {
  const { count, error } = await supabase
    .from('issues')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .in('severity', ['critical', 'high']);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Последние обработанные страницы задачи — из них собирается журнал обхода на экране аудита. */
export async function fetchRecentPages(
  userId: string,
  taskId: string,
  limit = 12,
): Promise<Pick<PageRow, 'id' | 'url' | 'status_code' | 'load_time' | 'created_at'>[]> {
  const { data, error } = await supabase
    .from('page_analysis')
    .select('id, url, status_code, load_time, created_at')
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Аудит считается готовым, когда scoring-processor записал балл: completed или partial. */
export function isFinished(status: string | null | undefined): boolean {
  return status === 'completed' || status === 'partial';
}

export function errorText(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
