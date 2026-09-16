import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { KeywordPosition } from '@/services/position/positionTracker';

/**
 * Позиции сайта в поиске.
 *
 * Здесь были вписаны три запроса с позициями: «seo аудит» — 3-я (была 5-я),
 * «оптимизация сайта» — 7-я, «анализ сайта» — 12-я, со стрелками роста. Это
 * показывали любому вошедшему, в том числе тому, кто ни одной проверки не
 * запускал. Теперь берём настоящие проверки пользователя.
 *
 * Потом выяснилось, что брать просто самую свежую проверку нельзя: у идущей
 * или упавшей проверки результатов нет, и вкладка писала «Проверок пока не
 * было», хотя вчерашняя готовая проверка есть. Ошибку запроса общий сервис
 * истории глотал и возвращал пустой список — выходило то же сообщение. Поэтому
 * читаем проверки здесь: результаты — из последней завершённой, о свежей
 * идущей или упавшей говорим отдельно, ошибку показываем как ошибку.
 */

interface CheckRow {
  id: string;
  domain: string;
  status: string;
  error: string | null;
  created_at: string;
  keywords_total: number;
  keywords_checked: number;
}

/** Статусы, у которых есть результаты: 'partial' — часть запросов не проверилась. */
const FINISHED_STATUSES = ['completed', 'partial'];
/** Сколько последних проверок просматриваем в поисках завершённой. */
const CHECKS_LIMIT = 20;

const formatDate = (value: string) => new Date(value).toLocaleDateString('ru-RU');

const ClientPositionTracker: React.FC = () => {
  const { user } = useAuth();
  const userId = user.user?.id;

  const [positions, setPositions] = useState<KeywordPosition[]>([]);
  const [finishedCheck, setFinishedCheck] = useState<CheckRow | null>(null);
  const [latestCheck, setLatestCheck] = useState<CheckRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const load = async () => {
      // Фильтр по user_id явный: администратор по политике видит проверки всех.
      const { data: checks, error: checksError } = await supabase
        .from('position_checks')
        .select('id, domain, status, error, created_at, keywords_total, keywords_checked')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(CHECKS_LIMIT);
      if (checksError) throw checksError;

      const rows = (checks ?? []) as CheckRow[];
      const latest = rows[0] ?? null;
      const finished = rows.find((row) => FINISHED_STATUSES.includes(row.status)) ?? null;

      let keywords: KeywordPosition[] = [];
      if (finished) {
        const { data: results, error: resultsError } = await supabase
          .from('position_results')
          .select('keyword, search_engine, position, previous_position, url, search_url, checked_at')
          .eq('check_id', finished.id);
        if (resultsError) throw resultsError;

        keywords = (results ?? []).map((row) => ({
          keyword: row.keyword,
          position: row.position,
          previousPosition: row.previous_position ?? undefined,
          url: row.url ?? undefined,
          searchEngine: row.search_engine,
          searchUrl: row.search_url ?? undefined,
          lastChecked: row.checked_at,
        }));
      }

      if (cancelled) return;
      setLatestCheck(latest);
      setFinishedCheck(finished);
      setPositions(keywords);
    };

    load()
      .catch((err) => {
        if (cancelled) return;
        console.error('Не удалось получить позиции:', err);
        setError(err instanceof Error ? err.message : 'Не удалось получить позиции');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  const getTrendIcon = (current: number, previous?: number) => {
    if (previous === undefined) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  // Свежая проверка ещё идёт или упала — это важнее старых результатов.
  const latestIsNewer = latestCheck && latestCheck.id !== finishedCheck?.id;
  const latestRunning = latestIsNewer && latestCheck.status === 'running';
  const latestFailed = latestIsNewer && latestCheck.status === 'failed';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold">Отслеживание позиций</h3>
          {finishedCheck && (
            <p className="text-xs text-muted-foreground">
              {finishedCheck.domain}, проверка от {formatDate(finishedCheck.created_at)}
              {finishedCheck.status === 'partial' ? ' (проверены не все запросы)' : ''}
            </p>
          )}
        </div>
        <Link to="/position-tracker">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Проверить позиции
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Загружаем последнюю проверку...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Не удалось получить позиции: {error}
        </div>
      ) : (
        <>
          {latestRunning && (
            <div className="flex items-center gap-2 rounded-lg border p-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>
                Идёт проверка {latestCheck.domain} от {formatDate(latestCheck.created_at)}
                {latestCheck.keywords_total > 0
                  ? `: проверено ${latestCheck.keywords_checked} из ${latestCheck.keywords_total} запросов`
                  : ''}
                . Результаты появятся здесь, когда она закончится.
              </span>
            </div>
          )}

          {latestFailed && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
              <span>
                Последняя проверка {latestCheck.domain} от {formatDate(latestCheck.created_at)} не удалась
                {latestCheck.error ? `: ${latestCheck.error}` : '.'}
              </span>
            </div>
          )}

          {!latestCheck ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Проверок позиций пока не было. Запустите первую — результаты появятся здесь.
            </div>
          ) : !finishedCheck ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Завершённых проверок пока нет.
            </div>
          ) : positions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              В проверке от {formatDate(finishedCheck.created_at)} нет сохранённых результатов.
            </div>
          ) : (
            <div className="grid gap-4">
              {positions.map((item) => (
                <Card key={`${item.searchEngine}:${item.keyword}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm md:text-base">{item.keyword}</p>
                        <p className="text-xs text-muted-foreground">{item.searchEngine}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {item.position > 0 ? item.position : 'не найден'}
                          </span>
                          {item.position > 0 && getTrendIcon(item.position, item.previousPosition)}
                        </div>
                        <p className="text-xs text-muted-foreground">позиция</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientPositionTracker;
