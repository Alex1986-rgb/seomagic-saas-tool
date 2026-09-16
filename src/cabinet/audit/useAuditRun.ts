import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetProject } from '../project';
import { hostOf } from '../format';
import { groupIssues, type IssueGroup } from './groups';
import { stageLabel } from './labels';
import { errorText, fetchIssues, fetchRecentPages, fetchRecentTasks, fetchTask, isFinished, type TaskRow } from './queries';
import { ACTIVE_STATUSES, RESUMABLE_STATUSES, buildLog, type LogEvent, type Sample } from './run';

/**
 * Состояние экрана «Новый аудит» поверх настоящих edge-функций.
 *
 *   idle     — форма; сверху баннер, если последняя задача сайта прервана и в ней есть страницы;
 *   running  — есть задача в работе: опрашиваем audit-status каждые 3 с;
 *   done     — задача закончена и scoring-processor записал балл в audits.
 *
 * Опрос audit-status не только читает ход: функция сама подталкивает audit-processor к следующей
 * пачке адресов. Закрыли экран — обход продолжится по крону cleanup/при следующем опросе, но
 * медленнее; поэтому пока экран открыт, опрашиваем без пауз.
 *
 * Статус задачи completed ещё не значит «готово»: после обхода считаются баллы и замечания, и
 * только потом аудит в таблице audits становится completed/partial. До этого показываем этап «Оценка».
 */

export type RunPhase = 'loading' | 'idle' | 'running' | 'done';

interface AuditRowLite {
  id: string;
  status: string;
  seo_score: number | null;
  pages_scanned: number | null;
  created_at: string | null;
  completed_at: string | null;
}

export interface DoneInfo {
  task: TaskRow;
  audit: AuditRowLite;
  groups: IssueGroup[];
  discovered: number | null;
}

const POLL_MS = 3000;

async function fetchAuditLite(userId: string, auditId: string): Promise<AuditRowLite | null> {
  const { data, error } = await supabase
    .from('audits')
    .select('id, status, seo_score, pages_scanned, created_at, completed_at')
    .eq('user_id', userId)
    .eq('id', auditId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Текст ошибки edge-функции: при ответе не 2xx supabase-js кладёт тело в error.context. */
async function invokeError(err: unknown, fallback: string): Promise<string> {
  const ctx = (err as { context?: unknown })?.context;
  if (ctx && typeof (ctx as Response).json === 'function') {
    try {
      const body = await (ctx as Response).clone().json();
      if (body?.error) return String(body.error);
      if (body?.message) return String(body.message);
    } catch {
      /* тело не JSON */
    }
  }
  return errorText(err, fallback);
}

export function useAuditRun(taskParam: string | null) {
  const { userId, host, reload, setHost } = useCabinetProject();
  const [phase, setPhase] = useState<RunPhase>('loading');
  const [task, setTask] = useState<TaskRow | null>(null);
  const [interrupted, setInterrupted] = useState<TaskRow | null>(null);
  const [done, setDone] = useState<DoneInfo | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const events = useRef<LogEvent[]>([]);
  const lastStage = useRef<string>('');
  const lastDiscovered = useRef<number>(0);
  // audit_id задачи для опроса: эффект опроса не пересоздаётся на каждое обновление task.
  const auditIdRef = useRef<string | null>(null);

  const finish = useCallback(
    async (t: TaskRow) => {
      if (!userId || !t.audit_id) return false;
      const audit = await fetchAuditLite(userId, t.audit_id);
      if (!audit || !isFinished(audit.status)) return false;
      const issues = await fetchIssues(userId, t.id);
      setDone({ task: t, audit, groups: groupIssues(issues, new Map()), discovered: t.discovered_urls_count });
      setPhase('done');
      void reload();
      return true;
    },
    [userId, reload],
  );

  const beginRunning = useCallback((t: TaskRow) => {
    events.current = [];
    lastStage.current = '';
    lastDiscovered.current = 0;
    setSamples([]);
    setLog([]);
    auditIdRef.current = t.audit_id;
    setTask(t);
    setInterrupted(null);
    setDone(null);
    setPhase('running');
  }, []);

  // Первичная загрузка: задача из ?task=, иначе задача в работе, иначе форма (+ прерванная).
  useEffect(() => {
    if (!userId) {
      setPhase('idle');
      return;
    }
    let alive = true;
    setPhase('loading');
    (async () => {
      try {
        if (taskParam) {
          const t = await fetchTask(userId, taskParam);
          if (t && alive) {
            if (ACTIVE_STATUSES.includes(t.status)) return beginRunning(t);
            if (t.status === 'completed') {
              if (await finish(t)) return;
              return beginRunning(t);
            }
          }
        }
        const recent = await fetchRecentTasks(userId);
        if (!alive) return;
        const active = recent.find((t) => ACTIVE_STATUSES.includes(t.status));
        if (active) return beginRunning(active);
        // Обход закончен, но баллы ещё считаются — это тоже «в работе».
        const scoring = recent.find((t) => t.status === 'completed');
        if (scoring && scoring.audit_id) {
          const a = await fetchAuditLite(userId, scoring.audit_id);
          if (alive && a && !isFinished(a.status) && a.status !== 'failed') return beginRunning(scoring);
        }
        // Прерванная — только если это самая свежая задача своего сайта: после неё аудит не
        // перезапускали, и продолжать есть смысл. Сайт — текущий проект, а без него последний.
        const siteHost = host ?? (recent[0] ? hostOf(recent[0].url) : null);
        const newestOfSite = siteHost ? recent.find((t) => hostOf(t.url) === siteHost) : undefined;
        if (alive) {
          setInterrupted(
            newestOfSite && RESUMABLE_STATUSES.includes(newestOfSite.status) && (newestOfSite.pages_scanned ?? 0) > 0
              ? newestOfSite
              : null,
          );
          setPhase('idle');
        }
      } catch (err) {
        console.error('Кабинет: не удалось проверить задачи аудита', err);
        if (alive) {
          setError(errorText(err, 'Не удалось проверить запущенные аудиты'));
          setPhase('idle');
        }
      }
    })();
    return () => {
      alive = false;
    };
    // host не в зависимостях: смена проекта не должна сбрасывать идущий обход.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, taskParam]);

  // Опрос хода обхода.
  const taskId = phase === 'running' ? task?.id ?? null : null;
  useEffect(() => {
    if (!userId || !taskId) return;
    let alive = true;
    let timer: number | undefined;

    const tick = async () => {
      try {
        const { data, error: invErr } = await supabase.functions.invoke('audit-status', { body: { task_id: taskId } });
        if (invErr) throw new Error(await invokeError(invErr, 'Не удалось узнать ход аудита'));
        if (!alive) return;
        if (!data?.success) throw new Error(data?.error || 'audit-status вернул ошибку');
        const next: TaskRow = {
          id: taskId,
          audit_id: auditIdRef.current,
          url: data.url ?? task?.url ?? '',
          status: data.status,
          stage: data.stage ?? null,
          progress: data.progress ?? 0,
          pages_scanned: data.pages_scanned ?? 0,
          estimated_pages: data.estimated_pages ?? null,
          discovered_urls_count: data.discovered_urls_count ?? null,
          current_url: data.current_url ?? null,
          error_message: data.error_message ?? null,
          created_at: data.created_at ?? task?.created_at ?? null,
          updated_at: new Date().toISOString(),
        };
        // audit-status не отдаёт audit_id — берём из базы один раз.
        if (!next.audit_id) {
          const row = await fetchTask(userId, taskId);
          next.audit_id = row?.audit_id ?? null;
          auditIdRef.current = next.audit_id;
        }
        const now = Date.now();
        const stage = stageLabel(next.status, next.stage);
        if (stage !== lastStage.current) {
          events.current.push({ at: now, text: `этап: ${stage}` });
          lastStage.current = stage;
        }
        const disc = next.discovered_urls_count ?? 0;
        if (disc > lastDiscovered.current) {
          events.current.push({
            at: now,
            text: `найдено адресов: ${disc.toLocaleString('ru-RU')}${data.discovery_source ? ` (${data.discovery_source})` : ''}`,
          });
          lastDiscovered.current = disc;
        }
        const pages = await fetchRecentPages(userId, taskId);
        if (!alive) return;
        setTask(next);
        setLog(buildLog(pages, events.current));
        setSamples((s) => [...s, { at: now, scanned: next.pages_scanned ?? 0 }].slice(-20));

        if (next.status === 'completed') {
          if (await finish(next)) return;
        } else if (RESUMABLE_STATUSES.includes(next.status)) {
          setInterrupted((next.pages_scanned ?? 0) > 0 ? next : null);
          setError(next.error_message ? `Аудит остановился: ${next.error_message}` : 'Аудит остановился.');
          setPhase('idle');
          void reload();
          return;
        }
      } catch (err) {
        // Сетевой сбой одного опроса не останавливает экран — пробуем снова на следующем тике.
        console.error('Кабинет: опрос аудита', err);
      }
      if (alive) timer = window.setTimeout(tick, POLL_MS);
    };
    void tick();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
    // task в зависимостях не нужен: опрос живёт, пока та же задача в работе.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, taskId, finish, reload]);

  const start = useCallback(
    async (url: string, maxPages: number) => {
      setBusy(true);
      setError(null);
      try {
        // type=deep: глубокий обход с лимитом страниц; quick у сервера — 10 страниц для гостей.
        const { data, error: invErr } = await supabase.functions.invoke('audit-start', {
          body: { url, options: { type: 'deep', maxPages } },
        });
        if (invErr) throw new Error(await invokeError(invErr, 'Не удалось запустить аудит'));
        if (!data?.task_id) throw new Error(data?.error || 'Сервер не вернул номер задачи');
        beginRunning({
          id: data.task_id,
          audit_id: null,
          url,
          status: data.status ?? 'queued',
          stage: 'queued',
          progress: 0,
          pages_scanned: 0,
          estimated_pages: maxPages,
          discovered_urls_count: 0,
          current_url: null,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        await reload();
        setHost(hostOf(url));
      } catch (err) {
        setError(errorText(err, 'Не удалось запустить аудит'));
      } finally {
        setBusy(false);
      }
    },
    [beginRunning, reload, setHost],
  );

  const cancel = useCallback(async () => {
    if (!task) return;
    setBusy(true);
    setError(null);
    try {
      const { data, error: invErr } = await supabase.functions.invoke('audit-cancel', { body: { task_id: task.id } });
      if (invErr) throw new Error(await invokeError(invErr, 'Не удалось прервать аудит'));
      if (data && data.success === false) throw new Error(data.error || 'Не удалось прервать аудит');
      const stopped = { ...task, status: 'cancelled' };
      setInterrupted((stopped.pages_scanned ?? 0) > 0 ? stopped : null);
      setTask(null);
      setPhase('idle');
      void reload();
    } catch (err) {
      setError(errorText(err, 'Не удалось прервать аудит'));
    } finally {
      setBusy(false);
    }
  }, [task, reload]);

  const resume = useCallback(async () => {
    if (!interrupted) return;
    setBusy(true);
    setError(null);
    try {
      const { data, error: invErr } = await supabase.functions.invoke('audit-resume', { body: { task_id: interrupted.id } });
      if (invErr) throw new Error(await invokeError(invErr, 'Не удалось возобновить аудит'));
      if (!data?.success) throw new Error(data?.message || 'Не удалось возобновить аудит');
      beginRunning({ ...interrupted, status: 'processing', stage: 'crawling', error_message: null });
      void reload();
    } catch (err) {
      setError(errorText(err, 'Не удалось возобновить аудит'));
    } finally {
      setBusy(false);
    }
  }, [interrupted, beginRunning, reload]);

  /** «Начать заново» / «Новый аудит»: к форме. Прерванная задача остаётся в базе, её можно открыть позже. */
  const reset = useCallback(() => {
    setInterrupted(null);
    setDone(null);
    setTask(null);
    setError(null);
    setPhase('idle');
  }, []);

  return { phase, task, interrupted, done, log, samples, busy, error, start, cancel, resume, reset };
}
