
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface OptimizationPlanProps {
  title: string;
  price: number;
  features: string[];
  recommended?: boolean;
  onSelect: (plan: string) => void;
}

const OptimizationPlan: React.FC<OptimizationPlanProps> = ({
  title,
  price,
  features,
  recommended,
  onSelect
}) => {
  return (
    <Card className={`h-full flex flex-col ${recommended ? 'border-primary shadow-lg' : 'border-border'}`}>
      {recommended && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-xs font-medium">
          Рекомендуемый план
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <span>{title}</span>
          <span className="text-3xl font-bold">{price.toLocaleString('ru-RU')} ₽</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-2 mb-6 flex-1">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="rounded-full bg-primary/20 p-1 mr-2">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <Button 
          variant={recommended ? "default" : "outline"} 
          className="w-full mt-auto" 
          onClick={() => onSelect(title.toLowerCase())}
        >
          Выбрать план
        </Button>
      </CardContent>
    </Card>
  );
};

const OptimizationPlans: React.FC<{
  onSelectPlan: (plan: string) => void;
}> = ({ onSelectPlan }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <OptimizationPlan
        title="Базовый"
        price={15000}
        features={[
          "Технический аудит",
          "Оптимизация мета-тегов",
          "Базовые рекомендации",
          "Отчет в PDF"
        ]}
        onSelect={onSelectPlan}
      />
      <OptimizationPlan
        title="Стандарт"
        price={35000}
        features={[
          "Все из базового плана",
          "Оптимизация контента",
          "Структурирование данных",
          "Улучшение изображений",
          "Постоянная поддержка"
        ]}
        recommended
        onSelect={onSelectPlan}
      />
      <OptimizationPlan
        title="Премиум"
        price={75000}
        features={[
          "Все из плана Стандарт",
          "Полная оптимизация сайта",
          "Контент-маркетинг",
          "Анализ конкурентов",
          "Техническая поддержка 24/7",
          "Ежемесячные отчеты"
        ]}
        onSelect={onSelectPlan}
      />
    </div>
  );
};

export default OptimizationPlans;
