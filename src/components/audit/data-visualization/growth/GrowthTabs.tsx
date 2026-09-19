import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart } from 'lucide-react';

/**
 * Вкладки сравнения. Показываем только те, по которым есть измерения:
 * пустая вкладка с нарисованным ростом хуже, чем её отсутствие.
 */
interface GrowthTabsProps {
  hasSeo: boolean;
  hasPerformance: boolean;
}

const GrowthTabs: React.FC<GrowthTabsProps> = ({ hasSeo, hasPerformance }) => {
  const count = 1 + (hasSeo ? 1 : 0) + (hasPerformance ? 1 : 0);
  // Классы Tailwind пишем целиком: собранное из переменной имя в сборку не попадёт.
  const columns = count === 3 ? 'grid-cols-3' : count === 2 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <TabsList className={`mb-6 grid max-w-md mx-auto ${columns}`}>
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span>Общий обзор</span>
      </TabsTrigger>
      {hasSeo && (
        <TabsTrigger value="seo" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          <span>SEO метрики</span>
        </TabsTrigger>
      )}
      {hasPerformance && (
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          <span>Производительность</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};

export default GrowthTabs;
