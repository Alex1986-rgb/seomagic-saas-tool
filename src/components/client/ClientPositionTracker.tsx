import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHistoricalData } from '@/services/position/positionHistory';
import type { KeywordPosition } from '@/services/position/positionTracker';

/**
 * Позиции сайта в поиске.
 *
 * Здесь были вписаны три запроса с позициями: «seo аудит» — 3-я (была 5-я),
 * «оптимизация сайта» — 7-я, «анализ сайта» — 12-я, со стрелками роста. Это
 * показывали любому вошедшему, в том числе тому, кто ни одной проверки не
 * запускал. Теперь берём последнюю настоящую проверку пользователя.
 */
const ClientPositionTracker: React.FC = () => {
  const [positions, setPositions] = useState<KeywordPosition[]>([]);
  const [domain, setDomain] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getHistoricalData()
      .then((history) => {
        if (cancelled) return;
        const last = history[0];
        setPositions(last?.keywords ?? []);
        setDomain(last?.domain ?? null);
        setCheckedAt(last?.timestamp ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось получить позиции');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const getTrendIcon = (current: number, previous?: number) => {
    if (previous === undefined) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold">Отслеживание позиций</h3>
          {domain && checkedAt && (
            <p className="text-xs text-muted-foreground">
              {domain}, проверка от {new Date(checkedAt).toLocaleDateString('ru-RU')}
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
          {error}
        </div>
      ) : positions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Проверок позиций пока не было. Запустите первую — результаты появятся здесь.
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
    </div>
  );
};

export default ClientPositionTracker;
