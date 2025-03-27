
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/position-tracker/analytics/StatCard';
import { TopKeywordsTable, RankingDistribution } from '@/components/position-tracker/analytics';
import { Search, BarChart, TrendingUp } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';

interface KeywordsTabProps {
  history: PositionData[];
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Отслеживаемые ключевые слова"
          value="34"
          description="За последние 30 дней"
          icon={<Search className="h-5 w-5" />}
          trend="+5"
          trendType="up"
        />
        <StatCard
          title="Средняя позиция"
          value="12.4"
          description="За последние 30 дней"
          icon={<BarChart className="h-5 w-5" />}
          trend="-2.3"
          trendType="up"
        />
        <StatCard
          title="Ключевых слов в ТОП-10"
          value="18"
          description="За последние 30 дней"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+3"
          trendType="up"
        />
      </div>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Топ ключевых слов</h3>
          <Button variant="outline" size="sm">Экспорт</Button>
        </div>
        <TopKeywordsTable history={history} />
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Распределение по рангам</h3>
        <RankingDistribution history={history} />
      </Card>
    </div>
  );
};

export default KeywordsTab;
