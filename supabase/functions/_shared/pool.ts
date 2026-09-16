/**
 * Параллельное выполнение однотипных задач.
 *
 * Запросы к поставщику выдачи и к языковой модели почти всё время просто ждут
 * ответа, поэтому выполнять их по одному — значит тратить минуты там, где
 * хватит секунд. Но и запускать сотню разом нельзя: поставщики держат лимиты и
 * отвечают отказом.
 *
 * Здесь задачи идут потоком с ограничением на число одновременных: как только
 * одна завершилась, берётся следующая.
 */

export interface PoolOptions {
  /** Сколько задач выполняется одновременно. */
  concurrency: number;
  /** Пауза перед стартом каждой задачи — чтобы не бить по поставщику залпом. */
  staggerMs?: number;
  /** Вызывается после каждой завершённой задачи: удобно для счётчика. */
  onSettled?: () => void | Promise<void>;
}

export interface PoolResult<T, R> {
  item: T;
  result?: R;
  error?: unknown;
}

/**
 * Выполняет задачи с ограничением параллельности.
 *
 * Ошибка одной задачи не отменяет остальные: результат содержит и удачи, и
 * неудачи — вызывающий решает, что с ними делать.
 */
export async function runPool<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  { concurrency, staggerMs = 0, onSettled }: PoolOptions,
): Promise<Array<PoolResult<T, R>>> {
  const results: Array<PoolResult<T, R>> = new Array(items.length);
  const limit = Math.max(1, Math.min(concurrency, items.length));
  let nextIndex = 0;

  async function runner(): Promise<void> {
    for (;;) {
      const index = nextIndex++;
      if (index >= items.length) return;

      if (staggerMs > 0) await delay(staggerMs);

      try {
        results[index] = { item: items[index], result: await worker(items[index], index) };
      } catch (error) {
        results[index] = { item: items[index], error };
      }

      if (onSettled) await onSettled();
    }
  }

  await Promise.all(Array.from({ length: limit }, () => runner()));
  return results;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Сколько задач брать в работу одновременно.
 *
 * Значение подбирается под лимиты поставщика: слишком много — получим отказы,
 * слишком мало — будем ждать без нужды. Настраивается переменной окружения,
 * чтобы менять без пересборки.
 */
export function concurrencyFromEnv(name: string, fallback: number): number {
  const raw = Deno.env.get(name);
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, 20); // выше двадцати поставщики начинают отказывать
}
