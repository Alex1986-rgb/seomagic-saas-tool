import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Число проблем и критичных проблем по аудитам проекта — из таблицы issues.
 *
 * audit_results.issues_count не заполняется (scoring-processor его не пишет, issue-classifier
 * только возвращает число в ответе), поэтому считаем строки issues по audit_id. Запросы-счётчики
 * (head + count) не тянут сами строки: у большого сайта проблем тысячи.
 *
 * Фильтр user_id обязателен: политика чтения issues отдаёт и строки без владельца (гостевые).
 * Считаем не больше MAX_AUDITS последних аудитов — дальше история в таблице без чисел.
 */

const MAX_AUDITS = 24;

export interface IssueCounts {
  issues: number | null;
  critical: number | null;
}

export function useAuditIssueCounts(userId: string | null, auditIds: string[]) {
  const [counts, setCounts] = useState<Map<string, IssueCounts>>(new Map());
  const [loading, setLoading] = useState(false);
  const key = auditIds.slice(0, MAX_AUDITS).join(',');

  useEffect(() => {
    const ids = key ? key.split(',') : [];
    if (!userId || ids.length === 0) {
      setCounts(new Map());
      return;
    }
    let alive = true;
    setLoading(true);
    const countOf = async (id: string, criticalOnly: boolean): Promise<number | null> => {
      let q = supabase.from('issues').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('audit_id', id);
      if (criticalOnly) q = q.eq('severity', 'critical');
      const { count, error } = await q;
      return error ? null : count ?? 0;
    };
    void Promise.all(
      ids.map(async (id) => {
        const [issues, critical] = await Promise.all([countOf(id, false), countOf(id, true)]);
        return [id, { issues, critical }] as const;
      }),
    ).then((entries) => {
      if (!alive) return;
      setCounts(new Map(entries));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [userId, key]);

  return { counts, loading };
}
