
import type { Proxy } from '../types';
import axios from 'axios';

/**
 * Проверка одного прокси.
 *
 * Параметр `proxy` у axios работает только в Node. В браузере он молча
 * игнорируется, и запрос уходит напрямую. Раньше из-за этого любой прокси
 * из списка помечался «active», как только тестовый адрес отвечал браузеру
 * напрямую, а в «скорость» записывалось время прямого запроса. Из админки
 * (браузер) проверить прокси нельзя, поэтому статус не меняем и объясняем
 * причину в lastError.
 */
export const BROWSER_PROXY_CHECK_UNAVAILABLE =
  'Не проверен: браузер не умеет отправить запрос через указанный прокси, а прямой ответ тестового адреса ничего не говорит о самом прокси.';

export async function testProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
  const updatedProxy = { ...proxy };

  if (typeof window !== 'undefined') {
    updatedProxy.status = 'testing';
    updatedProxy.speed = undefined;
    updatedProxy.lastError = BROWSER_PROXY_CHECK_UNAVAILABLE;
    return updatedProxy;
  }

  const startTime = Date.now();

  try {
    // Create a proxy configuration for Axios
    const proxyConfig = {
      host: proxy.ip,
      port: proxy.port,
      protocol: proxy.protocol || 'http'
    };

    // Make request with timeout
    const response = await axios.get(testUrl, {
      proxy: proxyConfig,
      timeout: 15000,
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.status >= 200 && response.status < 400) {
      updatedProxy.status = 'active';
      updatedProxy.speed = responseTime;
      updatedProxy.lastSeen = new Date();
      updatedProxy.lastError = undefined;
      updatedProxy.checkedUrl = testUrl;
    } else {
      updatedProxy.status = 'inactive';
      updatedProxy.lastError = `Unexpected response: ${response.status}`;
      updatedProxy.checkedUrl = testUrl;
    }
  } catch (error) {
    updatedProxy.status = 'inactive';
    updatedProxy.lastError = error instanceof Error ? error.message : 'Unknown error';
    updatedProxy.checkedUrl = testUrl;
  }

  updatedProxy.lastChecked = new Date();

  return updatedProxy;
}
