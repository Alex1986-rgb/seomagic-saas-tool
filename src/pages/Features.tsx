import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { 
  Search, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap,
  Globe,
  Users,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Rocket,
  Brain,
  Eye,
  Settings
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
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

  const coreFeatures = [
    {
      icon: Search,
      title: "SEO Аудит",
      description: "Комплексный анализ сайта с детальными рекомендациями",
      category: "Анализ",
      badge: "Популярно",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      icon: BarChart3,
      title: "Отслеживание позиций",
      description: "Мониторинг ключевых слов в реальном времени",
      category: "Мониторинг",
      badge: "Новое",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      icon: Target,
      title: "Анализ конкурентов",
      description: "Изучение стратегий и ключевых слов конкурентов",
      category: "Исследование",
      badge: "Pro",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      icon: TrendingUp,
      title: "Отчеты и аналитика",
      description: "Детальные отчеты с графиками и трендами",
      category: "Отчетность",
      badge: "Обновлено",
      badgeColor: "bg-orange-100 text-orange-800"
    },
    {
      icon: Shield,
      title: "Безопасность сайта",
      description: "Проверка безопасности и SSL сертификатов",
      category: "Безопасность",
      badge: "Важно",
      badgeColor: "bg-red-100 text-red-800"
    },
    {
      icon: Zap,
      title: "Скорость загрузки",
      description: "Анализ производительности и оптимизация",
      category: "Производительность",
      badge: "Быстро",
      badgeColor: "bg-yellow-100 text-yellow-800"
    }
  ];

  const advancedFeatures = [
    {
      icon: Globe,
      title: "Международное SEO",
      description: "Анализ и оптимизация для разных регионов и языков"
    },
    {
      icon: Users,
      title: "Командная работа",
      description: "Совместная работа над проектами с ролями пользователей"
    },
    {
      icon: Award,
      title: "White Label",
      description: "Брендированные отчеты под вашим логотипом"
    },
    {
      icon: Brain,
      title: "AI Рекомендации",
      description: "Умные рекомендации на основе машинного обучения"
    },
    {
      icon: Eye,
      title: "Мониторинг упоминаний",
      description: "Отслеживание упоминаний бренда в интернете"
    },
    {
      icon: Settings,
      title: "API Интеграция",
      description: "Полный API доступ для интеграции с вашими системами"
    }
  ];

  const planFeatures = {
    basic: [
      "5 сайтов в проекте",
      "100 ключевых слов",
      "Ежедневные проверки",
      "Базовые отчеты",
      "Email поддержка"
    ],
    pro: [
      "25 сайтов в проекте", 
      "1000 ключевых слов",
      "Почасовые проверки",
      "Расширенные отчеты",
      "Анализ конкурентов",
      "API доступ",
      "Приоритетная поддержка"
    ],
    enterprise: [
      "Неограниченные сайты",
      "Неограниченные ключевые слова",
      "Мониторинг в реальном времени",
      "Персональные отчеты",
      "White Label решения",
      "Выделенный менеджер",
      "SLA гарантии"
    ]
  };

  const stats = [
    { number: "50K+", label: "Проанализированных сайтов" },
    { number: "1M+", label: "Отслеживаемых ключевых слов" },
    { number: "99.9%", label: "Время работы сервиса" },
    { number: "24/7", label: "Техническая поддержка" }
  ];

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Возможности', url: '/features' }
      ]} />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Полный набор SEO инструментов
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
              >
                Возможности SeoMarket
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
              >
                Профессиональные инструменты для SEO-аналитики, мониторинга позиций 
                и оптимизации сайтов. Все что нужно для успешного продвижения в одной платформе
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  <Rocket className="w-5 h-5 mr-2" />
                  Начать бесплатно
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Посмотреть демо
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="neo-card text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Core Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-20"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Основные возможности</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Мощные инструменты для комплексного SEO-анализа и оптимизации
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coreFeatures.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="neo-card h-full hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <feature.icon className="w-6 h-6 text-primary" />
                          </div>
                          <Badge className={`${feature.badgeColor} text-xs`}>
                            {feature.badge}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <div className="flex items-center text-sm text-primary">
                          <span className="mr-2">{feature.category}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Feature Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Выберите свой план</h2>
                <p className="text-muted-foreground">
                  Функции, адаптированные под ваши потребности
                </p>
              </div>

              <Tabs defaultValue="pro" className="max-w-4xl mx-auto">
                <TabsList className="grid grid-cols-3 w-full mb-8">
                  <TabsTrigger value="basic">Базовый</TabsTrigger>
                  <TabsTrigger value="pro">Профессиональный</TabsTrigger>
                  <TabsTrigger value="enterprise">Корпоративный</TabsTrigger>
                </TabsList>
                
                {Object.entries(planFeatures).map(([plan, features]) => (
                  <TabsContent key={plan} value={plan}>
                    <Card className="neo-card">
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>

            {/* Advanced Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-20"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Расширенные возможности</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Профессиональные инструменты для продвинутых пользователей
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedFeatures.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="neo-card h-full hover:border-primary/40 transition-colors group">
                      <CardContent className="p-6">
                        <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                          <feature.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Card className="neo-card bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
                <CardContent className="p-12">
                  <Star className="w-12 h-12 text-primary mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Присоединяйтесь к тысячам специалистов, которые уже используют 
                    SeoMarket для достижения лучших результатов в SEO
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button size="lg" className="text-lg px-8">
                      Начать бесплатный период
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8">
                      Связаться с нами
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>14 дней бесплатно</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Без обязательств</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Поддержка 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeaturesPage;
