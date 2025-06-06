
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Tag, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MetadataAnalysis: React.FC = () => {
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              SEO Оптимизация
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Анализ метаданных</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Проверка тегов title, description и других метаданных для максимальной оптимизации поисковой выдачи.
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
              <h2>Важность метаданных для SEO</h2>
              
              <p>
                Метаданные - это невидимые для пользователей элементы HTML-кода, которые предоставляют 
                поисковым системам информацию о содержимом вашей страницы. Правильно оптимизированные 
                метаданные значительно влияют на позиции в поисковой выдаче.
              </p>

              <h3>Что анализирует наш инструмент:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Tag className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Title теги</h4>
                    <p className="text-muted-foreground">
                      Проверка заголовков страниц на оптимальную длину и релевантность
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Eye className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Meta Description</h4>
                    <p className="text-muted-foreground">
                      Анализ описаний страниц для улучшения кликабельности в поиске
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Ключевые проверки:</h3>
              
              <ul>
                <li><strong>Длина title</strong> - Оптимальная длина 50-60 символов</li>
                <li><strong>Уникальность</strong> - Каждая страница должна иметь уникальный title</li>
                <li><strong>Ключевые слова</strong> - Наличие релевантных ключевых слов</li>
                <li><strong>Meta description</strong> - Длина 150-160 символов, призыв к действию</li>
                <li><strong>H1 теги</strong> - Соответствие заголовка странице</li>
                <li><strong>Open Graph</strong> - Метаданные для социальных сетей</li>
              </ul>

              <h3>Рекомендации по оптимизации:</h3>
              
              <p>
                Система автоматически проверяет все метаданные вашего сайта и предоставляет 
                конкретные рекомендации по улучшению каждого элемента. Вы получите детальный 
                отчет с приоритизированным списком изменений.
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
                <h3 className="text-xl font-semibold mb-4">Что проверяется</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Tag size={16} className="mt-1 mr-2 text-primary" />
                    <span>Title теги всех страниц</span>
                  </li>
                  <li className="flex items-start">
                    <FileText size={16} className="mt-1 mr-2 text-primary" />
                    <span>Meta descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <Eye size={16} className="mt-1 mr-2 text-primary" />
                    <span>H1-H6 заголовки</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp size={16} className="mt-1 mr-2 text-primary" />
                    <span>Open Graph теги</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Анализировать метаданные</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default MetadataAnalysis;
