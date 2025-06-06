
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SiteScanning: React.FC = () => {
  return (
    <Layout>
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
              <Search className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              SEO Аудит
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Полное сканирование сайта</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем и возможностей для улучшения.
          </p>
        </motion.div>

        {/* Основное содержимое */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <h2>Что включает полное сканирование?</h2>
              
              <p>
                Наш инструмент полного сканирования сайта проводит всесторонний анализ вашего веб-ресурса, 
                проверяя каждую страницу на соответствие современным SEO-стандартам. Система автоматически 
                обнаруживает и анализирует все доступные URL-адреса вашего сайта.
              </p>

              <h3>Ключевые возможности:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Target className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Глубокий анализ структуры</h4>
                    <p className="text-muted-foreground">
                      Проверка иерархии страниц, внутренних ссылок и архитектуры сайта
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <CheckCircle className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Обнаружение ошибок</h4>
                    <p className="text-muted-foreground">
                      Поиск битых ссылок, дублированного контента и технических проблем
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Процесс сканирования:</h3>
              
              <ol>
                <li><strong>Обнаружение страниц</strong> - Система находит все доступные URL через sitemap.xml и внутренние ссылки</li>
                <li><strong>Анализ контента</strong> - Каждая страница проверяется на качество контента и SEO-оптимизацию</li>
                <li><strong>Техническая проверка</strong> - Анализ скорости загрузки, мобильной версии и технических параметров</li>
                <li><strong>Формирование отчета</strong> - Создание детального отчета с рекомендациями по улучшению</li>
              </ol>

              <h3>Что вы получите:</h3>
              
              <ul>
                <li>Полный список всех страниц сайта</li>
                <li>Детальный анализ каждой страницы</li>
                <li>Приоритизированный список проблем</li>
                <li>Конкретные рекомендации по улучшению</li>
                <li>Экспорт результатов в различных форматах</li>
              </ul>
            </div>
          </motion.div>

          {/* Боковая панель */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Преимущества</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <TrendingUp size={16} className="mt-1 mr-2 text-primary" />
                    <span>Повышение позиций в поисковых системах</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="mt-1 mr-2 text-primary" />
                    <span>Выявление скрытых проблем</span>
                  </li>
                  <li className="flex items-start">
                    <Target size={16} className="mt-1 mr-2 text-primary" />
                    <span>Улучшение пользовательского опыта</span>
                  </li>
                  <li className="flex items-start">
                    <Search size={16} className="mt-1 mr-2 text-primary" />
                    <span>Комплексная SEO-диагностика</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Начать сканирование</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SiteScanning;
