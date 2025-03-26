
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingPlans: React.FC = () => {
  // Список тарифных планов
  const plans = [
    {
      name: 'Бесплатно',
      price: 0,
      period: 'бессрочно',
      features: [
        '1 сайт',
        'Базовый SEO-аудит',
        'PDF-отчет',
      ],
      restrictions: [
        'Без оптимизации',
        'Без приоритетной поддержки',
      ],
      recommended: false,
      buttonText: 'Начать бесплатно',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Базовый',
      price: 990,
      period: 'месяц',
      features: [
        'До 5 сайтов',
        'Полный SEO-аудит',
        'PDF и CSV отчеты',
        '3 оптимизации в месяц',
        'Email поддержка',
      ],
      restrictions: [],
      recommended: false,
      buttonText: 'Выбрать тариф',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Про',
      price: 2900,
      period: 'месяц',
      features: [
        'До 15 сайтов',
        'Расширенный SEO-аудит',
        'Все форматы отчетов',
        '20 оптимизаций в месяц',
        'Приоритетная поддержка',
        'API доступ',
        'Сравнение с конкурентами',
      ],
      restrictions: [],
      recommended: true,
      buttonText: 'Выбрать тариф',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Агентство',
      price: 9900,
      period: 'месяц',
      features: [
        'Неограниченное количество сайтов',
        'Полный SEO-аудит',
        'Все форматы отчетов',
        'Неограниченные оптимизации',
        'Выделенная поддержка',
        'API доступ с расширенными возможностями',
        'White label отчеты',
        'Командный доступ',
      ],
      restrictions: [],
      recommended: false,
      buttonText: 'Выбрать тариф',
      buttonVariant: 'default' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`neo-card relative p-6 border-2 transition-all hover:shadow-md ${
            plan.recommended ? 'border-primary ring-2 ring-primary/10' : 'border-border'
          }`}
        >
          {plan.recommended && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1">
              <Badge className="bg-primary text-white">Рекомендуемый</Badge>
            </div>
          )}
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold">
              {plan.price > 0 ? `${plan.price} ₽` : 'Бесплатно'}
              <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <p className="text-sm text-muted-foreground text-center">Включено:</p>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              
              {plan.restrictions.map((restriction, idx) => (
                <li key={`r-${idx}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-xl leading-none mt-0.5">·</span>
                  <span>{restriction}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant={plan.buttonVariant} 
            className="w-full"
            asChild
          >
            <Link to="/auth?tab=register&plan={plan.name}">{plan.buttonText}</Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PricingPlans;
