
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      enhancedFeatures.push('Проверка позиций (до 10 ключевых слов)');
      enhancedFeatures.push('Еженедельное обновление');
      enhancedFeatures.push('1 регион на выбор');
    } else if (plan.name === 'Базовый') {
      enhancedFeatures.push('Проверка позиций (до 100 ключевых слов)');
      enhancedFeatures.push('Обновление 3 раза в неделю');
      enhancedFeatures.push('3 региона на выбор');
      enhancedFeatures.push('История позиций 30 дней');
      enhancedFeatures.push('Экспорт отчетов');
    } else if (plan.name === 'Про') {
      enhancedFeatures.push('Проверка позиций (до 500 ключевых слов)');
      enhancedFeatures.push('Ежедневное обновление');
      enhancedFeatures.push('10 регионов на выбор');
      enhancedFeatures.push('История позиций 90 дней');
      enhancedFeatures.push('Экспорт и автоматические отчеты');
      enhancedFeatures.push('Уведомления об изменениях');
      enhancedFeatures.push('API доступ');
    } else if (plan.name === 'Агентство') {
      enhancedFeatures.push('Неограниченная проверка позиций');
      enhancedFeatures.push('Настраиваемая частота обновления');
      enhancedFeatures.push('Все регионы');
      enhancedFeatures.push('Полная история позиций');
      enhancedFeatures.push('Расширенная аналитика');
      enhancedFeatures.push('Расширенный API доступ');
      enhancedFeatures.push('White label отчеты');
    }
    
    return {
      ...plan,
      features: enhancedFeatures
    };
  });
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Доступные планы</h2>
      <p className="text-muted-foreground mb-6">
        Выберите план, который подходит для ваших задач. Все планы включают как SEO-аудит, 
        так и мониторинг позиций. Для более детальной настройки мониторинга позиций посетите 
        <Link to="/position-pricing" className="text-primary hover:underline ml-1">
          страницу тарифов мониторинга
        </Link>.
      </p>
      
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
