
import React from 'react';

interface CostSummaryProps {
  pageCount: number;
  optimizationCost: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({ pageCount, optimizationCost }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  // Рассчитываем примерную стоимость за страницу
  const costPerPage = pageCount > 0 ? Math.round(optimizationCost / pageCount) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div className="bg-primary/10 p-3 rounded-lg">
        <div className="text-sm text-muted-foreground">Количество страниц</div>
        <div className="text-xl font-semibold">{formatNumber(pageCount)}</div>
      </div>
      
      <div className="bg-primary/10 p-3 rounded-lg">
        <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
        <div className="text-xl font-semibold">{formatNumber(costPerPage)} ₽</div>
        <div className="text-xs text-muted-foreground">(среднее значение)</div>
      </div>
      
      <div className="bg-primary/10 p-3 rounded-lg">
        <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
        <div className="text-xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
      </div>
    </div>
  );
};

export default CostSummary;
