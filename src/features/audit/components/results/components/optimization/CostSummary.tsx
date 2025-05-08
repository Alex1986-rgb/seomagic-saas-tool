
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CostSummaryProps {
  pageCount: number;
  optimizationCost: number;
  discount?: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({ 
  pageCount, 
  optimizationCost, 
  discount 
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  const pricePerPage = pageCount ? Math.round(optimizationCost / pageCount) : 0;
  
  return (
    <Card className="mb-4 bg-muted/30">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-2">
            <div className="text-sm text-muted-foreground mb-1">Количество страниц</div>
            <div className="text-2xl font-bold">{formatNumber(pageCount)}</div>
          </div>
          
          <div className="text-center p-2">
            <div className="text-sm text-muted-foreground mb-1">Цена за страницу</div>
            <div className="text-2xl font-bold">{formatNumber(pricePerPage)} ₽</div>
          </div>
          
          <div className="text-center p-2">
            <div className="text-sm text-muted-foreground mb-1">Итоговая стоимость</div>
            <div className="text-2xl font-bold text-primary">{formatNumber(optimizationCost)} ₽</div>
            {discount && (
              <div className="text-xs text-green-500">Скидка {discount}%</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
