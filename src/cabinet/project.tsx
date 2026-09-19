import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { hostOf } from './format';

/**
 * Текущий проект кабинета.
 *
 * В макете проект — самостоятельная сущность (сайдбар «Проект: mebel-grad.ru», таблица «Все
 * проекты» со статусом). В базе такой таблицы нет: есть только аудиты пользователя. Поэтому
 * проект здесь выводится из аудитов — один хост = один проект, выбранный хост помнится в
 * браузере. Когда появится таблица проектов, меняется только этот файл, экраны читают тот же
 * контекст.
 *
 * Запросы явно ограничены user_id: политика чтения audits отдаёт гостевые записи всем и всё
 * подряд администратору, и без фильтра в «свой» кабинет попали бы чужие сайты.
 */

export interface CabinetAudit {
  id: string;
  url: string;
  host: string;
  seoScore: number | null;
  status: string;
  createdAt: string | null;
  completedAt: string | null;
  pagesScanned: number | null;
  totalPages: number | null;
  errorMessage: string | null;
}

export interface CabinetProjectSummary {
  host: string;
  lastAudit: CabinetAudit;
  /** Последний завершённый аудит — балл и страницы берутся только из него. */
  lastCompleted: CabinetAudit | null;
  auditsCount: number;
}

interface CabinetProjectContextValue {
  userId: string | null;
  loading: boolean;
  error: string | null;
  /** Все аудиты пользователя, новые сверху. */
  audits: CabinetAudit[];
  projects: CabinetProjectSummary[];
  /** Хост текущего проекта; null — у пользователя ещё нет ни одного аудита. */
  host: string | null;
  project: CabinetProjectSummary | null;
  /** Аудиты текущего проекта, новые сверху. */
  projectAudits: CabinetAudit[];
  setHost: (host: string) => void;
  reload: () => Promise<void>;
}

const STORAGE_KEY = 'seomarket-cabinet-project';

const CabinetProjectContext = createContext<CabinetProjectContextValue | null>(null);

function readStoredHost(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export const CabinetProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [audits, setAudits] = useState<CabinetAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(readStoredHost);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setAudits([]);
        return;
      }
      const { data, error: qError } = await supabase
        .from('audits')
        .select('id, url, seo_score, status, created_at, completed_at, pages_scanned, total_pages, error_message')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(500);
      if (qError) throw qError;
      setAudits(
        (data ?? []).map((row) => ({
          id: row.id,
          url: row.url,
          host: hostOf(row.url),
          seoScore: row.seo_score,
          status: row.status,
          createdAt: row.created_at,
          completedAt: row.completed_at,
          pagesScanned: row.pages_scanned,
          totalPages: row.total_pages,
          errorMessage: row.error_message,
        })),
      );
    } catch (err) {
      console.error('Кабинет: не удалось загрузить аудиты', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить проекты');
      setAudits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const projects = useMemo<CabinetProjectSummary[]>(() => {
    const byHost = new Map<string, CabinetProjectSummary>();
    for (const a of audits) {
      if (!a.host) continue;
      const p = byHost.get(a.host);
      if (!p) {
        byHost.set(a.host, {
          host: a.host,
          lastAudit: a,
          lastCompleted: a.status === 'completed' ? a : null,
          auditsCount: 1,
        });
      } else {
        p.auditsCount += 1;
        if (!p.lastCompleted && a.status === 'completed') p.lastCompleted = a;
      }
    }
    return Array.from(byHost.values());
  }, [audits]);

  // Выбранный хост мог исчезнуть (аудиты удалены) — тогда берём самый свежий проект.
  const host = useMemo(() => {
    if (chosen && projects.some((p) => p.host === chosen)) return chosen;
    return projects[0]?.host ?? null;
  }, [chosen, projects]);

  const setHost = useCallback((next: string) => {
    setChosen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* хранилище недоступно — выбор живёт до перезагрузки */
    }
  }, []);

  const value = useMemo<CabinetProjectContextValue>(
    () => ({
      userId,
      loading,
      error,
      audits,
      projects,
      host,
      project: projects.find((p) => p.host === host) ?? null,
      projectAudits: host ? audits.filter((a) => a.host === host) : [],
      setHost,
      reload,
    }),
    [userId, loading, error, audits, projects, host, setHost, reload],
  );

  return <CabinetProjectContext.Provider value={value}>{children}</CabinetProjectContext.Provider>;
};

export function useCabinetProject(): CabinetProjectContextValue {
  const ctx = useContext(CabinetProjectContext);
  if (!ctx) throw new Error('useCabinetProject вне CabinetProjectProvider');
  return ctx;
}
