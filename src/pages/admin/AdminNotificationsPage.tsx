import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Info, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
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
 *
 * Видны только уведомления, адресованные самому администратору: уведомления
 * клиентов ему не открыты (правило доступа к таблице пускает каждого только к
 * своим записям, а расширять его — вопрос приватности, который решает
 * владелец). Страница говорит об этом прямо и не выдаёт пустой список за
 * «событий не было».
 *
 * Убраны обещания, за которыми ничего нет: кнопка «Настройки уведомлений»
 * вела на страницу, где никаких настроек нет, а в списке значилось, что
 * «отправку писем и правила оповещений настраивают в разделе настроек» —
 * правил оповещений в проекте нет, а писем по уведомлениям платформа не
 * отправляет (create-notification записывает строку с email_sent = false и
 * больше ничего). Также неверно было, что уведомления приходят об оптимизации
 * и проверке позиций: create-notification вызывает только scoring-processor
 * по завершении аудита.
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
        title="Уведомления администратора: только ваши записи"
        description="Уведомления, адресованные учётной записи администратора. Уведомления клиентов на этой странице не показываются."
        noindex
      />

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 text-primary p-1.5 rounded">
              <Bell className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold">Уведомления администратора</h1>
          </div>
          <p className="text-muted-foreground">
            Только уведомления, адресованные вашей учётной записи. Уведомления клиентов здесь
            не показываются.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Ваши уведомления
                  </CardTitle>
                  {!isLoading && !error && (
                    <Badge variant="outline" className="bg-primary/10">
                      {unread > 0 ? `${unread} непрочитанных` : 'все прочитаны'}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {isLoading
                    ? 'Загружаем...'
                    : error
                      ? 'Список не загрузился'
                      : total === 0
                        ? 'На вашу учётную запись уведомлений нет'
                        : `Ваших уведомлений: ${total}, показаны последние ${notifications.length}`}
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
                ) : error ? null : notifications.length === 0 ? (
                  <p className="py-6 text-sm text-muted-foreground">
                    На вашу учётную запись уведомлений нет. О том, получали ли уведомления
                    клиенты, эта страница не говорит: их записи сюда не попадают.
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
                              <h3 className="font-medium min-w-0">{notification.title}</h3>
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
              title="Уведомления клиентов не показываются"
              description="Правило доступа к таблице notifications разрешает каждому, в том числе администратору, читать только свои записи, и страница запрашивает только уведомления вашей учётной записи. Сколько уведомлений получили клиенты, отсюда не узнать."
            />

            <NotCollectedNotice
              title="Каналов оповещений нет"
              description="Здесь значились активные Email, Slack и SMS. Ни одна из этих интеграций не подключена, статусы были нарисованы. Что есть на самом деле:"
              items={[
                'уведомления записываются в базу и видны в интерфейсе',
                'писем по уведомлениям платформа не отправляет; рассылки администратору по почте, SMS или в Slack нет',
                'правил оповещений, которые можно было бы настроить, в админке нет',
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
                  Сейчас платформа создаёт уведомление в одном случае: когда аудит завершён и
                  посчитаны баллы. Об оптимизации и проверке позиций уведомлений нет.
                </p>
                <p>
                  Запись появляется, только если у получателя в{' '}
                  <Link to="/settings" className="text-primary hover:underline">
                    личных настройках
                  </Link>{' '}
                  включены «Email уведомления» и «Завершение аудита». Письмо при этом не
                  уходит: переключатели решают лишь, создавать ли запись.
                </p>
                <p>
                  Работает ли отправка писем в принципе, можно проверить в разделе{' '}
                  <Link to="/admin/system/email" className="text-primary hover:underline">
                    «Настройки почты»
                  </Link>
                  .
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
