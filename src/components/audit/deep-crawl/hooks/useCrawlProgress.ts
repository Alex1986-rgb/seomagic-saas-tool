import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Настоящее глубокое сканирование сайта.
 *
 * Раньше кнопка «Глубокое сканирование» ничего не сканировала: полоса прогресса
 * росла на случайные числа, «всего страниц» всегда было 1000, адреса страниц
 * выдумывались из случайных букв, а через десять секунд обход объявлялся
 * завершённым. Пользователь получал список несуществующих страниц своего сайта.
 *
 * Теперь обход запускает edge-функция `audit-start` (тип `deep`), ход работы мы
 * читаем из `audit-status`, а список найденных адресов — из таблицы
 * `page_analysis` по номеру задачи. Ни одной придуманной цифры здесь нет.
 */

type CrawlStage = 'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed';

/** Как часто спрашиваем сервер о ходе обхода. */
const POLL_INTERVAL_MS = 2000;
/** Сколько страниц просим обойти за один запуск. */
const MAX_PAGES = 200;
/** Если ни одна цифра не меняется дольше этого — обход встал, честно об этом говорим. */
const STALL_TIMEOUT_MS = 3 * 60 * 1000;
/** Порция, которой дочитываем новые найденные адреса. */
const URL_PAGE_SIZE = 500;

interface AuditStatus {
  status: string;
  stage: string;
  progress: number;
  pagesScanned: number;
  estimatedPages: number;
  errorMessage: string | null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrl = (value: string): string => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
};

const extractDomain = (value: string): string => {
  try {
    return new URL(normalizeUrl(value)).hostname;
  } catch {
    return value;
  }
};

const describeError = (err: unknown): string =>
  err instanceof Error ? err.message : 'неизвестная ошибка';

/** Текст ошибки функции полезнее общего «Edge Function returned a non-2xx». */
const readFunctionError = async (err: unknown): Promise<string | null> => {
  const context = (err as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
};

const mapStage = (status: string, stage: string): CrawlStage => {
  if (status === 'completed') return 'completed';
  if (status === 'failed' || status === 'cancelled') return 'failed';

  switch (stage) {
    case 'queued':
    case 'pending':
    case 'initialization':
      return 'starting';
    case 'crawling':
    case 'scanning':
      return 'crawling';
    case 'analysis':
    case 'scoring':
    case 'generating':
    case 'complete':
      return 'analyzing';
    default:
      return status === 'queued' || status === 'pending' ? 'starting' : 'crawling';
  }
};

export const useCrawlProgress = (baseUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [crawlStage, setCrawlStage] = useState<CrawlStage>('idle');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>(() => extractDomain(baseUrl));
  const [taskId, setTaskId] = useState<string | null>(null);

  /**
   * Номер текущего запуска. Раньше отмену отмечал общий флаг cancelledRef:
   * «Отменить» ставил его, а новый запуск тут же сбрасывал. Старый цикл
   * опроса, проснувшись после паузы, видел сброшенный флаг и продолжал —
   * получал статус 'cancelled' своей задачи и помечал ошибкой уже новый
   * запуск, а его адреса дописывались в список нового. Теперь каждый запуск
   * помнит свой номер и молча выходит, как только номер сменился (новый запуск,
   * отмена или закрытие экрана).
   */
  const runIdRef = useRef(0);
  const runningRef = useRef(false);
  const taskIdRef = useRef<string | null>(null);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    setDomain(extractDomain(baseUrl));
  }, [baseUrl]);

  // Экран закрыли — опрос сервера прекращаем, задача на сервере живёт своей жизнью.
  useEffect(() => () => { runIdRef.current += 1; }, []);

  const failWith = useCallback((message: string) => {
    setError(message);
    setCrawlStage('failed');
    setIsLoading(false);
    runningRef.current = false;
  }, []);

  /** Дочитывает порциями адреса, которые обход успел сохранить в `page_analysis`. */
  const loadDiscoveredUrls = useCallback(async (task: string, isCurrent: () => boolean) => {
    for (;;) {
      if (!isCurrent()) return;
      const from = urlsRef.current.length;
      const { data, error: dbError } = await supabase
        .from('page_analysis')
        .select('url')
        .eq('task_id', task)
        .order('created_at', { ascending: true })
        .range(from, from + URL_PAGE_SIZE - 1);

      // Пока ждали ответ, мог начаться другой запуск: чужие адреса не дописываем.
      if (!isCurrent()) return;
      if (dbError || !data || data.length === 0) return;

      const fresh = data.map((row) => row.url).filter(Boolean);
      if (fresh.length === 0) return;

      urlsRef.current = [...urlsRef.current, ...fresh];
      setScannedUrls(urlsRef.current);
      setCurrentUrl(fresh[fresh.length - 1]);

      if (data.length < URL_PAGE_SIZE) return;
    }
  }, []);

  const fetchStatus = useCallback(async (task: string): Promise<AuditStatus> => {
    const { data, error: invokeError } = await supabase.functions.invoke('audit-status', {
      body: { task_id: task },
    });

    if (invokeError) {
      throw new Error((await readFunctionError(invokeError)) ?? invokeError.message);
    }

    return {
      status: String(data?.status ?? ''),
      stage: String(data?.stage ?? ''),
      progress: Number(data?.progress ?? 0),
      pagesScanned: Number(data?.pages_scanned ?? 0),
      estimatedPages: Number(data?.estimated_pages ?? data?.total_pages ?? 0),
      errorMessage: (data?.error ?? data?.error_message ?? null) as string | null,
    };
  }, []);

  const cancelTaskOnServer = useCallback((task: string) => {
    supabase.functions
      .invoke('audit-cancel', { body: { task_id: task } })
      .catch((err) => console.error('Не удалось отменить задачу на сервере:', err));
  }, []);

  const startCrawl = useCallback(async (): Promise<{ urls: string[] }> => {
    if (runningRef.current) return { urls: urlsRef.current };

    const target = normalizeUrl(baseUrl);
    if (!target) {
      failWith('Не указан адрес сайта для сканирования');
      return { urls: [] };
    }

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const isCurrent = () => runIdRef.current === runId;

    runningRef.current = true;
    urlsRef.current = [];
    taskIdRef.current = null;

    setScannedUrls([]);
    setIsLoading(true);
    setIsComplete(false);
    setError(null);
    setProgress(0);
    setPagesScanned(0);
    setTotalPages(0);
    setCurrentUrl('');
    setTaskId(null);
    setCrawlStage('starting');
    setDomain(extractDomain(target));

    // Глубокий обход сервер выполняет только для вошедшего пользователя,
    // поэтому проверяем сессию заранее, а не ловим отказ после запуска.
    const { data: { session } } = await supabase.auth.getSession();
    if (!isCurrent()) return { urls: [] };
    if (!session) {
      failWith('Войдите, чтобы запустить глубокое сканирование');
      return { urls: [] };
    }

    let task: string;
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('audit-start', {
        body: { url: target, options: { maxPages: MAX_PAGES, type: 'deep' } },
      });

      if (invokeError) {
        throw new Error((await readFunctionError(invokeError)) ?? invokeError.message);
      }
      if (data?.error) throw new Error(String(data.error));
      if (!data?.task_id) throw new Error('сервер не вернул номер задачи');

      task = String(data.task_id);
    } catch (err) {
      if (isCurrent()) failWith(`Не удалось запустить сканирование: ${describeError(err)}`);
      return { urls: [] };
    }

    // Отменили, пока сервер создавал задачу: номер задачи отмена ещё не знала,
    // поэтому снимаем задачу здесь, иначе обход шёл бы впустую.
    if (!isCurrent()) {
      cancelTaskOnServer(task);
      return { urls: [] };
    }

    taskIdRef.current = task;
    setTaskId(task);
    setCrawlStage('crawling');

    let lastSignature = '';
    let lastChangeAt = Date.now();
    let statusErrors = 0;

    while (isCurrent()) {
      await wait(POLL_INTERVAL_MS);
      if (!isCurrent()) break;

      let status: AuditStatus;
      try {
        status = await fetchStatus(task);
        statusErrors = 0;
      } catch (err) {
        if (!isCurrent()) break;
        // Сеть могла моргнуть — обход на сервере идёт дальше, пробуем ещё раз.
        statusErrors += 1;
        if (statusErrors >= 5) {
          failWith(`Потеряна связь с сервером: ${describeError(err)}`);
          return { urls: urlsRef.current };
        }
        continue;
      }

      await loadDiscoveredUrls(task, isCurrent);
      if (!isCurrent()) break;

      const estimated = status.estimatedPages || 0;
      const computed = estimated > 0
        ? Math.min(99, Math.round((status.pagesScanned / estimated) * 100))
        : status.progress;

      setPagesScanned(status.pagesScanned);
      setTotalPages(estimated);
      setProgress(status.status === 'completed' ? 100 : Math.max(status.progress, computed));
      setCrawlStage(mapStage(status.status, status.stage));

      if (status.status === 'completed') {
        await loadDiscoveredUrls(task, isCurrent);
        if (!isCurrent()) break;
        setProgress(100);
        setCrawlStage('completed');
        setIsComplete(true);
        setIsLoading(false);
        runningRef.current = false;
        return { urls: urlsRef.current };
      }

      if (status.status === 'failed' || status.status === 'cancelled') {
        failWith(status.errorMessage || 'Сервер прервал сканирование без объяснения причины');
        return { urls: urlsRef.current };
      }

      const signature = `${status.stage}:${status.status}:${status.pagesScanned}`;
      if (signature !== lastSignature) {
        lastSignature = signature;
        lastChangeAt = Date.now();
      } else if (Date.now() - lastChangeAt > STALL_TIMEOUT_MS) {
        failWith(
          `Сканирование остановилось на этапе «${status.stage || status.status}»: ` +
          `${Math.round(STALL_TIMEOUT_MS / 60000)} мин без изменений. Попробуйте запустить заново.`,
        );
        return { urls: urlsRef.current };
      }
    }

    // Сюда попадаем, только если запуск устарел (отмена, новый запуск, закрытие
    // экрана). Состояние теперь принадлежит другому запуску — не трогаем его.
    return { urls: [] };
  }, [baseUrl, failWith, fetchStatus, loadDiscoveredUrls, cancelTaskOnServer]);

  const cancelCrawl = useCallback(() => {
    runIdRef.current += 1;
    runningRef.current = false;
    setIsLoading(false);
    setCrawlStage('idle');
    setProgress(0);

    const task = taskIdRef.current;
    taskIdRef.current = null;
    if (task) cancelTaskOnServer(task);
  }, [cancelTaskOnServer]);

  return {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    crawlStage,
    scannedUrls,
    startCrawl,
    cancelCrawl,
    error,
    domain,
    taskId,
    errorMsg: error // alias for compatibility with existing code
  };
};
