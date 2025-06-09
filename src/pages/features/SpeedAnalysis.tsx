
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Target, CheckCircle, TrendingUp, Clock, Gauge, Smartphone, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const SpeedAnalysis: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('lcp');

  const speedMetrics = [
    {
      id: 'lcp',
      name: 'Largest Contentful Paint (LCP)',
      description: 'Время загрузки основного контента',
      good: '< 2.5с',
      poor: '> 4.0с',
      value: 2.1,
      status: 'good'
    },
    {
      id: 'fid',
      name: 'First Input Delay (FID)',
      description: 'Время отклика на первое взаимодействие',
      good: '< 100ms',
      poor: '> 300ms',
      value: 85,
      status: 'good'
    },
    {
      id: 'cls',
      name: 'Cumulative Layout Shift (CLS)',
      description: 'Стабильность макета при загрузке',
      good: '< 0.1',
      poor: '> 0.25',
      value: 0.05,
      status: 'good'
    }
  ];

  const optimizationTips = [
    {
      title: 'Оптимизация изображений',
      description: 'Сжатие и конвертация в современные форматы (WebP, AVIF)',
      impact: 'Высокий',
      difficulty: 'Легко'
    },
    {
      title: 'Минификация CSS/JS',
      description: 'Удаление лишних пробелов и комментариев из кода',
      impact: 'Средний',
      difficulty: 'Легко'
    },
    {
      title: 'Ленивая загрузка',
      description: 'Отложенная загрузка изображений и контента',
      impact: 'Высокий',
      difficulty: 'Средне'
    },
    {
      title: 'CDN и кеширование',
      description: 'Использование сети доставки контента',
      impact: 'Высокий',
      difficulty: 'Средне'
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
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Производительность
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Проверка скорости загрузки</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Анализ времени загрузки страниц и детальные рекомендации по увеличению скорости сайта.
          </p>
        </motion.div>

        {/* Демо анализ скорости */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Core Web Vitals - Демо анализ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {speedMetrics.map((metric) => (
                  <motion.div
                    key={metric.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMetric === metric.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMetric(metric.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{metric.name}</h4>
                      <Badge variant={metric.status === 'good' ? 'default' : 'destructive'}>
                        {metric.status === 'good' ? 'Хорошо' : 'Плохо'}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {metric.id === 'cls' ? metric.value.toFixed(2) : 
                       metric.id === 'fid' ? `${metric.value}ms` : `${metric.value}s`}
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                    <div className="mt-3">
                      <Progress 
                        value={metric.status === 'good' ? 85 : 40} 
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedMetric && (
                <motion.div
                  key={selectedMetric}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <h4 className="font-semibold mb-2">
                    {speedMetrics.find(m => m.id === selectedMetric)?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {speedMetrics.find(m => m.id === selectedMetric)?.description}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">
                      ✓ Хорошо: {speedMetrics.find(m => m.id === selectedMetric)?.good}
                    </span>
                    <span className="text-red-600">
                      ✗ Плохо: {speedMetrics.find(m => m.id === selectedMetric)?.poor}
                    </span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Основное содержимое с вкладками */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis">Анализ</TabsTrigger>
              <TabsTrigger value="optimization">Оптимизация</TabsTrigger>
              <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
              <TabsTrigger value="devices">Устройства</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Что мы анализируем
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Время загрузки страницы</h4>
                        <p className="text-sm text-muted-foreground">Полное время до загрузки всех ресурсов</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Время до интерактивности</h4>
                        <p className="text-sm text-muted-foreground">Когда пользователь может взаимодействовать со страницей</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Core Web Vitals</h4>
                        <p className="text-sm text-muted-foreground">Ключевые метрики пользовательского опыта от Google</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Размер ресурсов</h4>
                        <p className="text-sm text-muted-foreground">Анализ веса изображений, скриптов и стилей</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Факторы влияющие на скорость</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Размер изображений</span>
                        <Badge variant="destructive">Критично</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Время ответа сервера</span>
                        <Badge variant="destructive">Критично</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Количество HTTP запросов</span>
                        <Badge variant="secondary">Важно</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Кеширование браузера</span>
                        <Badge variant="secondary">Важно</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Сжатие файлов</span>
                        <Badge variant="outline">Полезно</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="optimization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Рекомендации по оптимизации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{tip.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant={tip.impact === 'Высокий' ? 'destructive' : 'secondary'}>
                              {tip.impact}
                            </Badge>
                            <Badge variant="outline">{tip.difficulty}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Непрерывный мониторинг</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Автоматические проверки</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Ежедневные тесты скорости
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Уведомления о замедлениях
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Сравнение с конкурентами
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Исторические данные
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Отчеты и аналитика</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Еженедельные отчеты
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Тренды производительности
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Рекомендации по улучшению
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          ROI от оптимизации
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Мобильные устройства
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/50 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Скорость загрузки</span>
                          <span className="text-sm text-primary">2.8s</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Особенности мобильной оптимизации:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Адаптивные изображения</li>
                          <li>• Минимизация JavaScript</li>
                          <li>• Оптимизация для медленных сетей</li>
                          <li>• Приоритизация видимого контента</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Десктоп
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/50 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Скорость загрузки</span>
                          <span className="text-sm text-primary">1.9s</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Возможности десктопа:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Больше вычислительных ресурсов</li>
                          <li>• Быстрые сетевые соединения</li>
                          <li>• Возможность prefetch ресурсов</li>
                          <li>• Кеширование больших объемов</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
              <h3 className="text-2xl font-bold mb-4">Проверьте скорость вашего сайта</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Получите детальный анализ производительности и конкретные рекомендации 
                по ускорению загрузки страниц.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Проверить скорость</Link>
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

export default SpeedAnalysis;
