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

const errorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  // Ошибки PostgREST приходят объектом с полем message, а не экземпляром Error.
  if (err && typeof err === 'object' && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'неизвестная ошибка';
};

/**
 * Уведомления из таблицы `notifications`, адресованные самому администратору.
 *
 * Раньше страница показывала три придуманных события — про «543 запроса в
 * минуту» и регистрацию несуществующего Алексея Смирнова.
 *
 * Уведомления клиентов сюда не попадают. Правило доступа к таблице
 * (миграция 20251119002428) пускает каждого, в том числе администратора,
 * только к своим записям, а открывать администратору чужие уведомления —
 * вопрос приватности клиентов, который решает владелец. Поэтому страница
 * прямо подписана «только ваши уведомления», и фильтр по получателю стоит в
 * самих запросах: если правило доступа когда-нибудь расширят, страница не
 * начнёт молча показывать чужие записи под этой подписью, а итоги total и
 * unread не смешают свои уведомления с чужими.
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
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const viewerId = userData?.user?.id;
        if (userError || !viewerId) {
          throw new Error('не удалось определить учётную запись, войдите заново');
        }

        const [listResult, totalResult, unreadResult] = await Promise.all([
          supabase
            .from('notifications')
            .select('id, title, message, type, read, created_at')
            .eq('user_id', viewerId)
            .order('created_at', { ascending: false })
            .limit(LIMIT),
          supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', viewerId),
          supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', viewerId)
            .eq('read', false),
        ]);

        if (listResult.error) throw listResult.error;
        // Без счётчиков страница написала бы «все прочитаны» или «0 записей»
        // наугад — лучше показать ошибку.
        if (totalResult.error) throw totalResult.error;
        if (unreadResult.error) throw unreadResult.error;

        const rows = listResult.data ?? [];

        if (cancelled) return;
        setNotifications(
          rows.map((row) => ({
            id: row.id,
            title: row.title,
            message: row.message,
            type: row.type,
            read: Boolean(row.read),
            createdAt: row.created_at,
          })),
        );
        setTotal(totalResult.count ?? rows.length);
        setUnread(unreadResult.count ?? 0);
      } catch (err) {
        if (cancelled) return;
        console.error('Не удалось загрузить уведомления:', err);
        setError(errorMessage(err));
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
