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

  // Google — код страны, Яндекс — числовой код региона.
  const loc = region || REGION_DEFAULTS[engine];
  const wanted = Math.min(100, Math.max(10, depth));

  // За один запрос XMLRiver отдаёт одну страницу выдачи. Её размер задаётся не
  // в запросе, а в «Настройках сбора» личного кабинета — по умолчанию около
  // десяти органических результатов. Поэтому глубину набираем постранично: при
  // настройке в сто результатов хватит одного запроса, при десяти понадобится
  // несколько. Каждая страница платная, так что лишних запросов не делаем —
  // останавливаемся, как только набрали нужное или страница пришла пустой.
  const urls: string[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= XMLRIVER_MAX_PAGES; page++) {
    const params = new URLSearchParams({ user, key, query });
    if (engine === 'yandex') params.set('lr', loc);
    else params.set('country', loc);
    // Первая страница запрашивается без параметра: page=0 и page=1 дают её же.
    if (page > 1) params.set('page', String(page));

    const pageUrls = await fetchXmlRiverPage(`${base}?${params.toString()}`);
    if (pageUrls.length === 0) break;

    // Если кабинет отдаёт страницу целиком, следующая может повторить часть
    // ссылок — повторы не должны сдвигать позицию.
    for (const value of pageUrls) {
      if (seen.has(value)) continue;
      seen.add(value);
      urls.push(value);
    }
    if (urls.length >= wanted) break;
  }

  return {
    urls: urls.slice(0, wanted),
    provider: 'xmlriver',
    searchUrl: humanSearchUrl(engine, query, loc),
  };
}

/**
 * Потолок страниц на один запрос. При стандартной настройке кабинета (десять
 * результатов на страницу) этого хватает на глубину 100; выше — уже не столько
 * полезных данных, сколько расход баланса.
 */
const XMLRIVER_MAX_PAGES = 10;

/** Одна страница выдачи XMLRiver с повторами на штатную «выполните перезапрос». */
async function fetchXmlRiverPage(url: string): Promise<string[]> {

  // XMLRiver штатно отвечает ошибкой 500 «Выполните перезапрос», когда не получил
  // ответ от поисковика: это не сбой, а просьба повторить. Повторяем сами, иначе
  // каждая вторая проверка падала бы у пользователя на пустом месте.
  let xml = '';
  let lastTransientError = '';
  for (let attempt = 1; attempt <= XMLRIVER_MAX_ATTEMPTS; attempt++) {
    const res = await fetch(url);
    if (!res.ok) throw new SerpProviderError(`XMLRiver ответил ${res.status}`, 502);
    xml = await res.text();

    const error = xml.match(/<error\s+code="(\d+)"[^>]*>([\s\S]*?)<\/error>/i);
    if (!error) break;

    const code = Number(error[1]);
    const message = stripCdata(error[2]).trim();

    // 15 — поисковик ничего не нашёл. Это валидный результат: сайта в выдаче нет.
    if (code === 15) return [];

    if (code !== 500) throw new SerpProviderError(`XMLRiver: ${message}`, 502);

    lastTransientError = message;
    if (attempt < XMLRIVER_MAX_ATTEMPTS) await delay(XMLRIVER_RETRY_DELAY_MS * attempt);
  }

  if (lastTransientError && /<error/i.test(xml)) {
    throw new SerpProviderError(
      `XMLRiver не отдал выдачу за ${XMLRIVER_MAX_ATTEMPTS} попытки: ${lastTransientError}`,
      502,
    );
  }

  return parseXmlRiverUrls(xml);
}

const XMLRIVER_MAX_ATTEMPTS = 3;
const XMLRIVER_RETRY_DELAY_MS = 1500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Порядок органических ссылок из ответа XMLRiver.
 *
 * Разбираем поштучно каждый <doc>, а не все <url> подряд: в выдаче попадаются
 * блоки с типом, отличным от organic (реклама, картинки, видео), и они не
 * занимают позицию в органике — иначе позиция сайта уезжала бы вниз.
 */
export function parseXmlRiverUrls(xml: string): string[] {
  const urls: string[] = [];

  for (const doc of xml.matchAll(/<doc>([\s\S]*?)<\/doc>/gi)) {
    const body = doc[1];
    const contentType = body.match(/<contenttype>([\s\S]*?)<\/contenttype>/i);
    // Тип указан не всегда; когда его нет, считаем результат органическим.
    if (contentType && stripCdata(contentType[1]).trim().toLowerCase() !== 'organic') continue;

    const url = body.match(/<url>([\s\S]*?)<\/url>/i);
    if (!url) continue;

    const value = stripCdata(url[1]).trim();
    if (value) urls.push(value);
  }

  return urls;
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
