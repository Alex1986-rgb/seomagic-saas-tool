
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Target, CheckCircle, TrendingUp, Bot, Code, FileText, Settings, Sparkles, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const AIOptimization: React.FC = () => {
  const [automationLevel, setAutomationLevel] = useState(90);

  const aiFeatures = [
    {
      title: 'Автоматическое исправление title и meta',
      description: 'ИИ анализирует контент и создает оптимальные заголовки и описания',
      icon: FileText,
      automation: 95,
      impact: 'Высокий',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Оптимизация структуры заголовков',
      description: 'Автоматическая корректировка H1-H6 для лучшей иерархии',
      icon: Settings,
      automation: 85,
      impact: 'Средний',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Генерация alt атрибутов',
      description: 'ИИ создает описания изображений на основе их содержимого',
      icon: Bot,
      automation: 100,
      impact: 'Средний',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Оптимизация internal linking',
      description: 'Умное создание внутренних ссылок между страницами',
      icon: Target,
      automation: 75,
      impact: 'Высокий',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Схема разметка Schema.org',
      description: 'Автоматическое добавление структурированных данных',
      icon: Code,
      automation: 90,
      impact: 'Высокий',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Контентная оптимизация',
      description: 'Улучшение текста для лучшего ранжирования',
      icon: Brain,
      automation: 70,
      impact: 'Очень высокий',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const optimizationSteps = [
    {
      step: 1,
      title: 'Анализ сайта',
      description: 'ИИ сканирует весь сайт и выявляет проблемы',
      status: 'completed'
    },
    {
      step: 2,
      title: 'Создание плана',
      description: 'Формирование стратегии оптимизации',
      status: 'completed'
    },
    {
      step: 3,
      title: 'Автоматические исправления',
      description: 'Применение безопасных оптимизаций',
      status: 'in-progress'
    },
    {
      step: 4,
      title: 'Проверка результатов',
      description: 'Валидация внесенных изменений',
      status: 'pending'
    },
    {
      step: 5,
      title: 'Отчет о результатах',
      description: 'Подробный отчет о проделанной работе',
      status: 'pending'
    }
  ];

  const beforeAfter = [
    {
      element: 'Title тег',
      before: 'Главная - Мой сайт',
      after: 'Профессиональные услуги SEO оптимизации | SeoMarket',
      improvement: '+85% кликабельность'
    },
    {
      element: 'Meta описание',
      before: 'Описание сайта',
      after: 'Увеличьте трафик на 300% с нашими SEO услугами. Бесплатный аудит за 24 часа. Гарантия результата.',
      improvement: '+67% CTR'
    },
    {
      element: 'H1 заголовок',
      before: 'Добро пожаловать',
      after: 'Увеличьте органический трафик на 300% за 3 месяца',
      improvement: '+120% конверсия'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>На главную</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 relative">
              <Zap className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-4 w-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              До 90% автоматизации
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ИИ Оптимизация
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Автоматическое применение оптимизаций с использованием продвинутых алгоритмов искусственного интеллекта. 
            Доверьте SEO машинному обучению.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link to="/audit">Запустить ИИ оптимизацию</Link>
            </Button>
            <Button variant="outline" size="lg">
              Посмотреть демо
            </Button>
          </div>
        </motion.div>

        {/* Уровень автоматизации */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Уровень автоматизации - {automationLevel}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={automationLevel} className="h-4 mb-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Базовые исправления</span>
                  <span>Полная автоматизация</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Автоматических исправлений</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600 mb-1">2.3 сек</div>
                  <div className="text-sm text-muted-foreground">Среднее время исправления</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">99.8%</div>
                  <div className="text-sm text-muted-foreground">Точность исправлений</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ИИ возможности */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Возможности ИИ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Искусственный интеллект автоматически исправляет SEO проблемы без вашего участия
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.automation}% авто
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Влияние:</span>
                        <Badge variant={
                          feature.impact === 'Очень высокий' ? 'default' :
                          feature.impact === 'Высокий' ? 'secondary' : 'outline'
                        }>
                          {feature.impact}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Табы с процессом */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="process" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="process">Процесс</TabsTrigger>
              <TabsTrigger value="before-after">До и После</TabsTrigger>
              <TabsTrigger value="safety">Безопасность</TabsTrigger>
              <TabsTrigger value="results">Результаты</TabsTrigger>
            </TabsList>
            
            <TabsContent value="process" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Этапы ИИ оптимизации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step.status === 'completed' ? 'bg-green-100 text-green-700' :
                          step.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {step.status === 'completed' ? '✓' : step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <Badge variant={
                          step.status === 'completed' ? 'default' :
                          step.status === 'in-progress' ? 'secondary' : 'outline'
                        }>
                          {step.status === 'completed' ? 'Завершено' :
                           step.status === 'in-progress' ? 'В процессе' : 'Ожидание'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="before-after" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Примеры улучшений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {beforeAfter.map((example, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{example.element}</h4>
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            {example.improvement}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="text-xs text-red-600 font-medium mb-1">ДО:</div>
                            <div className="text-sm">{example.before}</div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="text-xs text-green-600 font-medium mb-1">ПОСЛЕ:</div>
                            <div className="text-sm">{example.after}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="safety" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Безопасность и контроль</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Создание резервных копий</h4>
                        <p className="text-sm text-muted-foreground">Автоматическое сохранение оригинального кода перед изменениями</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Поэтапное применение</h4>
                        <p className="text-sm text-muted-foreground">Изменения вносятся постепенно с возможностью отката</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Валидация изменений</h4>
                        <p className="text-sm text-muted-foreground">Проверка корректности HTML и структуры после изменений</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Ручная проверка критичных изменений</h4>
                        <p className="text-sm text-muted-foreground">Важные правки требуют подтверждения пользователя</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ожидаемые результаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">+150%</div>
                      <div className="text-sm text-muted-foreground">Органический трафик</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">+85%</div>
                      <div className="text-sm text-muted-foreground">CTR в поиске</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">-70%</div>
                      <div className="text-sm text-muted-foreground">Время на оптимизацию</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">+40</div>
                      <div className="text-sm text-muted-foreground">Позиций в ТОП-10</div>
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
          <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Доверьте SEO искусственному интеллекту</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Автоматизируйте до 90% SEO задач с помощью ИИ. 
                Получите результаты в 10 раз быстрее с гарантией качества.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Link to="/audit">Запустить ИИ оптимизацию</Link>
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

export default AIOptimization;
