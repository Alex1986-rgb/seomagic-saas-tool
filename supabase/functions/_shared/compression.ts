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
 * Поэтому спрашиваем сервер напрямую: открываем соединение, отправляем запрос и
 * читаем заголовки ответа как есть. Сжатие настраивается на сервере, а не на
 * отдельной странице, поэтому проверяем один раз на задачу, по стартовому
 * адресу.
 *
 * Ответ «сжатия нет» принимаем только от настоящей HTML-страницы: код 2xx,
 * `Content-Type: text/html` и заголовки целиком. Раньше годился любой ответ —
 * XML-карта сайта (nginx по умолчанию сжимает только text/html), отказ
 * защиты от ботов с кодом 403, обрезанный на середине блок заголовков, — и
 * ложное «сжатия нет» попадало в смету на весь сайт. Всё, что не подходит,
 * теперь даёт «неизвестно».
 *
 * Запрос — GET, а не HEAD: nginx на HEAD сжатие не включает вовсе, и
 * заголовка `Content-Encoding` в ответе нет даже там, где сжатие работает.
 * Тело не читаем: соединение закрывается сразу после заголовков.
 */

import { isPublicUrlResolved } from './url-guard.ts';

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
/** Больше этого заголовков не бывает; дальше читать незачем. */
const MAX_HEAD_BYTES = 32 * 1024;

const HEAD_END = '\r\n\r\n';

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

/**
 * Блок заголовков, если он пришёл целиком (до пустой строки), иначе `null`.
 * По обрезанному блоку нельзя сказать, что `Content-Encoding` в нём нет.
 */
export function completeHead(raw: string): string | null {
  const end = raw.indexOf(HEAD_END);
  return end >= 0 ? raw.slice(0, end + HEAD_END.length) : null;
}

/** Разбор заголовков в готовый ответ о сжатии. */
export function compressionFromHead(rawHead: string): CompressionInfo {
  const head = completeHead(rawHead);
  if (!head) return UNKNOWN;

  // Судим только по странице, которая открылась: переадресация, ошибка или
  // отказ защиты от ботов о настройке сжатия ничего не говорят.
  const status = statusCode(head);
  if (status === null || status < 200 || status >= 300) return UNKNOWN;

  const contentType = (headerValue(head, 'content-type') ?? '').toLowerCase();
  if (!contentType.startsWith('text/html') && !contentType.startsWith('application/xhtml+xml')) {
    return UNKNOWN;
  }

  const encoding = headerValue(head, 'content-encoding');
  if (!encoding) return { compressed: false, type: null };
  const first = encoding.split(',')[0].trim().toLowerCase();
  // `identity` означает «сжатия нет», хоть заголовок и присутствует.
  if (!first || first === 'identity') return { compressed: false, type: null };
  return { compressed: true, type: first };
}

async function readHead(target: URL): Promise<string | null> {
  const port = target.port ? Number(target.port) : (target.protocol === 'https:' ? 443 : 80);

  let conn: Deno.Conn | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  // Один срок на всё: соединение, отправку и чтение заголовков.
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), TIMEOUT_MS);
  });

  try {
    const connecting: Promise<Deno.Conn> = target.protocol === 'https:'
      ? Deno.connectTls({ hostname: target.hostname, port })
      : Deno.connect({ hostname: target.hostname, port });

    const connected = await Promise.race([connecting, timeout]);
    if (!connected) {
      // Соединение может установиться уже после срока — закрываем и его.
      connecting.then((late) => late.close()).catch(() => {});
      return null;
    }
    conn = connected;

    const request =
      `GET ${target.pathname || '/'}${target.search} HTTP/1.1\r\n` +
      `Host: ${target.host}\r\n` +
      `User-Agent: Mozilla/5.0 (compatible; SEO-Auditor/1.0)\r\n` +
      `Accept: text/html,application/xhtml+xml\r\n` +
      `Accept-Encoding: gzip, deflate, br\r\n` +
      `Connection: close\r\n\r\n`;

    await conn.write(new TextEncoder().encode(request));

    // Заголовки могут прийти несколькими порциями: читаем до пустой строки.
    const decoder = new TextDecoder();
    let received = '';
    let total = 0;
    while (total < MAX_HEAD_BYTES) {
      const buffer = new Uint8Array(8192);
      const read = await Promise.race([conn.read(buffer), timeout]);
      if (!read) return null; // сервер закрыл соединение раньше или вышел срок

      total += read;
      received += decoder.decode(buffer.subarray(0, read), { stream: true });
      const head = completeHead(received);
      if (head) return head;
    }
    return null;
  } catch (error) {
    console.error('Не удалось проверить сжатие:', error instanceof Error ? error.message : error);
    return null;
  } finally {
    clearTimeout(timer);
    try { conn?.close(); } catch { /* соединение уже закрыто сервером */ }
  }
}

/**
 * Проверка сжатия по стартовому адресу сайта. Вызывается один раз на задачу;
 * результат хранится в задаче, а не в памяти модуля, которую делят между собой
 * запросы по разным сайтам.
 */
export async function detectCompression(url: string): Promise<CompressionInfo> {
  let current: URL;
  try {
    current = new URL(url);
  } catch {
    return UNKNOWN;
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    // Переадресация могла увести во внутреннюю сеть — проверяем каждый шаг.
    if (!(await isPublicUrlResolved(current.toString()))) return UNKNOWN;

    const head = await readHead(current);
    if (!head) return UNKNOWN;

    const status = statusCode(head);
    if (status !== null && status >= 300 && status < 400) {
      const location = headerValue(head, 'location');
      // Переадресации кончились раньше страницы — судить не по чему.
      if (!location || hop === MAX_REDIRECTS) return UNKNOWN;
      try {
        current = new URL(location, current);
      } catch {
        return UNKNOWN;
      }
      continue;
    }

    return compressionFromHead(head);
  }

  return UNKNOWN;
}
