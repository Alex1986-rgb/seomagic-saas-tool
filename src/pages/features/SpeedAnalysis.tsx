import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, CheckCircle, Gauge, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Проверка скорости.
 *
 * Страница показывала «демо-анализ Core Web Vitals» (LCP 2.1 с, FID 85 мс,
 * CLS 0.05), «время до интерактивности», «непрерывный мониторинг» с
 * автоматическими проверками и замеры по устройствам. Аудит ничего из этого не
 * измеряет: браузер страницу не отрисовывает, Core Web Vitals не считаются,
 * проверок по расписанию нет.
 *
 * Теперь описаны замеры, которые аудит действительно сохраняет для каждой
 * страницы, а общие советы по ускорению подписаны как советы, а не как
 * результаты проверки.
 */
const SpeedAnalysis: React.FC = () => {
  const measured = [
    { name: 'Время ответа сервера (TTFB)', description: 'Сколько сервер думает, прежде чем начать отдавать страницу' },
    { name: 'Время загрузки', description: 'Сколько занимает получение HTML-кода страницы' },
    { name: 'Сжатие', description: 'Отдаёт ли сервер страницу в сжатом виде (gzip, brotli)' },
    { name: 'Размер ответа', description: 'Объём HTML-кода страницы и переданных данных' }
  ];

  const optimizationTips = [
    { title: 'Включить сжатие', description: 'Сжатие gzip или brotli на сервере уменьшает объём передаваемого кода' },
    { title: 'Ускорить ответ сервера', description: 'Кеширование страниц и лёгкие запросы к базе сокращают время ответа' },
    { title: 'Оптимизировать изображения', description: 'Сжатие и современные форматы (WebP, AVIF) облегчают страницу' },
    { title: 'Отложенная загрузка', description: 'Картинки ниже первого экрана можно загружать по мере прокрутки' }
  ];

  return (
    <Layout>
      <PageSeo
        title="Проверка скорости сайта: время ответа сервера и сжатие"
        description="Аудит замеряет для каждой страницы время ответа сервера, время загрузки HTML, сжатие и размер ответа — и показывает медленные страницы."
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
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Производительность
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Проверка скорости загрузки</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Аудит замеряет скорость ответа каждой страницы и показывает, какие страницы
            отвечают медленно или отдаются без сжатия.
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
                <Gauge className="h-5 w-5" />
                Что замеряет аудит
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
              <p className="text-sm text-muted-foreground">
                Core Web Vitals (LCP, INP, CLS) и отрисовку страницы в браузере аудит сейчас не измеряет.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Общие советы по ускорению
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationTips.map((tip) => (
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
              <h3 className="text-2xl font-bold mb-4">Проверьте скорость своего сайта</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Запустите аудит — в результатах будут время ответа и сжатие для каждой страницы.
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

export default SpeedAnalysis;
