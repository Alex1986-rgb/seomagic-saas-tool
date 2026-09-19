import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { groupIssues, type IssueGroup, type IssueRow } from '@/cabinet/audit/groups';
import { isFinished } from '@/cabinet/audit/queries';
import { RESUMABLE_STATUSES } from '@/cabinet/audit/run';
import { aggregateIssues, type IssueRow as WorkIssueRow } from '@/cabinet/estimate/works';

/**
 * Быстрая проверка с главной — настоящая, без входа.
 *
 * audit-start принимает гостя для type=quick (лимит сервера — 10 страниц) и пишет задачу с
 * user_id = null; политики чтения audits/audit_tasks/issues такие записи отдают всем, поэтому
 * гость видит свой результат без аккаунта. Глубокий аудит (до 300 страниц) сервер гостю не даёт —
 * это и есть честная граница «без регистрации / в кабинете».
 *
 *   idle     — форма;
 *   running  — опрашиваем audit-status: этап, процент и число страниц — из задачи, не таймер;
 *   scoring  — обход закончен (status=completed), scoring-processor ещё считает балл и замечания;
 *   done     — в audits появился итоговый статус и seo_score;
 *   failed   — задача остановилась с ошибкой.
 *
 * Опрос нужен не только для показа: audit-status сам подталкивает audit-processor к следующей
 * пачке адресов, поэтому пока страница открыта, опрашиваем без пауз.
 */

export type GuestPhase = 'idle' | 'running' | 'scoring' | 'done' | 'failed';

export interface GuestProgress {
  status: string;
  stage: string | null;
  progress: number;
  pagesScanned: number;
  estimatedPages: number;
  currentUrl: string | null;
}

export interface GuestResult {
  score: number | null;
  pagesScanned: number;
  issuesTotal: number;
  top: IssueGroup[];
  /** Объём работ по типу строки прайса — для «ставка × объём» у трёх главных проблем. */
  qtyByPriceType: Map<string, number>;
}

const POLL_MS = 3000;
/** Номер задачи в sessionStorage: перезагрузка страницы не должна терять идущую проверку. */
const STORE_KEY = 'seomarket:landing-audit';

interface TaskLite {
  id: string;
  url: string;
  auditId: string | null;
}

function readStored(): TaskLite | null {
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as TaskLite;
    return v && typeof v.id === 'string' ? v : null;
  } catch {
    return null;
  }
}

function writeStored(v: TaskLite | null) {
  try {
    if (v) window.sessionStorage.setItem(STORE_KEY, JSON.stringify(v));
    else window.sessionStorage.removeItem(STORE_KEY);
  } catch {
    /* хранилище недоступно — проверка просто не переживёт перезагрузку */
  }
}

/** Текст ошибки edge-функции: при ответе не 2xx supabase-js кладёт тело в error.context. */
async function invokeError(err: unknown, fallback: string): Promise<string> {
  const ctx = (err as { context?: unknown })?.context;
  if (ctx && typeof (ctx as Response).json === 'function') {
    try {
      const body = await (ctx as Response).clone().json();
      if (body?.error) return String(body.error);
    } catch {
      /* тело не JSON */
    }
  }
  return err instanceof Error && err.message ? err.message : fallback;
}

/** Сообщения сервера — по-английски; частые переводим, чтобы гость понял, что не так. */
function humanError(msg: string): string {
  if (/private|internal|unsafe|not allowed|resolve/i.test(msg))
    return 'Этот адрес проверить нельзя: укажите сайт, открытый в интернете.';
  if (/Invalid URL/i.test(msg)) return 'Не похоже на адрес сайта. Пример: shop.ru';
  return msg;
}

export function useGuestAudit() {
  const [phase, setPhase] = useState<GuestPhase>('idle');
  const [task, setTask] = useState<TaskLite | null>(null);
  const [progress, setProgress] = useState<GuestProgress | null>(null);
  const [result, setResult] = useState<GuestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const auditIdRef = useRef<string | null>(null);

  // Идущая проверка из этой вкладки — продолжаем показывать после перезагрузки.
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      auditIdRef.current = stored.auditId;
      setTask(stored);
      setPhase('running');
    }
  }, []);

  const loadResult = useCallback(async (taskId: string, auditId: string): Promise<boolean> => {
    const { data: audit, error: auditErr } = await supabase
      .from('audits')
      .select('status, seo_score, pages_scanned')
      .eq('id', auditId)
      .maybeSingle();
    if (auditErr) throw new Error(auditErr.message);
    if (!audit || !isFinished(audit.status)) return false;

    // На быстрой проверке (до 10 страниц) замечаний десятки, одной выборки хватает.
    const { data: rows, error: issuesErr } = await supabase
      .from('issues')
      .select('id, issue_type, category, severity, page_id, metadata, can_auto_fix')
      .eq('task_id', taskId)
      .limit(1000);
    if (issuesErr) throw new Error(issuesErr.message);
    const list = rows ?? [];
    const groups = groupIssues(list as IssueRow[], new Map());
    const qtyByPriceType = new Map(aggregateIssues(list as WorkIssueRow[]).map((v) => [v.priceType, v.qty]));
    setResult({
      score: audit.seo_score,
      pagesScanned: audit.pages_scanned ?? 0,
      issuesTotal: list.length,
      top: groups.slice(0, 3),
      qtyByPriceType,
    });
    return true;
  }, []);

  const taskId = phase === 'running' || phase === 'scoring' ? (task?.id ?? null) : null;

  useEffect(() => {
    if (!taskId) return;
    let alive = true;
    let timer: number | undefined;

    const tick = async () => {
      try {
        const { data, error: invErr } = await supabase.functions.invoke('audit-status', { body: { task_id: taskId } });
        if (invErr) throw new Error(await invokeError(invErr, 'Не удалось узнать ход проверки'));
        if (!alive) return;
        if (!data?.success) throw new Error(data?.error || 'Проверка не найдена');

        setProgress({
          status: data.status,
          stage: data.stage ?? null,
          progress: Math.max(0, Math.min(100, Math.round(data.progress ?? 0))),
          pagesScanned: data.pages_scanned ?? 0,
          estimatedPages: data.estimated_pages ?? 0,
          currentUrl: data.current_url || null,
        });

        if (RESUMABLE_STATUSES.includes(data.status)) {
          setError(
            data.error_message ? `Проверка остановилась: ${data.error_message}` : 'Проверка остановилась. Попробуйте ещё раз.',
          );
          setPhase('failed');
          writeStored(null);
          return;
        }

        if (data.status === 'completed') {
          // audit-status не отдаёт audit_id — берём из задачи один раз.
          if (!auditIdRef.current) {
            const { data: row } = await supabase.from('audit_tasks').select('audit_id').eq('id', taskId).maybeSingle();
            auditIdRef.current = row?.audit_id ?? null;
          }
          if (auditIdRef.current && (await loadResult(taskId, auditIdRef.current))) {
            if (!alive) return;
            setPhase('done');
            writeStored(null);
            return;
          }
          if (alive) setPhase('scoring');
        }
      } catch (err) {
        // Сбой одного опроса не останавливает проверку — пробуем снова на следующем тике.
        console.error('Главная: опрос проверки', err);
      }
      if (alive) timer = window.setTimeout(tick, POLL_MS);
    };

    void tick();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [taskId, loadResult]);

  const start = useCallback(async (url: string) => {
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(null);
    try {
      const { data, error: invErr } = await supabase.functions.invoke('audit-start', {
        body: { url, options: { type: 'quick' } },
      });
      if (invErr) throw new Error(await invokeError(invErr, 'Не удалось запустить проверку'));
      if (!data?.task_id) throw new Error(data?.error || 'Сервер не вернул номер проверки');
      const next = { id: data.task_id as string, url, auditId: null };
      auditIdRef.current = null;
      writeStored(next);
      setTask(next);
      setPhase('running');
    } catch (err) {
      setError(humanError(err instanceof Error ? err.message : 'Не удалось запустить проверку'));
      setPhase('failed');
    } finally {
      setBusy(false);
    }
  }, []);

  const reset = useCallback(() => {
    writeStored(null);
    setTask(null);
    setProgress(null);
    setResult(null);
    setError(null);
    setPhase('idle');
  }, []);

  return { phase, task, progress, result, error, busy, start, reset };
}
