import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import SystemSettingsPage from '@/components/admin/system/SystemSettingsPage';
import { Server, Database, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import PageSeo from '@/components/seo/PageSeo';
import NotCollectedNotice from '@/components/admin/NotCollectedNotice';
import { useApiActivity } from '@/hooks/use-api-activity';
import { usePlatformUsage } from '@/hooks/use-platform-usage';
import { formatDateTime } from '@/lib/admin-stats';

/**
 * Состояние системы.
 *
 * Раньше страница уверенно сообщала «Система работает стабильно»,
 * «Время работы: 23 дня, 14 часов», загрузку CPU 23 %, память 36 %, диск
 * 42 %, размер базы 2.34 GB и дату последнего бэкапа — всё это было
 * вписано в код и ничему не соответствовало. Ни одной такой метрики
 * платформа не снимает. Ниже — только то, что есть в базе: журнал вызовов
 * функций и объём накопленных данных.
 *
 * Журнал api_logs неполный: пишут в него не все функции и не при каждой
 * ошибке. Поэтому страница больше не выносит вердикт «ошибок в журнале нет»
 * и не показывает «0 мс» там, где время не мерили, — только число записей
 * и оговорку, откуда оно.
 */

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

const SystemStatusPage: React.FC = () => {
  const { stats, isLoading, error } = useApiActivity();
  const { usage, isLoading: usageLoading, error: usageError } = usePlatformUsage();

  const hasCalls = stats.total > 0;
  const statusText = hasCalls
    ? `Записей в журнале за сутки: ${stats.total}`
    : 'За сутки в журнал ничего не записано';
  const loggedFunctions = stats.byFunction.map((fn) => fn.name).join(', ');

  return (
    <>
      <PageSeo
        title="Состояние системы: журнал вызовов и объём данных"
        description="Записи журнала вызовов функций платформы за сутки и число накопленных в базе аудитов, оптимизаций, проверок позиций и заявок."
        noindex
      />

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <Server className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold">Состояние системы</h1>
            </div>
            <p className="text-muted-foreground">
              Журнал вызовов функций и объём данных платформы
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 bg-muted rounded-lg border">
            <Database className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <div className="font-medium">{isLoading ? 'Читаем журнал...' : statusText}</div>
              <div className="text-xs text-muted-foreground">
                Последняя запись: {stats.lastCallAt ? formatDateTime(stats.lastCallAt) : 'нет данных'}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Не удалось прочитать журнал вызовов: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Журнал вызовов за 24 часа</h3>
                </div>
                <Badge variant="outline">api_logs</Badge>
              </div>

              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Загружаем...
                </div>
              ) : hasCalls ? (
                <div className="space-y-2 text-sm">
                  <Row label="Записей в журнале" value={String(stats.total)} />
                  <Row label="С кодом ошибки (4xx/5xx)" value={String(stats.errors)} />
                  {stats.averageDuration !== null && (
                    <Row label="Средняя длительность" value={`${stats.averageDuration} мс`} />
                  )}
                  <Row label="Записи оставили" value={loggedFunctions || '—'} />
                  {stats.sampleSize < stats.total && (
                    <p className="text-xs text-muted-foreground">
                      Список функций построен по последним {stats.sampleSize} записям.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  За последние сутки в журнал ничего не записано. Это не значит,
                  что платформой не пользовались: журнал ведут не все функции.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Накоплено в базе</h3>
                </div>
                <Badge variant="outline">Supabase / PostgreSQL</Badge>
              </div>

              {usageLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Считаем...
                </div>
              ) : usageError ? (
                <p className="text-sm text-destructive">Не удалось посчитать записи: {usageError}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <Row label="Аудитов" value={String(usage.audits.total)} />
                  <Row label="Оптимизаций" value={String(usage.optimizations.total)} />
                  <Row label="Проверок позиций" value={String(usage.positionChecks.total)} />
                  <Row label="Пользователей" value={String(usage.users.total)} />
                  <Row label="Заявок с сайта" value={String(usage.requests.total)} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <NotCollectedNotice
          className="mb-6"
          title="Журнал вызовов неполный"
          description="Числа выше — только то, что функции сами записали в api_logs. Судить по ним, были ли сбои, нельзя:"
          items={[
            'записи оставляют не все функции платформы и не на каждом шаге — часть обращений, в том числе неудачные, в журнал не попадает',
            'длительность пишут не все функции; где время не замеряли, средняя не показывается',
            'если записей с кодом ошибки нет, это не значит, что ошибок не было',
          ]}
        />

        <p className="mb-6 text-sm text-muted-foreground">
          Упавшие аудиты и оптимизации видны по их статусам в разделах{' '}
          <Link to="/admin/audits" className="text-primary underline-offset-2 hover:underline">
            «Аудиты»
          </Link>{' '}
          и{' '}
          <Link to="/admin/sites" className="text-primary underline-offset-2 hover:underline">
            «Оптимизация сайтов»
          </Link>
          .
        </p>

        <NotCollectedNotice
          className="mb-6"
          title="Чего на этой странице больше нет"
          description="Эти показатели платформа не собирает, поэтому показывать их нечем — раньше на их месте стояли выдуманные значения:"
          items={[
            'uptime сервера, загрузка процессора, памяти и диска',
            'размер базы, число подключений и время отклика',
            'дата последнего бэкапа, статус брандмауэра и попытки входа',
          ]}
        />

        <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
          <CardContent className="p-0">
            <SystemSettingsPage />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SystemStatusPage;
