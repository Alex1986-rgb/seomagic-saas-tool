
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Award,
  BarChart3,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>О нас | SEO Platform</title>
        <meta name="description" content="Узнайте больше о нашей SEO платформе. Наша миссия, команда и технологии для успешного продвижения вашего сайта." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-orange-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-orange-400 bg-clip-text text-transparent">
            О SEO Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Мы создаём инновационные решения для 
            <span className="text-primary font-semibold"> SEO-оптимизации</span>, 
            которые помогают бизнесу достигать новых высот в поисковых системах
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              5+ лет опыта
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              10,000+ клиентов
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              50M+ проанализированных страниц
            </Badge>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link to="/audit">
                Попробовать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link to="/contact">Связаться с нами</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Наша миссия</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Демократизировать доступ к профессиональным SEO-инструментам для бизнеса любого размера
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Точность</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Предоставляем максимально точные данные и рекомендации на основе современных алгоритмов поисковых систем
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-green-100 dark:bg-green-900/30 w-fit mb-4">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Скорость</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Молниеносный анализ сайтов и мгновенные результаты для принятия быстрых решений
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Надёжность</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Стабильная работа платформы 24/7 с гарантией сохранности всех ваших данных
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Почему выбирают нас</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Комплексное решение для всех ваших SEO-задач в одной платформе
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Продвинутая аналитика",
                description: "Глубокий анализ всех аспектов SEO с детальными отчётами и рекомендациями"
              },
              {
                icon: Globe,
                title: "Мультиязычность",
                description: "Поддержка анализа сайтов на любых языках с учётом региональной специфики"
              },
              {
                icon: Award,
                title: "Экспертные алгоритмы",
                description: "Собственные алгоритмы, разработанные SEO-экспертами с многолетним опытом"
              },
              {
                icon: Users,
                title: "Командная работа",
                description: "Возможность совместной работы над проектами с назначением ролей"
              },
              {
                icon: Zap,
                title: "API интеграция",
                description: "Мощный API для интеграции с вашими существующими системами"
              },
              {
                icon: Shield,
                title: "Безопасность данных",
                description: "Высокий уровень защиты данных и соответствие стандартам безопасности"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="relative rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-orange-400/10 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Цифры, которые говорят сами за себя</h2>
              <p className="text-xl text-muted-foreground">
                Результаты нашей работы в цифрах
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                { number: "10,000+", label: "Довольных клиентов" },
                { number: "50M+", label: "Проанализированных страниц" },
                { number: "99.9%", label: "Время работы сервиса" },
                { number: "24/7", label: "Техническая поддержка" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Наши ценности</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Прозрачность",
                description: "Мы открыто делимся методологией наших алгоритмов и предоставляем понятные объяснения всех рекомендаций",
                points: ["Открытые алгоритмы", "Детальные объяснения", "Честные отчёты"]
              },
              {
                title: "Инновации",
                description: "Постоянно развиваем платформу, внедряя последние достижения в области SEO и машинного обучения",
                points: ["Передовые технологии", "Регулярные обновления", "Исследования и разработки"]
              },
              {
                title: "Клиентоориентированность",
                description: "Все решения принимаем с учётом потребностей наших пользователей и их обратной связи",
                points: ["Поддержка 24/7", "Персональный подход", "Обучающие материалы"]
              },
              {
                title: "Качество",
                description: "Высокие стандарты качества во всём - от точности данных до удобства интерфейса",
                points: ["Точные данные", "Интуитивный интерфейс", "Надёжная работа"]
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="h-full p-6">
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground mb-6">{value.description}</p>
                  <ul className="space-y-2">
                    {value.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="relative rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 md:p-12 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Готовы начать оптимизацию?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Присоединяйтесь к тысячам довольных клиентов и улучшите SEO вашего сайта уже сегодня
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                  <Link to="/audit">
                    Бесплатный аудит
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link to="/pricing">Посмотреть тарифы</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default About;
