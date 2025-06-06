
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Eye, TrendingDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CompetitorAnalysis: React.FC = () => {
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
              <Users className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Конкурентная разведка
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Анализ конкурентов</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Сравнение ваших позиций с конкурентами для определения оптимальной SEO-стратегии.
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
              <h2>Зачем анализировать конкурентов?</h2>
              
              <p>
                Анализ конкурентов помогает понять, какие стратегии работают в вашей нише, 
                выявить пробелы в их подходе и использовать эту информацию для опережения 
                в поисковой выдаче.
              </p>

              <h3>Что анализируется:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Eye className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Позиции конкурентов</h4>
                    <p className="text-muted-foreground">
                      Сравнение позиций по одинаковым ключевым словам
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <TrendingDown className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Возможности роста</h4>
                    <p className="text-muted-foreground">
                      Выявление ключевых слов с потенциалом опережения
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Ключевые метрики анализа:</h3>
              
              <ul>
                <li><strong>Органическая видимость</strong> - Доля присутствия в поисковой выдаче</li>
                <li><strong>Ключевые слова</strong> - Сравнение семантических ядер</li>
                <li><strong>Контентная стратегия</strong> - Анализ типов контента конкурентов</li>
                <li><strong>Техническое SEO</strong> - Сравнение технических показателей</li>
                <li><strong>Ссылочная масса</strong> - Анализ профиля ссылок</li>
              </ul>

              <h3>Отчеты и рекомендации:</h3>
              
              <p>
                Система автоматически генерирует отчеты с конкретными рекомендациями:
              </p>
              
              <ul>
                <li>Список ключевых слов для атаки</li>
                <li>Анализ контентных пробелов</li>
                <li>Технические улучшения</li>
                <li>Стратегии линкбилдинга</li>
                <li>Приоритизация действий</li>
              </ul>

              <h3>Мониторинг изменений:</h3>
              
              <p>
                Постоянное отслеживание действий конкурентов позволяет быстро реагировать 
                на их изменения в стратегии и поддерживать конкурентное преимущество.
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
                <h3 className="text-xl font-semibold mb-4">Анализируемые данные</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Users size={16} className="mt-1 mr-2 text-primary" />
                    <span>Топ конкуренты по нише</span>
                  </li>
                  <li className="flex items-start">
                    <Eye size={16} className="mt-1 mr-2 text-primary" />
                    <span>Органическая видимость</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingDown size={16} className="mt-1 mr-2 text-primary" />
                    <span>Пробелы в позициях</span>
                  </li>
                  <li className="flex items-start">
                    <Shield size={16} className="mt-1 mr-2 text-primary" />
                    <span>Стратегии продвижения</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Анализировать конкурентов</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CompetitorAnalysis;
