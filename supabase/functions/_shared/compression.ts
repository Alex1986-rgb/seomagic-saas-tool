/**
 * Включено ли на сервере сжатие ответов.
 *
 * Обычный `fetch` в этой среде распаковывает ответ сам и вырезает заголовок
 * `content-encoding` — он не виден ни при GET, ни при HEAD, ни при явном
 * `Accept-Encoding` (этот заголовок среда подменяет). Из-за этого признак
 * «сжатие есть» всегда выходил ложным, и замечание «не включено сжатие»
 * получала каждая страница сайта: в смете появлялись тысячи рублей работ,
 * которых делать не нужно.
 *
 * Поэтому спрашиваем сервер напрямую: открываем соединение, отправляем HEAD и
 * читаем заголовки ответа как есть. Сжатие настраивается на сервере, а не на
 * отдельной странице, поэтому проверяем один раз на сайт.
 */

export interface CompressionInfo {
  /** `null` — проверить не удалось. Это не то же самое, что «сжатия нет». */
  compressed: boolean | null;
  type: string | null;
}

const UNKNOWN: CompressionInfo = { compressed: null, type: null };

/** Сколько ждём ответа: сервер, который молчит дольше, нам не интересен. */
const TIMEOUT_MS = 8000;
/** Сколько переадресаций проходим, прежде чем сдаться. */
const MAX_REDIRECTS = 3;

/** Заголовок ответа по имени — регистр не важен. */
export function headerValue(rawHead: string, name: string): string | null {
  const match = rawHead.match(new RegExp(`^${name}:\\s*([^\\r\\n]+)`, 'im'));
  return match ? match[1].trim() : null;
}

/** Код ответа из первой строки. */
export function statusCode(rawHead: string): number | null {
  const match = rawHead.match(/^HTTP\/[\d.]+\s+(\d{3})/);
  return match ? Number(match[1]) : null;
}

/** Разбор заголовков в готовый ответ о сжатии. */
export function compressionFromHead(rawHead: string): CompressionInfo {
  const encoding = headerValue(rawHead, 'content-encoding');
  if (!encoding) return { compressed: false, type: null };
  const first = encoding.split(',')[0].trim().toLowerCase();
  // `identity` означает «сжатия нет», хоть заголовок и присутствует.
  if (!first || first === 'identity') return { compressed: false, type: null };
  return { compressed: true, type: first };
}

async function readHead(target: URL): Promise<string | null> {
  const port = target.port ? Number(target.port) : (target.protocol === 'https:' ? 443 : 80);

  let conn: Deno.Conn | null = null;
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS));

  try {
    const connecting = target.protocol === 'https:'
      ? Deno.connectTls({ hostname: target.hostname, port })
      : Deno.connect({ hostname: target.hostname, port });

    conn = await Promise.race([connecting, timeout]) as Deno.Conn | null;
    if (!conn) return null;

    const request =
      `HEAD ${target.pathname || '/'}${target.search} HTTP/1.1\r\n` +
      `Host: ${target.hostname}\r\n` +
      `User-Agent: Mozilla/5.0 (compatible; SEO-Auditor/1.0)\r\n` +
      `Accept-Encoding: gzip, deflate, br\r\n` +
      `Connection: close\r\n\r\n`;

    await conn.write(new TextEncoder().encode(request));

    const buffer = new Uint8Array(8192);
    const read = await Promise.race([conn.read(buffer), timeout]) as number | null;
    if (!read) return null;

    return new TextDecoder().decode(buffer.subarray(0, read));
  } catch (error) {
    console.error('Не удалось проверить сжатие:', error instanceof Error ? error.message : error);
    return null;
  } finally {
    try { conn?.close(); } catch { /* соединение уже закрыто сервером */ }
  }
}

/** Запомненный ответ по сайту: сжатие задаётся на сервере, а не на странице. */
const bySite = new Map<string, CompressionInfo>();

export async function detectCompression(url: string): Promise<CompressionInfo> {
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return UNKNOWN;
  }

  const known = bySite.get(target.host);
  if (known) return known;

  let result = UNKNOWN;
  let current = target;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const head = await readHead(current);
    if (!head) break;

    const status = statusCode(head);
    const location = headerValue(head, 'location');

    // Переадресация: сжатие проверяем там, где на самом деле лежит страница.
    if (status && status >= 300 && status < 400 && location && hop < MAX_REDIRECTS) {
      try {
        current = new URL(location, current);
        continue;
      } catch {
        break;
      }
    }

    result = compressionFromHead(head);
    break;
  }

  bySite.set(target.host, result);
  return result;
}
