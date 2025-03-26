
import React from 'react';
import Layout from '@/components/Layout';
import { Check, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const Pricing: React.FC = () => {
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

  // Сравнительная таблица возможностей
  const featureComparison = [
    {
      name: 'Количество сайтов',
      free: '1',
      basic: '5',
      pro: '15',
      agency: 'Неограниченно',
    },
    {
      name: 'SEO-аудит',
      free: 'Базовый',
      basic: 'Полный',
      pro: 'Расширенный',
      agency: 'Полный',
    },
    {
      name: 'Анализ конкурентов',
      free: '✖',
      basic: '✖',
      pro: '✓',
      agency: '✓',
    },
    {
      name: 'Оптимизации в месяц',
      free: '0',
      basic: '3',
      pro: '20',
      agency: 'Неограниченно',
    },
    {
      name: 'API доступ',
      free: '✖',
      basic: '✖',
      pro: '✓',
      agency: '✓ (расширенный)',
    },
    {
      name: 'White label',
      free: '✖',
      basic: '✖',
      pro: '✖',
      agency: '✓',
    },
    {
      name: 'Техническая поддержка',
      free: 'Форум',
      basic: 'Email',
      pro: 'Приоритетная',
      agency: 'Выделенная',
    },
    {
      name: 'Командный доступ',
      free: '✖',
      basic: '✖',
      pro: '✖',
      agency: '✓',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Выберите подходящий тариф</h1>
          <p className="text-lg text-muted-foreground">
            Мы предлагаем гибкие варианты подписки для любых потребностей - от личных блогов до крупных корпоративных сайтов
          </p>
        </div>

        {/* Тарифные планы */}
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

        {/* Сравнение возможностей */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Сравнение возможностей</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Возможности</th>
                  <th className="py-4 px-4 text-center">Бесплатно</th>
                  <th className="py-4 px-4 text-center">Базовый</th>
                  <th className="py-4 px-4 text-center">Про</th>
                  <th className="py-4 px-4 text-center">Агентство</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/10" : ""}>
                    <td className="py-4 px-4 font-medium">
                      <div className="flex items-center gap-1">
                        {feature.name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Информация о возможности "{feature.name}"</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{feature.free}</td>
                    <td className="py-4 px-4 text-center">{feature.basic}</td>
                    <td className="py-4 px-4 text-center">{feature.pro}</td>
                    <td className="py-4 px-4 text-center">{feature.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-2xl font-bold text-center mb-10">Часто задаваемые вопросы</h2>
          
          <div className="space-y-6">
            <div className="neo-card p-6">
              <h3 className="text-lg font-medium mb-2">Можно ли сменить тариф?</h3>
              <p className="text-muted-foreground">Да, вы можете изменить свой тариф в любое время. Изменения вступят в силу со следующего платежного периода.</p>
            </div>
            
            <div className="neo-card p-6">
              <h3 className="text-lg font-medium mb-2">Что произойдет если я превышу лимит?</h3>
              <p className="text-muted-foreground">При превышении лимитов вашего тарифа мы предложим вам обновить ваш план. Текущий анализ будет сохранен, но для продолжения работы потребуется выбрать более подходящий тариф.</p>
            </div>
            
            <div className="neo-card p-6">
              <h3 className="text-lg font-medium mb-2">Как происходит оплата?</h3>
              <p className="text-muted-foreground">Мы принимаем оплату банковскими картами, через электронные кошельки и банковским переводом. Для юридических лиц предоставляем все необходимые документы.</p>
            </div>
            
            <div className="neo-card p-6">
              <h3 className="text-lg font-medium mb-2">Есть ли скидки при оплате за год?</h3>
              <p className="text-muted-foreground">Да, при оплате за год вы получаете скидку 20% от общей стоимости.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center mt-20 neo-card p-10">
          <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
          <p className="text-lg mb-6">Наша команда поддержки готова помочь вам выбрать оптимальное решение для ваших задач</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" asChild>
              <Link to="/contact">Связаться с нами</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/demo">Запросить демо</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
