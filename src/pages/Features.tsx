import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { HowToSchema } from '@/components/seo/HowToSchema';
import {
  Search,
  BarChart3,
  TrendingUp,
  Zap,
  FileCode,
  Star,
  ArrowRight,
  Sparkles,
  Rocket,
  Brain
} from 'lucide-react';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Возможности платформы.
 *
 * На странице были счётчики «50K+ проанализированных сайтов», «1M+
 * отслеживаемых ключевых слов», «99.9% время работы» и «24/7 поддержка»,
 * третий по счёту набор тарифов («Базовый / Профессиональный / Корпоративный»
 * с почасовыми проверками и API — не совпадал ни с /pricing, ни с
 * /position-pricing), «расширенные возможности», которых нет (White Label,
 * мониторинг упоминаний бренда, командная работа, API), и призыв
 * «присоединяйтесь к тысячам специалистов» с «14 днями бесплатно». Кнопки
 * «Начать бесплатно», «Посмотреть демо», «Начать бесплатный период» и
 * «Связаться с нами» ничего не делали.
 *
 * Выдуманное убрано. Карточки описывают то, что сервис действительно делает,
 * кнопки ведут на аудит, демо и форму связи.
 */
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
      description: "Обход страниц сайта и проверка title, description, заголовков, canonical и индексируемости",
      category: "Анализ"
    },
    {
      icon: BarChart3,
      title: "Отслеживание позиций",
      description: "Места сайта в выдаче Яндекса и Google по вашему списку запросов с учётом региона",
      category: "Мониторинг"
    },
    {
      icon: Brain,
      title: "ИИ-оптимизация",
      description: "Языковая модель готовит новые title, description и тексты для страниц с ошибками",
      category: "Оптимизация"
    },
    {
      icon: TrendingUp,
      title: "Отчеты",
      description: "Результаты аудита по каждой странице и выгрузка отчёта в PDF",
      category: "Отчетность"
    },
    {
      icon: FileCode,
      title: "Технические ошибки",
      description: "Коды ответа, цепочки редиректов, изображения без alt и страницы с малым объёмом текста",
      category: "Техническое SEO"
    },
    {
      icon: Zap,
      title: "Скорость загрузки",
      description: "Время ответа сервера, время загрузки и сжатие страниц",
      category: "Производительность"
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Возможности платформы: аудит, позиции и оптимизация"
        description="Обзор функций: сканирование всех страниц, анализ метаданных, отслеживание позиций, отчёты о скорости загрузки и правка текстов."
      />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Возможности', url: '/features' }
      ]} />
      <ServiceSchema />
      <HowToSchema />
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
                  Инструменты SEO в одном сервисе
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
                Аудит страниц сайта, проверка позиций в Яндексе и Google и подготовка
                исправленных текстов с помощью ИИ
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/audit">
                    <Rocket className="w-5 h-5 mr-2" />
                    Проверить сайт
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                  <Link to="/demo">
                    Посмотреть демо
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>
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
                  Что сервис делает с вашим сайтом
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
                    Запустите аудит своего сайта или напишите нам, если нужна помощь
                    с оптимизацией или расчёт стоимости работ
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="text-lg px-8" asChild>
                      <Link to="/audit">Проверить сайт</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                      <Link to="/contact">Связаться с нами</Link>
                    </Button>
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
