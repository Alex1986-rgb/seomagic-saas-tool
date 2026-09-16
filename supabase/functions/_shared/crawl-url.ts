/**
 * Один вид адреса для обхода сайта.
 *
 * Краулер добавлял в очередь каждую найденную ссылку как есть. Один и тот же
 * документ попадал туда по многу раз: со слэшем и без, с якорем, с рекламными
 * метками, по http и https, с «www» и без. Отчёт показывал «300 страниц» там,
 * где их было шестьдесят, а доли и оценки считались от раздутого знаменателя.
 *
 * Здесь адрес приводится к одному виду. Вид задаёт начальный адрес сайта:
 * протокол и имя хоста берутся у него, чтобы ссылки внутри сайта не плодили
 * второй его «облик».
 */

/** Метки рекламы и обсуждений: на содержимое страницы они не влияют. */
const BLOCKED_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'yclid', 'replytocom', 'share',
];

export interface SiteOrigin {
  protocol: string;
  hostname: string;
}

export function parseSiteOrigin(url: string): SiteOrigin | null {
  try {
    const parsed = new URL(url);
    return { protocol: parsed.protocol, hostname: parsed.hostname.toLowerCase() };
  } catch {
    return null;
  }
}

/** Тот же сайт с точностью до «www». */
export function isSameSite(hostname: string, origin: SiteOrigin | null): boolean {
  if (!origin) return true;
  const bare = (host: string) => host.toLowerCase().replace(/^www\./, '');
  return bare(hostname) === bare(origin.hostname);
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // «www» здесь не снимаем: сайт на www отвечал бы переадресацией на каждой
    // странице, а canonical переставал совпадать сам с собой.
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.endsWith('/') && parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    parsed.hash = '';
    const params = Array.from(parsed.searchParams.entries()).sort(([a], [b]) => a.localeCompare(b));
    parsed.search = '';
    params.forEach(([key, value]) => parsed.searchParams.append(key, value));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function filterQueryParams(url: string): string {
  try {
    const parsed = new URL(url);
    BLOCKED_PARAMS.forEach((param) => parsed.searchParams.delete(param));
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Адрес в том виде, в каком он кладётся в очередь.
 * Метки снимаются до сортировки параметров — иначе адрес с меткой и без неё
 * давали разные строки.
 */
export function canonicalizeUrl(url: string, origin: SiteOrigin | null = null): string {
  const normalized = normalizeUrl(filterQueryParams(url));
  if (!origin) return normalized;

  try {
    const parsed = new URL(normalized);
    if (isSameSite(parsed.hostname, origin)) {
      parsed.protocol = origin.protocol;
      parsed.hostname = origin.hostname;
    }
    return parsed.toString();
  } catch {
    return normalized;
  }
}
