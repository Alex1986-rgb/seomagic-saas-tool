import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import NotCollectedNotice from "@/components/admin/NotCollectedNotice";
import { useApiActivity } from "@/hooks/use-api-activity";
import PageSeo from '@/components/seo/PageSeo';

/**
 * Журнал событий.
 *
 * Здесь был вписанный в код «журнал»: «Failed to connect to database», «High
 * CPU usage detected», «Backup completed successfully» с датами апреля 2025,
 * фильтр по уровню, поиск и кнопка «Экспорт логов», которые ни к чему не были
 * подключены. Владелец мог принять выдуманную ошибку базы за настоящую.
 *
 * Отдельного журнала событий платформа не ведёт. Единственное, что реально
 * пишется, — вызовы части edge-функций в таблицу api_logs (запуск аудита и
 * оптимизации, очистка данных); их и показываем. Журнал неполный, поэтому
 * пустой список не означает «ошибок не было».
 */

const formatDateTime = (value: string | null): string =>
  value ? new Date(value).toLocaleString('ru-RU') : '—';

const LogSettingsPage = () => {
  const { recent, isLoading, error, refetch } = useApiActivity();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <PageSeo
        title="Журнал событий: последние вызовы серверных функций"
        description="Что реально записывается в журнал платформы: последние вызовы серверных функций с кодом ответа и длительностью."
        noindex
      />
      <h2 className="text-2xl font-bold mb-3">Логирование событий</h2>

      <NotCollectedNotice
        className="mb-6"
        title="Отдельного журнала событий нет"
        description="Записи, фильтры и экспорт, которые здесь были, выдуманы. Что есть на самом деле:"
        items={[
          "часть серверных функций (запуск аудита и оптимизации, очистка данных) записывает вызовы в таблицу api_logs — последние показаны ниже; остальные функции туда не пишут",
          "подробные логи функций (текст ошибок, вывод console) — в панели Supabase, раздел Edge Functions → Logs",
          "уровни логирования, ротация и экспорт из админки не настраиваются",
        ]}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-medium">Последние записи журнала за сутки</h3>
            <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Обновить
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Читаем журнал вызовов...
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">Не удалось прочитать журнал вызовов: {error}</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              За последние сутки записей в журнале нет. Это не значит, что ошибок не было: пишут
              сюда не все функции.
            </p>
          ) : (
            <div className="space-y-2">
              {recent.map((row, index) => {
                const isError = row.status_code !== null && row.status_code >= 400;
                return (
                  <div
                    key={`${row.created_at ?? ''}-${row.function_name}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium break-all">{row.function_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(row.created_at)}
                        {row.duration_ms !== null ? ` · ${row.duration_ms} мс` : ''}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        isError ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {row.status_code ?? 'без кода'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground">
            Графики вызовов и ошибок по часам — на странице{' '}
            <Link to="/admin/monitoring" className="text-primary hover:underline">
              мониторинга
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogSettingsPage;
