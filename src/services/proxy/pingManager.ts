
import { ProxyStorage } from './proxyStorage';
import { PingService } from './pingService';
import type { PingResult } from './types';

/**
 * XML-RPC пинг страниц.
 *
 * Раньше метод ничего не отправлял: на каждую пару «адрес × сервис»
 * возвращал success: true, «Ping simulated successfully» и случайное время
 * до секунды. Экран «Пинг страниц и RSS» всегда показывал сплошной успех.
 * Теперь запросы уходят по-настоящему через PingService. Из браузера многие
 * пинг-сервисы недоступны (не разрешают CORS) — тогда результат будет ошибкой
 * с объяснением, а не выдуманным успехом.
 */
export class PingManager {
  private pingService: PingService;

  constructor(proxyStorage: ProxyStorage) {
    this.pingService = new PingService(proxyStorage);
  }

  async pingUrlsWithRpc(
    urls: string[],
    siteTitle: string,
    feedUrl: string,
    rpcEndpoints: string[],
    batchSize: number = 10,
    concurrency: number = 5,
    useProxies: boolean = true
  ): Promise<PingResult[]> {
    return this.pingService.pingUrlsWithRpc(
      urls,
      siteTitle,
      feedUrl,
      rpcEndpoints,
      batchSize,
      concurrency,
      useProxies
    );
  }
}
