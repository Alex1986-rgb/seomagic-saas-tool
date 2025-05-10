
import React from 'react';
import { 
  generateRandomPageCount, 
  generateMockOptimizationItems, 
  calculateTotalCost,
  calculatePricingTiers
} from './mockOptimizationData';
import OptimizationCost from './OptimizationCost';

const DemonstrationCost: React.FC = () => {
  // Генерируем демонстрационные данные
  const pageCount = generateRandomPageCount();
  const optimizationItems = generateMockOptimizationItems(pageCount);
  const optimizationCost = calculateTotalCost(optimizationItems);
  const demoUrl = 'example.com';
  
  // Рассчитываем стоимость по тарифам
  const pricingTiers = calculatePricingTiers(pageCount, optimizationCost / pageCount);
  
  return (
    <div className="space-y-6">
      <OptimizationCost
        url={demoUrl}
        pageCount={pageCount}
        optimizationCost={optimizationCost}
        optimizationItems={optimizationItems}
      />
      
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Стоимость по тарифным планам:</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 bg-background rounded-lg border">
            <div className="text-sm text-muted-foreground">Начальный (до 3 стр.)</div>
            <div className="text-lg font-medium">{pricingTiers.basic.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div className="p-3 bg-background rounded-lg border">
            <div className="text-sm text-muted-foreground">Базовый (до 50 стр.)</div>
            <div className="text-lg font-medium">{pricingTiers.standard.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div className="p-3 bg-background rounded-lg border">
            <div className="text-sm text-muted-foreground">Стандарт (до 500 стр.)</div>
            <div className="text-lg font-medium">{pricingTiers.premium.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div className="p-3 bg-background rounded-lg border">
            <div className="text-sm text-muted-foreground">Корпоративный (от 1000 стр.)</div>
            <div className="text-lg font-medium">{pricingTiers.enterprise.toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemonstrationCost;
