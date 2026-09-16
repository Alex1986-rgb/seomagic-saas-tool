import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

/**
 * Данные вкладок «Администрирования»: пороги, статусы и загрузка.
 *
 * Все запросы админки идут обычным клиентом под сессией администратора: доступ ко всем строкам
 * даёт RLS-правило has_role(auth.uid(), 'admin'). Поэтому, в отличие от клиентских экранов,
 * запросы здесь НЕ ограничиваются user_id — админке нужна платформа целиком. Где политика
 * администратору строк не отдаёт (job_estimates, url_queue), вкладка честно пишет «не подключено»,
 * а не показывает пустую выборку как «ноль».
 */

export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;

export const sinceIso = (ms: number): string => new Date(Date.now() - ms).toISOString();

/**
 * «Живые» статусы задачи аудита. Список совпадает с уборкой зависших задач
 * (миграция 20260916180100_fail_stuck_all_live_statuses): queued → processing — нынешние значения,
 * pending и scanning — старые, могут остаться в базе. Если счётчики админки и уборка разойдутся,
 * «в работе» будет висеть задача, которую уборка уже не видит.
 */
export const LIVE_TASK_STATUSES = ['queued', 'pending', 'processing', 'scanning'];

/** Задача без движения дольше часа — порог той же уборки: дальше её переведут в failed. */
export const STUCK_AFTER_MS = HOUR_MS;

/** Ошибки Supabase — не экземпляры Error, а объекты с message: достаём текст из обоих. */
export function errText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Не удалось загрузить данные';
}

/**
 * Загрузка с состояниями «грузим / ошибка / данные» и перезапуском.
 * Функция загрузки берётся из ref: вкладки передают стрелку, и без ref каждый рендер
 * запускал бы запрос заново.
 */
export function useAsync<T>(load: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loadRef
      .current()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        console.error('Админка: запрос не выполнен', err);
        if (alive) setState({ data: null, loading: false, error: errText(err) });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}

/** Точный счётчик ответа head-запроса: ошибку пробрасываем, а не превращаем в ноль. */
export function countOf(res: { count: number | null; error: unknown }): number {
  if (res.error) throw res.error;
  return res.count ?? 0;
}
