/**
 * Проверка адреса перед обходом.
 *
 * Аудит ходит по чужому адресу нашим сервером. Без проверки этим можно было
 * пользоваться как посредником: попросить аудит «сайта» http://169.254.169.254
 * или http://localhost:8000 и читать то, что доступно только изнутри.
 * Поэтому разрешаем только http(s) на публичные имена и отсекаем служебные
 * диапазоны адресов.
 */

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsafeUrlError';
  }
}

/** Диапазоны, которых снаружи быть не может: внутренняя сеть и служебные адреса. */
function isPrivateIpv4(host: string): boolean {
  const parts = host.split('.');
  if (parts.length !== 4) return false;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;

  const [a, b] = nums;
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) || // адреса облачных метаданных
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224 // многоадресные и служебные
  );
}

function isPrivateIpv6(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, '').toLowerCase();
  return h === '::1' || h === '::' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80');
}

/**
 * Возвращает разобранный адрес или бросает `UnsafeUrlError`.
 * `allowHosts` — имена, которые разрешены дополнительно (для своих же сервисов).
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

  const host = parsed.hostname.toLowerCase();

  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === 'metadata.google.internal'
  ) {
    throw new UnsafeUrlError('Внутренние адреса проверять нельзя');
  }

  if (isPrivateIpv4(host) || isPrivateIpv6(host)) {
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
