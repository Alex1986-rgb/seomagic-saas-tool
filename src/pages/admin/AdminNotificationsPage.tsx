import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Info, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import PageSeo from '@/components/seo/PageSeo';
import NotCollectedNotice from '@/components/admin/NotCollectedNotice';
import { useAdminNotifications } from '@/hooks/use-admin-notifications';
import { formatDateTime } from '@/lib/admin-stats';

/**
 * Уведомления администратора.
 *
 * Раньше страница показывала три выдуманных события — «запланировано
 * обновление до версии 2.8.2», «543 запроса в минуту», регистрация
 * несуществующего Алексея Смирнова — и три канала доставки (Email, Slack,
 * SMS) с придуманными статусами. Ни планировщика обновлений, ни интеграций
 * со Slack и SMS в проекте нет. Показываем строки из таблицы
 * `notifications` — то, что платформа действительно создала.
 */

const typeStyles: Record<string, string> = {
  error: 'bg-red-500/10 text-red-500',
  warning: 'bg-amber-500/10 text-amber-500',
  success: 'bg-green-500/10 text-green-500',
};

const AdminNotificationsPage: React.FC = () => {
  const { notifications, unread, total, isLoading, error } = useAdminNotifications();

  return (
    <>
      <PageSeo
        title="Уведомления администратора: события и каналы связи"
        description="Центр оповещений администратора: последние системные события, запланированные работы и настройка каналов доставки уведомлений."
        noindex
      />

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <Bell className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold">Уведомления администратора</h1>
            </div>
            <p className="text-muted-foreground">
              Записи из таблицы уведомлений: что платформа сообщила пользователям
            </p>
          </div>

          <Link to="/admin/system/notifications">
            <Button className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Настройки уведомлений
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Последние уведомления
                  </CardTitle>
                  {!isLoading && (
                    <Badge variant="outline" className="bg-primary/10">
                      {unread > 0 ? `${unread} непрочитанных` : 'все прочитаны'}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {isLoading
                    ? 'Загружаем...'
                    : total === 0
                      ? 'Пока ни одного уведомления не создано'
                      : `Всего записей: ${total}, показаны последние ${notifications.length}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    Не удалось загрузить уведомления: {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Читаем таблицу уведомлений...
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="py-6 text-sm text-muted-foreground">
                    Уведомлений пока нет. Они появляются, когда платформа завершает
                    аудит, проверку позиций или оптимизацию.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border rounded-lg p-4 ${
                          notification.read ? 'bg-card' : 'bg-primary/5 border-primary/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${typeStyles[notification.type] ?? 'bg-blue-500/10 text-blue-500'}`}>
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-3">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDateTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <NotCollectedNotice
              title="Каналов доставки пока нет"
              description="Здесь значились активные Email, Slack и SMS. Ни одна из этих интеграций не подключена, статусы были нарисованы. Что есть на самом деле:"
              items={[
                'уведомления складываются в базу и видны в интерфейсе',
                'отправку писем и правила оповещений настраивают в разделе настроек',
                'расписание плановых работ платформа не ведёт',
              ]}
            />

            <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Откуда берутся уведомления
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Записи создаёт сама платформа по ходу работы: завершился аудит,
                  закончилась оптимизация, пришёл результат проверки позиций.
                </p>
                <p>
                  Если список пустой — значит, событий ещё не было, а не значит,
                  что что-то сломалось.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNotificationsPage;
