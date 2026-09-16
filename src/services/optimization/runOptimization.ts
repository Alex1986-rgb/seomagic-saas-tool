import { supabase } from '@/integrations/supabase/client';

/**
 * Настоящая оптимизация страниц.
 *
 * Раньше кнопка «начать оптимизацию» двигала полосу случайными числами и
 * показывала вписанный в код результат «было 65 → стало 92» — одинаковый для
 * любого сайта, а на сервер не уходило ничего. Здесь запуск идёт через
 * `optimization-start`, обработчик переписывает страницы языковой моделью и
 * сохраняет каждую, а мы следим за ходом работы и забираем готовые страницы.
 */

export interface OptimizationOptions {
  fixMetaTags?: boolean;
  improveContent?: boolean;
  language?: string;
  /**
   * Пожелания человека к оптимизации (текст из поля «инструкции» или шаблона).
   * Раньше поле заполнялось, интерфейс отвечал «параметры установлены», а на
   * сервер уходили только флаги — пожелания терялись. Теперь они едут вместе с
   * запуском и сохраняются в задании (optimization_jobs.options); вставлять их
   * в запрос к модели — дело обработчика optimization-processor.
   */
  instructions?: string;
}

/** Длиннее незачем: это пожелания к модели, а не текст страницы. */
const MAX_INSTRUCTIONS_LENGTH = 2000;

export interface OptimizationProgress {
  status: string;
  processed: number;
  total: number;
}

export interface OptimizedPage {
  url: string;
  originalTitle: string | null;
  originalDescription: string | null;
  recommendations: string;
  model: string | null;
  tokens: number | null;
}

export interface OptimizationOutcome {
  optimizationId: string;
  status: 'completed' | 'partial' | 'failed';
  pages: OptimizedPage[];
  failures: Array<{ url: string; error: string }>;
  totalTokens: number;
  cost: number;
  error?: string;
}

/** Как часто спрашиваем о ходе. Страницы идут пачками, чаще незачем. */
const POLL_INTERVAL_MS = 3000;
/** Дольше этого не ждём: обработчик либо закончил, либо умер. */
const MAX_WAIT_MS = 15 * 60 * 1000;

const FINISHED = new Set(['completed', 'partial', 'failed']);

export async function runOptimization(
  taskId: string,
  options: OptimizationOptions = { fixMetaTags: true, improveContent: true, language: 'ru' },
  onProgress?: (progress: OptimizationProgress) => void,
): Promise<OptimizationOutcome> {
  // Функция запуска пускает только вошедших. Без этой проверки гость получал
  // невнятное «Unauthorized» от сервера.
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session) {
    throw new Error('Оптимизация доступна после входа в аккаунт');
  }

  const instructions = options.instructions?.trim().slice(0, MAX_INSTRUCTIONS_LENGTH);
  const body = {
    task_id: taskId,
    options: { ...options, instructions: instructions || undefined },
  };

  const { data, error } = await supabase.functions.invoke('optimization-start', { body });

  if (error || !data?.optimization_id) {
    const message = await readError(error) ?? data?.error ?? 'Не удалось запустить оптимизацию';
    throw new Error(message);
  }

  const optimizationId: string = data.optimization_id;
  onProgress?.({ status: 'queued', processed: 0, total: 0 });

  const startedAt = Date.now();
  while (Date.now() - startedAt < MAX_WAIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const { data: job, error: jobError } = await supabase
      .from('optimization_jobs')
      .select('status, cost, result_data')
      .eq('id', optimizationId)
      .single();

    // Разрыв связи — не повод бросать работу, которая идёт на сервере.
    if (jobError || !job) continue;

    const result = (job.result_data ?? {}) as Record<string, unknown>;
    onProgress?.({
      status: job.status,
      processed: Number(result.processed ?? result.optimized_pages ?? 0),
      total: Number(result.total ?? result.total_pages ?? 0),
    });

    if (FINISHED.has(job.status)) {
      return buildOutcome(optimizationId, job.status as OptimizationOutcome['status'], job.cost, result);
    }
  }

  throw new Error('Оптимизация идёт дольше обычного. Результат появится в истории оптимизаций, когда закончится.');
}

function buildOutcome(
  optimizationId: string,
  status: OptimizationOutcome['status'],
  cost: number | null,
  result: Record<string, unknown>,
): OptimizationOutcome {
  const improvements = Array.isArray(result.improvements) ? result.improvements : [];

  const pages: OptimizedPage[] = improvements.map((item) => {
    const page = item as Record<string, unknown>;
    const original = (page.original ?? {}) as Record<string, unknown>;
    const tokens = (page.tokens ?? null) as { total_tokens?: number } | null;
    return {
      url: String(page.url ?? ''),
      originalTitle: (original.title as string) ?? null,
      originalDescription: (original.meta_description as string) ?? null,
      recommendations: String(page.recommendations ?? ''),
      model: page.model ? String(page.model) : null,
      tokens: tokens?.total_tokens ?? null,
    };
  });

  return {
    optimizationId,
    status,
    pages,
    failures: Array.isArray(result.failures) ? (result.failures as OptimizationOutcome['failures']) : [],
    totalTokens: Number(result.total_tokens ?? 0),
    cost: Number(cost ?? 0),
    error: typeof result.error === 'string' ? result.error : undefined,
  };
}

/** Текст ошибки функции полезнее общего «Edge Function returned a non-2xx». */
async function readError(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return body?.error ?? null;
  } catch {
    return null;
  }
}
