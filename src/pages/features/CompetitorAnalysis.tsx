import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Search, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Анализ конкурентов.
 *
 * Страница показывала «демо» с настоящими доменами чужих компаний —
 * seo-expert.ru, megagroup.ru, seoprofy.ua — и придуманными для них
 * «видимостью 85%», «1247 ключевыми словами», «трафиком 15 600» и динамикой,
 * таблицу «ваша позиция / позиция конкурента», вкладки со стратегиями и кнопки
 * без обработчиков. Отдельного инструмента анализа конкурентов в сервисе нет, а
 * выдуманные цифры о реальных компаниях публиковать нельзя.
 *
 * Теперь страница честно говорит, что инструмента нет, и объясняет, что можно
 * сделать уже сейчас существующими функциями.
 */
const CompetitorAnalysis: React.FC = () => {
  const workarounds = [
    {
      title: 'Аудит сайта конкурента',
      description: 'Запустите аудит для сайта конкурента и сравните найденные ошибки, метатеги и скорость ответа со своими.',
      icon: Search,
      link: '/audit',
      action: 'Запустить аудит'
    },
    {
      title: 'Позиции конкурента по вашим запросам',
      description: 'В трекере позиций укажите домен конкурента и тот же список запросов, что и для своего сайта, — получите места обоих сайтов в выдаче.',
      icon: BarChart3,
      link: '/position-tracker',
      action: 'Открыть трекер'
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Анализ конкурентов: как сравнить сайты в SeoMarket"
        description="Отдельного инструмента анализа конкурентов пока нет. Как сравнить свой сайт с конкурентом с помощью аудита и проверки позиций."
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">
              Отдельного инструмента пока нет
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Анализ конкурентов</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Автоматического сравнения с конкурентами — видимости, трафика и общих запросов — в
            сервисе пока нет. Сравнить сайты можно вручную с помощью аудита и проверки позиций.
          </p>
        </motion.div>

        {/* Что можно сделать сейчас */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workarounds.map((item) => (
              <Card key={item.title} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Button variant="outline" asChild>
                    <Link to={item.link}>{item.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Нужен разбор конкурентов?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Расскажите, с какими сайтами хотите сравниться, — обсудим, чем можем помочь.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Написать нам</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/features">Все возможности</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CompetitorAnalysis;
