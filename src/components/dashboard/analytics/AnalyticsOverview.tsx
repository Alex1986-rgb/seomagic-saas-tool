import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart2, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsOverviewProps {
  projectId: string;
}

export const AnalyticsOverview = ({ projectId }: AnalyticsOverviewProps) => {
  const { data, isLoading, fetchAnalyticsData } = useAnalyticsData();

  useEffect(() => {
    if (projectId) {
      fetchAnalyticsData(projectId);
    }
  }, [projectId, fetchAnalyticsData]);

  const handleRefresh = () => {
    if (projectId) {
      fetchAnalyticsData(projectId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Нет доступных данных аналитики
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Аналитика проекта</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Обновить анализ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Общий рейтинг SEO"
          value={`${data.seoScore}/100`}
          increase="+12%"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Проверенные страницы"
          value={data.pagesScanned.toLocaleString()}
          increase="+8%"
          icon={<BarChart2 className="h-4 w-4" />}
        />
        <StatCard
          title="Отслеживаемые позиции"
          value={data.positionsTracked.toLocaleString()}
          increase="+24%"
          icon={<LineChart className="h-4 w-4" />}
        />
        <StatCard
          title="Активные пользователи"
          value={data.activeUsers.toLocaleString()}
          increase="+18%"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Тренд SEO оценок</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение оценок</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  increase: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, increase, icon }: StatCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        <span className="text-sm text-green-500">{increase}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </CardContent>
  </Card>
);
