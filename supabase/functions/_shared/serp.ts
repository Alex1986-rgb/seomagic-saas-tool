/**
 * Слой поставщиков поисковой выдачи (SERP).
 *
 * Позиция сайта в выдаче — внешние данные: их нельзя вычислить на своей стороне,
 * их можно только запросить у поставщика, который имеет доступ к поиску.
 * Поэтому модуль не содержит ни одной эвристики «предсказания» позиции: либо
 * поставщик настроен и возвращает реальную выдачу, либо запрос честно падает.
 *
 * Поставщик выбирается переменной окружения SERP_PROVIDER:
 *   xmlriver   — XMLRiver: XMLRIVER_USER + XMLRIVER_KEY (Яндекс и Google, РФ)
 *   dataforseo — DataForSEO: DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD
 *   serpapi    — SerpApi: SERPAPI_KEY
 */

export type SearchEngine = 'google' | 'yandex';

export interface SerpRequest {
  engine: SearchEngine;
  query: string;
  /** Регион: код страны для Google ('ru', 'us') либо номер региона Яндекса ('213'). */
  region?: string;
  /** Сколько позиций просматриваем (10–100). */
  depth: number;
}

export interface SerpResponse {
  /** Органическая выдача по порядку, позиция = индекс + 1. */
  urls: string[];
  provider: string;
  /** Адрес выдачи для ручной перепроверки человеком. */
  searchUrl: string;
}

/** Поставщик не настроен или ответил отказом — отличаем от прочих сбоев. */
export class SerpProviderError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
    this.name = 'SerpProviderError';
  }
}

const REGION_DEFAULTS = {
  google: 'ru',
  yandex: '213', // Москва
} as const;

/**
 * Настроен ли поставщик. Проверяется до начала проверки, чтобы пользователь
 * получил внятный отказ, а не сотню упавших запросов.
 */
export function getConfiguredProvider(): string | null {
  const explicit = Deno.env.get('SERP_PROVIDER')?.trim().toLowerCase();
  const available = [
    Deno.env.get('XMLRIVER_USER') && Deno.env.get('XMLRIVER_KEY') ? 'xmlriver' : null,
    Deno.env.get('DATAFORSEO_LOGIN') && Deno.env.get('DATAFORSEO_PASSWORD') ? 'dataforseo' : null,
    Deno.env.get('SERPAPI_KEY') ? 'serpapi' : null,
  ].filter(Boolean) as string[];

  if (explicit) return available.includes(explicit) ? explicit : null;
  return available[0] ?? null;
}

export const PROVIDER_SETUP_HINT =
  'Трекинг позиций не настроен: не задан поставщик поисковой выдачи. ' +
  'Пропишите в секретах проекта ключи одного из поставщиков — ' +
  'XMLRIVER_USER + XMLRIVER_KEY, либо DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD, либо SERPAPI_KEY.';

export async function fetchSerp(req: SerpRequest): Promise<SerpResponse> {
  const provider = getConfiguredProvider();
  if (!provider) throw new SerpProviderError(PROVIDER_SETUP_HINT, 503);

  switch (provider) {
    case 'xmlriver':
      return await fetchXmlRiver(req);
    case 'dataforseo':
      return await fetchDataForSeo(req);
    case 'serpapi':
      return await fetchSerpApi(req);
    default:
      throw new SerpProviderError(`Неизвестный поставщик выдачи: ${provider}`, 500);
  }
}

/**
 * Позиция домена в выдаче: 1..depth, либо 0 если в просмотренной выдаче его нет.
 * Совпадением считается сам домен и его поддомены, www игнорируется.
 */
export function findDomainPosition(
  urls: string[],
  domain: string,
): { position: number; url?: string } {
  const target = normalizeHost(domain);

  for (let i = 0; i < urls.length; i++) {
    let host: string;
    try {
      host = normalizeHost(new URL(urls[i]).hostname);
    } catch {
      continue; // мусор в выдаче поставщика не должен ронять проверку
    }
    if (host === target || host.endsWith(`.${target}`)) {
      return { position: i + 1, url: urls[i] };
    }
  }
  return { position: 0 };
}

function normalizeHost(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
}

// --- XMLRiver ---------------------------------------------------------------

async function fetchXmlRiver({ engine, query, region, depth }: SerpRequest): Promise<SerpResponse> {
  const user = Deno.env.get('XMLRIVER_USER');
  const key = Deno.env.get('XMLRIVER_KEY');
  if (!user || !key) throw new SerpProviderError(PROVIDER_SETUP_HINT, 503);

  const base = engine === 'yandex'
    ? 'https://xmlriver.com/search_yandex/xml'
    : 'https://xmlriver.com/search/xml';

  const params = new URLSearchParams({
    user,
    key,
    query,
    groupby: String(Math.min(100, Math.max(10, depth))),
  });
  // Google — код страны, Яндекс — числовой код региона.
  const loc = region || REGION_DEFAULTS[engine];
  if (engine === 'yandex') params.set('lr', loc);
  else params.set('country', loc);

  const url = `${base}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new SerpProviderError(`XMLRiver ответил ${res.status}`, 502);
  }
  const xml = await res.text();

  const error = xml.match(/<error[^>]*>([\s\S]*?)<\/error>/i);
  if (error) throw new SerpProviderError(`XMLRiver: ${stripCdata(error[1])}`, 502);

  // Из выдачи нужен только порядок ссылок, поэтому полноценный разбор XML избыточен.
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)]
    .map((m) => stripCdata(m[1]).trim())
    .filter(Boolean);

  return { urls, provider: 'xmlriver', searchUrl: humanSearchUrl(engine, query, loc) };
}

function stripCdata(value: string): string {
  return value.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '');
}

// --- DataForSEO -------------------------------------------------------------

async function fetchDataForSeo({ engine, query, region, depth }: SerpRequest): Promise<SerpResponse> {
  const login = Deno.env.get('DATAFORSEO_LOGIN');
  const password = Deno.env.get('DATAFORSEO_PASSWORD');
  if (!login || !password) throw new SerpProviderError(PROVIDER_SETUP_HINT, 503);

  const endpoint = engine === 'yandex'
    ? 'https://api.dataforseo.com/v3/serp/yandex/organic/live/advanced'
    : 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced';

  const loc = region || REGION_DEFAULTS[engine];
  const task: Record<string, unknown> = {
    keyword: query,
    depth: Math.min(100, Math.max(10, depth)),
    language_code: 'ru',
  };
  // У DataForSEO регион задаётся названием местоположения; для РФ хватает страны.
  task.location_name = loc === 'us' ? 'United States' : 'Russian Federation';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${login}:${password}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([task]),
  });
  if (!res.ok) throw new SerpProviderError(`DataForSEO ответил ${res.status}`, 502);

  const body = await res.json();
  const taskResult = body?.tasks?.[0];
  if (!taskResult || taskResult.status_code !== 20000) {
    throw new SerpProviderError(`DataForSEO: ${taskResult?.status_message ?? 'нет данных'}`, 502);
  }

  const items = taskResult.result?.[0]?.items ?? [];
  const urls = items
    .filter((item: Record<string, unknown>) => item.type === 'organic' && typeof item.url === 'string')
    .map((item: Record<string, string>) => item.url);

  return { urls, provider: 'dataforseo', searchUrl: humanSearchUrl(engine, query, loc) };
}

// --- SerpApi ----------------------------------------------------------------

async function fetchSerpApi({ engine, query, region, depth }: SerpRequest): Promise<SerpResponse> {
  const key = Deno.env.get('SERPAPI_KEY');
  if (!key) throw new SerpProviderError(PROVIDER_SETUP_HINT, 503);

  const loc = region || REGION_DEFAULTS[engine];
  const params = new URLSearchParams({
    engine: engine === 'yandex' ? 'yandex' : 'google',
    api_key: key,
    num: String(Math.min(100, Math.max(10, depth))),
  });
  if (engine === 'yandex') {
    params.set('text', query);
    params.set('lr', loc);
  } else {
    params.set('q', query);
    params.set('gl', loc);
    params.set('hl', 'ru');
  }

  const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  if (!res.ok) throw new SerpProviderError(`SerpApi ответил ${res.status}`, 502);

  const body = await res.json();
  if (body.error) throw new SerpProviderError(`SerpApi: ${body.error}`, 502);

  const urls = (body.organic_results ?? [])
    .map((item: Record<string, string>) => item.link)
    .filter(Boolean);

  return { urls, provider: 'serpapi', searchUrl: humanSearchUrl(engine, query, loc) };
}

/** Ссылка на живую выдачу — чтобы человек мог перепроверить результат руками. */
function humanSearchUrl(engine: SearchEngine, query: string, region: string): string {
  return engine === 'yandex'
    ? `https://yandex.ru/search/?text=${encodeURIComponent(query)}&lr=${encodeURIComponent(region)}`
    : `https://www.google.com/search?q=${encodeURIComponent(query)}&gl=${encodeURIComponent(region)}`;
}
