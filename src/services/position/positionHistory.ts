import { supabase } from '@/integrations/supabase/client';
import { KeywordPosition, PositionData } from './positionTracker';

/** Сколько последних проверок показываем в истории. */
const HISTORY_LIMIT = 50;

/**
 * История проверок позиций из базы.
 *
 * Раньше история лежала в localStorage и состояла из сгенерированных чисел.
 * Теперь это записи проверок пользователя: они переживают смену браузера.
 *
 * Ошибки не глушим: раньше любой сбой превращался в пустой список, и интерфейс
 * показывал «истории нет», хотя история была, просто не прочиталась. Теперь
 * функция бросает ошибку, а вызывающий код сам решает, как её показать.
 *
 * Берём только проверки текущего пользователя явным фильтром: политика доступа
 * пускает администратора и к чужим записям, а это личная история.
 */
export const getHistoricalData = async (domain?: string): Promise<PositionData[]> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Войдите в аккаунт, чтобы увидеть историю проверок');
  }

  let query = supabase
    .from('position_checks')
    .select('id, domain, search_engine, region, depth, status, provider, error, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT);

  if (domain) query = query.eq('domain', domain);

  const { data: checks, error } = await query;
  if (error) {
    console.error('Ошибка получения истории позиций:', error);
    throw new Error('Не удалось загрузить историю проверок');
  }
  if (!checks || checks.length === 0) return [];

  const { data: rows, error: rowsError } = await supabase
    .from('position_results')
    .select('check_id, keyword, search_engine, position, previous_position, url, search_url, checked_at')
    .in('check_id', checks.map((c) => c.id));
  if (rowsError) {
    console.error('Ошибка получения результатов проверок позиций:', rowsError);
    throw new Error('Не удалось загрузить результаты проверок');
  }

  const byCheck = new Map<string, KeywordPosition[]>();
  for (const row of rows ?? []) {
    const list = byCheck.get(row.check_id) ?? [];
    list.push({
      keyword: row.keyword,
      position: row.position,
      previousPosition: row.previous_position ?? undefined,
      url: row.url ?? undefined,
      searchEngine: row.search_engine,
      searchUrl: row.search_url ?? undefined,
      lastChecked: row.checked_at,
    });
    byCheck.set(row.check_id, list);
  }

  return checks.map((check) => ({
    domain: check.domain,
    timestamp: check.created_at,
    date: check.created_at,
    keywords: byCheck.get(check.id) ?? [],
    searchEngine: check.search_engine,
    region: check.region ?? undefined,
    depth: check.depth,
    scanFrequency: 'once',
    scanId: check.id,
    provider: check.provider ?? undefined,
    status: check.status,
    failures: check.error ? [check.error] : [],
  }));
};

// Псевдоним для обратной совместимости с интерфейсом.
export const getPositionHistory = getHistoricalData;

/**
 * Проверки сохраняет сервер в момент проверки, поэтому клиенту сохранять нечего.
 * Функция оставлена, чтобы не ломать вызывающий код, и только уведомляет интерфейс.
 */
export const saveToHistory = (_result: PositionData): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('position-history-updated'));
  }
};

/** Удаление истории: по домену или целиком. Каскадом уходят и результаты. */
export const clearHistory = async (domain?: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Требуется вход в аккаунт');

    let query = supabase.from('position_checks').delete().eq('user_id', user.id);
    if (domain) query = query.eq('domain', domain);

    const { error } = await query;
    if (error) throw error;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('position-history-updated'));
    }
  } catch (error) {
    console.error('Ошибка очистки истории позиций:', error);
    throw error;
  }
};
