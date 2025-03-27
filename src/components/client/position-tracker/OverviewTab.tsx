
import React from 'react';
import { Card } from '@/components/ui/card';
import { PositionData } from '@/services/position/positionTracker';
import { 
  StatsOverview, 
  PositionsDistributionChart, 
  SearchEngineDistribution, 
  DailyActivityChart 
} from '@/components/position-tracker/analytics';

interface OverviewTabProps {
  history: PositionData[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ history }) => {
  return (
    <div className="space-y-6">
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
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Динамика проверок</h3>
        <DailyActivityChart history={history} />
      </Card>
    </div>
  );
};

export default OverviewTab;
