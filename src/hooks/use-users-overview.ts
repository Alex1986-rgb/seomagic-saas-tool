import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  buildMonthWindows,
  buildRoleDistribution,
  type MonthBucket,
  type RoleBucket,
} from '@/lib/admin-stats';

export interface UsersOverview {
  total: number;
  newLastMonth: number;
  admins: number;
  registrationsByMonth: MonthBucket[];
  roleDistribution: RoleBucket[];
}

export const EMPTY_USERS_OVERVIEW: UsersOverview = {
  total: 0,
  newLastMonth: 0,
  admins: 0,
  registrationsByMonth: [],
  roleDistribution: [],
};

const DAY_MS = 24 * 60 * 60 * 1000;
/** Сколько идентификаторов администраторов забираем списком — их единицы. */
const ADMIN_IDS_LIMIT = 500;

/** Точный счётчик профилей, при необходимости — в границах дат. */
async function countProfiles(from?: string, to?: string): Promise<number> {
  let query = supabase.from('profiles').select('*', { count: 'exact', head: true });
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lt('created_at', to);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

interface RoleSummary {
  counts: Record<string, number>;
  admins: number;
  /** null — посчитать профили без роли точно не получилось. */
  withoutRole: number | null;
}

/**
 * Роли — отдельными счётчиками по каждому значению app_role ('admin', 'user',
 * миграция 20250614001730). Одна учётная запись может иметь обе роли
 * (UNIQUE(user_id, role)), поэтому «без роли» считаем как профили минус
 * различных владельцев ролей, вычитая пересечение admin и user.
 */
async function loadRoleSummary(totalProfiles: number): Promise<RoleSummary> {
  const [allRows, adminRows, userRows, adminIdsResult] = await Promise.all([
    supabase.from('user_roles').select('*', { count: 'exact', head: true }),
    supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('user_roles').select('user_id').eq('role', 'admin').limit(ADMIN_IDS_LIMIT),
  ]);

  if (allRows.error) throw allRows.error;
  if (adminRows.error) throw adminRows.error;
  if (userRows.error) throw userRows.error;
  if (adminIdsResult.error) throw adminIdsResult.error;

  const rowsTotal = allRows.count ?? 0;
  const admins = adminRows.count ?? 0;
  const users = userRows.count ?? 0;
  const other = Math.max(0, rowsTotal - admins - users);

  const counts: Record<string, number> = { admin: admins, user: users };
  if (other > 0) counts.other = other;

  const adminIds = (adminIdsResult.data ?? [])
    .map((row) => row.user_id)
    .filter((id): id is string => Boolean(id));

  // Точно посчитать можно, только если других ролей нет и список
  // администраторов пришёл целиком. Иначе группу «без роли» не показываем.
  let withoutRole: number | null = null;
  if (other === 0 && adminIds.length === admins) {
    let overlap = 0;
    if (adminIds.length > 0) {
      const { count, error } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user')
        .in('user_id', adminIds);
      if (error) throw error;
      overlap = count ?? 0;
    }
    withoutRole = Math.max(0, totalProfiles - (rowsTotal - overlap));
  }

  return { counts, admins, withoutRole };
}

/**
 * Сводка по пользователям — из `profiles` и `user_roles`.
 *
 * Раньше здесь стояли «97 пользователей, 82 активных, +22 % за месяц».
 * Кто именно «активен» и когда кто заходил, платформа не пишет, поэтому
 * таких показателей тут больше нет: считаем только то, что есть в базе.
 *
 * Все числа — точные счётчики базы (count: 'exact', head: true). Раньше
 * итог был длиной выборки из 2000 профилей, а роли читались одним запросом,
 * который упирается в предел строк PostgREST (1000): при большем числе
 * пользователей карточки молча застывали на этих значениях.
 */
export function useUsersOverview() {
  const [overview, setOverview] = useState<UsersOverview>(EMPTY_USERS_OVERVIEW);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const since = new Date(Date.now() - 30 * DAY_MS).toISOString();
        const windows = buildMonthWindows();

        const [total, newLastMonth, monthly] = await Promise.all([
          countProfiles(),
          countProfiles(since),
          Promise.all(windows.map((range) => countProfiles(range.from, range.to))),
        ]);

        // Роли могут быть закрыты политикой доступа — это не повод ронять
        // весь раздел вместе со счётчиками профилей.
        let roles: RoleSummary = { counts: {}, admins: 0, withoutRole: null };
        try {
          roles = await loadRoleSummary(total);
        } catch (rolesError) {
          console.error('Не удалось посчитать роли пользователей:', rolesError);
        }

        if (cancelled) return;
        setOverview({
          total,
          newLastMonth,
          admins: roles.admins,
          registrationsByMonth: windows.map((range, index) => ({
            month: range.month,
            count: monthly[index],
          })),
          roleDistribution: buildRoleDistribution(roles.counts, roles.withoutRole),
        });
      } catch (err) {
        if (cancelled) return;
        console.error('Не удалось загрузить сводку по пользователям:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
        setOverview(EMPTY_USERS_OVERVIEW);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { overview, isLoading, error };
}
