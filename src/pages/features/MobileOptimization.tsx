
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MobileOptimization: React.FC = () => {
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
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Мобильная оптимизация
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Проверка мобильной версии</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Тестирование адаптивности и удобства использования на мобильных устройствах и планшетах.
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
              <h2>Mobile-First индексация</h2>
              
              <p>
                Google использует Mobile-First индексацию, что означает приоритет мобильной версии 
                сайта при ранжировании. Более 60% поискового трафика приходит с мобильных устройств, 
                поэтому мобильная оптимизация критически важна для успеха в SEO.
              </p>

              <h3>Что проверяет наш инструмент:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Smartphone className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Мобильные</h4>
                    <p className="text-muted-foreground">
                      Тестирование на популярных мобильных устройствах
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Tablet className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Планшеты</h4>
                    <p className="text-muted-foreground">
                      Проверка адаптивности на планшетах
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Monitor className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Десктоп</h4>
                    <p className="text-muted-foreground">
                      Сравнение с десктопной версией
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Критерии оценки:</h3>
              
              <ul>
                <li><strong>Viewport настройка</strong> - Корректная meta viewport настройка</li>
                <li><strong>Размер текста</strong> - Читаемость без зума</li>
                <li><strong>Размер кнопок</strong> - Минимум 44px для удобного нажатия</li>
                <li><strong>Горизонтальная прокрутка</strong> - Отсутствие горизонтального скролла</li>
                <li><strong>Скорость загрузки</strong> - Оптимизация для медленных соединений</li>
                <li><strong>Интерактивность</strong> - Удобство навигации и взаимодействия</li>
              </ul>

              <h3>Google Mobile-Friendly Test</h3>
              
              <p>
                Наш инструмент интегрирован с официальным тестом Google Mobile-Friendly Test 
                и предоставляет детальный анализ соответствия вашего сайта требованиям Google 
                для мобильной оптимизации.
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
                <h3 className="text-xl font-semibold mb-4">Проверяемые параметры</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Globe size={16} className="mt-1 mr-2 text-primary" />
                    <span>Адаптивный дизайн</span>
                  </li>
                  <li className="flex items-start">
                    <Smartphone size={16} className="mt-1 mr-2 text-primary" />
                    <span>Мобильная навигация</span>
                  </li>
                  <li className="flex items-start">
                    <Tablet size={16} className="mt-1 mr-2 text-primary" />
                    <span>Размеры элементов</span>
                  </li>
                  <li className="flex items-start">
                    <Monitor size={16} className="mt-1 mr-2 text-primary" />
                    <span>Кроссплатформенность</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Тестировать мобильную версию</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default MobileOptimization;
