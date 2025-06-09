
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Target, CheckCircle, TrendingUp, Code, Search, Eye, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MetadataAnalysis: React.FC = () => {
  const metadataExamples = [
    {
      type: 'Хороший Title',
      example: '<title>SEO Аудит сайта - Бесплатная проверка | SeoMarket</title>',
      length: '52 символа',
      status: 'good'
    },
    {
      type: 'Плохой Title',
      example: '<title>Главная</title>',
      length: '7 символов',
      status: 'bad'
    },
    {
      type: 'Хороший Description',
      example: '<meta name="description" content="Проведите комплексный SEO аудит вашего сайта бесплатно. Анализ скорости, метаданных, структуры и получите детальные рекомендации для улучшения позиций в поиске.">',
      length: '156 символов',
      status: 'good'
    }
  ];

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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              SEO Аудит
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Анализ метаданных</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Проверка тегов title, description и других метаданных для максимальной оптимизации поисковой выдачи.
          </p>
        </motion.div>

        {/* Основное содержимое с вкладками */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="examples">Примеры</TabsTrigger>
              <TabsTrigger value="tools">Инструменты</TabsTrigger>
              <TabsTrigger value="tips">Советы</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Что включает анализ метаданных?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Наш инструмент анализа метаданных проводит всестороннюю проверку всех meta-тегов 
                    вашего сайта, выявляя проблемы и предлагая конкретные рекомендации для улучшения.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Target className="h-6 w-6 text-primary mb-2" />
                      <h4 className="font-semibold mb-2">Title теги</h4>
                      <p className="text-sm text-muted-foreground">
                        Проверка длины, уникальности и релевантности заголовков страниц
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <FileText className="h-6 w-6 text-primary mb-2" />
                      <h4 className="font-semibold mb-2">Meta Description</h4>
                      <p className="text-sm text-muted-foreground">
                        Анализ описаний страниц и их соответствие лучшим практикам SEO
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <Code className="h-6 w-6 text-primary mb-2" />
                      <h4 className="font-semibold mb-2">Open Graph</h4>
                      <p className="text-sm text-muted-foreground">
                        Проверка тегов для социальных сетей и мессенджеров
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <BarChart3 className="h-6 w-6 text-primary mb-2" />
                      <h4 className="font-semibold mb-2">Структурированные данные</h4>
                      <p className="text-sm text-muted-foreground">
                        Анализ микроразметки Schema.org для улучшения сниппетов
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Примеры хороших и плохих метаданных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {metadataExamples.map((example, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{example.type}</h4>
                          <Badge variant={example.status === 'good' ? 'default' : 'destructive'}>
                            {example.status === 'good' ? 'Хорошо' : 'Плохо'}
                          </Badge>
                        </div>
                        <code className="block bg-muted p-3 rounded text-sm overflow-x-auto">
                          {example.example}
                        </code>
                        <p className="text-sm text-muted-foreground mt-2">
                          Длина: {example.length}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Наши инструменты анализа</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg">
                      <Eye className="h-8 w-8 text-primary mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Предварительный просмотр</h4>
                      <p className="text-muted-foreground mb-4">
                        Посмотрите, как ваши страницы будут выглядеть в поисковой выдаче
                      </p>
                      <Button variant="outline" size="sm">Попробовать</Button>
                    </div>
                    
                    <div className="p-6 border rounded-lg">
                      <CheckCircle className="h-8 w-8 text-primary mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Автоматическая проверка</h4>
                      <p className="text-muted-foreground mb-4">
                        Массовая проверка всех страниц сайта на соответствие стандартам
                      </p>
                      <Button variant="outline" size="sm">Запустить</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Рекомендации по оптимизации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Title теги</h4>
                        <p className="text-muted-foreground">Длина 50-60 символов, уникальные для каждой страницы</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Meta Description</h4>
                        <p className="text-muted-foreground">150-160 символов, призыв к действию</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Ключевые слова</h4>
                        <p className="text-muted-foreground">Естественное включение в начале title и description</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Боковая панель с преимуществами */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Процесс анализа метаданных</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Сканирование сайта</h4>
                      <p className="text-muted-foreground">Автоматическое обнаружение всех страниц и извлечение метаданных</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Анализ соответствия</h4>
                      <p className="text-muted-foreground">Проверка длины, уникальности и качества метатегов</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Генерация отчета</h4>
                      <p className="text-muted-foreground">Детальный отчет с конкретными рекомендациями</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Мониторинг изменений</h4>
                      <p className="text-muted-foreground">Отслеживание улучшений после внесения изменений</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Преимущества</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <TrendingUp size={16} className="mt-1 mr-2 text-primary" />
                  <span>Улучшение CTR в поиске до 30%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="mt-1 mr-2 text-primary" />
                  <span>Автоматическое выявление дублей</span>
                </li>
                <li className="flex items-start">
                  <Target size={16} className="mt-1 mr-2 text-primary" />
                  <span>Оптимизация для социальных сетей</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 size={16} className="mt-1 mr-2 text-primary" />
                  <span>Повышение видимости в поиске</span>
                </li>
              </ul>
              
              <Button className="w-full mt-6">Начать анализ</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Готовы оптимизировать метаданные?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Запустите анализ метаданных вашего сайта прямо сейчас и получите детальный отчет 
                с конкретными рекомендациями по улучшению.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Бесплатный анализ</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Получить консультацию</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MetadataAnalysis;
