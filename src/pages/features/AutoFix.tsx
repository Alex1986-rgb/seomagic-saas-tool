
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wrench, Zap, CheckCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AutoFix: React.FC = () => {
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
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Автоматизация
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Автоматическое исправление</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            ИИ-powered автоматическое исправление найденных SEO-ошибок и оптимизация контента.
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
              <h2>Революция в SEO-оптимизации</h2>
              
              <p>
                Наша система использует передовые алгоритмы искусственного интеллекта для 
                автоматического обнаружения и исправления SEO-проблем. Больше никаких 
                часов ручной работы - ИИ сделает всё за вас.
              </p>

              <h3>Что исправляется автоматически:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <Zap className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Метаданные</h4>
                    <p className="text-muted-foreground">
                      Автоматическая генерация и оптимизация title и description
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <CheckCircle className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Контент</h4>
                    <p className="text-muted-foreground">
                      Улучшение структуры и SEO-оптимизация текстов
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Типы автоматических исправлений:</h3>
              
              <ul>
                <li><strong>Title теги</strong> - Генерация оптимизированных заголовков</li>
                <li><strong>Meta descriptions</strong> - Создание привлекательных описаний</li>
                <li><strong>H1-H6 заголовки</strong> - Структурирование контента</li>
                <li><strong>Alt-теги изображений</strong> - Описания для всех изображений</li>
                <li><strong>Внутренние ссылки</strong> - Оптимизация анкорных текстов</li>
                <li><strong>Schema markup</strong> - Добавление структурированных данных</li>
              </ul>

              <h3>Как работает ИИ-оптимизация:</h3>
              
              <ol>
                <li><strong>Анализ</strong> - ИИ сканирует и анализирует ваш сайт</li>
                <li><strong>Выявление проблем</strong> - Обнаружение всех SEO-недочетов</li>
                <li><strong>Генерация решений</strong> - Создание оптимизированного контента</li>
                <li><strong>Автоматическое применение</strong> - Внедрение изменений</li>
                <li><strong>Контроль качества</strong> - Проверка результатов</li>
              </ol>

              <h3>Безопасность и контроль:</h3>
              
              <p>
                Система предоставляет полный контроль над процессом оптимизации. 
                Все изменения предварительно показываются для одобрения, и вы можете 
                настроить, какие типы исправлений применять автоматически.
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
                <h3 className="text-xl font-semibold mb-4">Автоматические исправления</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Wrench size={16} className="mt-1 mr-2 text-primary" />
                    <span>Оптимизация метаданных</span>
                  </li>
                  <li className="flex items-start">
                    <Zap size={16} className="mt-1 mr-2 text-primary" />
                    <span>Улучшение контента</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="mt-1 mr-2 text-primary" />
                    <span>Исправление ошибок</span>
                  </li>
                  <li className="flex items-start">
                    <Settings size={16} className="mt-1 mr-2 text-primary" />
                    <span>Техническая оптимизация</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Запустить автоисправление</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AutoFix;
