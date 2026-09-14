import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ArrowRight, BarChart2, ExternalLink, Globe, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDashboardSummary, type DashboardAudit } from '@/hooks/use-dashboard-summary';

/** Подпись об изменении за месяц: показываем, только когда есть что сравнивать. */
const MonthlyChange: React.FC<{ value: number | null; suffix?: string }> = ({ value, suffix = '' }) => {
  if (value === null || value === 0) {
    return <p className="text-xs text-muted-foreground mt-1">за последний месяц без изменений</p>;
  }
  const positive = value > 0;
  return (
    <div className="flex items-center mt-1">
      <Badge
        variant="outline"
        className={positive
          ? 'bg-green-500/10 text-green-500 border-green-500/20'
          : 'bg-destructive/10 text-destructive border-destructive/20'}
      >
        {positive ? '+' : ''}{value}{suffix}
      </Badge>
      <p className="text-xs text-muted-foreground ml-2">за последний месяц</p>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  children?: React.ReactNode;
  isLoading: boolean;
}> = ({ title, icon, value, children, isLoading }) => (
  <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {children}
        </>
      )}
    </CardContent>
  </Card>
);

const statusLabels: Record<string, string> = {
  pending: 'В ожидании',
  scanning: 'Сканирование',
  processing: 'Обработка',
  completed: 'Завершён',
  failed: 'Ошибка',
  cancelled: 'Отменён',
};

function scoreColor(score: number | null): string {
  if (score === null) return 'bg-muted-foreground/40';
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-destructive';
}

const AuditRow: React.FC<{ audit: DashboardAudit; onOpen: () => void }> = ({ audit, onOpen }) => {
  const when = audit.createdAt
    ? formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true, locale: ru })
    : 'дата неизвестна';

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/40 transition-colors">
      <div className={`w-2 h-10 rounded-full ${scoreColor(audit.seoScore)}`} />
      <div className="flex-1 space-y-1 min-w-0">
        <p className="text-sm font-medium leading-none flex items-center gap-2 truncate">
          <span className="truncate">{audit.url}</span>
          <Badge variant="outline" className="text-[10px] font-normal shrink-0">
            {statusLabels[audit.status] ?? audit.status}
          </Badge>
        </p>
        <p className="text-xs text-muted-foreground">
          {when}
          {audit.seoScore !== null && ` • балл ${audit.seoScore}/100`}
          {audit.pagesScanned ? ` • страниц: ${audit.pagesScanned}` : ''}
        </p>
      </div>
      <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 shrink-0" onClick={onOpen}>
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};

const DashboardOverviewTab: React.FC = () => {
  const navigate = useNavigate();
  const { summary, isLoading, error } = useDashboardSummary();

  const hasAudits = summary.totalAudits > 0;

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            Не удалось загрузить данные кабинета: {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего сканирований"
          icon={<Search className="h-4 w-4 text-primary" />}
          value={summary.totalAudits}
          isLoading={isLoading}
        >
          <MonthlyChange value={summary.auditsLastMonth || null} />
        </StatCard>

        <StatCard
          title="Средний SEO балл"
          icon={<Activity className="h-4 w-4 text-primary" />}
          value={summary.averageScore === null ? '—' : `${summary.averageScore}/100`}
          isLoading={isLoading}
        >
          <MonthlyChange value={summary.averageScoreChange} />
        </StatCard>

        <StatCard
          title="Проверок позиций"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          value={summary.positionChecks}
          isLoading={isLoading}
        >
          <MonthlyChange value={summary.positionChecksLastMonth || null} />
        </StatCard>

        <StatCard
          title="Сайтов"
          icon={<Globe className="h-4 w-4 text-primary" />}
          value={summary.sites.length}
          isLoading={isLoading}
        >
          <MonthlyChange value={summary.sitesLastMonth || null} />
        </StatCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle>Динамика SEO баллов</CardTitle>
            <CardDescription>
              {summary.scoreTrend.length > 1
                ? `По ${summary.scoreTrend.length} завершённым аудитам`
                : 'Появится, когда завершится хотя бы два аудита'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : summary.scoreTrend.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.scoreTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="dashboardScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} width={32} />
                    <Tooltip formatter={(value: number) => [`${value}/100`, 'Балл']} />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="url(#dashboardScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2 bg-muted/30 rounded-md">
                  <BarChart2 className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Данных для графика пока нет</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Последние сканирования</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/audits')}>
                Все
              </Button>
            </div>
            <CardDescription>
              {hasAudits ? 'Ваши последние аудиты' : 'Пока ни одного аудита'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : hasAudits ? (
              <div className="space-y-2">
                {summary.audits.slice(0, 3).map((audit) => (
                  <AuditRow key={audit.id} audit={audit} onOpen={() => navigate('/audits')} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Запустите первый аудит — здесь появятся его результаты.
                </p>
                <Button className="gap-2" onClick={() => navigate('/audit')}>
                  Запустить аудит
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverviewTab;
