
import React from 'react';

interface CostSummaryProps {
  pageCount: number;
  optimizationCost: number;
  discount?: number; 
}

const CostSummary: React.FC<CostSummaryProps> = ({ pageCount, optimizationCost, discount = 0 }) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  // Рассчитываем стоимость за страницу (средняя)
  const costPerPage = pageCount > 0 ? Math.round(optimizationCost / pageCount) : 0;

  // Определение применяемой скидки в зависимости от количества страниц
  const getDiscountPercentage = (pages: number): number => {
    if (pages >= 1000) return 80;
    if (pages >= 500) return 50;
    if (pages >= 50) return 20;
    return 0;
  };

  const discountPercentage = discount || getDiscountPercentage(pageCount);
  const originalCost = discountPercentage > 0 ? 
    Math.round(optimizationCost / (1 - discountPercentage / 100)) : optimizationCost;
  const discountAmount = originalCost - optimizationCost;

  return (
    <div className="mt-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Страниц для оптимизации</div>
          <div className="text-2xl font-semibold">{formatNumber(pageCount)}</div>
        </div>
        
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
          <div className="text-2xl font-semibold">{formatNumber(costPerPage)} ₽</div>
        </div>
        
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
          <div className="text-2xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
        </div>
      </div>
      
      {discountPercentage > 0 && (
        <div className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg mb-4">
          <div>
            <span className="font-medium">Применена скидка {discountPercentage}%</span>
            <p className="text-sm">Стандартная цена: {formatNumber(originalCost)} ₽</p>
          </div>
          <div className="text-lg font-bold">
            Экономия: {formatNumber(discountAmount)} ₽
          </div>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        В стоимость входят все работы по технической оптимизации, оптимизации контента и мета-тегов.
        Чем больше страниц на сайте, тем выше скидка на оптимизацию!
      </p>
    </div>
  );
};

export default CostSummary;
