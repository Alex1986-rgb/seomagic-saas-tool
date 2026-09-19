import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';

/**
 * Сайты пользователя.
 *
 * Отдельной сущности «проект» в продукте пока нет: сайт появляется здесь тогда,
 * когда по нему запущен аудит. Поэтому и кнопка ведёт на запуск аудита — раньше
 * она не делала ничего, а список состоял из трёх выдуманных доменов.
 */
const DashboardProjectsTab: React.FC = () => {
  const navigate = useNavigate();
  const { summary, isLoading } = useDashboardSummary();

  const auditsBySite = summary.audits.reduce<Record<string, number>>((acc, audit) => {
    let host = audit.url;
    try {
      host = new URL(audit.url).hostname.replace(/^www\./, '');
    } catch {
      // оставляем адрес как есть, если он не разбирается
    }
    acc[host] = (acc[host] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Сайты</CardTitle>
            <CardDescription>
              Сайты, по которым вы запускали аудит
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => navigate('/audit')}>
            Добавить сайт
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : summary.sites.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Здесь появятся сайты, по которым вы запустите аудит.
            </p>
            <Button onClick={() => navigate('/audit')}>Запустить первый аудит</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {summary.sites.map((site) => (
              <div
                key={site}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{site}</p>
                    <p className="text-xs text-muted-foreground">
                      аудитов: {auditsBySite[site] ?? 0}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/audits')}>
                  История
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardProjectsTab;
