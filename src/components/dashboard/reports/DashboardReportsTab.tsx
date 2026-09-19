import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';

/**
 * Отчёты — это завершённые аудиты: по каждому можно получить выгрузку.
 * Раньше вкладка при любых обстоятельствах утверждала, что отчётов нет.
 */
const DashboardReportsTab: React.FC = () => {
  const navigate = useNavigate();
  const { summary, isLoading } = useDashboardSummary();

  const completed = summary.audits.filter((audit) => audit.status === 'completed');

  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
      <CardHeader>
        <CardTitle>Отчеты</CardTitle>
        <CardDescription>
          {completed.length > 0
            ? `Завершённых аудитов: ${completed.length}`
            : 'Отчёт появляется после завершения аудита'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : completed.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Пока нет завершённых аудитов</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Запустите аудит — по его результатам можно будет выгрузить отчёт.
            </p>
            <Button className="mt-4" onClick={() => navigate('/audit')}>
              Запустить аудит
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {completed.slice(0, 8).map((audit) => (
              <div
                key={audit.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{audit.url}</p>
                  <p className="text-xs text-muted-foreground">
                    {audit.completedAt
                      ? format(new Date(audit.completedAt), 'd MMMM yyyy', { locale: ru })
                      : 'дата завершения неизвестна'}
                    {audit.seoScore !== null && ` • балл ${audit.seoScore}/100`}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate('/audits')}>
                  Открыть
                </Button>
              </div>
            ))}
            {completed.length > 8 && (
              <Button variant="link" className="w-full" onClick={() => navigate('/audits')}>
                Показать все
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardReportsTab;
