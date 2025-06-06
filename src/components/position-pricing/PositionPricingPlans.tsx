
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Star, Zap, Target, TrendingUp, ArrowRight, Sparkles, Calculator, Trophy, Shield } from 'lucide-react';
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
  const [selectedCalculation, setSelectedCalculation] = useState(0);

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
      name: "Стартер",
      price: 1499,
      originalPrice: 2199,
      description: "Идеально для небольших проектов",
      features: [
        "До 100 ключевых слов",
        "1 регион (Москва или СПб)",
        "Еженедельные проверки",
        "История за 30 дней",
        "Базовая аналитика",
        "Email уведомления",
        "Экспорт в Excel"
      ],
      popular: false,
      buttonText: "Начать отслеживание",
      buttonVariant: "outline" as const,
      icon: Target,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderGradient: "from-blue-500/30 to-cyan-500/30",
      highlight: "Экономия 32%"
    },
    {
      name: "Профессионал",
      price: 3899,
      originalPrice: 5299,
      description: "Лучший выбор для растущего бизнеса",
      features: [
        "До 500 ключевых слов",
        "5 регионов на выбор",
        "Ежедневные проверки",
        "История за 90 дней",
        "Продвинутая аналитика",
        "Push уведомления",
        "Все форматы экспорта",
        "API доступ",
        "Анализ конкурентов",
        "Приоритетная поддержка"
      ],
      popular: true,
      buttonText: "Выбрать план",
      buttonVariant: "default" as const,
      icon: Star,
      gradient: "from-primary/20 to-orange-500/20",
      borderGradient: "from-primary/50 to-orange-500/50",
      highlight: "Самый популярный"
    },
    {
      name: "Эксперт",
      price: 8999,
      originalPrice: 11999,
      description: "Для серьезных SEO проектов",
      features: [
        "До 2000 ключевых слов",
        "15 регионов включая зарубежные",
        "Проверки каждые 6 часов",
        "Полная история данных",
        "Белые отчеты (White Label)",
        "Мгновенные алерты",
        "Интеграции через API",
        "Конкурентная разведка",
        "Персональный менеджер",
        "SLA 99.9%"
      ],
      popular: false,
      buttonText: "Связаться с нами",
      buttonVariant: "outline" as const,
      icon: Trophy,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderGradient: "from-purple-500/30 to-pink-500/30",
      highlight: "Максимум возможностей"
    },
    {
      name: "Enterprise",
      price: null,
      originalPrice: null,
      description: "Индивидуальные решения для агентств",
      features: [
        "Неограниченные ключевые слова",
        "Любые регионы мира",
        "Настраиваемая частота",
        "Безлимитная история",
        "Полностью белые отчеты",
        "Dedicated серверы",
        "Приоритетный API",
        "Обучение команды",
        "Техподдержка 24/7",
        "Гарантии SLA"
      ],
      popular: false,
      buttonText: "Обсудить проект",
      buttonVariant: "outline" as const,
      icon: Shield,
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderGradient: "from-emerald-500/30 to-teal-500/30",
      highlight: "Под ключ"
    }
  ];

  const calculatePrice = (keywords: number, regions: number, frequency: number) => {
    const keywordPrice = 0.35;
    const regionMultiplier = 1.3;
    const frequencyMultiplier = frequency === 7 ? 1.8 : frequency === 3 ? 1.4 : 1;
    
    return Math.round(keywords * keywordPrice * (regions * regionMultiplier) * frequencyMultiplier);
  };

  const calculationExamples = [
    { keywords: 50, regions: 1, frequency: 1, desc: "Малый бизнес", color: "text-blue-600" },
    { keywords: 300, regions: 3, frequency: 3, desc: "Средний проект", color: "text-green-600" },
    { keywords: 1000, regions: 5, frequency: 7, desc: "Крупная компания", color: "text-purple-600" }
  ];

  return (
    <div className="mb-20">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 px-6 py-3 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Профессиональный мониторинг позиций в поисковых системах
          </Badge>
        </motion.div>
        
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent leading-tight"
        >
          Тарифные планы мониторинга
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-10"
        >
          Выберите оптимальный план для отслеживания позиций вашего сайта в Яндекс и Google.
          Получите детальную аналитику, мгновенные уведомления и профессиональные отчеты.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 text-sm"
        >
          {[
            { icon: Check, text: "Точность данных 99.9%", color: "text-green-600" },
            { icon: Shield, text: "Защищенное соединение", color: "text-blue-600" },
            { icon: Zap, text: "Обновления в реальном времени", color: "text-orange-600" },
            { icon: Star, text: "7 дней бесплатно", color: "text-purple-600" }
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-3 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 shadow-sm">
              <feature.icon className={`h-4 w-4 ${feature.color}`} />
              <span className="font-medium">{feature.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Plans Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20"
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
            <Card className={`relative h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 ${
              plan.popular 
                ? 'border-primary/60 shadow-xl shadow-primary/20 scale-105 ring-2 ring-primary/20' 
                : hoveredPlan === index 
                  ? 'border-primary/40 shadow-xl shadow-primary/10 scale-102' 
                  : 'border-border/40 shadow-md'
            }`}>
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-40 transition-opacity duration-500 ${
                hoveredPlan === index ? 'opacity-60' : ''
              }`} />
              
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max z-10">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 shadow-lg animate-pulse">
                    <Star className="w-3 h-3 mr-1" />
                    {plan.highlight}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.borderGradient} p-[2px] shadow-lg`}>
                    <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                      <plan.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  {!plan.popular && plan.highlight && (
                    <Badge variant="secondary" className="text-xs bg-muted/80">
                      {plan.highlight}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                
                <div className="mb-4">
                  {plan.price ? (
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-primary">{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground font-medium">₽/мес</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="flex items-center gap-3">
                          <span className="text-lg text-muted-foreground line-through">
                            {plan.originalPrice.toLocaleString()} ₽
                          </span>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            -{Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-primary">Индивидуально</div>
                  )}
                </div>
                
                <p className="text-muted-foreground leading-relaxed">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="relative z-10 flex-grow flex flex-col">
                <ul className="mb-8 space-y-4 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full group-hover:scale-105 transition-all duration-300 h-12 text-base font-semibold ${
                    plan.popular ? 'shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/40' : ''
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
      
      {/* Enhanced Pricing Calculator */}
      <motion.div
        className="bg-gradient-to-br from-background/80 via-muted/30 to-background/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-border/50 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Калькулятор стоимости</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Стоимость рассчитывается индивидуально в зависимости от количества ключевых слов, 
            регионов и частоты проверок. Используйте примеры ниже для оценки.
          </p>
        </div>
        
        {/* Interactive Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {calculationExamples.map((example, index) => (
            <motion.div
              key={index}
              className={`relative p-8 bg-background/60 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-pointer ${
                selectedCalculation === index 
                  ? 'border-primary/50 shadow-xl shadow-primary/20 scale-105' 
                  : 'border-border/30 hover:border-primary/30 hover:shadow-lg'
              }`}
              onClick={() => setSelectedCalculation(index)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="text-center">
                <div className={`text-sm font-semibold mb-3 ${example.color}`}>
                  {example.desc}
                </div>
                <div className="text-lg font-medium mb-4 text-muted-foreground">
                  {example.keywords} слов • {example.regions} регион{example.regions > 1 ? 'а' : ''}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {calculatePrice(example.keywords, example.regions, example.frequency).toLocaleString()} ₽
                </div>
                <div className="text-sm text-muted-foreground">в месяц</div>
              </div>
              
              {selectedCalculation === index && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Pricing Formula */}
        <Card className="bg-background/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <h4 className="text-xl font-semibold mb-6 text-center">Формула расчета</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Ключевые слова",
                  description: "0.35 ₽ за слово",
                  tooltip: "Базовая стоимость отслеживания одного ключевого слова"
                },
                {
                  icon: TrendingUp,
                  title: "Регионы",
                  description: "Коэффициент ×1.3",
                  tooltip: "Каждый дополнительный регион увеличивает точность и стоимость"
                },
                {
                  icon: Zap,
                  title: "Частота проверок",
                  description: "От ×1.0 до ×1.8",
                  tooltip: "Более частые проверки требуют больше ресурсов"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 cursor-help">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <h5 className="font-semibold mb-2">{item.title}</h5>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PositionPricingPlans;
