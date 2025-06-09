
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Target, CheckCircle, TrendingUp, Bot, Settings, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const AutoFix: React.FC = () => {
  const [fixingProgress, setFixingProgress] = useState(68);

  const autoFixResults = [
    {
      category: 'Meta теги',
      fixed: 23,
      total: 28,
      status: 'progress',
      description: 'Оптимизация заголовков и описаний'
    },
    {
      category: 'Изображения',
      fixed: 156,
      total: 156,
      status: 'completed',
      description: 'Добавление alt атрибутов'
    },
    {
      category: 'Внутренние ссылки',
      fixed: 12,
      total: 18,
      status: 'progress',
      description: 'Исправление анкоров ссылок'
    },
    {
      category: 'Структурированные данные',
      fixed: 8,
      total: 8,
      status: 'completed',
      description: 'Добавление Schema.org разметки'
    }
  ];

  const aiCapabilities = [
    {
      title: 'Генерация мета-тегов',
      description: 'ИИ создает уникальные title и description на основе контента страницы',
      icon: Sparkles,
      examples: ['Автоматический title для 247 страниц', 'Уникальные описания для категорий', 'SEO-оптимизированные заголовки']
    },
    {
      title: 'Оптимизация контента',
      description: 'Улучшение текстов для лучшего ранжирования в поисковых системах',
      icon: Target,
      examples: ['Распределение ключевых слов', 'Улучшение читаемости', 'Оптимизация длины контента']
    },
    {
      title: 'Техническое SEO',
      description: 'Автоматическое исправление технических проблем сайта',
      icon: Settings,
      examples: ['Исправление дублированного контента', 'Оптимизация внутренней перелинковки', 'Настройка robots.txt']
    },
    {
      title: 'Структурированные данные',
      description: 'Автоматическое добавление микроразметки для богатых сниппетов',
      icon: Bot,
      examples: ['Schema.org для товаров', 'Разметка статей и FAQ', 'Локальная разметка для бизнеса']
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
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              ИИ-технологии
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Автоматическое исправление</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            ИИ-powered автоматическое исправление найденных SEO-ошибок и оптимизация контента.
          </p>
        </motion.div>

        {/* Демо процесса исправления */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Процесс автоматического исправления - Демо
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Общий прогресс оптимизации</span>
                  <span className="text-sm text-muted-foreground">{fixingProgress}% завершено</span>
                </div>
                <Progress value={fixingProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Исправлено 199 из 292 проблем • Время выполнения: 12 минут
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {autoFixResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="p-4 border rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{result.category}</h4>
                      <Badge variant={result.status === 'completed' ? 'default' : 'secondary'}>
                        {result.status === 'completed' ? 'Завершено' : 'В процессе'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{result.description}</p>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs">Прогресс</span>
                      <span className="text-xs font-medium">{result.fixed}/{result.total}</span>
                    </div>
                    <Progress value={(result.fixed / result.total) * 100} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Возможности ИИ */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="capabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="capabilities">Возможности ИИ</TabsTrigger>
              <TabsTrigger value="examples">Примеры</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
              <TabsTrigger value="results">Результаты</TabsTrigger>
            </TabsList>
            
            <TabsContent value="capabilities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiCapabilities.map((capability, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <capability.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{capability.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{capability.description}</p>
                          <div className="space-y-1">
                            {capability.examples.map((example, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-muted-foreground">{example}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Пример: Генерация meta-описания</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-800 mb-2">До оптимизации:</h5>
                        <code className="text-sm text-red-700">
                          &lt;meta name="description" content="Главная страница"&gt;
                        </code>
                        <p className="text-xs text-red-600 mt-1">Длина: 15 символов (слишком короткое)</p>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">После оптимизации ИИ:</h5>
                        <code className="text-sm text-green-700">
                          &lt;meta name="description" content="Профессиональный SEO аудит сайта с детальным анализом технических ошибок, оптимизации контента и рекомендациями по улучшению позиций в поисковых системах."&gt;
                        </code>
                        <p className="text-xs text-green-600 mt-1">Длина: 157 символов (оптимально)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Пример: Оптимизация заголовков</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-semibold text-red-800 mb-2">До:</h5>
                        <code className="text-sm text-red-700">&lt;h1&gt;Услуги&lt;/h1&gt;</code>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">После ИИ:</h5>
                        <code className="text-sm text-green-700">&lt;h1&gt;SEO услуги и продвижение сайтов в Москве&lt;/h1&gt;</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки автоматического исправления</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Автоматическая генерация meta-тегов</h4>
                        <p className="text-sm text-muted-foreground">ИИ создает title и description для страниц без них</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Оптимизация изображений</h4>
                        <p className="text-sm text-muted-foreground">Автоматическое добавление alt атрибутов</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Исправление технических ошибок</h4>
                        <p className="text-sm text-muted-foreground">Автоматическая коррекция распространенных проблем</p>
                      </div>
                      <Badge variant="secondary">Настроить</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Требовать подтверждение</h4>
                        <p className="text-sm text-muted-foreground">Запрашивать разрешение перед внесением изменений</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Результаты автоматических исправлений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-semibold mb-2">Исправлено проблем</h4>
                      <div className="text-2xl font-bold text-primary">1,247</div>
                      <p className="text-xs text-green-600">+89% за месяц</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-semibold mb-2">Улучшение позиций</h4>
                      <div className="text-2xl font-bold text-primary">+23</div>
                      <p className="text-xs text-green-600">средний рост</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-semibold mb-2">Время экономии</h4>
                      <div className="text-2xl font-bold text-primary">47ч</div>
                      <p className="text-xs text-green-600">ручной работы</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Последние исправления:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span>Оптимизированы meta-теги для 23 страниц</span>
                        <span className="text-xs text-muted-foreground">2 часа назад</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span>Добавлены alt атрибуты к 156 изображениям</span>
                        <span className="text-xs text-muted-foreground">1 день назад</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span>Исправлена внутренняя перелинковка</span>
                        <span className="text-xs text-muted-foreground">2 дня назад</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
              <h3 className="text-2xl font-bold mb-4">Попробуйте автоматические исправления</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Позвольте ИИ автоматически исправить найденные SEO-проблемы и оптимизировать 
                ваш сайт для лучших позиций в поисковых системах.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Запустить ИИ-оптимизацию</Link>
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

export default AutoFix;
