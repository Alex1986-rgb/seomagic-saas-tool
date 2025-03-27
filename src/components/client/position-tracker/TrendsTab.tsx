
import React from 'react';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/position-tracker/analytics/StatCard';
import { KeywordPositionTrend } from '@/components/position-tracker/analytics';
import { BarChart, TrendingUp } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';

interface TrendsTabProps {
  history: PositionData[];
}

const TrendsTab: React.FC<TrendsTabProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Изменение за 30 дней"
          value="+8.3"
          description="Улучшение средней позиции"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+12%"
          trendType="up"
        />
        <StatCard
          title="Топ растущие ключи"
          value="7"
          description="Ключевые слова с ростом"
          icon={<BarChart className="h-5 w-5" />}
          trend="+2"
          trendType="up"
        />
        <StatCard
          title="Снижающиеся ключи"
          value="3"
          description="Ключевые слова со снижением"
          icon={<BarChart className="h-5 w-5" />}
          trend="-1"
          trendType="down"
        />
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Тренд ключевого слова</h3>
        <KeywordPositionTrend history={history} />
      </Card>
    </div>
  );
};

export default TrendsTab;
