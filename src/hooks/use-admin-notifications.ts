import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string | null;
}

const LIMIT = 50;

/**
 * Уведомления из таблицы `notifications` — те, что система действительно
 * создала (завершение аудита, результат оптимизации и т. п.).
 *
 * Раньше страница показывала три придуманных события — про «543 запроса в
 * минуту» и регистрацию несуществующего Алексея Смирнова.
 */
export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [listResult, totalResult, unreadResult] = await Promise.all([
          supabase
            .from('notifications')
            .select('id, title, message, type, read, created_at')
            .order('created_at', { ascending: false })
            .limit(LIMIT),
          supabase.from('notifications').select('*', { count: 'exact', head: true }),
          supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
        ]);

        if (listResult.error) throw listResult.error;

        if (cancelled) return;
        setNotifications(
          (listResult.data ?? []).map((row) => ({
            id: row.id,
            title: row.title,
            message: row.message,
            type: row.type,
            read: Boolean(row.read),
            createdAt: row.created_at,
          })),
        );
        setTotal(totalResult.count ?? listResult.data?.length ?? 0);
        setUnread(unreadResult.count ?? 0);
      } catch (err) {
        if (cancelled) return;
        console.error('Не удалось загрузить уведомления:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить уведомления');
        setNotifications([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { notifications, unread, total, isLoading, error };
}
