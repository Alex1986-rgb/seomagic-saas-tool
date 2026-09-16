import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  buildApiActivity,
  EMPTY_API_ACTIVITY,
  type ApiActivityStats,
  type ApiLogRow,
} from '@/lib/admin-stats';

export type { ApiActivityStats };

const DAY_MS = 24 * 60 * 60 * 1000;
const ROWS_LIMIT = 1000;

/**
 * Активность edge-функций за последние сутки — из таблицы `api_logs`.
 *
 * Это единственные технические метрики, которые платформа действительно
 * пишет. Загрузку CPU, память, диск и uptime сервера никто не собирает,
 * поэтому раньше на их месте стояли выдуманные числа.
 */
export function useApiActivity(windowHours = 24) {
  const [stats, setStats] = useState<ApiActivityStats>(EMPTY_API_ACTIVITY);
  const [recent, setRecent] = useState<ApiLogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const since = new Date(Date.now() - (windowHours / 24) * DAY_MS).toISOString();
      const { data, error: queryError } = await supabase
        .from('api_logs')
        .select('function_name, status_code, duration_ms, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(ROWS_LIMIT);

      if (queryError) throw queryError;

      const rows = (data ?? []) as ApiLogRow[];
      setStats(buildApiActivity(rows));
      setRecent(rows.slice(0, 15));
    } catch (err) {
      console.error('Не удалось загрузить журнал вызовов функций:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить журнал вызовов');
      setStats(EMPTY_API_ACTIVITY);
      setRecent([]);
    } finally {
      setIsLoading(false);
    }
  }, [windowHours]);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, recent, isLoading, error, refetch: load };
}
