
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Target, CheckCircle, BarChart3, Calendar, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const PositionTrackingFeature: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('seo аудит');

  const keywordData = [
    {
      keyword: 'seo аудит',
      position: 3,
      change: +2,
      volume: 8100,
      difficulty: 'Средне',
      trend: 'up'
    },
    {
      keyword: 'проверка сайта',
      position: 7,
      change: -1,
      volume: 5400,
      difficulty: 'Легко',
      trend: 'down'
    },
    {
      keyword: 'оптимизация сайта',
      position: 12,
      change: +5,
      volume: 12000,
      difficulty: 'Сложно',
      trend: 'up'
    },
    {
      keyword: 'анализ конкурентов',
      position: 15,
      change: 0,
      volume: 2900,
      difficulty: 'Средне',
      trend: 'stable'
    }
  ];

  const trackingFeatures = [
    {
      title: 'Ежедневный мониторинг',
      description: 'Автоматическая проверка позиций каждый день',
      icon: Calendar
    },
    {
      title: 'Геотаргетинг',
      description: 'Отслеживание по регионам и городам',
      icon: MapPin
    },
    {
      title: 'Анализ SERP',
      description: 'Детальный анализ поисковой выдачи',
      icon: Eye
    },
    {
      title: 'Сравнение с конкурентами',
      description: 'Мониторинг позиций конкурентов',
      icon: BarChart3
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
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Мониторинг позиций
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Отслеживание позиций</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Ежедневный мониторинг позиций вашего сайта в поисковых системах по ключевым словам.
          </p>
        </motion.div>

        {/* Демо трекинга */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Текущие позиции - Демо проект
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {keywordData.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedKeyword === item.keyword ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedKeyword(item.keyword)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm truncate">{item.keyword}</h4>
                      <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}>
                        {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Позиция</span>
                        <span className="text-lg font-bold text-primary">#{item.position}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Изменение</span>
                        <span className={`text-xs font-medium ${
                          item.change > 0 ? 'text-green-600' : 
                          item.change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.change > 0 ? '+' : ''}{item.change}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Частота: {item.volume.toLocaleString()}/мес
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedKeyword && (
                <motion.div
                  key={selectedKeyword}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <h4 className="font-semibold mb-2">
                    Детали по запросу: "{selectedKeyword}"
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Текущая позиция:</span>
                      <div className="font-semibold">#{keywordData.find(k => k.keyword === selectedKeyword)?.position}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Сложность:</span>
                      <div className="font-semibold">{keywordData.find(k => k.keyword === selectedKeyword)?.difficulty}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Объем поиска:</span>
                      <div className="font-semibold">{keywordData.find(k => k.keyword === selectedKeyword)?.volume.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Тренд:</span>
                      <div className="font-semibold">
                        {keywordData.find(k => k.keyword === selectedKeyword)?.trend === 'up' ? 'Растет' : 
                         keywordData.find(k => k.keyword === selectedKeyword)?.trend === 'down' ? 'Падает' : 'Стабильно'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Основные функции */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Возможности</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
              <TabsTrigger value="alerts">Уведомления</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trackingFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Аналитика позиций</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-semibold mb-2">Средняя позиция</h4>
                        <div className="text-2xl font-bold text-primary">9.2</div>
                        <p className="text-xs text-green-600">+1.3 за неделю</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-semibold mb-2">ТОП-10</h4>
                        <div className="text-2xl font-bold text-primary">67%</div>
                        <p className="text-xs text-green-600">+12% за месяц</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-semibold mb-2">Видимость</h4>
                        <div className="text-2xl font-bold text-primary">34.5%</div>
                        <p className="text-xs text-green-600">+5.2% за месяц</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">Распределение по позициям:</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ТОП-3 (1-3 позиции)</span>
                          <div className="flex items-center gap-2">
                            <Progress value={25} className="w-24 h-2" />
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ТОП-10 (4-10 позиции)</span>
                          <div className="flex items-center gap-2">
                            <Progress value={42} className="w-24 h-2" />
                            <span className="text-sm font-medium">42%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ТОП-30 (11-30 позиции)</span>
                          <div className="flex items-center gap-2">
                            <Progress value={23} className="w-24 h-2" />
                            <span className="text-sm font-medium">23%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Вне ТОП-30</span>
                          <div className="flex items-center gap-2">
                            <Progress value={10} className="w-24 h-2" />
                            <span className="text-sm font-medium">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Автоматические отчеты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Еженедельный отчет по позициям</h4>
                        <p className="text-sm text-muted-foreground">Каждый понедельник в 9:00</p>
                      </div>
                      <Badge variant="default">Включен</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Ежемесячный сводный отчет</h4>
                        <p className="text-sm text-muted-foreground">1 числа каждого месяца</p>
                      </div>
                      <Badge variant="default">Включен</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Отчет по конкурентам</h4>
                        <p className="text-sm text-muted-foreground">Каждые 2 недели</p>
                      </div>
                      <Badge variant="secondary">Настроить</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройка уведомлений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Значительные изменения позиций</h4>
                        <p className="text-sm text-muted-foreground">При изменении на ±5 позиций</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Попадание в ТОП-10</h4>
                        <p className="text-sm text-muted-foreground">Когда ключевое слово попадает в ТОП-10</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Выпадение из ТОП-30</h4>
                        <p className="text-sm text-muted-foreground">Критичные изменения позиций</p>
                      </div>
                      <Badge variant="destructive">Включено</Badge>
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
              <h3 className="text-2xl font-bold mb-4">Начните отслеживать позиции</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Добавьте ключевые слова и получайте ежедневные отчеты об изменениях 
                позиций вашего сайта в поисковых системах.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/position-tracking">Начать отслеживание</Link>
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

export default PositionTrackingFeature;
