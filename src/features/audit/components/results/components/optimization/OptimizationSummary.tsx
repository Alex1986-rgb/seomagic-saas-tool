
import React from 'react';

interface OptimizationSummaryProps {
  url: string;
}

const OptimizationSummary: React.FC<OptimizationSummaryProps> = ({ url }) => {
  return (
    <div className="my-4 p-3 bg-muted/30 rounded-lg">
      <div className="text-sm">
        <span className="font-medium">Сайт для оптимизации:</span> {url}
      </div>
      <div className="text-sm mt-1 text-muted-foreground">
        Выберите подходящий тарифный план в зависимости от размера сайта. 
        Чем больше страниц, тем выше скидка на оптимизацию.
      </div>
    </div>
  );
};

export default OptimizationSummary;
