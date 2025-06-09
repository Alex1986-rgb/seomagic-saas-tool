
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart, Target, CheckCircle, TrendingUp, TrendingDown, Calendar, Search, Globe, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const PositionTracking: React.FC = () => {
  const [trackingActive, setTrackingActive] = useState(true);

  const searchEngines = [
    { name: 'Google', logo: '🔍', coverage: 95, keywords: 247 },
    { name: 'Yandex', logo: '🟡', coverage: 89, keywords: 156 },
    { name: 'Bing', logo: '🔷', coverage: 76, keywords: 89 },
    { name: 'DuckDuckGo', logo: '🦆', coverage: 67, keywords: 45 }
  ];

  const keywordData = [
    {
      keyword: 'SEO оптимизация',
      position: 3,
      previousPosition: 5,
      change: '+2',
      trend: 'up',
      volume: 8900,
      difficulty: 'Высокая'
    },
    {
      keyword: 'аудит сайта',
      position: 1,
      previousPosition: 1,
      change: '0',
      trend: 'stable',
      volume: 2400,
      difficulty: 'Средняя'
    },
    {
      keyword: 'продвижение сайта',
      position: 7,
      previousPosition: 4,
      change: '-3',
      trend: 'down',
      volume: 12000,
      difficulty: 'Очень высокая'
    },
    {
      keyword: 'анализ конкурентов',
      position: 2,
      previousPosition: 6,
      change: '+4',
      trend: 'up',
      volume: 1800,
      difficulty: 'Средняя'
    }
  ];

  const trackingFeatures = [
    {
      title: 'Ежедневный мониторинг',
      description: 'Отслеживание позиций каждый день для максимальной точности',
      icon: Calendar,
      frequency: 'Каждые 24 часа',
      accuracy: '99.2%'
    },
    {
      title: 'Мульти-поисковики',
      description: 'Мониторинг позиций в Google, Yandex, Bing и других системах',
      icon: Globe,
      frequency: '4 поисковика',
      accuracy: 'Полный охват'
    },
    {
      title: 'Локальный поиск',
      description: 'Отслеживание позиций по регионам и городам',
      icon: Target,
      frequency: 'До 100 регионов',
      accuracy: 'Точная геолокация'
    },
    {
      title: 'Мобильные позиции',
      description: 'Отдельное отслеживание позиций для мобильных устройств',
      icon: Eye,
      frequency: 'Desktop + Mobile',
      accuracy: 'Раздельная статистика'
    }
  ];

  const reportTypes = [
    {
      type: 'Ежедневный отчет',
      description: 'Краткая сводка изменений позиций',
      frequency: 'Каждый день',
      format: 'Email'
    },
    {
      type: 'Еженедельная аналитика',
      description: 'Подробный анализ трендов и рекомендации',
      frequency: 'Каждую неделю',
      format: 'PDF + Email'
    },
    {
      type: 'Месячный отчет',
      description: 'Полная картина продвижения за месяц',
      frequency: 'Каждый месяц',
      format: 'Презентация'
    },
    {
      type: 'Алерты изменений',
      description: 'Мгновенные уведомления о значительных изменениях',
      frequency: 'В реальном времени',
      format: 'Push + SMS'
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
            <div className="p-4 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
              Ежедневный мониторинг
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Отслеживание позиций
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Мониторинг позиций вашего сайта в поисковых системах по важным ключевым словам. 
            Получайте актуальные данные каждый день.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Link to="/position-tracker">Начать отслеживание</Link>
            </Button>
            <Button variant="outline" size="lg">
              Посмотреть демо
            </Button>
          </div>
        </motion.div>

        {/* Статус отслеживания */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Статус мониторинга
                <Badge variant="default" className="ml-auto">Активен</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">247</div>
                  <div className="text-sm text-muted-foreground">Отслеживаемых ключевых слов</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">4</div>
                  <div className="text-sm text-muted-foreground">Поисковые системы</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">15</div>
                  <div className="text-sm text-muted-foreground">Регионов мониторинга</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">2.4 сек</div>
                  <div className="text-sm text-muted-foreground">Последнее обновление</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {searchEngines.map((engine, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{engine.logo}</span>
                      <div>
                        <h4 className="font-semibold">{engine.name}</h4>
                        <div className="text-sm text-muted-foreground">{engine.keywords} ключевых слов</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{engine.coverage}% покрытие</div>
                      <Progress value={engine.coverage} className="w-20 h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Демо данных ключевых слов */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Отслеживание ключевых слов - Демо</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Пример отслеживания позиций для различных ключевых запросов
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Топ ключевые слова</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordData.map((keyword, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{keyword.keyword}</h4>
                        <Badge variant={
                          keyword.difficulty === 'Очень высокая' ? 'destructive' :
                          keyword.difficulty === 'Высокая' ? 'secondary' : 'outline'
                        }>
                          {keyword.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Объем: {keyword.volume.toLocaleString()}</span>
                        <span>Позиция: {keyword.position}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`flex items-center gap-2 mb-1 ${
                        keyword.trend === 'up' ? 'text-green-600' :
                        keyword.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {keyword.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                         keyword.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                         <span className="w-4 h-4 flex items-center justify-center">−</span>}
                        <span className="font-semibold">
                          {keyword.change !== '0' ? keyword.change : 'Без изменений'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">за 7 дней</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Возможности отслеживания */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Возможности мониторинга</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Полный контроль над позициями вашего сайта в поисковых системах
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trackingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-green-100">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {feature.frequency}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      
                      <div className="text-xs font-medium text-green-600">
                        {feature.accuracy}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Табы с отчетами */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
              <TabsTrigger value="competitors">Конкуренты</TabsTrigger>
              <TabsTrigger value="alerts">Уведомления</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Типы отчетов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTypes.map((report, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{report.type}</h4>
                          <Badge variant="outline">{report.format}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <div className="text-xs text-green-600 font-medium">{report.frequency}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Углубленная аналитика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Анализ трендов</h4>
                      <p className="text-sm text-muted-foreground">Выявление закономерностей в изменении позиций</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Сезонность запросов</h4>
                      <p className="text-sm text-muted-foreground">Анализ влияния времени года на позиции</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Корреляция с обновлениями</h4>
                      <p className="text-sm text-muted-foreground">Влияние обновлений сайта на позиции</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="competitors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Анализ конкурентов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">competitor1.ru</h4>
                        <p className="text-sm text-muted-foreground">Средняя позиция: 2.3</p>
                      </div>
                      <Badge variant="destructive">Выше нас</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">competitor2.com</h4>
                        <p className="text-sm text-muted-foreground">Средняя позиция: 4.1</p>
                      </div>
                      <Badge variant="default">Ниже нас</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">competitor3.org</h4>
                        <p className="text-sm text-muted-foreground">Средняя позиция: 3.8</p>
                      </div>
                      <Badge variant="secondary">Близко</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки уведомлений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Падение позиций</h4>
                        <p className="text-sm text-muted-foreground">Уведомление при падении более чем на 5 позиций</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Попадание в ТОП-10</h4>
                        <p className="text-sm text-muted-foreground">Уведомление о входе в топ по новым запросам</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Еженедельная сводка</h4>
                        <p className="text-sm text-muted-foreground">Общая статистика за неделю</p>
                      </div>
                      <Badge variant="outline">Настроить</Badge>
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
          <Card className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Начните отслеживать позиции уже сегодня</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Получайте ежедневные данные о позициях вашего сайта в поисковых системах. 
                Отслеживайте прогресс и реагируйте на изменения вовремя.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Link to="/position-tracker">Настроить мониторинг</Link>
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

export default PositionTracking;
