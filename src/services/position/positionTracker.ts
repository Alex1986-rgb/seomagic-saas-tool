import { supabase } from '@/integrations/supabase/client';

// Интерфейсы для типизации
export interface KeywordPosition {
  keyword: string;
  /** 1..depth — место в выдаче; 0 — в просмотренной выдаче домена нет. */
  position: number;
  url?: string;
  searchEngine: string;
  previousPosition?: number;
  lastChecked?: string;
  searchUrl?: string;
}

export interface PositionData {
  domain: string;
  timestamp: string;
  date?: string;
  keywords: KeywordPosition[];
  searchEngine: string;
  region?: string;
  depth: number;
  scanFrequency: string;
  previousResults?: PositionData[];
  useProxy?: boolean;
  proxyUsed?: string;
  scanId?: string;
  /** Поставщик выдачи, откуда взяты данные. */
  provider?: string;
  /** 'completed' — проверены все запросы, 'partial' — часть запросов не прошла. */
  status?: string;
  /** Запросы, которые не удалось проверить: их нет в keywords. */
  failures?: string[];
}

export interface PositionCheckParams {
  domain: string;
  keywords: string[];
  searchEngine: string;
  region?: string;
  depth: number;
  scanFrequency: string;
  useProxy?: boolean;
  timestamp?: string;
}

/**
 * Проверка позиций домена в поисковой выдаче.
 *
 * Данные приходят от внешнего поставщика выдачи через edge-функцию
 * `positions-check`: ключи поставщика не должны попадать в браузер, а поисковики
 * не отвечают на запросы со страницы. Если поставщик не настроен или запрос
 * не прошёл — функция бросает ошибку. Никаких подставных чисел она не возвращает.
 */
export const checkPositions = async (data: PositionCheckParams): Promise<PositionData> => {
  if (!data.domain) {
    throw new Error('Не указан домен для проверки');
  }

  const validKeywords = (data.keywords ?? [])
    .filter((k) => k && typeof k === 'string' && k.trim() !== '')
    .map((k) => k.trim());

  if (validKeywords.length === 0) {
    throw new Error('Не указаны ключевые слова для проверки');
  }

  const { data: response, error } = await supabase.functions.invoke('positions-check', {
    body: {
      domain: data.domain,
      keywords: validKeywords,
      searchEngine: data.searchEngine === 'all' ? 'all' : data.searchEngine,
      region: data.region,
      depth: data.depth,
    },
  });

  if (error) {
    // Текст ошибки функции полезнее общего «Edge Function returned a non-2xx».
    const detail = await readFunctionError(error);
    throw new Error(detail ?? error.message);
  }
  if (!response || response.error) {
    throw new Error(response?.error ?? 'Пустой ответ сервиса проверки позиций');
  }

  const result: PositionData = {
    domain: response.domain,
    timestamp: response.timestamp ?? new Date().toISOString(),
    date: response.timestamp ?? new Date().toISOString(),
    keywords: response.keywords ?? [],
    searchEngine: response.searchEngine ?? data.searchEngine,
    region: response.region ?? data.region,
    depth: response.depth ?? data.depth,
    scanFrequency: data.scanFrequency,
    scanId: response.scanId,
    provider: response.provider,
    status: response.status,
    failures: response.failures ?? [],
  };

  // История лежит в БД, поэтому отдельного сохранения не нужно — достаточно
  // сообщить интерфейсу, что появилась новая запись.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('position-history-updated', { detail: result }));
  }

  return result;
};

/** Ответ edge-функции с ошибкой приходит телом; вытаскиваем из него текст. */
async function readFunctionError(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response })?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
}
