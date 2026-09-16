
import type { Proxy } from '../types';
import { UrlTestResult } from '../types';

/**
 * Запросы для проверки адресов и XML-RPC пинга.
 *
 * Раньше обе функции ничего не запрашивали: makeRequest выбирала код ответа
 * случайно (200, 301, 404, 500…) и ждала случайную паузу, а
 * makeXmlRpcRequest с вероятностью 65–85 % объявляла «Weblog ping
 * successful» с выдуманным ответом «Sample Weblog». Теперь это настоящие
 * запросы fetch.
 *
 * Ограничения браузера:
 * - отправить запрос через прокси браузер не умеет, поэтому запрос всегда
 *   прямой, и результат не приписывается прокси;
 * - прочитать ответ чужого сайта можно, только если он разрешает это (CORS).
 *   Если не разрешает, это ошибка «ответ недоступен», а не «сайт не работает».
 */

const CORS_OR_NETWORK_ERROR =
  'Браузер не получил ответ: сайт не разрешает чтение с чужого домена (CORS) или сеть недоступна.';

function describeFetchError(error: unknown, timeout: number): string {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return `Нет ответа за ${Math.round(timeout / 1000)} с`;
  }
  if (error instanceof TypeError) return CORS_OR_NETWORK_ERROR;
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

export async function makeRequest(url: string, proxy?: Proxy, timeout: number = 20000): Promise<UrlTestResult> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  // Прокси браузер применить не может — честно отмечаем прямой запрос.
  const proxyNote = proxy
    ? ` Прокси ${proxy.ip}:${proxy.port} не использован: браузер не умеет отправлять запросы через прокси.`
    : '';

  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    const endTime = Date.now();

    return {
      url,
      status: response.status,
      success: response.ok,
      errorDetails: response.ok ? (proxyNote.trim() || undefined) : `Код ответа ${response.status}.${proxyNote}`,
      timestamp: new Date().toISOString(),
      direct: true,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime
      }
    };
  } catch (error) {
    const endTime = Date.now();
    const message = describeFetchError(error, timeout);

    return {
      url,
      status: 0,
      success: false,
      error: message,
      errorDetails: `${message}${proxyNote}`,
      timestamp: new Date().toISOString(),
      direct: true,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime
      }
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Разбор ответа weblogUpdates: ошибка — fault или flerror = 1. */
function parsePingResponse(xml: string): { failed: boolean; message?: string } {
  const fault = /<fault>/i.test(xml);
  const flerror = /<name>\s*flerror\s*<\/name>\s*<value>\s*<boolean>\s*1\s*<\/boolean>/i.test(xml);
  const messageMatch = xml.match(
    /<name>\s*(?:message|faultString)\s*<\/name>\s*<value>\s*(?:<string>)?([^<]*)/i,
  );
  return { failed: fault || flerror, message: messageMatch?.[1]?.trim() || undefined };
}

export async function makeXmlRpcRequest(
  rpcEndpoint: string,
  xmlrpcRequest: string,
  proxy: Proxy | null,
  timeout: number = 20000,
  retries: number = 1
): Promise<{
  success: boolean;
  error?: string;
  errorDetails?: string;
  data?: any;
}> {
  const startTime = Date.now();
  let lastError = 'Неизвестная ошибка';
  const attempts = Math.max(1, retries);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xmlrpcRequest,
        signal: controller.signal,
      });
      const body = await response.text();

      if (!response.ok) {
        lastError = `Сервис ответил кодом ${response.status}`;
        continue;
      }

      const parsed = parsePingResponse(body);
      if (parsed.failed) {
        return {
          success: false,
          error: 'Сервис отклонил пинг',
          errorDetails: parsed.message ?? 'Ответ содержит признак ошибки (fault или flerror)',
        };
      }

      return {
        success: true,
        data: {
          endpoint: rpcEndpoint,
          message: parsed.message,
          responseCode: response.status,
          pingTime: Date.now() - startTime,
          // Прокси не применялся: браузер отправляет запрос напрямую.
          proxyUsed: 'none',
        },
      };
    } catch (error) {
      lastError = describeFetchError(error, timeout);
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    success: false,
    error: lastError,
    errorDetails: proxy
      ? `${lastError} Прокси ${proxy.ip}:${proxy.port} не использован: браузер не умеет отправлять запросы через прокси.`
      : lastError,
  };
}
