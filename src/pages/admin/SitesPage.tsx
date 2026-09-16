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
 *
 * Из result_data берём только нужные ключи. Раньше выбирался весь объект, а
 * в нём у выполненного задания лежит `improvements` — ответы модели по
 * каждой странице, так что сотня заданий тянула мегабайты текста ради двух
 * чисел.
 *
 * Колонка «Расход» раньше выводила `cost` в рублях, но у запущенных
 * оптимизаций это поле всегда 0: optimization-start создаёт задание с
 * cost: 0, а optimization-processor кладёт расход модели в
 * result_data.llm_cost_usd — в долларах, оценкой по токенам. В рублях в
 * cost лежит только смета (status = 'estimated'). Показываем каждое число
 * там, где оно действительно записано.
 */

type JsonScalar = string | number | boolean | null;

interface JobRow {
  id: string;
  status: string;
  cost: number | null;
  created_at: string | null;
  /** result_data->processed — счётчик по ходу обработки. */
  processed: JsonScalar;
  /** result_data->optimized_pages — итог выполненного задания. */
  optimized_pages: JsonScalar;
  /** result_data->llm_cost_usd — оценка расхода модели по токенам, USD. */
  llm_cost_usd: JsonScalar;
  /** result_data->total_tokens — сколько токенов вернула модель. */
  total_tokens: JsonScalar;
  audit_tasks: { url: string } | null;
}

/** Число из JSON-поля или null, если значения нет. */
function jsonNumber(value: JsonScalar): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const usdFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  completed: { text: 'Выполнено', className: 'bg-green-500/10 text-green-600' },
  partial: { text: 'Частично', className: 'bg-amber-500/10 text-amber-600' },
  estimated: { text: 'Смета посчитана', className: 'bg-blue-500/10 text-blue-600' },
  processing: { text: 'В работе', className: 'bg-blue-500/10 text-blue-600' },
  queued: { text: 'В очереди', className: 'bg-muted text-muted-foreground' },
  failed: { text: 'Ошибка', className: 'bg-red-500/10 text-red-600' },
};

/**
 * Из result_data берём только четыре числа, а не весь объект с текстами
 * переписанных страниц. Строка объявлена как string: разбирать JSON-пути в
 * типах postgrest-js не умеет и уходит в бесконечную глубину.
 */
const JOB_COLUMNS: string =
  'id, status, cost, created_at, processed:result_data->processed, optimized_pages:result_data->optimized_pages, llm_cost_usd:result_data->llm_cost_usd, total_tokens:result_data->total_tokens, audit_tasks!inner(url)';

const SitesPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('optimization_jobs')
      .select(JOB_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else setJobs((data ?? []) as unknown as JobRow[]);
        setIsLoading(false);
      });
  }, []);

  const pagesOf = (job: JobRow): number =>
    jsonNumber(job.processed) ?? jsonNumber(job.optimized_pages) ?? 0;

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
              const llmCost = jsonNumber(job.llm_cost_usd);
              const tokens = jsonNumber(job.total_tokens);

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
                          {job.created_at ? new Date(job.created_at).toLocaleDateString('ru-RU') : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Страниц переписано</p>
                        <p className="font-medium">{pagesOf(job)}</p>
                      </div>
                      {job.status === 'estimated' ? (
                        <div>
                          <p className="text-muted-foreground">Смета</p>
                          <p className="font-medium">
                            {job.cost !== null ? `${Number(job.cost).toLocaleString('ru-RU')} ₽` : 'не посчитана'}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground">Расход модели (оценка по токенам)</p>
                          <p className="font-medium">
                            {llmCost !== null ? usdFormatter.format(llmCost) : 'не посчитан'}
                          </p>
                          {llmCost !== null && tokens !== null && (
                            <p className="text-xs text-muted-foreground">
                              {tokens.toLocaleString('ru-RU')} токенов
                            </p>
                          )}
                        </div>
                      )}
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
