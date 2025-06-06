
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Clock, Gauge, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SpeedAnalysis: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

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
            Анализ времени загрузки страниц и детальные рекомендации по увеличению скорости сайта.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <h2>Почему скорость сайта критически важна?</h2>
              
              <p>
                Скорость загрузки сайта напрямую влияет на пользовательский опыт, конверсию и 
                позиции в поисковых системах. Google использует скорость загрузки как один из 
                ключевых факторов ранжирования, особенно для мобильных устройств.
              </p>

              <h3>Что мы анализируем:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Clock className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Core Web Vitals</h4>
                    <p className="text-muted-foreground">
                      Анализ ключевых метрик производительности от Google
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Gauge className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">PageSpeed Insights</h4>
                    <p className="text-muted-foreground">
                      Интеграция с официальными инструментами Google
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Ключевые метрики:</h3>
              
              <ul>
                <li><strong>First Contentful Paint (FCP)</strong> - Время отображения первого контента</li>
                <li><strong>Largest Contentful Paint (LCP)</strong> - Загрузка основного контента</li>
                <li><strong>First Input Delay (FID)</strong> - Время до первого взаимодействия</li>
                <li><strong>Cumulative Layout Shift (CLS)</strong> - Стабильность визуального контента</li>
                <li><strong>Time to Interactive (TTI)</strong> - Время до полной интерактивности</li>
              </ul>

              <h3>Рекомендации по оптимизации:</h3>
              
              <p>
                Система предоставляет конкретные рекомендации по улучшению каждой метрики:
              </p>
              
              <ul>
                <li>Оптимизация изображений и форматов</li>
                <li>Минификация CSS и JavaScript</li>
                <li>Настройка кэширования</li>
                <li>Оптимизация критического пути рендеринга</li>
                <li>Использование CDN</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Результаты анализа</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Zap size={16} className="mt-1 mr-2 text-primary" />
                    <span>Общий балл производительности</span>
                  </li>
                  <li className="flex items-start">
                    <Clock size={16} className="mt-1 mr-2 text-primary" />
                    <span>Детальная разбивка по метрикам</span>
                  </li>
                  <li className="flex items-start">
                    <Gauge size={16} className="mt-1 mr-2 text-primary" />
                    <span>Сравнение с конкурентами</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp size={16} className="mt-1 mr-2 text-primary" />
                    <span>Приоритизированные улучшения</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Проверить скорость</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SpeedAnalysis;
