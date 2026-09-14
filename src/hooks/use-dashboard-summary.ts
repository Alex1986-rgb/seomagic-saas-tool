import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  buildDashboardSummary,
  EMPTY_SUMMARY,
  type DashboardAudit,
  type DashboardSummary,
} from '@/lib/dashboard-summary';

export type { DashboardAudit, DashboardSummary };

/**
 * Сводка личного кабинета — из базы, а не из вписанных в код чисел.
 *
 * До сентября 2026 кабинет показывал одинаковые у всех выдуманные цифры и
 * чужие сайты (example.com, mysite.ru). Здесь видно только то, что принадлежит
 * пользователю: RLS отдаёт лишь его записи.
 */
export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [auditsResult, positionsResult, optimizationsResult] = await Promise.all([
        supabase
          .from('audits')
          .select('id, url, seo_score, status, created_at, completed_at, pages_scanned')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from('position_checks').select('created_at'),
        supabase.from('optimization_jobs').select('created_at'),
      ]);

      if (auditsResult.error) throw auditsResult.error;

      const audits: DashboardAudit[] = (auditsResult.data ?? []).map((row) => ({
        id: row.id,
        url: row.url,
        seoScore: row.seo_score,
        status: row.status,
        createdAt: row.created_at,
        completedAt: row.completed_at,
        pagesScanned: row.pages_scanned,
      }));

      // Позиции и оптимизации могут быть ещё не накачены на проект — их
      // отсутствие не должно ронять весь кабинет вместе с аудитами.
      setSummary(
        buildDashboardSummary({
          audits,
          positionCheckDates: (positionsResult.error ? [] : positionsResult.data ?? []).map(
            (row) => row.created_at,
          ),
          optimizationDates: (optimizationsResult.error ? [] : optimizationsResult.data ?? []).map(
            (row) => row.created_at,
          ),
        }),
      );
    } catch (err) {
      console.error('Не удалось загрузить сводку кабинета:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
      setSummary(EMPTY_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, isLoading, error, refetch: load };
}
