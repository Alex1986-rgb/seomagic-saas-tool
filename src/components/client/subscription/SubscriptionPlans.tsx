
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  price: number;
  features: string[];
  recommended: boolean;
  current?: boolean;
}

interface SubscriptionPlansProps {
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, onPlanSelect }) => {
  // Расширим планы подписки, включив функционал проверки позиций
  const enhancedPlans = plans.map(plan => {
    const enhancedFeatures = [...plan.features];
    
    // Добавляем функции проверки позиций в зависимости от плана
    if (plan.name === 'Бесплатно') {
      enhancedFeatures.push('Проверка позиций (до 5 ключевых слов)');
    } else if (plan.name === 'Базовый') {
      enhancedFeatures.push('Проверка позиций (до 50 ключевых слов)');
      enhancedFeatures.push('История проверок (7 дней)');
    } else if (plan.name === 'Про') {
      enhancedFeatures.push('Проверка позиций (до 500 ключевых слов)');
      enhancedFeatures.push('История проверок (90 дней)');
      enhancedFeatures.push('Регулярные проверки позиций');
      enhancedFeatures.push('Экспорт отчетов');
    } else if (plan.name === 'Агентство') {
      enhancedFeatures.push('Неограниченная проверка позиций');
      enhancedFeatures.push('Полная история проверок');
      enhancedFeatures.push('Регулярные проверки с уведомлениями');
      enhancedFeatures.push('Отчеты и экспорт данных');
      enhancedFeatures.push('API доступ к данным позиций');
    }
    
    return {
      ...plan,
      features: enhancedFeatures
    };
  });
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Доступные планы</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enhancedPlans.map((plan) => (
          <div 
            key={plan.name} 
            className={`neo-card p-6 border-2 ${
              plan.current 
                ? 'border-primary' 
                : plan.recommended 
                  ? 'border-green-500' 
                  : 'border-transparent'
            }`}
          >
            {plan.recommended && !plan.current && (
              <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                <Badge className="bg-green-500">Рекомендуемый</Badge>
              </div>
            )}
            {plan.current && (
              <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                <Badge>Текущий план</Badge>
              </div>
            )}
            
            <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
            <div className="text-2xl font-bold mb-4">
              {plan.price} ₽<span className="text-sm font-normal text-muted-foreground">/мес</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              variant={plan.current ? "outline" : "default"} 
              className="w-full"
              disabled={plan.current}
              onClick={() => plan.current ? null : onPlanSelect(plan)}
            >
              {plan.current ? 'Текущий план' : plan.price === 0 ? 'Выбрать бесплатный' : 'Выбрать план'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
