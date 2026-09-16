import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminAccount {
  userId: string;
  role: string;
  grantedAt: string | null;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

/**
 * Настоящие учётные записи с ролями — `user_roles` плюс данные из `profiles`.
 *
 * До сентября 2026 в этом списке жили четыре выдуманных человека
 * (alex@example.com и компания) вместе с датами их «последнего входа».
 * Входы платформа не фиксирует, поэтому такого столбца здесь нет.
 */
export function useAdminAccounts() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role, created_at')
          .order('created_at', { ascending: false })
          .limit(200);

        if (rolesError) throw rolesError;

        const rows = (roles ?? []).filter((row): row is typeof row & { user_id: string } =>
          Boolean(row.user_id),
        );

        if (rows.length === 0) {
          if (!cancelled) setAccounts([]);
          return;
        }

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url')
          .in('id', rows.map((row) => row.user_id));

        const byId = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

        if (cancelled) return;
        setAccounts(
          rows.map((row) => {
            const profile = byId.get(row.user_id);
            return {
              userId: row.user_id,
              role: row.role,
              grantedAt: row.created_at,
              email: profile?.email ?? null,
              fullName: profile?.full_name ?? null,
              avatarUrl: profile?.avatar_url ?? null,
            };
          }),
        );
      } catch (err) {
        if (cancelled) return;
        console.error('Не удалось загрузить список учётных записей:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
        setAccounts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { accounts, isLoading, error };
}
