import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Оптимизированные сайты.
 *
 * Страница была полностью бутафорской: список сайтов хранился в браузере
 * администратора и начинался с трёх вымышленных (example.com — 92 балла,
 * mysite.ru — 87). Добавление сайта через пять секунд объявляло «Оптимизация
 * завершена» и ставило случайную оценку от 80 до 99, а кнопка «Опубликовать на
 * Beget» через три секунды выдавала адрес вида opt-example-com.beget.tech, по
 * которому ничего не публиковалось. По такому экрану можно было отчитаться
 * клиенту за работу, которой не было.
 *
 * Теперь показываем настоящие задания оптимизации из базы.
 */

interface JobRow {
  id: string;
  status: string;
  cost: number | null;
  created_at: string;
  result_data: Record<string, unknown> | null;
  audit_tasks: { url: string } | null;
}

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  completed: { text: 'Выполнено', className: 'bg-green-500/10 text-green-600' },
  partial: { text: 'Частично', className: 'bg-amber-500/10 text-amber-600' },
  estimated: { text: 'Смета посчитана', className: 'bg-blue-500/10 text-blue-600' },
  processing: { text: 'В работе', className: 'bg-blue-500/10 text-blue-600' },
  queued: { text: 'В очереди', className: 'bg-muted text-muted-foreground' },
  failed: { text: 'Ошибка', className: 'bg-red-500/10 text-red-600' },
};

const SitesPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('optimization_jobs')
      .select('id, status, cost, created_at, result_data, audit_tasks!inner(url)')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else setJobs((data ?? []) as unknown as JobRow[]);
        setIsLoading(false);
      });
  }, []);

  const pagesOf = (job: JobRow): number => {
    const result = job.result_data ?? {};
    return Number(result.processed ?? result.optimized_pages ?? 0);
  };

  return (
    <>
      <PageSeo
        title="Оптимизированные сайты: задания и их результаты"
        description="Список запущенных оптимизаций: какой сайт, когда, сколько страниц переписано и во сколько обошлась работа языковой модели."
        noindex
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Оптимизация сайтов</h1>
          <p className="text-sm text-muted-foreground">
            Задания, запущенные пользователями. Сборка исправленной копии сайта пока не
            реализована — оптимизация переписывает тексты страниц.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Загружаем задания...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            Не удалось получить задания: {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Оптимизаций пока не запускали.
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => {
              const status = STATUS_LABELS[job.status] ?? {
                text: job.status,
                className: 'bg-muted text-muted-foreground',
              };

              return (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle className="text-base break-all">
                        {job.audit_tasks?.url ?? 'Сайт не указан'}
                      </CardTitle>
                      <Badge variant="outline" className={status.className}>{status.text}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground">Дата</p>
                        <p className="font-medium">
                          {new Date(job.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Страниц переписано</p>
                        <p className="font-medium">{pagesOf(job)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {job.status === 'estimated' ? 'Смета' : 'Расход'}
                        </p>
                        <p className="font-medium">
                          {Number(job.cost ?? 0).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SitesPage;
