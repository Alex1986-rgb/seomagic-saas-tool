/**
 * Проверка адреса перед обходом.
 *
 * Аудит ходит по чужому адресу нашим сервером. Без проверки этим можно было
 * пользоваться как посредником: попросить аудит «сайта» http://169.254.169.254
 * или http://localhost:8000 и читать то, что доступно только изнутри.
 * Поэтому разрешаем только http(s) на публичные имена и отсекаем служебные
 * диапазоны адресов.
 *
 * Сравнения одной строкой было мало: «localhost.» с точкой на конце,
 * IPv4 внутри IPv6 ([::ffff:127.0.0.1]) и имена вроде 127.0.0.1.nip.io,
 * которые DNS разворачивает во внутренний адрес, проходили проверку. Теперь
 * хвостовая точка снимается, IPv6 разбирается по группам, а имя сайта
 * резолвится и проверяется каждый его адрес.
 */

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsafeUrlError';
  }
}

/** Четыре числа IPv4 или null, если это не IPv4. */
function parseIpv4(host: string): number[] | null {
  const parts = host.split('.');
  if (parts.length !== 4) return null;
  if (parts.some((p) => !/^\d{1,3}$/.test(p))) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => n > 255)) return null;
  return nums;
}

/** Диапазоны, которых снаружи быть не может: внутренняя сеть и служебные адреса. */
function isPrivateIpv4Parts(nums: number[]): boolean {
  const [a, b, c] = nums;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) || // адреса облачных метаданных
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224 // многоадресные и служебные
  );
}

/** Восемь групп IPv6 или null, если это не IPv6. */
function parseIpv6(host: string): number[] | null {
  let h = host.replace(/^\[|\]$/g, '').toLowerCase();
  const zone = h.indexOf('%');
  if (zone >= 0) h = h.slice(0, zone);
  if (!h.includes(':')) return null;

  // IPv4 в хвосте (::ffff:127.0.0.1) переводим в две шестнадцатеричные группы.
  const lastColon = h.lastIndexOf(':');
  const tail = h.slice(lastColon + 1);
  if (tail.includes('.')) {
    const v4 = parseIpv4(tail);
    if (!v4) return null;
    const hi = ((v4[0] << 8) | v4[1]).toString(16);
    const lo = ((v4[2] << 8) | v4[3]).toString(16);
    h = `${h.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const halves = h.split('::');
  if (halves.length > 2) return null;
  const split = (s: string) => (s === '' ? [] : s.split(':'));
  const head = split(halves[0]);
  const rest = halves.length === 2 ? split(halves[1]) : [];
  const missing = 8 - head.length - rest.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;

  const groups = [...head, ...new Array(halves.length === 2 ? missing : 0).fill('0'), ...rest];
  if (groups.length !== 8 || groups.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  return groups.map((g) => parseInt(g, 16));
}

function isPrivateIpv6Groups(g: number[]): boolean {
  const embeddedV4 = (hi: number, lo: number) => [hi >> 8, hi & 0xff, lo >> 8, lo & 0xff];
  const zeros = (from: number, to: number) => g.slice(from, to).every((x) => x === 0);

  // :: и ::1
  if (zeros(0, 7) && (g[7] === 0 || g[7] === 1)) return true;
  // IPv4 внутри IPv6: ::ffff:a.b.c.d, ::a.b.c.d и NAT64 64:ff9b::a.b.c.d —
  // соединение уходит на тот же IPv4, значит и проверять надо его.
  if (zeros(0, 5) && (g[5] === 0xffff || g[5] === 0)) return isPrivateIpv4Parts(embeddedV4(g[6], g[7]));
  if (g[0] === 0x64 && g[1] === 0xff9b) return isPrivateIpv4Parts(embeddedV4(g[6], g[7]));
  // 6to4: 2002:a.b.c.d::
  if (g[0] === 0x2002) return isPrivateIpv4Parts(embeddedV4(g[1], g[2]));

  const first = g[0];
  return (
    (first & 0xfe00) === 0xfc00 || // fc00::/7 — внутренняя сеть
    (first & 0xffc0) === 0xfe80 || // fe80::/10 — локальная линия
    (first & 0xffc0) === 0xfec0 || // fec0::/10 — устаревшие «site-local»
    (first & 0xff00) === 0xff00 || // ff00::/8 — многоадресные
    (first === 0x2001 && g[1] === 0x0db8) || // адреса для документации
    (first === 0x2001 && g[1] === 0) // Teredo: внутри спрятан IPv4
  );
}

/** Адрес (IPv4 или IPv6) из внутренней сети или служебного диапазона. */
export function isPrivateAddress(ip: string): boolean {
  const v4 = parseIpv4(ip);
  if (v4) return isPrivateIpv4Parts(v4);
  const v6 = parseIpv6(ip);
  if (v6) return isPrivateIpv6Groups(v6);
  return false;
}

/** Имя хоста без скобок IPv6 и без точки на конце: «localhost.» — это тот же localhost. */
function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');
}

function isIpLiteral(host: string): boolean {
  return parseIpv4(host) !== null || parseIpv6(host) !== null;
}

/**
 * Возвращает разобранный адрес или бросает `UnsafeUrlError`.
 * Проверяет только запись адреса, без обращения к DNS; для имён сайтов
 * используйте `assertPublicUrlResolved`.
 */
export function assertPublicUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError('Адрес сайта указан неверно');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new UnsafeUrlError('Проверять можно только адреса http и https');
  }

  const host = normalizeHost(parsed.hostname);

  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.home.arpa') ||
    host === 'metadata.google.internal'
  ) {
    throw new UnsafeUrlError('Внутренние адреса проверять нельзя');
  }

  if (isPrivateAddress(host)) {
    throw new UnsafeUrlError('Адреса внутренней сети проверять нельзя');
  }

  // Имя без точки — это имя внутри сети, а не сайт в интернете.
  if (!host.includes('.') && !host.includes(':')) {
    throw new UnsafeUrlError('Укажите адрес сайта целиком, например https://example.ru');
  }

  if (parsed.port && !['', '80', '443', '8080', '8443'].includes(parsed.port)) {
    throw new UnsafeUrlError('Проверяются только обычные порты сайта');
  }

  return parsed;
}

/** Мягкая проверка для обхода ссылок: не бросает, а отвечает да/нет. */
export function isPublicUrl(rawUrl: string): boolean {
  try {
    assertPublicUrl(rawUrl);
    return true;
  } catch {
    return false;
  }
}

/** Все адреса имени (A и AAAA). Пустой список — узнать не удалось. */
export type DnsResolver = (hostname: string) => Promise<string[]>;

const DNS_TIMEOUT_MS = 3000;

async function withTimeout<T>(promise: Promise<T>, fallback: T, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

type DenoDns = { resolveDns?: (query: string, type: 'A' | 'AAAA') => Promise<string[]> };

/**
 * Резолвер среды Deno. Вне Deno (тесты под Node) и при любой ошибке DNS
 * возвращает пустой список: проверку по имени это не отменяет, а упавший DNS не
 * должен ронять аудит — соединение к такому имени всё равно не установится.
 */
const denoResolver: DnsResolver = async (hostname) => {
  const deno = (globalThis as { Deno?: DenoDns }).Deno;
  const resolveDns = deno?.resolveDns;
  if (typeof resolveDns !== 'function') return [];

  const lookup = (type: 'A' | 'AAAA') =>
    resolveDns.call(deno, hostname, type).catch(() => [] as string[]);

  const results = await withTimeout(Promise.all([lookup('A'), lookup('AAAA')]), [[], []], DNS_TIMEOUT_MS);
  return results.flat();
};

/**
 * Полная проверка перед запросом: запись адреса и все IP, в которые
 * разворачивается имя. Вызывать на каждом шаге переадресации.
 */
export async function assertPublicUrlResolved(
  rawUrl: string,
  resolve: DnsResolver = denoResolver,
): Promise<URL> {
  const parsed = assertPublicUrl(rawUrl);
  const host = normalizeHost(parsed.hostname);
  if (isIpLiteral(host)) return parsed;

  let addresses: string[] = [];
  try {
    addresses = await resolve(host);
  } catch {
    addresses = [];
  }

  if (addresses.some((ip) => isPrivateAddress(ip))) {
    throw new UnsafeUrlError('Адрес сайта указывает во внутреннюю сеть');
  }

  return parsed;
}

export async function isPublicUrlResolved(
  rawUrl: string,
  resolve: DnsResolver = denoResolver,
): Promise<boolean> {
  try {
    await assertPublicUrlResolved(rawUrl, resolve);
    return true;
  } catch {
    return false;
  }
}
