/**
 * Разбор очереди проверки позиций.
 *
 * Работает пачками: берёт из очереди столько запросов, сколько успевает
 * обработать за отведённое функции время, сохраняет результат каждой пачки и
 * будит сам себя, пока очередь не опустеет. Так проверка на триста обращений к
 * поставщику доходит до конца, а пользователь видит движение счётчика.
 *
 * Вызывается только служебным ключом: это внутренний обработчик, а не открытая
 * точка входа.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { assertServiceRole, AuthError } from "../_shared/auth.ts";
import { fetchSerp, findDomainPosition, SearchEngine, SerpProviderError } from "../_shared/serp.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Сколько работать за один заход. Функция живёт около двух с половиной минут,
 * поэтому останавливаемся заметно раньше и передаём дело следующему заходу.
 */
const BATCH_TIME_BUDGET_MS = 90_000;
/** Пауза между обращениями к поставщику, чтобы не ловить его ограничения. */
const REQUEST_DELAY_MS = 300;
/** Сколько раз пробуем один запрос, прежде чем признать его неудачным. */
const MAX_ATTEMPTS = 2;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    assertServiceRole(req);
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 403;
    return json({ error: error instanceof Error ? error.message : 'Доступ запрещён' }, status);
  }

  const startedAt = Date.now();

  try {
    const { check_id: checkId } = await req.json();
    if (!checkId) return json({ error: 'Не указана проверка' }, 400);

    const client = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: check, error: checkError } = await client
      .from('position_checks')
      .select('id, user_id, domain, region, depth, status')
      .eq('id', checkId)
      .single();

    if (checkError || !check) return json({ error: 'Проверка не найдена' }, 404);
    if (check.status !== 'running') {
      return json({ done: true, reason: `Проверка уже в состоянии «${check.status}»` });
    }

    const previous = await loadPreviousPositions(client, check.user_id, check.domain);

    let processed = 0;
    while (Date.now() - startedAt < BATCH_TIME_BUDGET_MS) {
      const { data: batch } = await client
        .from('position_queue')
        .select('id, keyword, search_engine, attempts')
        .eq('check_id', checkId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1);

      const item = batch?.[0];
      if (!item) break;

      // Помечаем сразу, чтобы параллельный заход не взял тот же запрос.
      await client
        .from('position_queue')
        .update({ status: 'processing', attempts: item.attempts + 1, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      try {
        const serp = await fetchSerp({
          engine: item.search_engine as SearchEngine,
          query: item.keyword,
          region: check.region ?? undefined,
          depth: check.depth ?? 100,
        });
        const { position, url } = findDomainPosition(serp.urls, check.domain);

        await client.from('position_results').insert({
          check_id: checkId,
          keyword: item.keyword,
          search_engine: item.search_engine,
          position,
          previous_position: previous.get(`${item.search_engine}:${item.keyword}`) ?? null,
          url: url ?? null,
          search_url: serp.searchUrl,
        });

        await client.from('position_queue').update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', item.id);
      } catch (error) {
        const message = error instanceof SerpProviderError
          ? error.message
          : `Сбой запроса к поставщику: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`Позиция не получена (${item.search_engine}, "${item.keyword}"):`, message);

        // Даём второй шанс: у поставщика бывают временные отказы.
        const exhausted = item.attempts + 1 >= MAX_ATTEMPTS;
        await client
          .from('position_queue')
          .update({
            status: exhausted ? 'failed' : 'pending',
            error: message,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);
      }

      processed++;

      // Счётчик обновляем по ходу — иначе пользователь смотрит на неподвижный ноль.
      const { count } = await client
        .from('position_results')
        .select('id', { count: 'exact', head: true })
        .eq('check_id', checkId);

      await client
        .from('position_checks')
        .update({ keywords_checked: count ?? 0, heartbeat_at: new Date().toISOString() })
        .eq('id', checkId);

      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
    }

    // Что осталось в очереди.
    const { count: pending } = await client
      .from('position_queue')
      .select('id', { count: 'exact', head: true })
      .eq('check_id', checkId)
      .in('status', ['pending', 'processing']);

    if ((pending ?? 0) > 0) {
      // Работа не кончилась — передаём эстафету следующему заходу.
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/positions-processor`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ check_id: checkId }),
      }).catch((error) => console.error('Не удалось передать эстафету:', error));

      return json({ processed, pending, done: false });
    }

    // Очередь пуста — подводим итог.
    const { count: done } = await client
      .from('position_results')
      .select('id', { count: 'exact', head: true })
      .eq('check_id', checkId);

    const { data: failedItems } = await client
      .from('position_queue')
      .select('keyword, search_engine, error')
      .eq('check_id', checkId)
      .eq('status', 'failed');

    const failures = (failedItems ?? []).map((f) => `${f.keyword} [${f.search_engine}]: ${f.error}`);
    // Частичный результат честно помечаем частичным: пользователь должен видеть,
    // что часть запросов не проверена, а не считать нули реальными позициями.
    const status = (done ?? 0) === 0 ? 'failed' : (failures.length > 0 ? 'partial' : 'completed');

    await client
      .from('position_checks')
      .update({
        status,
        keywords_checked: done ?? 0,
        error: failures.length > 0 ? failures.slice(0, 10).join('; ') : null,
        completed_at: new Date().toISOString(),
        heartbeat_at: new Date().toISOString(),
      })
      .eq('id', checkId);

    return json({ processed, pending: 0, done: true, status, checked: done ?? 0, failures: failures.length });
  } catch (error) {
    console.error('positions-processor упал:', error);
    return json({ error: error instanceof Error ? error.message : 'Внутренняя ошибка' }, 500);
  }
});

/**
 * Позиции прошлой проверки по этому домену — для колонки «было / стало».
 * Берём по ключу последнюю запись; отсутствие истории оставляем пустым,
 * а не заполняем произвольным числом.
 */
async function loadPreviousPositions(
  client: ReturnType<typeof createClient>,
  userId: string,
  domain: string,
): Promise<Map<string, number>> {
  const previous = new Map<string, number>();

  const { data: lastCheck } = await client
    .from('position_checks')
    .select('id')
    .eq('user_id', userId)
    .eq('domain', domain)
    .in('status', ['completed', 'partial'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastCheck) return previous;

  const { data: rows } = await client
    .from('position_results')
    .select('keyword, search_engine, position')
    .eq('check_id', lastCheck.id);

  for (const row of rows ?? []) {
    previous.set(`${row.search_engine}:${row.keyword}`, row.position);
  }
  return previous;
}
