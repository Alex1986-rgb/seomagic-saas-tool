
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart as LineChartIcon, PieChart, FileBarChart } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';
import { PositionsDistributionChart } from './PositionsDistributionChart';
import { DailyActivityChart } from './DailyActivityChart';
import { SearchEngineDistribution } from './SearchEngineDistribution';
import { TopKeywordsTable } from './TopKeywordsTable';

interface AnalyticsTabsProps {
  history: PositionData[];
}

export const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ history }) => {
  return (
    <Tabs defaultValue="positions">
      <TabsList className="mb-4">
        <TabsTrigger value="positions" className="flex items-center gap-1">
          <LineChartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Распределение позиций</span>
          <span className="sm:hidden">Позиции</span>
        </TabsTrigger>
        <TabsTrigger value="engines" className="flex items-center gap-1">
          <PieChart className="h-4 w-4" />
          <span className="hidden sm:inline">Поисковые системы</span>
          <span className="sm:hidden">Поисковики</span>
        </TabsTrigger>
        <TabsTrigger value="keywords" className="flex items-center gap-1">
          <FileBarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Топ ключевых слов</span>
          <span className="sm:hidden">Ключевые</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="positions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PositionsDistributionChart history={history} />
          <DailyActivityChart history={history} />
        </div>
      </TabsContent>

      <TabsContent value="engines">
        <SearchEngineDistribution history={history} />
      </TabsContent>

      <TabsContent value="keywords">
        <TopKeywordsTable history={history} />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
