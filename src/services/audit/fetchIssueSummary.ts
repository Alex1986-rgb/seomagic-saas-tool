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

/**
 * База отдаёт не больше 1000 строк за запрос. Раньше замечания читались одним
 * запросом, и у большого сайта всё, что дальше тысячной строки, молча терялось.
 * Читаем порциями.
 */
const BATCH_SIZE = 1000;
/** Предохранитель от бесконечного цикла: 50 тысяч замечаний хватит любому аудиту. */
const MAX_BATCHES = 50;

export async function fetchIssueSummary(taskId: string | null | undefined): Promise<IssueSummary> {
  if (!taskId) return EMPTY;

  const rows: Array<{ issue_type: string }> = [];
  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const from = batch * BATCH_SIZE;
    const { data, error } = await supabase
      .from('issues')
      .select('issue_type')
      .eq('task_id', taskId)
      .order('id', { ascending: true })
      .range(from, from + BATCH_SIZE - 1);

    if (error) {
      console.error('Не удалось получить замечания аудита:', error.message);
      return EMPTY;
    }

    rows.push(...(data ?? []));
    if (!data || data.length < BATCH_SIZE) break;
  }

  const count = (types: string[]) =>
    rows.filter((row) => types.includes(String(row.issue_type))).length;

  return {
    brokenLinks: count(['broken_link', 'server_error']),
    duplicateContent: count(['duplicate_title', 'duplicate_description', 'thin_content']),
    missingMetadata: count(['missing_title', 'missing_description', 'missing_h1', 'missing_canonical']),
    total: rows.length,
  };
}

/** Число замечаний одной страницы по важности — в тех трёх ступенях, что печатает отчёт. */
export interface PageIssueCounts {
  critical: number;
  warning: number;
  info: number;
}

/**
 * Замечания по страницам: ключ — `page_analysis.id` (в `issues` он лежит в
 * `page_id`).
 *
 * В базе четыре ступени важности, в отчёте три: critical — критические,
 * high и medium — предупреждения, low — к сведению.
 *
 * Возвращает `null`, если замечания узнать не удалось: запрос упал или по
 * задаче нет ни одной строки. Второе обычно значит, что классификатор ещё не
 * отработал (он дописывает замечания после обхода), и «0 проблем» в этот момент
 * было бы неправдой. Вызывающий тогда не печатает ни оценок, ни сумм.
 */
export async function fetchIssueCountsByPage(
  taskId: string | null | undefined,
): Promise<Map<string, PageIssueCounts> | null> {
  if (!taskId) return null;

  const counts = new Map<string, PageIssueCounts>();
  let totalRows = 0;

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const from = batch * BATCH_SIZE;
    const { data, error } = await supabase
      .from('issues')
      .select('page_id, severity')
      .eq('task_id', taskId)
      .order('id', { ascending: true })
      .range(from, from + BATCH_SIZE - 1);

    if (error) {
      console.error('Не удалось получить замечания по страницам:', error.message);
      return null;
    }

    const rows = data ?? [];
    totalRows += rows.length;

    for (const row of rows) {
      if (!row.page_id) continue;
      const entry = counts.get(row.page_id) ?? { critical: 0, warning: 0, info: 0 };
      if (row.severity === 'critical') entry.critical += 1;
      else if (row.severity === 'high' || row.severity === 'medium') entry.warning += 1;
      else entry.info += 1;
      counts.set(row.page_id, entry);
    }

    if (rows.length < BATCH_SIZE) break;
  }

  return totalRows > 0 ? counts : null;
}
