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
 * Данные приходят от внешнего поставщика выдачи через edge-функции: ключи
 * поставщика не должны попадать в браузер, а поисковики не отвечают на запросы
 * со страницы. Если поставщик не настроен или запрос не прошёл — функция бросает
 * ошибку. Никаких подставных чисел она не возвращает.
 *
 * Проверка идёт в фоне: `positions-check` ставит запросы в очередь и сразу
 * отвечает, обработчик разбирает её пачками. Здесь мы ждём завершения, сообщая
 * о ходе работы через `onProgress` — иначе десятки запросов на глубину 100 не
 * уложились бы в отведённое одному вызову время.
 */
export interface PositionCheckProgress {
  checked: number;
  total: number;
  status: string;
  estimatedSeconds?: number;
}

/** Как часто спрашиваем о ходе работы. Чаще незачем: проверка идёт минутами. */
const POLL_INTERVAL_MS = 4000;
/** Дольше этого не ждём даже фоновую проверку. */
const MAX_WAIT_MS = 45 * 60 * 1000;

export const checkPositions = async (
  data: PositionCheckParams,
  onProgress?: (progress: PositionCheckProgress) => void,
): Promise<PositionData> => {
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

  const scanId: string = response.scanId;
  onProgress?.({
    checked: 0,
    total: response.keywordsTotal ?? validKeywords.length,
    status: 'running',
    estimatedSeconds: response.estimatedSeconds,
  });

  const check = await waitForCheck(scanId, onProgress);
  const keywords = await loadCheckResults(scanId);

  if (keywords.length === 0) {
    throw new Error(check.error ?? 'Ни один запрос не удалось проверить');
  }

  const result: PositionData = {
    domain: response.domain,
    timestamp: response.timestamp ?? new Date().toISOString(),
    date: response.timestamp ?? new Date().toISOString(),
    keywords,
    searchEngine: response.searchEngine ?? data.searchEngine,
    region: response.region ?? data.region,
    depth: response.depth ?? data.depth,
    scanFrequency: data.scanFrequency,
    scanId,
    provider: response.provider,
    status: check.status,
    failures: check.error ? [check.error] : [],
  };

  // История лежит в БД, поэтому отдельного сохранения не нужно — достаточно
  // сообщить интерфейсу, что появилась новая запись.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('position-history-updated', { detail: result }));
  }

  return result;
};

/** Ждём, пока обработчик разберёт очередь, попутно сообщая о ходе работы. */
async function waitForCheck(
  scanId: string,
  onProgress?: (progress: PositionCheckProgress) => void,
): Promise<{ status: string; error: string | null }> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < MAX_WAIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const { data, error } = await supabase
      .from('position_checks')
      .select('status, keywords_checked, keywords_total, error')
      .eq('id', scanId)
      .single();

    if (error) continue; // разрыв связи не повод бросать проверку, которая идёт на сервере

    onProgress?.({
      checked: data.keywords_checked ?? 0,
      total: data.keywords_total ?? 0,
      status: data.status,
    });

    if (data.status !== 'running') {
      return { status: data.status, error: data.error ?? null };
    }
  }

  throw new Error('Проверка идёт дольше ожидаемого. Результаты появятся в истории, когда она закончится.');
}

/** Готовые позиции из базы: их пишет обработчик по мере обхода выдачи. */
async function loadCheckResults(scanId: string): Promise<KeywordPosition[]> {
  const { data, error } = await supabase
    .from('position_results')
    .select('keyword, search_engine, position, previous_position, url, search_url, checked_at')
    .eq('check_id', scanId)
    .order('keyword', { ascending: true });

  if (error) throw new Error('Проверка завершена, но результаты не прочитались');

  return (data ?? []).map((row) => ({
    keyword: row.keyword,
    position: row.position,
    previousPosition: row.previous_position ?? undefined,
    url: row.url ?? undefined,
    searchEngine: row.search_engine,
    searchUrl: row.search_url ?? undefined,
    lastChecked: row.checked_at,
  }));
}

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
