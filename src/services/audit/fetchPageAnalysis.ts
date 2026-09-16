import { supabase } from '@/integrations/supabase/client';
import type { AuditPageRow } from '@/utils/pdf/auditPdf';

/**
 * Разобранные страницы аудита.
 *
 * Нужны отчёту: без них раздел постраничного анализа раньше заполнялся
 * выдуманными адресами со случайными оценками. Если строк нет — возвращаем
 * пустой список, и раздел просто не печатается.
 */
export async function fetchPageAnalysis(taskId: string | null | undefined): Promise<AuditPageRow[]> {
  if (!taskId) return [];

  const { data, error } = await supabase
    .from('page_analysis')
    .select('url, status_code, load_time, content_length, title, meta_description, h1_count')
    .eq('task_id', taskId)
    .order('url', { ascending: true })
    .limit(200);

  if (error) {
    console.error('Не удалось получить разбор страниц:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    url: row.url,
    status_code: row.status_code,
    load_time: row.load_time,
    content_length: row.content_length,
    title: row.title,
    description: row.meta_description,
    h1_count: row.h1_count,
  }));
}
