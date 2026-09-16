import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  buildMonthlyCounts,
  buildRoleDistribution,
  countSince,
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

const PROFILES_LIMIT = 2000;

/**
 * Сводка по пользователям — из `profiles` и `user_roles`.
 *
 * Раньше здесь стояли «97 пользователей, 82 активных, +22 % за месяц».
 * Кто именно «активен» и когда кто заходил, платформа не пишет, поэтому
 * таких показателей тут больше нет: считаем только то, что есть в базе.
 */
export function useUsersOverview() {
  const [overview, setOverview] = useState<UsersOverview>(EMPTY_USERS_OVERVIEW);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [profilesResult, rolesResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(PROFILES_LIMIT),
          supabase.from('user_roles').select('role'),
        ]);

        if (profilesResult.error) throw profilesResult.error;

        const dates = (profilesResult.data ?? []).map((row) => row.created_at);
        // Роли могут быть закрыты политикой доступа — это не повод ронять
        // весь раздел вместе со списком профилей.
        const roles = (rolesResult.error ? [] : rolesResult.data ?? []).map((row) => row.role);

        if (cancelled) return;
        setOverview({
          total: dates.length,
          newLastMonth: countSince(dates, 30),
          admins: roles.filter((role) => role === 'admin').length,
          registrationsByMonth: buildMonthlyCounts(dates),
          roleDistribution: buildRoleDistribution(roles, dates.length),
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
