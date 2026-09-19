import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart, Target, Eye, Clock, Search, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Отслеживание позиций (страница из главного меню «Позиции»).
 *
 * Здесь описывался трекер, которого нет: ежедневные автоматические проверки
 * «в одно и то же время», Bing и «другие поисковые системы», отдельные
 * мобильные позиции, мгновенные уведомления и email-отчёты «Включено»,
 * «конкурентный анализ», доли трафика поисковиков (65% / 28% / 5%), кнопки
 * «Посмотреть демо», «Подробнее», «Скачать», «Создать», «Сравнить» без
 * обработчиков и обещание «первые 10 ключевых слов отслеживаются бесплатно».
 *
 * Теперь описано то, что делает трекер на самом деле: проверка по списку
 * запросов в Яндексе и Google с регионом и глубиной, запуск вручную, история
 * проверок. Пример таблицы подписан как условный.
 */
const PositionTracking: React.FC = () => {
  const trackingFeatures = [
    {
      title: 'Яндекс и Google',
      description: 'Проверка в одной поисковой системе или сразу в обеих',
      icon: Eye,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Регион выдачи',
      description: 'Для Яндекса — номер региона, для Google — код страны',
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Глубина проверки',
      description: 'Сайт ищется в первых 10–100 результатах выдачи',
      icon: Layers,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Данные из реальной выдачи',
      description: 'Позиции берутся у поставщика поисковой выдачи, а не рассчитываются на глаз',
      icon: Search,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'История проверок',
      description: 'Результаты сохраняются — можно сравнить с прошлыми проверками',
      icon: Clock,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  // Условный пример: показывает, как выглядит результат, а не данные реального сайта.
  const demoKeywords = [
    { keyword: 'seo оптимизация', position: 3 },
    { keyword: 'аудит сайта', position: 7 },
    { keyword: 'продвижение сайта', position: 12 },
    { keyword: 'техническое seo', position: 18 },
    { keyword: 'анализ сайта онлайн', position: 0 }
  ];

  return (
    <Layout>
      <PageSeo
        title="Отслеживание позиций сайта в Яндексе и Google по запросам"
        description="Проверка мест сайта в выдаче Яндекса и Google по вашему списку запросов: регион, глубина до 100 позиций, история проверок."
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>На главную</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Яндекс и Google
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Отслеживание позиций
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Узнайте, на каком месте ваш сайт стоит в выдаче Яндекса и Google по важным запросам,
            и следите, как позиции меняются после оптимизации.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Link to="/position-tracker">Проверить позиции</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/position-pricing">Тарифы</Link>
            </Button>
          </div>
        </motion.div>

        {/* Возможности отслеживания */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как устроена проверка</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Вы указываете домен и список запросов, сервис находит сайт в выдаче и сохраняет результат
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Пример результата */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Как выглядит результат (условный пример)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoKeywords.map((keyword) => (
                  <div
                    key={keyword.keyword}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <h4 className="font-semibold">{keyword.keyword}</h4>
                    <Badge variant={keyword.position > 0 ? 'secondary' : 'outline'}>
                      {keyword.position > 0 ? `Позиция ${keyword.position}` : 'Не найден в выдаче'}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Проверки запускаются вручную: расписания и уведомлений об изменениях позиций сейчас нет.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Проверьте позиции своего сайта</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Введите домен и запросы в трекере. Если нужен регулярный мониторинг большого объёма —
                оставьте заявку.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Link to="/position-tracker">Проверить позиции</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Оставить заявку</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PositionTracking;
