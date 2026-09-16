/**
 * Адреса страницы аудита и сравнение сайтов.
 *
 * Раньше каждая кнопка «Открыть / Просмотр / Возобновить» собирала ссылку сама
 * и вела на `/audit?url=...` без номера задачи: страница подбирала «последний
 * аудит» по подстроке домена, и человек видел не ту проверку, а то и проверку
 * другого сайта (`%shop.ru%` совпадает с myshop.ru). Здесь одна ссылка на
 * конкретную задачу и одно правило, что считать «тем же сайтом».
 */

/**
 * Хост сайта без протокола, www и регистра: «https://WWW.Shop.ru/catalog» → «shop.ru».
 * Для неразбираемой строки возвращает её же в нижнем регистре без пути.
 */
export function normalizeHost(value: string | null | undefined): string {
  const raw = (value ?? '').trim();
  if (!raw) return '';

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return raw
      .toLowerCase()
      .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
      .replace(/[/?#].*$/, '')
      .replace(/^www\./, '');
  }
}

/** Один и тот же сайт — совпадает хост целиком, а не часть адреса. */
export function isSameSite(a: string | null | undefined, b: string | null | undefined): boolean {
  const hostA = normalizeHost(a);
  return hostA !== '' && hostA === normalizeHost(b);
}

/**
 * Путь к странице аудита внутри приложения. С `taskId` открывается именно эта
 * проверка; без него страница сама подберёт последнюю завершённую проверку сайта.
 */
export function auditPagePath(url: string, taskId?: string | null): string {
  const params = new URLSearchParams({ url });
  if (taskId) params.set('task_id', taskId);
  return `/site-audit?${params.toString()}`;
}

/**
 * Полная ссылка на результаты — для «Поделиться». Сайт публикуется в подпапке,
 * поэтому к пути приклеивается адрес сборки (BASE_URL), иначе ссылка вела бы в 404.
 */
export function absoluteAuditPageUrl(url: string, taskId?: string | null): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  return `${origin}${base}${auditPagePath(url, taskId)}`;
}
