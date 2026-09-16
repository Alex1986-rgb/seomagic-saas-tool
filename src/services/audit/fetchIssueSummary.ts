import { supabase } from '@/integrations/supabase/client';

/**
 * Сводка замечаний аудита по типам.
 *
 * Нужна экранам, которые раньше показывали случайные числа: «битых ссылок 3»,
 * «дублей 1», «без описания 6» брались из `Math.random()`. Здесь считаем по
 * таблице `issues` — то, что краулер действительно нашёл.
 */

export interface IssueSummary {
  brokenLinks: number;
  duplicateContent: number;
  missingMetadata: number;
  total: number;
}

const EMPTY: IssueSummary = { brokenLinks: 0, duplicateContent: 0, missingMetadata: 0, total: 0 };

export async function fetchIssueSummary(taskId: string | null | undefined): Promise<IssueSummary> {
  if (!taskId) return EMPTY;

  const { data, error } = await supabase
    .from('issues')
    .select('issue_type')
    .eq('task_id', taskId);

  if (error) {
    console.error('Не удалось получить замечания аудита:', error.message);
    return EMPTY;
  }

  const rows = data ?? [];
  const count = (types: string[]) =>
    rows.filter((row) => types.includes(String(row.issue_type))).length;

  return {
    brokenLinks: count(['broken_link', 'server_error']),
    duplicateContent: count(['duplicate_title', 'duplicate_description', 'thin_content']),
    missingMetadata: count(['missing_title', 'missing_description', 'missing_h1', 'missing_canonical']),
    total: rows.length,
  };
}
