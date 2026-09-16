import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CabinetAudit } from '../project';
import { useCabinetProject } from '../project';
import { groupIssues, type IssueGroup } from './groups';
import {
  countCritical,
  errorText,
  fetchIssues,
  fetchPageUrls,
  fetchResult,
  fetchTaskForAudit,
  isFinished,
  type ResultRow,
  type TaskRow,
} from './queries';

/**
 * Готовые аудиты текущего проекта, новые сверху.
 *
 * project.lastCompleted из общего контекста учитывает только status=completed, а
 * scoring-processor ставит «partial», когда обход остановился раньше лимита. У такого аудита
 * есть балл и замечания — прятать его нельзя, поэтому готовность считаем здесь сами.
 */
export function useFinishedAudits(): CabinetAudit[] {
  const { projectAudits } = useCabinetProject();
  return useMemo(() => projectAudits.filter((a) => isFinished(a.status)), [projectAudits]);
}

export interface AuditReport {
  task: TaskRow | null;
  result: ResultRow | null;
  /** Найденные проблемы, сгруппированные по типу. */
  groups: IssueGroup[];
  /** Итог прошлого готового аудита проекта — для стрелок «↑ 4». */
  prevResult: ResultRow | null;
  prevCritical: number | null;
}

/**
 * Данные одного аудита: задача, баллы по категориям, замечания и (по желанию) адреса страниц.
 * withPages=false — для Обзора: ему нужны только числа, а выгрузка адресов на 300 страниц лишняя.
 */
export function useAuditReport(
  audit: CabinetAudit | null,
  prevAudit: CabinetAudit | null,
  { withPages }: { withPages: boolean },
) {
  const { userId } = useCabinetProject();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const auditId = audit?.id ?? null;
  const prevId = prevAudit?.id ?? null;

  useEffect(() => {
    if (!userId || !auditId) {
      setReport(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const task = await fetchTaskForAudit(userId, auditId);
        if (!task) {
          if (alive) setReport({ task: null, result: null, groups: [], prevResult: null, prevCritical: null });
          return;
        }
        const [result, issues, pages, prevTask] = await Promise.all([
          fetchResult(userId, task.id),
          fetchIssues(userId, task.id),
          withPages ? fetchPageUrls(userId, task.id) : Promise.resolve([]),
          prevId ? fetchTaskForAudit(userId, prevId) : Promise.resolve(null),
        ]);
        const [prevResult, prevCritical] = prevTask
          ? await Promise.all([fetchResult(userId, prevTask.id), countCritical(userId, prevTask.id)])
          : [null, null];
        const urlById = new Map(pages.map((p) => [p.id, p.url]));
        if (alive) setReport({ task, result, groups: groupIssues(issues, urlById), prevResult, prevCritical });
      } catch (err) {
        console.error('Кабинет: не удалось загрузить аудит', err);
        if (alive) setError(errorText(err, 'Не удалось загрузить результаты аудита'));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, auditId, prevId, withPages, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { report, loading, error, reload };
}

/** Общий балл результата: global_score, в старых записях — score. */
export function scoreOf(result: ResultRow | null, audit?: CabinetAudit | null): number | null {
  return result?.global_score ?? result?.score ?? audit?.seoScore ?? null;
}

/** Четыре категории, которые реально считает scoring-processor. Порядок — как в макете. */
export const MEASURED_CATEGORIES: { key: 'seo_score' | 'technical_score' | 'content_score' | 'performance_score'; label: string }[] = [
  { key: 'seo_score', label: 'Поисковая оптимизация' },
  { key: 'technical_score', label: 'Техническое состояние' },
  { key: 'content_score', label: 'Контент' },
  { key: 'performance_score', label: 'Скорость загрузки' },
];
