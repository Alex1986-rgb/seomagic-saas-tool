
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Users, Crown, ArrowRight, TrendingUp, Shield, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const PositionPricingPlans: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = [
    {
      name: 'Базовый',
      description: 'Для небольших проектов',
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      monthlyPrice: 2900,
      yearlyPrice: 29000,
      keywords: 100,
      sites: 3,
      checkFrequency: 'Еженедельно',
      regions: 5,
      competitors: 0,
      reports: 'Базовые',
      support: 'Email',
      features: [
        'До 100 ключевых слов',
        'Мониторинг 3 сайтов',
        'Проверка раз в неделю',
        '5 регионов',
        'Базовые отчеты',
        'Email поддержка'
      ],
      recommended: false,
      badge: null
    },
    {
      name: 'Стандарт',
      description: 'Оптимальный выбор',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      monthlyPrice: 5900,
      yearlyPrice: 59000,
      keywords: 500,
      sites: 10,
      checkFrequency: '3 раза в неделю',
      regions: 15,
      competitors: 3,
      reports: 'Расширенные',
      support: 'Приоритетная',
      features: [
        'До 500 ключевых слов',
        'Мониторинг 10 сайтов',
        'Проверка 3 раза в неделю',
        '15 регионов',
        'Анализ 3 конкурентов',
        'Расширенные отчеты',
        'Приоритетная поддержка',
        'История до 6 месяцев'
      ],
      recommended: true,
      badge: 'Популярный'
    },
    {
      name: 'Профессионал',
      description: 'Для крупного бизнеса',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      monthlyPrice: 11900,
      yearlyPrice: 119000,
      keywords: 2000,
      sites: 50,
      checkFrequency: 'Ежедневно',
      regions: 50,
      competitors: 10,
      reports: 'Персональные',
      support: '24/7',
      features: [
        'До 2000 ключевых слов',
        'Мониторинг 50 сайтов',
        'Ежедневные проверки',
        '50 регионов',
        'Анализ 10 конкурентов',
        'Персональные отчеты',
        'API доступ',
        'Белые отчеты',
        'Поддержка 24/7',
        'История до 1 года'
      ],
      recommended: false,
      badge: 'Бестселлер'
    },
    {
      name: 'Корпоративный',
      description: 'Индивидуальные решения',
      icon: Shield,
      color: 'from-orange-500 to-orange-600',
      monthlyPrice: null,
      yearlyPrice: null,
      keywords: 'Без ограничений',
      sites: 'Без ограничений',
      checkFrequency: 'По требованию',
      regions: 'Все',
      competitors: 'Без ограничений',
      reports: 'Индивидуальные',
      support: 'Персональный менеджер',
      features: [
        'Неограниченные ключевые слова',
        'Неограниченные сайты',
        'Кастомная частота проверок',
        'Все регионы мира',
        'Неограниченные конкуренты',
        'Индивидуальные отчеты',
        'Полный API доступ',
        'Интеграции на заказ',
        'Персональный менеджер',
        'SLA гарантии'
      ],
      recommended: false,
      badge: 'Enterprise'
    }
  ];

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

  const getPrice = (plan: typeof plans[0]) => {
    if (!plan.monthlyPrice) return 'По запросу';
    const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return `${price?.toLocaleString('ru-RU')} ₽`;
  };

  const getPeriod = () => billingPeriod === 'monthly' ? '/месяц' : '/год';

  const getDiscount = () => billingPeriod === 'yearly' ? '-20%' : null;

  return (
    <div className="mb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.div variants={itemVariants}>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Гибкие тарифы
          </Badge>
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
          Выберите подходящий тариф
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Профессиональный мониторинг позиций с гибкими тарифами для проектов любого размера
        </motion.p>

        {/* Billing Toggle */}
        <motion.div variants={itemVariants}>
          <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}>
            <TabsList className="grid grid-cols-2 w-72 mx-auto">
              <TabsTrigger value="monthly" className="relative">
                Ежемесячно
              </TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Ежегодно
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">-20%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {plans.map((plan, index) => (
          <motion.div key={plan.name} variants={itemVariants}>
            <Card className={`neo-card h-full relative overflow-hidden hover:shadow-xl transition-all duration-300 group ${
              plan.recommended ? 'ring-2 ring-primary border-primary' : ''
            }`}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              {plan.badge && !plan.recommended && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative pb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                
                <div className="mt-4">
                  {plan.monthlyPrice ? (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">{getPrice(plan)}</span>
                      <span className="text-muted-foreground ml-1">{getPeriod()}</span>
                      {getDiscount() && billingPeriod === 'yearly' && (
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                          {getDiscount()}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-muted-foreground">
                      Индивидуально
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{plan.keywords}</div>
                    <div className="text-xs text-muted-foreground">ключевых слов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{plan.sites}</div>
                    <div className="text-xs text-muted-foreground">сайтов</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.recommended ? '' : 'variant-outline'} group-hover:scale-105 transition-transform`}
                  asChild
                >
                  <Link to={plan.monthlyPrice ? "/auth?tab=register" : "/contact"}>
                    {plan.monthlyPrice ? 'Начать' : 'Связаться'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <Card className="neo-card overflow-hidden">
          <CardHeader>
            <h3 className="text-2xl font-bold text-center">Подробное сравнение тарифов</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Функция</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="text-center p-4 font-medium min-w-[150px]">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Частота проверок', key: 'checkFrequency' },
                    { label: 'Регионы', key: 'regions' },
                    { label: 'Конкуренты', key: 'competitors' },
                    { label: 'Отчеты', key: 'reports' },
                    { label: 'Поддержка', key: 'support' }
                  ].map((row, idx) => (
                    <tr key={row.key} className={idx % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="p-4 font-medium">{row.label}</td>
                      {plans.map((plan) => (
                        <td key={`${plan.name}-${row.key}`} className="text-center p-4">
                          {plan[row.key as keyof typeof plan]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <Card className="neo-card text-center">
          <CardContent className="p-6">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Быстрый старт</h3>
            <p className="text-muted-foreground text-sm">
              Начните мониторинг позиций уже сегодня. Настройка занимает 5 минут
            </p>
          </CardContent>
        </Card>

        <Card className="neo-card text-center">
          <CardContent className="p-6">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Точные данные</h3>
            <p className="text-muted-foreground text-sm">
              99.8% точность данных с проверкой в реальных условиях поиска
            </p>
          </CardContent>
        </Card>

        <Card className="neo-card text-center">
          <CardContent className="p-6">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Гарантия качества</h3>
            <p className="text-muted-foreground text-sm">
              30 дней возврата средств, если сервис не оправдает ожидания
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Free Trial CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="neo-card bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <CardContent className="p-8 text-center">
            <Zap className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Попробуйте бесплатно</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Получите полный доступ ко всем функциям на 7 дней абсолютно бесплатно. 
              Без привязки карты, без скрытых платежей.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" asChild>
                <Link to="/auth?tab=register">
                  Начать бесплатный период
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Получить консультацию
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>7 дней бесплатно</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Без привязки карты</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Отмена в любой момент</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PositionPricingPlans;
