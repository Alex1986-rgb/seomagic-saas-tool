
import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingPlans: React.FC = () => {
  // Список тарифных планов с обновленной логикой
  const plans = [
    {
      name: 'Начальный',
      description: 'до 3 страниц',
      price: 9900,
      period: 'разово',
      discount: null,
      discountText: null,
      features: [
        'Технический SEO-аудит',
        'Оптимизация до 3 страниц',
        'Исправление мета-тегов',
        'Оптимизация изображений',
        'PDF-отчет с рекомендациями',
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 300, unit: 'страница' },
        { name: 'Оптимизация изображений', price: 100, unit: 'изображение' },
        { name: 'Оптимизация контента', price: 500, unit: 'страница' },
      ],
      recommended: false,
      buttonText: 'Заказать аудит',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Базовый',
      description: 'до 50 страниц',
      price: 29900,
      period: 'месяц',
      discount: '20%',
      discountText: 'Скидка 20% от стандартной цены',
      features: [
        'Все функции начального тарифа',
        'Оптимизация до 50 страниц',
        'Исправление структуры URL',
        'Исправление битых ссылок',
        'Техническая поддержка',
        'Мониторинг результатов',
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 240, unit: 'страница' }, // 20% скидка
        { name: 'Оптимизация структуры URL', price: 160, unit: 'страница' }, // 20% скидка
        { name: 'Исправление ссылок', price: 160, unit: 'ссылка' }, // 20% скидка
        { name: 'Улучшение контента', price: 400, unit: 'страница' }, // 20% скидка
      ],
      recommended: false,
      buttonText: 'Выбрать тариф',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Стандарт',
      description: 'до 500 страниц',
      price: 59900,
      period: 'месяц',
      discount: '50%',
      discountText: 'Скидка 50% от стандартной цены',
      features: [
        'Все функции базового тарифа',
        'Оптимизация до 500 страниц',
        'Полное улучшение контента',
        'Внедрение микроразметки',
        'Внутренняя перелинковка',
        'Регулярные отчеты',
        'Приоритетная поддержка',
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 150, unit: 'страница' }, // 50% скидка
        { name: 'Оптимизация структуры URL', price: 100, unit: 'страница' }, // 50% скидка
        { name: 'Исправление ссылок', price: 100, unit: 'ссылка' }, // 50% скидка
        { name: 'Улучшение контента', price: 250, unit: 'страница' }, // 50% скидка
        { name: 'Внедрение микроразметки', price: 150, unit: 'шаблон' }, // 50% скидка
      ],
      recommended: true,
      buttonText: 'Выбрать тариф',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Корпоративный',
      description: 'от 1000 страниц',
      price: 99900,
      period: 'месяц',
      discount: '80%',
      discountText: 'Скидка 80% от стандартной цены',
      features: [
        'Все функции стандартного тарифа',
        'Неограниченное количество страниц',
        'Индивидуальная стратегия SEO',
        'Выделенный специалист',
        'Еженедельные отчеты',
        'Расширенная аналитика',
        'Оптимизация конверсий',
        'API доступ',
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 60, unit: 'страница' }, // 80% скидка
        { name: 'Оптимизация структуры URL', price: 40, unit: 'страница' }, // 80% скидка
        { name: 'Исправление ссылок', price: 40, unit: 'ссылка' }, // 80% скидка
        { name: 'Улучшение контента', price: 100, unit: 'страница' }, // 80% скидка
        { name: 'Внедрение микроразметки', price: 60, unit: 'шаблон' }, // 80% скидка
        { name: 'Индивидуальная настройка', price: 20000, unit: 'месяц' },
      ],
      recommended: false,
      buttonText: 'Получить предложение',
      buttonVariant: 'default' as const,
    },
  ];

  // Список работ по оптимизации
  const optimizationTypes = [
    'Оптимизация мета-тегов (title, description)',
    'Оптимизация заголовков (H1-H6)',
    'Исправление битых ссылок',
    'Оптимизация структуры URL',
    'Оптимизация изображений (alt-теги, сжатие)',
    'Оптимизация скорости загрузки страниц',
    'Оптимизация для мобильных устройств',
    'Исправление дублирующегося контента',
    'Улучшение текстового контента',
    'Оптимизация внутренней перелинковки',
    'Создание и оптимизация sitemap.xml',
    'Настройка robots.txt',
    'Исправление ошибок канонизации URL',
    'Оптимизация микроразметки (Schema.org)',
    'Оптимизация для локального поиска',
    'Исправление проблем индексации',
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Тарифные планы</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Выберите подходящий тариф для оптимизации вашего сайта. Стоимость зависит от количества страниц.
          <Link to="/optimization-pricing" className="text-primary hover:underline ml-1">
            Также доступны индивидуальные расчеты.
          </Link>
        </p>
      </div>
      
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
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              
              {plan.discount && (
                <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                  {plan.discount} скидка
                </Badge>
              )}
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">
                {plan.price.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-sm text-muted-foreground">/{plan.period}</div>
            </div>
            
            {plan.discountText && (
              <div className="bg-muted/40 text-center p-2 rounded-md text-sm mb-4">
                {plan.discountText}
              </div>
            )}
            
            <div className="space-y-4 mb-8">
              <p className="text-sm text-muted-foreground">Включено:</p>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t pt-4 pb-6 mb-4">
              <p className="text-sm font-medium mb-2">Стоимость работ:</p>
              <div className="space-y-1">
                {plan.workItems.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.price} ₽/{item.unit}</span>
                  </div>
                ))}
                {plan.workItems.length > 4 && (
                  <div className="text-xs text-center text-muted-foreground pt-1">
                    ... и другие работы
                  </div>
                )}
              </div>
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
      
      <div className="bg-muted/30 border rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Виды оптимизации, которые мы выполняем</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {optimizationTypes.map((type, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
