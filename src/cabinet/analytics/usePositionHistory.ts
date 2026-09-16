import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CheckRow, ResultRow } from './positions-model';

/**
 * История проверок позиций проекта из базы (position_checks + position_results).
 *
 * Общая для «Позиций» и «Конкурентов», чтобы оба экрана показывали одни и те же числа.
 *
 * Ограничения масштаба: берём последние MAX_CHECKS проверок домена — этого хватает на период
 * 90 дней при ежедневном съёме; результаты читаем страницами по 1000 строк (больше база за раз
 * не отдаёт), но не дальше MAX_RESULT_PAGES, чтобы экран не грузил десятки тысяч строк.
 *
 * Запрос проверок явно ограничен user_id: политика чтения пускает администратора ко всем
 * проверкам, и без фильтра в «свой» кабинет попали бы чужие домены.
 */

const MAX_CHECKS = 60;
const PAGE = 1000;
const MAX_RESULT_PAGES = 20;
/** Пока на сервере идёт проверка, обновляем счётчик. Чаще незачем — проверка идёт минутами. */
const POLL_MS = 8000;

export interface PositionHistory {
  loading: boolean;
  error: string | null;
  checks: CheckRow[];
  results: ResultRow[];
  /** Проверка, которая сейчас идёт на сервере (запущена здесь или в другой вкладке). */
  running: CheckRow[];
  reload: () => Promise<void>;
}

export function usePositionHistory(userId: string | null, host: string | null): PositionHistory {
  const [checks, setChecks] = useState<CheckRow[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(
    async (quiet = false) => {
      if (!userId || !host) {
        setChecks([]);
        setResults([]);
        setLoading(false);
        return;
      }
      if (!quiet) setLoading(true);
      setError(null);
      try {
        // Домен в проверке записан так, как его ввели: с www и без — один проект.
        const { data: checkRows, error: cErr } = await supabase
          .from('position_checks')
          .select('id, domain, search_engine, region, depth, status, keywords_total, keywords_checked, error, created_at, completed_at')
          .eq('user_id', userId)
          .in('domain', [host, `www.${host}`])
          .order('created_at', { ascending: false })
          .limit(MAX_CHECKS);
        if (cErr) throw cErr;
        const list = (checkRows ?? []) as CheckRow[];
        // Результаты есть и у частичной проверки; у упавшей — нет, у идущей — неполные.
        const doneIds = list.filter((c) => c.status === 'completed' || c.status === 'partial').map((c) => c.id);

        const rows: ResultRow[] = [];
        if (doneIds.length > 0) {
          for (let page = 0; page < MAX_RESULT_PAGES; page++) {
            const { data, error: rErr } = await supabase
              .from('position_results')
              .select('check_id, keyword, search_engine, position, url, checked_at')
              .in('check_id', doneIds)
              .order('checked_at', { ascending: false })
              .range(page * PAGE, page * PAGE + PAGE - 1);
            if (rErr) throw rErr;
            rows.push(...((data ?? []) as ResultRow[]));
            if (!data || data.length < PAGE) break;
          }
        }
        if (!alive.current) return;
        setChecks(list);
        setResults(rows);
      } catch (err) {
        console.error('Кабинет: не удалось загрузить позиции', err);
        if (alive.current) setError(err instanceof Error ? err.message : 'Не удалось загрузить позиции');
      } finally {
        if (alive.current) setLoading(false);
      }
    },
    [userId, host],
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Зависшая проверка (обработчик упал, статус остался running) не должна держать опрос вечно:
  // сервис ждёт не дольше 45 минут, берём с запасом два часа.
  const staleBefore = Date.now() - 2 * 60 * 60 * 1000;
  const running = checks.filter((c) => c.status === 'running' && Date.parse(c.created_at) >= staleBefore);

  // Пока хоть одна проверка идёт, перечитываем состояние; когда закончится — подтянутся и результаты.
  useEffect(() => {
    if (running.length === 0) return;
    const t = window.setInterval(() => void load(true), POLL_MS);
    return () => window.clearInterval(t);
  }, [running.length, load]);

  const reload = useCallback(() => load(true), [load]);

  return { loading, error, checks, results, running, reload };
}
