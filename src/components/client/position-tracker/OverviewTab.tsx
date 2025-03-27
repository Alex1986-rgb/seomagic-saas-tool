
import React from 'react';
import { RefreshCw, BarChart2, ArrowUpRight } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PositionsDistributionChart, 
  SearchEngineDistribution,
  DailyActivityChart,
  TopKeywordsTable
} from '@/components/position-tracker/analytics';

interface OverviewTabProps {
  history: PositionData[];
  isLoading: boolean;
  onRefresh: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ history, isLoading, onRefresh }) => {
  // Calculate statistics
  const calculateStats = () => {
    if (!history.length) return { total: 0, top10: 0, top30: 0, notFound: 0 };
    
    let total = 0, top10 = 0, top30 = 0, notFound = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        total++;
        if (keyword.position === 0) {
          notFound++;
        } else if (keyword.position <= 10) {
          top10++;
          top30++;
        } else if (keyword.position <= 30) {
          top30++;
        }
      });
    });
    
    return { total, top10, top30, notFound };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Обзор позиций сайта</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Всего запросов" 
          value={stats.total} 
          icon={<BarChart2 className="h-4 w-4 text-blue-500" />} 
        />
        <StatCard 
          title="В ТОП-10" 
          value={stats.top10} 
          percentage={stats.total ? Math.round((stats.top10 / stats.total) * 100) : 0}
          status="success" 
        />
        <StatCard 
          title="В ТОП-30" 
          value={stats.top30} 
          percentage={stats.total ? Math.round((stats.top30 / stats.total) * 100) : 0}
          status="warning" 
        />
        <StatCard 
          title="Не найдено" 
          value={stats.notFound} 
          percentage={stats.total ? Math.round((stats.notFound / stats.total) * 100) : 0}
          status="error" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PositionsDistributionChart history={history} />
        <DailyActivityChart history={history} />
      </div>
      
      <SearchEngineDistribution history={history} />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Топ ключевые слова</h3>
          <Button variant="link" size="sm" className="gap-1" onClick={() => window.location.href = "/position-analytics"}>
            Подробная аналитика
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <TopKeywordsTable history={history} limit={5} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, percentage, status, icon }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          {icon ? icon : (
            <div className={`p-2 rounded-full bg-${status === 'success' ? 'green' : status === 'warning' ? 'amber' : status === 'error' ? 'red' : 'blue'}-100`}>
              <ArrowUpRight className={`h-4 w-4 text-${status === 'success' ? 'green' : status === 'warning' ? 'amber' : status === 'error' ? 'red' : 'blue'}-500`} />
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline mt-1">
          <h2 className="text-2xl font-bold">{value}</h2>
          {percentage !== undefined && (
            <span className="ml-2 text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
