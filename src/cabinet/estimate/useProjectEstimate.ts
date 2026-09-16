import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetProject } from '../project';
import { usePriceRules, type PriceRule } from './rates';
import { aggregateIssues, type IssueRow, type IssueVolume } from './works';
import { useSavedEstimate } from './store';

/**
 * Данные сметы текущего проекта: замечания последнего завершённого аудита, прайс и сохранённая
 * смета. Экран «Смета» строит из них строки и считает их через calc.ts.
 *
 * Замечания читаются порциями по 1000: база больше за раз не отдаёт, и у большого сайта всё, что
 * дальше тысячной строки, молча потерялось бы из объёмов — а значит, и из счёта.
 */

const BATCH = 1000;
/** Предохранитель: 60 тысяч замечаний хватит любому аудиту, дальше — не зацикливаемся. */
const MAX_BATCHES = 60;

async function loadIssues(userId: string, auditId: string): Promise<IssueRow[]> {
  const rows: IssueRow[] = [];
  for (let i = 0; i < MAX_BATCHES; i++) {
    const from = i * BATCH;
    const { data, error } = await supabase
      .from('issues')
      .select('issue_type, severity, can_auto_fix, metadata')
      .eq('audit_id', auditId)
      // Явно свои: политика чтения issues исторически отдавала записи «без хозяина» всем.
      .eq('user_id', userId)
      .order('id', { ascending: true })
      .range(from, from + BATCH - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as IssueRow[]));
    if (!data || data.length < BATCH) break;
  }
  return rows;
}

export interface PricedVolume extends IssueVolume {
  rule: PriceRule;
}

export function useProjectEstimate() {
  const cab = useCabinetProject();
  const audit = cab.project?.lastCompleted ?? null;
  const { rules, loading: rulesLoading, error: rulesError } = usePriceRules();
  const auditIds = useMemo(() => cab.projectAudits.map((a) => a.id), [cab.projectAudits]);
  const saved = useSavedEstimate(cab.userId, auditIds);

  const [issues, setIssues] = useState<IssueRow[] | null>(null);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState<string | null>(null);
  // Для какого аудита загружены замечания. При смене проекта старые объёмы не должны на один
  // рендер выглядеть как объёмы нового аудита — экран выбрал бы по ним строки сметы.
  const [issuesFor, setIssuesFor] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!cab.userId || !audit) {
      setIssues(null);
      return;
    }
    setIssuesLoading(true);
    loadIssues(cab.userId, audit.id)
      .then((r) => {
        if (!alive) return;
        setIssues(r);
        setIssuesFor(audit.id);
        setIssuesError(null);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        console.error('Смета: не удалось загрузить замечания аудита', err);
        setIssuesError(err instanceof Error ? err.message : 'Не удалось загрузить замечания');
        setIssues(null);
        setIssuesFor(audit.id);
      })
      .finally(() => {
        if (alive) setIssuesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [cab.userId, audit?.id]);

  const { priced, unpriced, criticalCount } = useMemo(() => {
    const volumes = aggregateIssues(issues ?? []);
    const byType = new Map(rules.map((r) => [r.issueType, r]));
    const p: PricedVolume[] = [];
    const u: IssueVolume[] = [];
    for (const v of volumes) {
      const rule = byType.get(v.priceType);
      if (rule) p.push({ ...v, rule });
      else u.push(v);
    }
    // Порядок строк — как в прайсе (sort_order), чтобы смета и админка читались одинаково.
    p.sort((a, b) => a.rule.sortOrder - b.rule.sortOrder);
    u.sort((a, b) => b.issues - a.issues);
    const crit = (issues ?? []).filter((r) => r.severity === 'critical').length;
    return { priced: p, unpriced: u, criticalCount: crit };
  }, [issues, rules]);

  return {
    cab,
    audit,
    priced,
    unpriced,
    criticalCount,
    issuesTotal: issues?.length ?? 0,
    saved: saved.estimate,
    reloadSaved: saved.reload,
    loading: cab.loading || rulesLoading || issuesLoading || saved.loading || (!!audit && issuesFor !== audit.id),
    error: cab.error || rulesError || issuesError || saved.error,
  };
}
