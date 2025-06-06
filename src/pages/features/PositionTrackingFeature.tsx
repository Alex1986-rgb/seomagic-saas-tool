
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, Target, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PositionTrackingFeature: React.FC = () => {
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
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Мониторинг позиций
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Отслеживание позиций</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Ежедневный мониторинг позиций вашего сайта в поисковых системах по ключевым словам.
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
              <h2>Почему важно отслеживать позиции?</h2>
              
              <p>
                Мониторинг позиций в поисковых системах позволяет контролировать эффективность 
                SEO-стратегии, отслеживать динамику изменений и своевременно реагировать на 
                алгоритмические обновления поисковых систем.
              </p>

              <h3>Возможности системы:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Динамика позиций</h4>
                    <p className="text-muted-foreground">
                      Отслеживание изменений позиций в реальном времени
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Target className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Ключевые слова</h4>
                    <p className="text-muted-foreground">
                      Мониторинг неограниченного количества ключевых запросов
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Поддерживаемые поисковые системы:</h3>
              
              <ul>
                <li><strong>Google</strong> - Основная поисковая система для большинства регионов</li>
                <li><strong>Яндекс</strong> - Ведущая поисковая система в России и СНГ</li>
                <li><strong>Bing</strong> - Поисковая система Microsoft</li>
                <li><strong>DuckDuckGo</strong> - Поисковик с фокусом на приватность</li>
              </ul>

              <h3>Аналитика и отчеты:</h3>
              
              <p>
                Система предоставляет детальную аналитику изменений позиций:
              </p>
              
              <ul>
                <li>Графики динамики позиций по времени</li>
                <li>Сравнение позиций по разным поисковым системам</li>
                <li>Анализ видимости сайта в поиске</li>
                <li>Уведомления о значительных изменениях</li>
                <li>Экспорт данных в различных форматах</li>
              </ul>

              <h3>Региональное отслеживание:</h3>
              
              <p>
                Возможность настройки мониторинга для разных географических регионов, 
                что особенно важно для локального бизнеса и международных проектов.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Что отслеживается</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <BarChart3 size={16} className="mt-1 mr-2 text-primary" />
                    <span>Позиции по ключевым словам</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp size={16} className="mt-1 mr-2 text-primary" />
                    <span>Динамика изменений</span>
                  </li>
                  <li className="flex items-start">
                    <Target size={16} className="mt-1 mr-2 text-primary" />
                    <span>Видимость сайта</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar size={16} className="mt-1 mr-2 text-primary" />
                    <span>Исторические данные</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Начать отслеживание</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PositionTrackingFeature;
