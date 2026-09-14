import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Activity, ChartBar, RefreshCw, TrendingUp, Users } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

/**
 * Аналитика платформы.
 *
 * Раньше здесь стояли вписанные в код цифры: «3 842 аудита», «642 активных
 * пользователя», «доход за месяц ₽512 400», трафик по источникам, устройства и
 * города — ничего этого продукт не собирает и денег не принимает.
 *
 * Показываем то, что в базе действительно есть: аудиты, пользователей,
 * проверки позиций и задания оптимизации.
 */

interface PlatformStats {
  audits: number;
  users: number;
  positionChecks: number;
  optimizations: number;
  auditsByDay: { date: string; аудиты: number }[];
  statusBreakdown: { name: string; value: number }[];
  topSites: { site: string; аудиты: number }[];
}

const EMPTY: PlatformStats = {
  audits: 0,
  users: 0,
  positionChecks: 0,
  optimizations: 0,
  auditsByDay: [],
  statusBreakdown: [],
  topSites: [],
};

const STATUS_COLORS = ['#22c55e', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];

const statusLabels: Record<string, string> = {
  pending: 'В ожидании',
  scanning: 'Сканирование',
  processing: 'Обрабатывается',
  completed: 'Завершён',
  failed: 'Ошибка',
  cancelled: 'Отменён',
};

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [auditsResult, profilesResult, positionsResult, optimizationsResult] = await Promise.all([
        supabase.from('audits').select('url, status, created_at').order('created_at', { ascending: false }).limit(1000),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('position_checks').select('id', { count: 'exact', head: true }),
        supabase.from('optimization_jobs').select('id', { count: 'exact', head: true }),
      ]);

      if (auditsResult.error) throw auditsResult.error;
      const audits = auditsResult.data ?? [];

      // Аудиты по дням за последние две недели.
      const byDay = new Map<string, number>();
      for (let i = 13; i >= 0; i--) {
        const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        byDay.set(day.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }), 0);
      }
      for (const audit of audits) {
        if (!audit.created_at) continue;
        const key = new Date(audit.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
      }

      const statusCounts = new Map<string, number>();
      const siteCounts = new Map<string, number>();
      for (const audit of audits) {
        statusCounts.set(audit.status, (statusCounts.get(audit.status) ?? 0) + 1);
        const site = hostOf(audit.url);
        siteCounts.set(site, (siteCounts.get(site) ?? 0) + 1);
      }

      setStats({
        audits: audits.length,
        users: profilesResult.count ?? 0,
        positionChecks: positionsResult.count ?? 0,
        optimizations: optimizationsResult.count ?? 0,
        auditsByDay: [...byDay.entries()].map(([date, count]) => ({ date, аудиты: count })),
        statusBreakdown: [...statusCounts.entries()]
          .map(([status, value]) => ({ name: statusLabels[status] ?? status, value }))
          .sort((a, b) => b.value - a.value),
        topSites: [...siteCounts.entries()]
          .map(([site, count]) => ({ site, аудиты: count }))
          .sort((a, b) => b.аудиты - a.аудиты)
          .slice(0, 8),
      });
    } catch (err) {
      console.error('Не удалось загрузить аналитику платформы:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
      setStats(EMPTY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = [
    { label: 'Всего аудитов', value: stats.audits, icon: <ChartBar className="h-5 w-5 text-blue-600" /> },
    { label: 'Пользователей', value: stats.users, icon: <Users className="h-5 w-5 text-green-600" /> },
    { label: 'Проверок позиций', value: stats.positionChecks, icon: <TrendingUp className="h-5 w-5 text-purple-600" /> },
    { label: 'Заданий оптимизации', value: stats.optimizations, icon: <Activity className="h-5 w-5 text-orange-600" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Данные платформы из базы. Аналитика трафика и выручки не собирается.
        </p>
        <Button variant="outline" size="sm" className="gap-2" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Обновить
        </Button>
      </div>

      {error && <div className="text-sm text-destructive">Не удалось загрузить данные: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="shadow hover:shadow-md transition">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                {card.icon}
              </div>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <span className="text-2xl font-bold">{card.value}</span>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Аудиты по дням</CardTitle>
          <CardDescription>За последние две недели</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.auditsByDay}>
                <defs>
                  <linearGradient id="adminAudits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} width={32} />
                <Tooltip />
                <Area type="monotone" dataKey="аудиты" stroke="#8b5cf6" fill="url(#adminAudits)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Статусы аудитов</CardTitle>
            <CardDescription>Распределение по последним записям</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : stats.statusBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">Аудитов пока нет</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.statusBreakdown} dataKey="value" nameKey="name" outerRadius={100} label>
                    {stats.statusBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Чаще всего проверяют</CardTitle>
            <CardDescription>Сайты по числу аудитов</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : stats.topSites.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">Данных пока нет</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topSites} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="site" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="аудиты" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
