import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface UsageCounter {
  total: number;
  lastMonth: number;
}

export interface PlatformUsage {
  audits: UsageCounter;
  optimizations: UsageCounter;
  positionChecks: UsageCounter;
  users: UsageCounter;
  requests: UsageCounter;
}

const EMPTY_COUNTER: UsageCounter = { total: 0, lastMonth: 0 };

export const EMPTY_USAGE: PlatformUsage = {
  audits: EMPTY_COUNTER,
  optimizations: EMPTY_COUNTER,
  positionChecks: EMPTY_COUNTER,
  users: EMPTY_COUNTER,
  requests: EMPTY_COUNTER,
};

type CountableTable = 'audits' | 'optimization_jobs' | 'position_checks' | 'profiles' | 'contact_requests';

/** Счётчик строк без выгрузки самих строк. */
async function countRows(table: CountableTable, since?: string): Promise<number> {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (since) query = query.gte('created_at', since);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

/**
 * Реальное использование платформы: сколько аудитов, оптимизаций, проверок
 * позиций, пользователей и заявок есть в базе.
 *
 * Посещаемость сайта, конверсию и отказы платформа не измеряет — для этого
 * нужна внешняя аналитика, и таких чисел здесь принципиально нет.
 */
export function usePlatformUsage() {
  const [usage, setUsage] = useState<PlatformUsage>(EMPTY_USAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const since = new Date(Date.now() - 30 * DAY_MS).toISOString();
        const [
          audits,
          auditsMonth,
          optimizations,
          optimizationsMonth,
          positionChecks,
          positionChecksMonth,
          users,
          usersMonth,
          requests,
          requestsMonth,
        ] = await Promise.all([
          countRows('audits'),
          countRows('audits', since),
          countRows('optimization_jobs'),
          countRows('optimization_jobs', since),
          countRows('position_checks'),
          countRows('position_checks', since),
          countRows('profiles'),
          countRows('profiles', since),
          countRows('contact_requests'),
          countRows('contact_requests', since),
        ]);

        if (cancelled) return;
        setUsage({
          audits: { total: audits, lastMonth: auditsMonth },
          optimizations: { total: optimizations, lastMonth: optimizationsMonth },
          positionChecks: { total: positionChecks, lastMonth: positionChecksMonth },
          users: { total: users, lastMonth: usersMonth },
          requests: { total: requests, lastMonth: requestsMonth },
        });
      } catch (err) {
        if (cancelled) return;
        console.error('Не удалось посчитать использование платформы:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
        setUsage(EMPTY_USAGE);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { usage, isLoading, error };
}
