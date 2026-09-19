import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

/**
 * Запись в журнал вызовов api_logs.
 *
 * Раньше функции писали журнал клиентом на ключе anon: политики на вставку у
 * таблицы нет, RLS молча отклонял запись, и админка показывала пустой журнал.
 * Кроме того, длительность ставилась нулём, а ошибки не записывались вовсе —
 * только успешный путь. Теперь запись идёт служебным ключом, с настоящей
 * длительностью и в ветках ошибок.
 *
 * Журнал — вспомогательная вещь: если запись не удалась, ответ функции не
 * меняется, ошибка только уходит в лог функции.
 */

export interface ApiLogEntry {
  functionName: string;
  userId: string | null;
  statusCode: number;
  /** Date.now() в начале обработки запроса. */
  startedAt: number;
  requestData?: unknown;
  responseData?: unknown;
}

export async function writeApiLog(entry: ApiLogEntry): Promise<void> {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) {
      console.error('api_logs: не заданы SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY, запись пропущена');
      return;
    }

    const client = createClient(url, serviceKey);
    const { error } = await client.from('api_logs').insert({
      function_name: entry.functionName,
      user_id: entry.userId,
      request_data: entry.requestData ?? null,
      response_data: entry.responseData ?? null,
      status_code: entry.statusCode,
      duration_ms: Math.max(0, Date.now() - entry.startedAt),
    });

    if (error) {
      console.error(`api_logs: запись для ${entry.functionName} не сохранилась:`, error.message);
    }
  } catch (err) {
    console.error(`api_logs: запись для ${entry.functionName} не сохранилась:`, err);
  }
}
