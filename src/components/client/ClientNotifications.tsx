import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Уведомления пользователя.
 *
 * Здесь были вписаны три сообщения, одинаковые для всех: «Аудит завершён для
 * example.com», «Позиция по запросу "seo аудит" улучшилась» и «Платёж обработан
 * — подписка продлена до 15 января 2025». Последнее особенно вредно: приёма
 * оплаты нет, а человек читал, что с него списали деньги.
 *
 * Настройки уведомлений (переключатели «Email», «Push», «SMS») тоже были
 * декорацией — ни одно из них никуда не сохранялось, поэтому убраны до
 * появления настоящих настроек.
 */

interface NotificationRow {
  id: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
}

const timeAgo = (value: string): string => {
  const diffMinutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (diffMinutes < 1) return 'только что';
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  return new Date(value).toLocaleDateString('ru-RU');
};

const ClientNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('notifications')
      .select('id, title, message, read, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) setError(queryError.message);
        else setNotifications((data ?? []) as NotificationRow[]);
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const markAllRead = async () => {
    const unread = notifications.filter((item) => !item.read).map((item) => item.id);
    if (unread.length === 0) return;

    const { error: updateError } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .in('id', unread);

    if (updateError) {
      toast({
        title: 'Не удалось отметить прочитанными',
        description: updateError.message,
        variant: 'destructive',
      });
      return;
    }

    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Уведомления</h3>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Последние уведомления</CardTitle>
            {notifications.some((item) => !item.read) && (
              <Button size="sm" variant="outline" onClick={markAllRead}>
                Отметить все как прочитанные
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 py-4 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загружаем...
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">Не удалось получить уведомления: {error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Уведомлений нет. Они появятся, когда закончится проверка сайта или изменятся позиции.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-md border-l-4 ${
                    !notification.read ? 'border-l-primary bg-primary/5' : 'border-l-muted bg-muted/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base">{notification.title}</p>
                      {notification.message && (
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(notification.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotifications;
