
import React from 'react';
import { Card } from '@/components/ui/card';
import { PositionData } from '@/services/position/positionTracker';
import { 
  StatsOverview, 
  PositionsDistributionChart, 
  SearchEngineDistribution, 
  DailyActivityChart,
  TopKeywordsTable,
  RankingDistribution
} from '@/components/position-tracker/analytics';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface OverviewTabProps {
  history: PositionData[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  history, 
  isLoading = false,
  onRefresh 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Обзор позиций</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Экспорт отчета</span>
          </Button>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </Button>
          )}
        </div>
      </div>

      <StatsOverview history={history} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Распределение позиций</h3>
          <PositionsDistributionChart history={history} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Распределение по поисковым системам</h3>
          <SearchEngineDistribution history={history} />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Рейтинг ключевых слов</h3>
          <TopKeywordsTable history={history} limit={5} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Распределение рейтинга</h3>
          <RankingDistribution history={history} />
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Динамика проверок</h3>
        <DailyActivityChart history={history} />
      </Card>
    </div>
  );
};

export default OverviewTab;
