
import React from 'react';

interface CostSummaryProps {
  pageCount: number;
  optimizationCost: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({ pageCount, optimizationCost }) => {
  // Format number with spaces as thousand separators (Russian format)
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  // Calculate average cost per page
  const costPerPage = pageCount > 0 ? optimizationCost / pageCount : 0;

  return (
    <div className="mt-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Страниц для анализа</div>
          <div className="text-2xl font-semibold">{formatNumber(pageCount)}</div>
        </div>
        
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
          <div className="text-2xl font-semibold">{formatNumber(Math.round(costPerPage))} ₽</div>
        </div>
        
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
          <div className="text-2xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        В стоимость входят все работы по технической оптимизации, оптимизации контента и мета-тегов.
        Чем больше страниц на сайте, тем выше скидка на оптимизацию!
      </p>
    </div>
  );
};

export default CostSummary;
