
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Star, Zap, Target, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
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
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const plans = [
    {
      name: "Базовый",
      price: 500,
      originalPrice: 800,
      description: "Идеально для небольших сайтов",
      features: [
        "До 100 ключевых слов",
        "1 регион (Москва)",
        "Обновление позиций раз в неделю",
        "История позиций за 30 дней",
        "Базовая статистика",
        "Email поддержка"
      ],
      popular: false,
      buttonText: "Начать отслеживание",
      buttonVariant: "outline" as const,
      icon: Target,
      gradient: "from-blue-500/10 to-cyan-500/10",
      borderGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      name: "Стандарт",
      price: 1900,
      originalPrice: 2500,
      description: "Лучший выбор для растущего бизнеса",
      features: [
        "До 500 ключевых слов",
        "3 региона на выбор",
        "Обновление позиций 3 раза в неделю",
        "История позиций за 60 дней",
        "Расширенная статистика",
        "Уведомления об изменениях",
        "Экспорт отчетов",
        "Приоритетная поддержка"
      ],
      popular: true,
      buttonText: "Выбрать план",
      buttonVariant: "default" as const,
      icon: Star,
      gradient: "from-primary/10 to-orange-500/10",
      borderGradient: "from-primary/40 to-orange-500/40"
    },
    {
      name: "Профессионал",
      price: 4900,
      originalPrice: 6200,
      description: "Для серьезных SEO проектов",
      features: [
        "До 2000 ключевых слов",
        "10 регионов на выбор",
        "Ежедневное обновление позиций",
        "История позиций за 90 дней",
        "Полная аналитика и отчеты",
        "Мгновенные уведомления",
        "Все форматы экспорта данных",
        "API доступ для интеграций",
        "Автоматические отчеты",
        "Выделенный менеджер"
      ],
      popular: false,
      buttonText: "Перейти на Pro",
      buttonVariant: "outline" as const,
      icon: TrendingUp,
      gradient: "from-purple-500/10 to-pink-500/10",
      borderGradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      name: "Enterprise",
      price: null,
      originalPrice: null,
      description: "Индивидуальные решения для агентств",
      features: [
        "Неограниченное количество ключевых слов",
        "Любые регионы мира",
        "Индивидуальная частота проверок",
        "Полная история позиций",
        "Персональные отчеты",
        "White label решение",
        "Расширенный API доступ",
        "SLA гарантии",
        "Выделенная поддержка 24/7",
        "Обучение команды"
      ],
      popular: false,
      buttonText: "Связаться с нами",
      buttonVariant: "outline" as const,
      icon: Zap,
      gradient: "from-emerald-500/10 to-teal-500/10",
      borderGradient: "from-emerald-500/20 to-teal-500/20"
    }
  ];

  const calculatePrice = (keywords: number, regions: number, frequency: number) => {
    const keywordPrice = 0.3;
    const regionMultiplier = 1.2;
    const frequencyMultiplier = frequency === 7 ? 1.5 : 1;
    
    return Math.round(keywords * keywordPrice * (regions * regionMultiplier) * frequencyMultiplier);
  };

  const pricingFeatures = [
    {
      icon: Target,
      title: "Количество ключевых слов",
      description: "Базовая стоимость: 0.30 ₽ за слово",
      tooltip: "Каждое ключевое слово отслеживается отдельно по всем выбранным регионам"
    },
    {
      icon: TrendingUp,
      title: "Количество регионов",
      description: "Множитель: x1.2 за регион",
      tooltip: "Каждый дополнительный регион увеличивает точность данных"
    },
    {
      icon: Zap,
      title: "Частота проверок",
      description: "Множитель: от x1.0 до x1.5",
      tooltip: "Ежедневные проверки обеспечивают максимальную актуальность данных"
    }
  ];

  return (
    <div className="mb-20">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Профессиональный мониторинг позиций
          </Badge>
        </motion.div>
        
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
        >
          Тарифные планы мониторинга позиций
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
        >
          Выберите оптимальный план для отслеживания позиций вашего сайта в поисковых системах.
          Получите детальную аналитику, уведомления об изменениях и профессиональные отчеты.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <Check className="h-4 w-4 text-green-500" />
            <span>Точность данных 99.8%</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <Check className="h-4 w-4 text-green-500" />
            <span>Поддержка Яндекс, Google, Bing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <Check className="h-4 w-4 text-green-500" />
            <span>7 дней бесплатно</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Plans Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            variants={itemVariants}
            onHoverStart={() => setHoveredPlan(index)}
            onHoverEnd={() => setHoveredPlan(null)}
            className="group"
          >
            <Card className={`relative h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${
              plan.popular 
                ? 'border-primary/40 shadow-lg shadow-primary/10 scale-105' 
                : hoveredPlan === index 
                  ? 'border-primary/30 shadow-lg' 
                  : 'border-border/50'
            }`}>
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50 transition-opacity duration-300 ${
                hoveredPlan === index ? 'opacity-70' : ''
              }`} />
              
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-max z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Популярный выбор
                  </Badge>
                </div>
              )}
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.borderGradient} p-[1px]`}>
                    <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                      <plan.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                
                <div className="mt-4 mb-2">
                  {plan.price ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        <span className="text-muted-foreground">₽/мес</span>
                        {plan.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {plan.originalPrice} ₽
                          </span>
                        )}
                      </div>
                      {plan.originalPrice && (
                        <Badge variant="secondary" className="text-xs">
                          Скидка {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-primary">По запросу</div>
                  )}
                </div>
                
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="relative z-10 flex-grow flex flex-col">
                <ul className="mb-8 space-y-3 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full group-hover:scale-105 transition-transform duration-200 ${
                    plan.popular ? 'shadow-lg shadow-primary/25' : ''
                  }`}
                  asChild
                >
                  <Link to="/position-tracker?plan=starter" className="flex items-center justify-center gap-2">
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Pricing Calculator Section */}
      <motion.div
        className="bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30 p-8 md:p-12 rounded-2xl border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Калькулятор стоимости</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Стоимость мониторинга позиций рассчитывается индивидуально в зависимости от ваших потребностей.
            Используйте наш калькулятор для точного расчета.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {pricingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="neo-card h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Example Calculations */}
        <Card className="neo-card">
          <CardContent className="p-8">
            <h4 className="text-xl font-semibold mb-6 text-center">Примеры расчета стоимости</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { keywords: 100, regions: 1, frequency: 1, desc: "Базовый проект" },
                { keywords: 500, regions: 3, frequency: 3, desc: "Средний бизнес" },
                { keywords: 2000, regions: 5, frequency: 7, desc: "Крупный проект" }
              ].map((example, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-background/50 rounded-xl border border-border/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="text-sm text-muted-foreground mb-2">{example.desc}</div>
                  <div className="text-lg font-medium mb-2">
                    {example.keywords} слов, {example.regions} регион{example.regions > 1 ? 'а' : ''}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {calculatePrice(example.keywords, example.regions, example.frequency)} ₽
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">в месяц</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PositionPricingPlans;
