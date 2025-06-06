
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PositionPricingPlans: React.FC = () => {
  const plans = [
    {
      name: "Базовый",
      price: 500,
      description: "Для небольших сайтов и начинающих",
      features: [
        "До 100 ключевых слов",
        "1 регион (Москва)",
        "Обновление позиций раз в неделю",
        "История позиций за 30 дней",
        "Базовая статистика"
      ],
      popular: false,
      buttonText: "Выбрать план",
      buttonVariant: "outline" as const
    },
    {
      name: "Стандарт",
      price: 1900,
      description: "Для малого и среднего бизнеса",
      features: [
        "До 500 ключевых слов",
        "3 региона на выбор",
        "Обновление позиций 3 раза в неделю",
        "История позиций за 60 дней",
        "Расширенная статистика",
        "Уведомления об изменениях",
        "Экспорт отчетов"
      ],
      popular: true,
      buttonText: "Выбрать план",
      buttonVariant: "default" as const
    },
    {
      name: "Профессионал",
      price: 4900,
      description: "Для крупных проектов",
      features: [
        "До 2000 ключевых слов",
        "10 регионов на выбор",
        "Ежедневное обновление позиций",
        "История позиций за 90 дней",
        "Полная аналитика",
        "Мгновенные уведомления",
        "Все форматы экспорта данных",
        "API доступ",
        "Автоматические отчеты"
      ],
      popular: false,
      buttonText: "Выбрать план",
      buttonVariant: "outline" as const
    },
    {
      name: "Индивидуальный",
      price: null,
      description: "Для агентств и enterprise-клиентов",
      features: [
        "Неограниченное количество ключевых слов",
        "Любые регионы",
        "Индивидуальная частота проверок",
        "Полная история позиций",
        "Индивидуальные отчеты",
        "White label решение",
        "Расширенный API доступ",
        "Выделенная поддержка"
      ],
      popular: false,
      buttonText: "Получить предложение",
      buttonVariant: "outline" as const
    }
  ];

  const calculatePrice = (keywords: number, regions: number, frequency: number) => {
    const keywordPrice = 0.3; // рублей за ключевое слово
    const regionMultiplier = 1.2; // множитель за каждый дополнительный регион
    const frequencyMultiplier = 1.5; // множитель за ежедневные проверки
    
    return Math.round(keywords * keywordPrice * (regions * regionMultiplier) * (frequency === 7 ? frequencyMultiplier : 1));
  };

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-2">Тарифные планы мониторинга позиций</h2>
      <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12">
        Выберите оптимальный план для отслеживания позиций вашего сайта в поисковых системах.
        Стоимость рассчитывается в зависимости от количества ключевых слов, регионов и частоты проверок.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`relative h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-max">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">Популярный выбор</Badge>
                </div>
              )}
              
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2 mb-1">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">₽/мес</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">По запросу</div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col">
                <ul className="my-6 space-y-3 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full mt-4"
                  asChild
                >
                  <Link to="/position-tracker?plan=starter">{plan.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Индивидуальный расчет стоимости</h3>
        <p className="text-center mb-6 text-muted-foreground">
          Стоимость мониторинга позиций зависит от трех основных параметров:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <h4 className="font-medium">Количество ключевых слов</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Каждое ключевое слово отслеживается отдельно
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">Базовая стоимость: 0.30 ₽ за слово</p>
          </div>
          
          <div className="bg-background p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <h4 className="font-medium">Количество регионов</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Каждый регион проверяется независимо
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">Множитель: x1.2 за регион</p>
          </div>
          
          <div className="bg-background p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <h4 className="font-medium">Частота проверок</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    От еженедельных до ежедневных проверок
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">Множитель: от x1.0 до x1.5</p>
          </div>
        </div>
        
        <div className="p-4 bg-background rounded-lg">
          <h4 className="font-medium mb-2">Примеры расчета:</h4>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">100 ключевых слов, 1 регион, еженедельная проверка:</span> 
              <span className="ml-2">{calculatePrice(100, 1, 1)} ₽/месяц</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">500 ключевых слов, 3 региона, 3 проверки в неделю:</span> 
              <span className="ml-2">{calculatePrice(500, 3, 3)} ₽/месяц</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">2000 ключевых слов, 5 регионов, ежедневная проверка:</span> 
              <span className="ml-2">{calculatePrice(2000, 5, 7)} ₽/месяц</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionPricingPlans;
