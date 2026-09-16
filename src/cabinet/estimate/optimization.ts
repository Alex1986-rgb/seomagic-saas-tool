import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { findTaskId } from './store';

/**
 * Задания оптимизации (optimization_jobs) и готовые страницы (fixed_pages) текущего аудита —
 * для экранов «Оптимизация» и «Исправление».
 *
 * Работа настоящая: optimization-start ставит задание, optimization-processor прогоняет страницы
 * через языковую модель и пишет каждую в fixed_pages, счётчик — в result_data. Отсюда и берётся
 * прогресс; таймеров «как в прототипе» нет.
 *
 * Строки со статусом 'estimated' — не запуски, а сметы старого интерфейса (optimization-calculate),
 * их не показываем.
 */

export interface OptJob {
  id: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  processed: number;
  total: number;
  pageLimit: number | null;
  failures: { url: string; error: string }[];
  error: string | null;
}

export interface FixedPage {
  id: string;
  url: string;
  createdAt: string | null;
  originalTitle: string | null;
  originalDescription: string | null;
  wordCount: number | null;
  h1Count: number | null;
  recommendations: string;
  model: string | null;
}

export const ACTIVE_STATUSES = new Set(['queued', 'processing']);

export const JOB_STATUS_LABEL: Record<string, string> = {
  queued: 'в очереди',
  processing: 'идёт обработка',
  completed: 'завершено',
  partial: 'завершено с ошибками',
  failed: 'ошибка',
};

function toJob(row: { id: string; status: string; created_at: string | null; updated_at: string | null; result_data: unknown }): OptJob {
  const r = (row.result_data ?? {}) as Record<string, unknown>;
  // В ходе работы обработчик пишет processed/total, по завершении — optimized_pages/total_pages.
  const processed = Number(r.processed ?? r.optimized_pages ?? 0) || 0;
  const total = Number(r.total ?? r.total_pages ?? 0) || 0;
  const limit = Number(r.page_limit);
  return {
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    processed,
    total,
    pageLimit: Number.isFinite(limit) && limit > 0 ? limit : null,
    failures: Array.isArray(r.failures) ? (r.failures as OptJob['failures']) : [],
    error: typeof r.error === 'string' ? r.error : null,
  };
}

function toPage(row: { id: string; created_at: string | null; fixes_applied: unknown; llm_provider_used: string | null }): FixedPage | null {
  const f = (row.fixes_applied ?? {}) as Record<string, unknown>;
  const original = (f.original ?? {}) as Record<string, unknown>;
  const url = typeof f.url === 'string' ? f.url : '';
  if (!url) return null;
  const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  return {
    id: row.id,
    url,
    createdAt: row.created_at,
    originalTitle: typeof original.title === 'string' ? original.title : null,
    originalDescription: typeof original.meta_description === 'string' ? original.meta_description : null,
    wordCount: n(original.word_count),
    h1Count: n(original.h1_count),
    recommendations: typeof f.recommendations === 'string' ? f.recommendations : '',
    model: typeof f.model === 'string' ? f.model : row.llm_provider_used,
  };
}

const POLL_MS = 3000;

export function useOptimization(userId: string | null, auditId: string | null) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<OptJob[]>([]);
  const [pages, setPages] = useState<FixedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  // Номер запроса: ответ по прошлому проекту, пришедший после переключения, не должен затереть новый.
  const seq = useRef(0);

  const load = useCallback(async () => {
    const my = ++seq.current;
    if (!userId || !auditId) {
      setTaskId(null);
      setJobs([]);
      setPages([]);
      setLoading(false);
      return;
    }
    try {
      const tid = await findTaskId(userId, auditId);
      let jobRows: OptJob[] = [];
      if (tid) {
        const jobsRes = await supabase
          .from('optimization_jobs')
          .select('id, status, created_at, updated_at, result_data')
          .eq('user_id', userId)
          .eq('task_id', tid)
          .neq('status', 'estimated')
          .order('created_at', { ascending: false })
          .limit(10);
        if (jobsRes.error) throw jobsRes.error;
        jobRows = (jobsRes.data ?? []).map(toJob);
      }
      const pagesRes = await supabase
        .from('fixed_pages')
        // original_html/fixed_html не тянем: это целые страницы, экрану они не нужны.
        .select('id, created_at, fixes_applied, llm_provider_used')
        .eq('user_id', userId)
        .eq('audit_id', auditId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(100);
      if (pagesRes.error) throw pagesRes.error;
      if (my !== seq.current) return;
      setTaskId(tid);
      setJobs(jobRows);
      // Одна страница могла обрабатываться в нескольких запусках — показываем последний результат.
      const seen = new Set<string>();
      const list: FixedPage[] = [];
      for (const row of pagesRes.data ?? []) {
        const p = toPage(row);
        if (!p || seen.has(p.url)) continue;
        seen.add(p.url);
        list.push(p);
      }
      setPages(list);
      setError(null);
    } catch (err) {
      if (my !== seq.current) return;
      console.error('Кабинет: не удалось загрузить оптимизацию', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить оптимизацию');
    } finally {
      if (my === seq.current) setLoading(false);
    }
  }, [userId, auditId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load, tick]);

  const latest = jobs[0] ?? null;
  const active = !!latest && ACTIVE_STATUSES.has(latest.status);

  // Пока задание в работе — опрашиваем. Закончилось — опрос останавливается сам.
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(t);
  }, [active, load]);

  return { taskId, jobs, latest, active, pages, loading, error, reload: () => setTick((x) => x + 1) };
}

/** Текст ошибки функции полезнее общего «Edge Function returned a non-2xx». */
export async function readFunctionError(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return body?.error ?? null;
  } catch {
    return null;
  }
}

export async function startOptimization(
  taskId: string,
  options: { fixMetaTags: boolean; improveContent: boolean; improveStructure: boolean },
): Promise<{ id: string; pageLimit: number | null }> {
  const { data, error } = await supabase.functions.invoke('optimization-start', {
    body: { task_id: taskId, options: { ...options, language: 'ru' } },
  });
  if (error || !data?.optimization_id) {
    throw new Error((await readFunctionError(error)) ?? data?.error ?? 'Не удалось запустить оптимизацию');
  }
  const limit = Number(data.page_limit);
  return { id: data.optimization_id, pageLimit: Number.isFinite(limit) && limit > 0 ? limit : null };
}
