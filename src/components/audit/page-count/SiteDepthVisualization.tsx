
import React from 'react';
import { Layers, Globe } from 'lucide-react';
import { PageStatistics } from './types';

interface SiteDepthVisualizationProps {
  pageStats: PageStatistics;
}

const SiteDepthVisualization: React.FC<SiteDepthVisualizationProps> = ({ pageStats }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (!pageStats.levels || Object.keys(pageStats.levels).length === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
      <div className="flex items-center mb-2">
        <Layers className="h-4 w-4 text-primary mr-2" />
        <h4 className="text-sm font-medium">Глубина сайта</h4>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
        {Object.entries(pageStats.levels)
          .filter(([, count]) => count > 0)
          .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Сортировка по уровням
          .map(([level, count]) => (
            <div key={level} className="flex justify-between text-xs bg-background/50 p-2 rounded border border-border">
              <span className="font-medium">Уровень {level}:</span>
              <span>{formatNumber(count)} стр.</span>
            </div>
          ))
        }
      </div>
      
      <div className="mt-2 flex items-center">
        <Globe className="h-3 w-3 text-muted-foreground mr-1" />
        <p className="text-xs text-muted-foreground">
          Глубина сайта - количество ссылок от главной страницы до целевых страниц
        </p>
      </div>
    </div>
  );
};

export default SiteDepthVisualization;
