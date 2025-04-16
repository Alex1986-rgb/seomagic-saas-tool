
import React from 'react';

interface EstimateStatsProps {
  errors: number;
  warnings: number;
  timeToFix: string;
}

const EstimateStats: React.FC<EstimateStatsProps> = ({ errors, warnings, timeToFix }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-secondary/20 p-3 rounded-md">
        <div className="text-sm text-muted-foreground">Обнаружено ошибок</div>
        <div className="text-xl font-semibold text-destructive">{errors}</div>
      </div>
      
      <div className="bg-secondary/20 p-3 rounded-md">
        <div className="text-sm text-muted-foreground">Предупреждений</div>
        <div className="text-xl font-semibold text-amber-500">{warnings}</div>
      </div>
      
      <div className="bg-secondary/20 p-3 rounded-md">
        <div className="text-sm text-muted-foreground">Время на исправление</div>
        <div className="text-xl font-semibold">{timeToFix}</div>
      </div>
    </div>
  );
};

export default EstimateStats;
