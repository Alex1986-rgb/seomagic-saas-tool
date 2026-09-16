/**
 * Чистые функции экранов аккаунта: вход, сброс пароля, добавление сайта.
 * Вынесены из компонентов, чтобы проверяться тестом без браузера и Supabase.
 */

/** Не короче — как в существующей смене пароля (ClientPasswordTab): одно правило на весь продукт. */
export const MIN_PASSWORD_LENGTH = 8;

/** Потолок запросов за одну проверку позиций — тот же, что в positions-check (MAX_KEYWORDS). */
export const MAX_TRACKER_KEYWORDS = 200;

/**
 * Куда вернуть человека после входа.
 *
 * ProtectedRoute кладёт в state.from объект Location, старые ссылки — строку. Берём только
 * внутренний путь: «//evil.example» и «https://…» браузер понял бы как другой сайт, и форма
 * входа превратилась бы в открытый редирект для фишинга. Страницы входа и сброса как цель
 * не годятся — человек крутился бы по кругу.
 */
export function safeRedirect(from: unknown, fallback = '/app'): string {
  let path: string | null = null;
  if (typeof from === 'string') {
    path = from;
  } else if (from && typeof from === 'object' && 'pathname' in from) {
    const loc = from as { pathname?: unknown; search?: unknown; hash?: unknown };
    if (typeof loc.pathname === 'string') {
      path = `${loc.pathname}${typeof loc.search === 'string' ? loc.search : ''}${typeof loc.hash === 'string' ? loc.hash : ''}`;
    }
  }
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return fallback;
  if (/^\/(app\/)?(login|reset)(\/|\?|#|$)/.test(path) || /^\/auth(\/|\?|#|$)/.test(path)) return fallback;
  return path;
}

export interface AuthErrorLike {
  message?: string;
  status?: number;
  name?: string;
  code?: string;
}

/** Ошибки Supabase Auth приходят по-английски — клиенту показываем русский текст. */
export function loginErrorText(err: AuthErrorLike | null | undefined): string {
  if (!err) return 'Не удалось войти. Попробуйте ещё раз.';
  const msg = (err.message ?? '').toLowerCase();
  if (err.code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'Неверная почта или пароль.';
  }
  if (err.code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Почта не подтверждена. Откройте письмо со ссылкой, которое пришло после регистрации.';
  }
  if (err.status === 429 || msg.includes('rate limit') || msg.includes('too many')) {
    return 'Слишком много попыток. Подождите несколько минут.';
  }
  if (err.name === 'AuthRetryableFetchError' || msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.';
  }
  return 'Не удалось войти. Попробуйте ещё раз.';
}

/**
 * Что показать после запроса ссылки сброса.
 *
 * Защита от перебора: «письмо отправлено» показываем и для существующего, и для
 * несуществующего адреса — иначе форма отвечала бы на вопрос «есть ли такой клиент».
 * Отдельный текст допустим только для ошибок, которые от адреса не зависят: частота запросов
 * и отсутствие связи. Всё остальное — тот же экран «письмо отправлено».
 */
export function resetRequestOutcome(err: AuthErrorLike | null | undefined): { sent: true } | { sent: false; text: string } {
  if (!err) return { sent: true };
  const msg = (err.message ?? '').toLowerCase();
  if (err.status === 429 || msg.includes('rate limit') || msg.includes('security purposes')) {
    return { sent: false, text: 'Ссылку уже запрашивали только что. Подождите минуту и попробуйте снова.' };
  }
  if (err.name === 'AuthRetryableFetchError' || msg.includes('failed to fetch') || msg.includes('network')) {
    return { sent: false, text: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.' };
  }
  return { sent: true };
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * Адрес сайта из поля ввода: схема по умолчанию https, без хвоста пути.
 * null — адрес не похож на публичный домен (нет точки, пробелы, localhost): аудит по такому
 * всё равно отклонит сервер, лучше сказать сразу.
 */
export function normalizeSiteUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host.startsWith('.') || host.endsWith('.')) return null;
  // Кириллический домен URL уже перевёл в punycode (xn--…), поэтому допустимы только эти символы.
  if (!/^[a-z0-9.-]+$/.test(host)) return null;
  return `${url.protocol}//${url.host}`;
}

/** Запросы из textarea: по одному в строке, без пустых и повторов, не больше лимита проверки. */
export function parseKeywords(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const k = line.trim().replace(/\s+/g, ' ');
    if (!k) continue;
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out;
}

/** Регионы шага 1 → номер региона Яндекса, который принимает positions-check. */
export const REGIONS = [
  { value: 'msk', label: 'Москва', yandex: '213' },
  { value: 'spb', label: 'Санкт-Петербург', yandex: '2' },
  { value: 'ru', label: 'Россия', yandex: '225' },
] as const;

export type RegionId = (typeof REGIONS)[number]['value'];

export function auditLink(siteUrl: string): string {
  return `/app/audit?url=${encodeURIComponent(siteUrl)}`;
}

export function positionsLink(host: string, keywords: string[], region?: RegionId): string {
  const params = new URLSearchParams();
  params.set('host', host);
  params.set('keywords', keywords.slice(0, MAX_TRACKER_KEYWORDS).join('\n'));
  const r = REGIONS.find((x) => x.value === region);
  if (r) params.set('region', r.yandex);
  return `/app/positions?${params.toString()}`;
}
