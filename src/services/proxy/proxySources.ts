
import { v4 as uuidv4 } from 'uuid';
import type { Proxy, ProxySources as ProxySourcesType } from './types';
import { ProxyStorage } from './proxyStorage';

/** Сколько ждём ответа источника, прежде чем считать его недоступным. */
const SOURCE_TIMEOUT_MS = 20000;

/**
 * Разбор адресов ip:port из ответа источника — HTML-таблицы, текстового
 * списка или JSON. Статус у найденных адресов — «testing»: прокси только
 * найден, его работоспособность никто не проверял.
 */
export function extractProxiesFromContent(content: string, source: string): Proxy[] {
  const found = new Map<string, Proxy>();
  const patterns = [
    // 1.2.3.4:8080 или 1.2.3.4 8080
    /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*[:\s]\s*(\d{2,5})\b/g,
    // <td>1.2.3.4</td><td>8080</td>
    /<td[^>]*>\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*<\/td>\s*<td[^>]*>\s*(\d{2,5})\s*<\/td>/g,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const ip = match[1];
      const port = parseInt(match[2], 10);
      const key = `${ip}:${port}`;
      if (found.has(key) || !isPublicIp(ip) || !isValidPort(port)) continue;
      found.set(key, {
        id: uuidv4(),
        ip,
        port,
        protocol: 'http',
        status: 'testing',
        lastChecked: new Date(),
        source,
      });
    }
  }

  return Array.from(found.values());
}

function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

/** Частные, служебные и петлевые адреса прокси из интернета быть не могут. */
function isPublicIp(ip: string): boolean {
  if (!isValidIp(ip)) return false;
  const [a, b] = ip.split('.').map((part) => parseInt(part, 10));
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  return true;
}

function isValidPort(port: number): boolean {
  return !isNaN(port) && port > 0 && port <= 65535;
}

/**
 * Сбор прокси из списка источников.
 *
 * Раньше первый раунд сбора ничего не скачивал: для каждого источника
 * генерировалось 25–50 случайных IP вида 103.x.x.x со случайным протоколом,
 * уровнем анонимности и статусом «active» / «inactive» / «testing». Часть
 * несуществующих адресов сразу попадала в «активные», а админ видел
 * «Сбор прокси завершён — найдено N». Теперь источник действительно
 * запрашивается, адреса берутся из его ответа, а статус у них «testing»
 * (не проверен). Если браузер не смог получить ответ — чаще всего сайт
 * источника не разрешает чтение с чужого домена (CORS), — источник честно
 * отмечается как ошибка, и ничего не добавляется.
 */
export class ProxySources {
  public proxySources: ProxySourcesType;
  private proxyStorage: ProxyStorage;

  constructor(proxySources: ProxySourcesType, proxyStorage: ProxyStorage) {
    this.proxySources = proxySources;
    this.proxyStorage = proxyStorage;
  }

  async collectProxies(
    progressCallback?: (source: string, count: number) => void
  ): Promise<Proxy[]> {
    const newProxies: Proxy[] = [];
    let totalCollected = 0;

    for (const [sourceName, source] of Object.entries(this.proxySources)) {
      if (!source.enabled) continue;

      try {
        const content = await this.fetchSource(source.url);
        // Повторы по ip:port отсекает хранилище, сохраняет пачку одной записью.
        const added = this.proxyStorage.addMany(extractProxiesFromContent(content, sourceName));
        newProxies.push(...added);
        totalCollected += added.length;

        if (progressCallback) {
          progressCallback(sourceName, totalCollected);
        }
      } catch (error) {
        console.error(`Не удалось получить прокси из источника ${sourceName}:`, error);
        if (progressCallback) {
          progressCallback(sourceName, -1);
        }
      }
    }

    return newProxies;
  }

  /** Настоящий запрос к источнику с ограничением по времени. */
  private async fetchSource(url: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Источник ответил кодом ${response.status}`);
      }
      return await response.text();
    } finally {
      clearTimeout(timer);
    }
  }

  // Method to parse proxies from imported text
  parseProxiesFromText(text: string): Proxy[] {
    const proxies: Proxy[] = [];
    const lines = text.trim().split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      try {
        let ip: string;
        let port: number;
        let protocol: 'http' | 'https' | 'socks4' | 'socks5' = 'http';

        // Try to match protocol://ip:port format
        const protocolMatch = trimmedLine.match(/^(https?|socks[45]?):\/\/([^:]+):(\d+)/i);

        if (protocolMatch) {
          const protocolStr = protocolMatch[1].toLowerCase();
          // Fix for the type error: Check protocol value and map correctly to allowed types
          if (protocolStr === 'http' || protocolStr === 'https') {
            protocol = protocolStr;
          } else if (protocolStr === 'socks4') {
            protocol = 'socks4';
          } else if (protocolStr === 'socks5' || protocolStr === 'socks') {
            protocol = 'socks5'; // Map 'socks' to 'socks5'
          }
          ip = protocolMatch[2];
          port = parseInt(protocolMatch[3], 10);
        } else {
          // Try to match ip:port format
          const ipPortMatch = trimmedLine.match(/^([^:]+):(\d+)/);
          if (!ipPortMatch) continue;

          ip = ipPortMatch[1];
          port = parseInt(ipPortMatch[2], 10);
        }

        // Validate IP and port
        if (!isValidIp(ip) || !isValidPort(port)) continue;

        const proxy: Proxy = {
          id: uuidv4(),
          ip,
          port,
          protocol,
          status: 'testing',
          lastChecked: new Date(),
          source: 'imported'
        };

        proxies.push(proxy);
      } catch (error) {
        console.error('Error parsing proxy:', trimmedLine, error);
      }
    }

    return proxies;
  }

  // Разбор ответов конкретных источников. Раньше каждый из них вместо
  // разбора данных возвращал случайные адреса; теперь все читают ip:port
  // из того, что источник действительно прислал.
  parseFreeProxyLists(data: string): Proxy[] {
    return extractProxiesFromContent(data, 'freeproxylists');
  }

  parseSSLProxies(data: string): Proxy[] {
    return extractProxiesFromContent(data, 'sslproxies');
  }

  parseFreeProxyCZ(data: string): Proxy[] {
    return extractProxiesFromContent(data, 'free-proxy.cz');
  }

  parseProxylistMe(data: string): Proxy[] {
    return extractProxiesFromContent(data, 'proxylist.me');
  }

  parseProxyScanIO(data: string): Proxy[] {
    return extractProxiesFromContent(data, 'proxyscan.io');
  }
}
