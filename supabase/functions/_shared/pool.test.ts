import { describe, expect, it } from 'vitest';
import { runPool } from './pool.ts';

describe('runPool', () => {
  it('выполняет все задачи и сохраняет порядок результатов', async () => {
    const results = await runPool([1, 2, 3, 4, 5], async (n) => n * 2, { concurrency: 2 });
    expect(results.map((r) => r.result)).toEqual([2, 4, 6, 8, 10]);
  });

  it('держит заданное число одновременных задач', async () => {
    let running = 0;
    let peak = 0;

    await runPool(Array.from({ length: 12 }, (_, i) => i), async () => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((resolve) => setTimeout(resolve, 10));
      running--;
    }, { concurrency: 4 });

    expect(peak).toBeLessThanOrEqual(4);
    expect(peak).toBeGreaterThan(1); // иначе параллельности нет вовсе
  });

  it('падение одной задачи не отменяет остальные', async () => {
    const results = await runPool([1, 2, 3], async (n) => {
      if (n === 2) throw new Error('поставщик отказал');
      return n;
    }, { concurrency: 3 });

    expect(results[0].result).toBe(1);
    expect(results[1].error).toBeInstanceOf(Error);
    expect(results[2].result).toBe(3);
  });

  it('сообщает о каждой завершённой задаче', async () => {
    let settled = 0;
    await runPool([1, 2, 3, 4], async (n) => n, {
      concurrency: 2,
      onSettled: () => { settled++; },
    });
    expect(settled).toBe(4);
  });

  it('работает быстрее последовательного выполнения', async () => {
    const startedAt = Date.now();
    await runPool(Array.from({ length: 8 }, (_, i) => i), async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }, { concurrency: 8 });
    // Последовательно это заняло бы 400 мс; с запасом на медленную машину.
    expect(Date.now() - startedAt).toBeLessThan(250);
  });

  it('на пустом списке не делает ничего', async () => {
    const results = await runPool([], async () => 'не должно вызваться', { concurrency: 4 });
    expect(results).toEqual([]);
  });
});
