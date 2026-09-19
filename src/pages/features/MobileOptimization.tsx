import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, CheckCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Проверка мобильной версии.
 *
 * Страница показывала тестирование на «телефоне 375 × 667 по 4G», «планшете»
 * и «десктопе» с оценками 85 / 92 / 96, найденные «слишком мелкие кнопки» и
 * «горизонтальную прокрутку», проверки размера кнопок, читаемости текста и
 * кеширования. Аудит не открывает сайт в эмуляторе устройств и ничего из этого
 * не проверяет: из мобильных параметров он смотрит только наличие meta
 * viewport.
 *
 * Теперь честно описано, что проверяется, а общие советы по мобильной версии
 * подписаны как советы, а не как результаты проверки.
 */
const MobileOptimization: React.FC = () => {
  const measured = [
    { name: 'Meta viewport', description: 'Есть ли на странице тег, без которого сайт на телефоне показывается уменьшенной копией десктопа' },
    { name: 'Скорость ответа', description: 'Время ответа сервера и сжатие — медленные страницы особенно заметны в мобильной сети' },
    { name: 'Изображения без alt', description: 'Картинки без описания хуже понимают поисковики и экранные дикторы' }
  ];

  const tips = [
    { title: 'Крупные элементы для нажатия', description: 'Кнопки и ссылки должны быть удобны для пальца, с отступами между ними' },
    { title: 'Читаемый шрифт', description: 'Текст должен читаться без увеличения масштаба' },
    { title: 'Без горизонтальной прокрутки', description: 'Содержимое должно помещаться в ширину экрана' },
    { title: 'Лёгкие изображения', description: 'Уменьшенные версии картинок для узких экранов ускоряют загрузку' }
  ];

  return (
    <Layout>
      <PageSeo
        title="Мобильная версия сайта: что проверяет аудит"
        description="Какие мобильные параметры проверяет аудит — meta viewport, скорость ответа, изображения без alt — и общие советы по удобству сайта на телефоне."
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
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Мобильная оптимизация
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Проверка мобильной версии</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Аудит проверяет базовые параметры, от которых зависит, как сайт открывается на телефоне.
            Тестирования в эмуляторе устройств в сервисе нет.
          </p>
        </motion.div>

        <motion.div
          className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Что проверяет аудит
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {measured.map((item) => (
                <div key={item.name} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Общие советы для мобильной версии
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.map((tip) => (
                <div key={tip.title} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
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
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Проверьте свой сайт</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Запустите аудит — в результатах будут страницы без meta viewport, медленные страницы
                и изображения без alt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Запустить аудит</Link>
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

export default MobileOptimization;
