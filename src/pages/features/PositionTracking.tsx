
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart, Target, CheckCircle, TrendingUp, Calendar, Eye, AlertCircle, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const PositionTracking: React.FC = () => {
  const [trackingProgress, setTrackingProgress] = useState(75);

  const trackingFeatures = [
    {
      title: 'Ежедневный мониторинг',
      description: 'Автоматическая проверка позиций каждый день в одно и то же время',
      icon: Calendar,
      frequency: 'Каждый день',
      impact: 'Критично',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Множественные поисковики',
      description: 'Отслеживание в Google, Yandex, Bing и других поисковых системах',
      icon: Eye,
      frequency: 'Все системы',
      impact: 'Высокий',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Геолокация',
      description: 'Проверка позиций для разных регионов и городов',
      icon: Target,
      frequency: 'По регионам',
      impact: 'Высокий',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Мобильные позиции',
      description: 'Отдельное отслеживание для мобильных и десктопных результатов',
      icon: TrendingUp,
      frequency: 'Dual tracking',
      impact: 'Средний',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Уведомления об изменениях',
      description: 'Мгновенные alert при значительных изменениях позиций',
      icon: AlertCircle,
      frequency: 'Real-time',
      impact: 'Критично',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Исторические данные',
      description: 'Полная история изменений позиций за весь период отслеживания',
      icon: Clock,
      frequency: 'Архив',
      impact: 'Средний',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const demoKeywords = [
    { keyword: 'seo оптимизация', position: 3, change: +2, traffic: 1240, volume: 18500 },
    { keyword: 'аудит сайта', position: 7, change: -1, traffic: 890, volume: 12300 },
    { keyword: 'продвижение сайта', position: 12, change: +5, traffic: 650, volume: 25600 },
    { keyword: 'техническое seo', position: 18, change: +3, traffic: 420, volume: 8900 },
    { keyword: 'анализ конкурентов', position: 24, change: -2, traffic: 180, volume: 6700 }
  ];

  const searchEngines = [
    { name: 'Google', share: 65, color: 'bg-blue-500' },
    { name: 'Yandex', share: 28, color: 'bg-red-500' },
    { name: 'Bing', share: 5, color: 'bg-green-500' },
    { name: 'Другие', share: 2, color: 'bg-gray-500' }
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
            <Badge variant="secondary" className="text-xs">
              Ежедневный мониторинг
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Отслеживание позиций
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Мониторинг позиций вашего сайта в поисковых системах по важным ключевым словам. 
            Отслеживайте прогресс и получайте уведомления об изменениях.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Link to="/position-tracker">Запустить отслеживание</Link>
            </Button>
            <Button variant="outline" size="lg">
              Посмотреть демо
            </Button>
          </div>
        </motion.div>

        {/* Демо прогресса */}
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
                Процесс отслеживания - Демо
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Проверка позиций</span>
                  <span className="text-sm text-muted-foreground">{trackingProgress}% завершено</span>
                </div>
                <Progress value={trackingProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Проверено 45 из 60 ключевых слов • Найдено 12 изменений • Время: 3 мин 42 сек
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">+15</div>
                  <div className="text-sm text-muted-foreground">Улучшений</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">-8</div>
                  <div className="text-sm text-muted-foreground">Снижений</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">37</div>
                  <div className="text-sm text-muted-foreground">Без изменений</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">4.2</div>
                  <div className="text-sm text-muted-foreground">Средняя позиция</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Возможности отслеживания */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Возможности отслеживания</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Полный контроль над позициями вашего сайта во всех популярных поисковых системах
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-10`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.frequency}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Важность:</span>
                        <Badge variant={
                          feature.impact === 'Критично' ? 'default' :
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

        {/* Табы с подробностями */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="keywords">Ключевые слова</TabsTrigger>
              <TabsTrigger value="engines">Поисковики</TabsTrigger>
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
              <TabsTrigger value="alerts">Уведомления</TabsTrigger>
            </TabsList>
            
            <TabsContent value="keywords" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Отслеживаемые ключевые слова - Демо</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoKeywords.map((keyword, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{keyword.keyword}</h4>
                            <Badge variant="outline" className="text-xs">
                              Объем: {keyword.volume.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Трафик: {keyword.traffic}</span>
                            <span>Позиция: {keyword.position}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={keyword.change > 0 ? 'default' : keyword.change < 0 ? 'destructive' : 'secondary'}>
                            {keyword.change > 0 ? '+' : ''}{keyword.change}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="engines" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Поисковые системы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchEngines.map((engine, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${engine.color}`} />
                          <span className="font-semibold">{engine.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{engine.share}% трафика</span>
                          <Badge variant="default">Активно</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Отчеты и экспорт</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">Отчет по динамике</h4>
                      <p className="text-sm text-muted-foreground mb-3">Изменения позиций за период</p>
                      <Button variant="outline" size="sm" className="w-full">Скачать</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <BarChart className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">Аналитический отчет</h4>
                      <p className="text-sm text-muted-foreground mb-3">Детальная аналитика</p>
                      <Button variant="outline" size="sm" className="w-full">Создать</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">Конкурентный анализ</h4>
                      <p className="text-sm text-muted-foreground mb-3">Сравнение с конкурентами</p>
                      <Button variant="outline" size="sm" className="w-full">Сравнить</Button>
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
                        <h4 className="font-semibold">Ежедневные отчеты</h4>
                        <p className="text-sm text-muted-foreground">Email с результатами проверки</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Критичные изменения</h4>
                        <p className="text-sm text-muted-foreground">Уведомления при больших скачках</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Еженедельная сводка</h4>
                        <p className="text-sm text-muted-foreground">Общий анализ за неделю</p>
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
              <h3 className="text-2xl font-bold mb-4">Начните отслеживать позиции сегодня</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Получайте ежедневные данные о позициях вашего сайта в поисковиках. 
                Первые 10 ключевых слов отслеживаются бесплатно.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Link to="/position-tracker">Начать отслеживание</Link>
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
