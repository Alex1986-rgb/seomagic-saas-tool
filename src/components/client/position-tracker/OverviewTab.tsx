
import React from 'react';
import { RefreshCw, BarChart2, ArrowUpRight } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PositionsDistributionChart, 
  SearchEngineDistribution,
  DailyActivityChart,
  TopKeywordsTable,
  StatCard
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
          icon={<ArrowUpRight className="h-4 w-4 text-green-500" />}
          description={stats.total ? `${Math.round((stats.top10 / stats.total) * 100)}%` : "0%"} 
        />
        <StatCard 
          title="В ТОП-30" 
          value={stats.top30} 
          icon={<ArrowUpRight className="h-4 w-4 text-amber-500" />}
          description={stats.total ? `${Math.round((stats.top30 / stats.total) * 100)}%` : "0%"} 
        />
        <StatCard 
          title="Не найдено" 
          value={stats.notFound} 
          icon={<ArrowUpRight className="h-4 w-4 text-red-500" />}
          description={stats.total ? `${Math.round((stats.notFound / stats.total) * 100)}%` : "0%"} 
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

export default OverviewTab;
