/**
 * Проверка позиций домена по ключевым словам в реальной поисковой выдаче.
 *
 * Функция серверная по необходимости: ключи поставщика выдачи нельзя отдавать
 * в браузер, а сами поисковики не отвечают на кросс-доменные запросы со страницы.
 * Если поставщик не настроен — возвращаем 503 с объяснением, а не выдуманные числа.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import {
  fetchSerp,
  findDomainPosition,
  getConfiguredProvider,
  PROVIDER_SETUP_HINT,
  SearchEngine,
  SerpProviderError,
} from "../_shared/serp.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Потолок на один запрос: проверка идёт синхронно и должна уложиться в лимит функции. */
const MAX_KEYWORDS = 50;
/** Пауза между запросами к поставщику, чтобы не ловить его лимиты. */
const REQUEST_DELAY_MS = 300;

interface PositionsCheckRequest {
  domain: string;
  keywords: string[];
  searchEngine?: 'google' | 'yandex' | 'all';
  region?: string;
  depth?: number;
}

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Требуется авторизация' }, 401);
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return json({ error: 'Требуется авторизация' }, 401);
    }

    const body: PositionsCheckRequest = await req.json();
    const domain = (body.domain ?? '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const keywords = (body.keywords ?? [])
      .map((k) => (typeof k === 'string' ? k.trim() : ''))
      .filter(Boolean);

    if (!domain) return json({ error: 'Не указан домен для проверки' }, 400);
    if (keywords.length === 0) return json({ error: 'Не указаны ключевые слова' }, 400);
    if (keywords.length > MAX_KEYWORDS) {
      return json({
        error: `За одну проверку можно проверить не больше ${MAX_KEYWORDS} запросов. ` +
          `Разбейте список на части.`,
      }, 400);
    }

    // Поставщика проверяем до записи в БД: незачем заводить проверку, которая
    // заведомо ничего не вернёт.
    const provider = getConfiguredProvider();
    if (!provider) return json({ error: PROVIDER_SETUP_HINT }, 503);

    const depth = Math.min(100, Math.max(10, body.depth ?? 100));
    const region = body.region?.trim() || undefined;
    const requested = body.searchEngine ?? 'google';
    // Поставщики отдают только эти две системы. Молча подменять запрошенную
    // систему другой нельзя — пользователь будет считать результат чужой выдачи своим.
    if (!['google', 'yandex', 'all'].includes(requested)) {
      return json({ error: `Поисковая система «${requested}» не поддерживается: доступны Google и Яндекс` }, 400);
    }
    const engines: SearchEngine[] = requested === 'all' ? ['google', 'yandex'] : [requested as SearchEngine];

    // Запись результатов — под service-role: пользователь не должен иметь
    // возможности вписать себе любую позицию руками.
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: check, error: checkError } = await adminClient
      .from('position_checks')
      .insert({
        user_id: user.id,
        domain,
        search_engine: requested,
        region,
        depth,
        provider,
        status: 'running',
        keywords_total: keywords.length * engines.length,
      })
      .select()
      .single();

    if (checkError || !check) {
      console.error('Не удалось создать проверку:', checkError);
      return json({ error: 'Не удалось создать проверку позиций' }, 500);
    }

    const previous = await loadPreviousPositions(adminClient, user.id, domain);
    const results: Array<Record<string, unknown>> = [];
    const failures: string[] = [];

    for (const engine of engines) {
      for (const keyword of keywords) {
        try {
          const serp = await fetchSerp({ engine, query: keyword, region, depth });
          const { position, url } = findDomainPosition(serp.urls, domain);

          results.push({
            check_id: check.id,
            keyword,
            search_engine: engine,
            position,
            previous_position: previous.get(`${engine}:${keyword}`) ?? null,
            url: url ?? null,
            search_url: serp.searchUrl,
          });
        } catch (error) {
          const message = error instanceof SerpProviderError
            ? error.message
            : `Сбой запроса к поставщику: ${error instanceof Error ? error.message : String(error)}`;
          console.error(`Позиция не получена (${engine}, "${keyword}"):`, message);
          failures.push(`${keyword} [${engine}]: ${message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
      }
    }

    if (results.length > 0) {
      const { error: insertError } = await adminClient.from('position_results').insert(results);
      if (insertError) {
        console.error('Не удалось сохранить результаты:', insertError);
        return json({ error: 'Результаты получены, но не сохранены' }, 500);
      }
    }

    // Частичный результат честно помечаем частичным: пользователь должен видеть,
    // что часть запросов не проверена, а не считать нули реальными позициями.
    const status = results.length === 0 ? 'failed' : (failures.length > 0 ? 'partial' : 'completed');

    await adminClient
      .from('position_checks')
      .update({
        status,
        keywords_checked: results.length,
        error: failures.length > 0 ? failures.slice(0, 10).join('; ') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', check.id);

    if (results.length === 0) {
      return json({ error: failures[0] ?? 'Ни один запрос не удалось проверить' }, 502);
    }

    return json({
      scanId: check.id,
      domain,
      searchEngine: requested,
      region,
      depth,
      provider,
      status,
      timestamp: check.created_at,
      failures,
      keywords: results.map((r) => ({
        keyword: r.keyword,
        position: r.position,
        previousPosition: r.previous_position ?? undefined,
        url: r.url ?? undefined,
        searchEngine: r.search_engine,
        searchUrl: r.search_url,
        lastChecked: new Date().toISOString(),
      })),
    });
  } catch (error) {
    console.error('positions-check упал:', error);
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
