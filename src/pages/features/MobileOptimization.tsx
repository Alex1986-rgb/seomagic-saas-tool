
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Target, CheckCircle, TrendingUp, Tablet, Monitor, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const MobileOptimization: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('mobile');

  const deviceSpecs = {
    mobile: {
      name: 'Мобильный телефон',
      icon: Smartphone,
      viewport: '375 × 667',
      network: '4G',
      score: 85,
      issues: ['Кнопки слишком мелкие', 'Горизонтальная прокрутка']
    },
    tablet: {
      name: 'Планшет',
      icon: Tablet,
      viewport: '768 × 1024',
      network: 'WiFi',
      score: 92,
      issues: ['Неоптимальное использование пространства']
    },
    desktop: {
      name: 'Десктоп',
      icon: Monitor,
      viewport: '1920 × 1080',
      network: 'Ethernet',
      score: 96,
      issues: []
    }
  };

  const mobileChecks = [
    {
      category: 'Адаптивный дизайн',
      checks: [
        { name: 'Viewport meta тег', status: 'passed', description: 'Корректно настроен viewport' },
        { name: 'Адаптивные изображения', status: 'warning', description: 'Некоторые изображения не адаптированы' },
        { name: 'Гибкая сетка', status: 'passed', description: 'Используются относительные единицы' },
      ]
    },
    {
      category: 'Пользовательский опыт',
      checks: [
        { name: 'Размер кнопок', status: 'failed', description: 'Кнопки меньше рекомендуемых 44px' },
        { name: 'Расстояние между элементами', status: 'passed', description: 'Достаточное расстояние для нажатий' },
        { name: 'Читаемость текста', status: 'warning', description: 'Некоторый текст мелкий для мобильных' },
      ]
    },
    {
      category: 'Производительность',
      checks: [
        { name: 'Время загрузки', status: 'passed', description: 'Загружается менее чем за 3 секунды' },
        { name: 'Размер ресурсов', status: 'warning', description: 'Изображения можно оптимизировать' },
        { name: 'Кеширование', status: 'passed', description: 'Настроено браузерное кеширование' },
      ]
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
              <Smartphone className="h-8 w-8 text-primary" />
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

        {/* Демо тестирование устройств */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Тестирование на разных устройствах
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {Object.entries(deviceSpecs).map(([key, device]) => {
                  const Icon = device.icon;
                  return (
                    <motion.div
                      key={key}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDevice === key ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDevice(key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <h4 className="font-semibold">{device.name}</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Viewport:</span>
                          <span>{device.viewport}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Сеть:</span>
                          <span>{device.network}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Оценка</span>
                          <span className="text-sm font-semibold">{device.score}/100</span>
                        </div>
                        <Progress value={device.score} className="h-2" />
                      </div>
                      
                      {device.issues.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-destructive">
                            {device.issues.length} проблем{device.issues.length > 1 ? 'ы' : 'а'} обнаружен{device.issues.length > 1 ? 'о' : 'а'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {selectedDevice && (
                <motion.div
                  key={selectedDevice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <h4 className="font-semibold mb-2">
                    Проблемы на {deviceSpecs[selectedDevice as keyof typeof deviceSpecs].name.toLowerCase()}:
                  </h4>
                  {deviceSpecs[selectedDevice as keyof typeof deviceSpecs].issues.length > 0 ? (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {deviceSpecs[selectedDevice as keyof typeof deviceSpecs].issues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-destructive rounded-full"></span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-600">✓ Проблем не обнаружено</p>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Детальная проверка */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="responsive" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="responsive">Адаптивность</TabsTrigger>
              <TabsTrigger value="usability">Юзабилити</TabsTrigger>
              <TabsTrigger value="performance">Производительность</TabsTrigger>
              <TabsTrigger value="seo">Mobile SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="responsive" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Результаты проверки адаптивности</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mobileChecks.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h4 className="font-semibold mb-3">{category.category}</h4>
                        <div className="space-y-3">
                          {category.checks.map((check, checkIndex) => (
                            <div key={checkIndex} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <div className={`w-3 h-3 rounded-full ${
                                    check.status === 'passed' ? 'bg-green-500' :
                                    check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></div>
                                  <span className="font-medium">{check.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6">{check.description}</p>
                              </div>
                              <Badge variant={
                                check.status === 'passed' ? 'default' :
                                check.status === 'warning' ? 'secondary' : 'destructive'
                              }>
                                {check.status === 'passed' ? 'Пройдено' :
                                 check.status === 'warning' ? 'Внимание' : 'Ошибка'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usability" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Рекомендации по UX</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Размер кнопок</h4>
                        <p className="text-sm text-muted-foreground">Минимум 44×44 пикселя для удобного нажатия</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Читаемость текста</h4>
                        <p className="text-sm text-muted-foreground">Размер шрифта не менее 16px на мобильных</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Горизонтальная прокрутка</h4>
                        <p className="text-sm text-muted-foreground">Контент должен помещаться в ширину экрана</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Интерактивные элементы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Навигационное меню</span>
                        <Badge variant="default">Оптимизировано</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Формы ввода</span>
                        <Badge variant="secondary">Требует внимания</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Кнопки действий</span>
                        <Badge variant="destructive">Проблемы</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Модальные окна</span>
                        <Badge variant="default">Оптимизировано</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Производительность на мобильных
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Время загрузки (3G)</span>
                          <span className="text-sm font-semibold">3.2s</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">First Contentful Paint</span>
                          <span className="text-sm font-semibold">1.8s</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Largest Contentful Paint</span>
                          <span className="text-sm font-semibold">2.9s</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">Рекомендации:</h5>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Оптимизировать изображения для мобильных</li>
                        <li>• Уменьшить размер JavaScript</li>
                        <li>• Использовать ленивую загрузку</li>
                        <li>• Настроить Service Worker</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mobile-First индексация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Viewport meta тег</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Контент идентичен десктопу</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Структурированные данные</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Метаданные полные</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Core Web Vitals (Mobile)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">LCP</span>
                          <span className="text-sm text-green-600">2.4s</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">FID</span>
                          <span className="text-sm text-yellow-600">120ms</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">CLS</span>
                          <span className="text-sm text-green-600">0.08</span>
                        </div>
                        <Progress value={90} className="h-2" />
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
              <h3 className="text-2xl font-bold mb-4">Проверьте мобильную версию сайта</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Убедитесь, что ваш сайт идеально работает на всех мобильных устройствах 
                и соответствует требованиям Google Mobile-First индексации.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Проверить мобильную версию</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Консультация эксперта</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MobileOptimization;
