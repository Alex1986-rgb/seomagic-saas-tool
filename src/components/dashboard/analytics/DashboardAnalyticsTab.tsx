import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BarChart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';

/**
 * Аналитика по сайтам: средний балл и число аудитов на каждый сайт.
 * Раньше вкладка всегда показывала «нет данных», даже когда аудиты были.
 */
const DashboardAnalyticsTab: React.FC = () => {
  const navigate = useNavigate();
  const { summary, isLoading } = useDashboardSummary();

  const perSite = summary.sites
    .map((site) => {
      const auditsOfSite = summary.audits.filter((audit) => {
        try {
          return new URL(audit.url).hostname.replace(/^www\./, '') === site;
        } catch {
          return audit.url === site;
        }
      });
      const scored = auditsOfSite.filter((a) => typeof a.seoScore === 'number');
      return {
        site,
        audits: auditsOfSite.length,
        score: scored.length
          ? Math.round(scored.reduce((sum, a) => sum + (a.seoScore as number), 0) / scored.length)
          : 0,
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Аналитика
        </CardTitle>
        <CardDescription>
          {perSite.length > 0 ? 'Средний SEO балл по вашим сайтам' : 'Детальная аналитика ваших сайтов'}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px]">
        {isLoading ? (
          <Skeleton className="h-[360px] w-full" />
        ) : perSite.length === 0 ? (
          <div className="h-[360px] flex items-center justify-center">
            <div className="text-center max-w-md p-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary/80" />
              </div>
              <h3 className="text-xl font-medium mb-3">Нет доступных данных</h3>
              <p className="text-muted-foreground mb-6">
                Запустите аудит сайта — здесь появится сравнение ваших сайтов по SEO баллу.
              </p>
              <Button className="px-6 gap-2 shadow-md hover:shadow-lg" onClick={() => navigate('/audit')}>
                Запустить аудит
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={perSite} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="site" tick={{ fontSize: 11 }} tickLine={false} interval={0} angle={-15} height={50} textAnchor="end" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} width={32} />
                  <Tooltip formatter={(value: number) => [`${value}/100`, 'Средний балл']} />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-muted-foreground">
              Всего аудитов: {summary.totalAudits}
              {summary.averageScore !== null && ` • средний балл по всем сайтам: ${summary.averageScore}/100`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsTab;
