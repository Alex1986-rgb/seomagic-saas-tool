/**
 * Постановка проверки позиций в работу.
 *
 * Функция серверная по необходимости: ключи поставщика выдачи нельзя отдавать
 * в браузер, а поисковики не отвечают на кросс-доменные запросы со страницы.
 *
 * Сама выдача собирается не здесь. Тридцать запросов на глубину 100 — это триста
 * обращений к поставщику и минут двадцать работы, а edge-функция живёт две с
 * половиной минуты. Поэтому здесь запросы только становятся в очередь, а разбирает
 * её `positions-processor` пачками, сохраняя результат по ходу. Ответ приходит
 * сразу, состояние видно по `position_checks`.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import {
  getConfiguredProvider,
  PAGE_SIZE_HINT,
  PROVIDER_SETUP_HINT,
  SearchEngine,
} from "../_shared/serp.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Потолок на одну проверку. Ограничение не техническое, а денежное: каждый
 * запрос на каждой странице выдачи — платное обращение к поставщику.
 */
const MAX_KEYWORDS = 200;
/** Дальше этого числа обращений проверку не пускаем без явного согласия. */
const MAX_PROVIDER_REQUESTS = 1000;

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

    // Считаем цену вопроса заранее: поставщик отдаёт выдачу постранично, и
    // глубина 100 превращает один запрос в десяток платных обращений.
    const pagesPerKeyword = Math.ceil(depth / PAGE_SIZE_HINT);
    const providerRequests = keywords.length * engines.length * pagesPerKeyword;

    if (providerRequests > MAX_PROVIDER_REQUESTS) {
      return json({
        error: `Такая проверка потребует ${providerRequests} обращений к поставщику выдачи — `
          + `это дороже и дольше разумного. Уменьшите глубину или число запросов `
          + `(сейчас ${keywords.length} запросов × ${pagesPerKeyword} страниц выдачи).`,
      }, 400);
    }

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
        provider_requests: providerRequests,
        heartbeat_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (checkError || !check) {
      console.error('Не удалось создать проверку:', checkError);
      return json({ error: 'Не удалось создать проверку позиций' }, 500);
    }

    // Ставим в очередь каждую пару «запрос + поисковик».
    const queue = engines.flatMap((engine) =>
      keywords.map((keyword) => ({ check_id: check.id, keyword, search_engine: engine }))
    );

    const { error: queueError } = await adminClient.from('position_queue').insert(queue);
    if (queueError) {
      console.error('Не удалось поставить запросы в очередь:', queueError);
      await adminClient
        .from('position_checks')
        .update({ status: 'failed', error: 'Не удалось поставить запросы в очередь', completed_at: new Date().toISOString() })
        .eq('id', check.id);
      return json({ error: 'Не удалось поставить запросы в очередь' }, 500);
    }

    // Обработчик запускаем, не дожидаясь ответа: он работает дольше, чем
    // клиент готов ждать, и сам вызывает себя, пока очередь не опустеет.
    const processorUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/positions-processor`;
    fetch(processorUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ check_id: check.id }),
    }).catch((error) => console.error('Не удалось разбудить обработчик:', error));

    // Оценка времени нужна человеку: иначе непонятно, ждать минуту или полчаса.
    const estimatedSeconds = Math.round(providerRequests * 3.5);

    return json({
      scanId: check.id,
      domain,
      searchEngine: requested,
      region,
      depth,
      provider,
      status: 'running',
      keywordsTotal: check.keywords_total,
      providerRequests,
      estimatedSeconds,
      timestamp: check.created_at,
      message: `Проверка запущена: ${check.keywords_total} запросов, `
        + `около ${Math.max(1, Math.round(estimatedSeconds / 60))} мин.`,
    });
  } catch (error) {
    console.error('positions-check упал:', error);
    return json({ error: error instanceof Error ? error.message : 'Внутренняя ошибка' }, 500);
  }
});
