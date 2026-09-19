import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

/**
 * Предохранитель расходов на языковую модель.
 *
 * Оплата пока не подключена: оптимизация переписывает страницы моделью за счёт
 * сервиса, а запустить её может любой вошедший на своём аудите. Пока владелец
 * не решил, как брать за это деньги, сервер ограничивает каждого пользователя,
 * кроме администратора:
 *   * OPTIMIZATION_DAILY_LIMIT — запусков за последние сутки (по умолчанию 3);
 *   * OPTIMIZATION_MAX_PAGES — страниц за один запуск (по умолчанию 20).
 * Это не тариф, а защита от случайного или намеренного расхода.
 */

export const DEFAULT_DAILY_LIMIT = 3;
export const DEFAULT_MAX_PAGES = 20;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Функции, каждый успешный вызов которых — запуск модели за счёт сервиса. */
const PAID_FUNCTIONS = ['optimization-start', 'optimization-content'];

function intFromEnv(name: string, fallback: number, min: number): number {
  const raw = (Deno.env.get(name) ?? '').trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min) {
    console.error(`${name}=${raw} — не целое число не меньше ${min}, беру ${fallback}`);
    return fallback;
  }
  return value;
}

/** Запусков в сутки на пользователя. 0 — запуск закрыт всем, кроме администратора. */
export function optimizationDailyLimit(): number {
  return intFromEnv('OPTIMIZATION_DAILY_LIMIT', DEFAULT_DAILY_LIMIT, 0);
}

/** Страниц за один запуск. */
export function optimizationMaxPages(): number {
  return intFromEnv('OPTIMIZATION_MAX_PAGES', DEFAULT_MAX_PAGES, 1);
}

export class OptimizationLimitError extends Error {
  status: number;
  constructor(message: string, status = 429) {
    super(message);
    this.name = 'OptimizationLimitError';
    this.status = status;
  }
}

/**
 * Проверяет суточный лимит запусков. Администратора не ограничивает.
 *
 * Считаем по двум источникам и берём большее:
 *   * optimization_jobs пользователя за сутки со статусом не 'estimated'
 *     (смета — не запуск модели);
 *   * успешные вызовы платных функций в api_logs за сутки.
 * Одних заданий мало: пользователь может удалить свою задачу аудита, и её
 * задания оптимизации уйдут каскадом — счётчик обнулится. Журнал вызовов
 * пользователю не удалить.
 *
 * Если посчитать не удалось, запуск не пропускаем: предохранитель, который
 * молча выключается при сбое, ничего не защищает.
 */
export async function assertOptimizationQuota(userId: string, isAdmin: boolean): Promise<void> {
  if (isAdmin) return;

  const limit = optimizationDailyLimit();
  if (limit === 0) {
    throw new OptimizationLimitError('Запуск оптимизации сейчас недоступен');
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const since = new Date(Date.now() - DAY_MS).toISOString();

  const [jobs, logs] = await Promise.all([
    admin
      .from('optimization_jobs')
      .select('created_at', { count: 'exact' })
      .eq('user_id', userId)
      .neq('status', 'estimated')
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .limit(1),
    admin
      .from('api_logs')
      .select('created_at', { count: 'exact' })
      .eq('user_id', userId)
      .in('function_name', PAID_FUNCTIONS)
      .eq('status_code', 200)
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .limit(1),
  ]);

  if (jobs.error || logs.error) {
    console.error('Не удалось посчитать запуски оптимизации:', jobs.error?.message, logs.error?.message);
    throw new OptimizationLimitError('Не удалось проверить лимит запусков оптимизации, попробуйте позже', 503);
  }

  const used = Math.max(jobs.count ?? 0, logs.count ?? 0);
  if (used < limit) return;

  // Когда освободится место: сутки после самого раннего запуска в окне.
  const earliest = [jobs.data?.[0]?.created_at, logs.data?.[0]?.created_at]
    .filter((value): value is string => typeof value === 'string')
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b)[0];

  const hoursLeft = earliest !== undefined
    ? Math.max(1, Math.ceil((earliest + DAY_MS - Date.now()) / (60 * 60 * 1000)))
    : null;

  throw new OptimizationLimitError(
    `Лимит оптимизаций исчерпан: не больше ${limit} запусков за сутки.` +
      (hoursLeft ? ` Следующий запуск станет доступен примерно через ${hoursLeft} ч.` : ' Попробуйте позже.'),
  );
}
