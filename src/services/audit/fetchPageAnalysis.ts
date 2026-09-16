import { supabase } from '@/integrations/supabase/client';
import type { AuditPageRow } from '@/utils/pdf/auditPdf';
import { fetchIssueCountsByPage } from './fetchIssueSummary';

/**
 * Разобранные страницы аудита.
 *
 * Нужны отчёту: без них раздел постраничного анализа раньше заполнялся
 * выдуманными адресами со случайными оценками. Если строк нет — возвращаем
 * пустой список, и раздел просто не печатается.
 *
 * Число замечаний по странице берём из таблицы `issues`. Раньше этих полей в
 * строке не было вовсе, отчёт считал их нулями и ставил каждой странице «100
 * баллов, 0 проблем» — даже странице без title и H1. Если замечания узнать
 * нельзя, поля остаются пустыми (null), и отчёт оценку не печатает.
 */
export async function fetchPageAnalysis(taskId: string | null | undefined): Promise<AuditPageRow[]> {
  if (!taskId) return [];

  const { data, error } = await supabase
    .from('page_analysis')
    .select('id, url, status_code, load_time, content_length, title, meta_description, h1_count')
    .eq('task_id', taskId)
    .order('url', { ascending: true })
    .limit(200);

  if (error) {
    console.error('Не удалось получить разбор страниц:', error.message);
    return [];
  }

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const issueCounts = await fetchIssueCountsByPage(taskId);

  return rows.map((row) => {
    // Замечания известны — у страницы без строк в `issues` их действительно 0.
    const counts = issueCounts
      ? (issueCounts.get(row.id) ?? { critical: 0, warning: 0, info: 0 })
      : null;

    return {
      url: row.url,
      status_code: row.status_code,
      load_time: row.load_time,
      content_length: row.content_length,
      title: row.title,
      description: row.meta_description,
      h1_count: row.h1_count,
      issues_critical: counts ? counts.critical : null,
      issues_warning: counts ? counts.warning : null,
      issues_info: counts ? counts.info : null,
    };
  });
}
