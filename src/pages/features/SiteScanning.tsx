
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Target, CheckCircle, TrendingUp, Globe, FileText, AlertCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const SiteScanning: React.FC = () => {
  const [scanningProgress, setScanningProgress] = useState(75);

  const scanResults = [
    {
      category: 'Структура сайта',
      total: 45,
      issues: 8,
      warnings: 12,
      status: 'warning'
    },
    {
      category: 'SEO оптимизация',
      total: 32,
      issues: 15,
      warnings: 5,
      status: 'error'
    },
    {
      category: 'Производительность',
      total: 28,
      issues: 3,
      warnings: 8,
      status: 'good'
    },
    {
      category: 'Безопасность',
      total: 18,
      issues: 2,
      warnings: 3,
      status: 'good'
    }
  ];

  const foundIssues = [
    {
      type: 'Критично',
      title: 'Дублированные title теги',
      pages: 23,
      description: 'Найдены страницы с одинаковыми заголовками'
    },
    {
      type: 'Важно',
      title: 'Отсутствуют alt атрибуты',
      pages: 156,
      description: 'Изображения без описания для поисковиков'
    },
    {
      type: 'Внимание',
      title: 'Медленная загрузка',
      pages: 12,
      description: 'Страницы загружаются более 3 секунд'
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
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Полный аудит
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Полное сканирование сайта</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем и возможностей для улучшения.
          </p>
        </motion.div>

        {/* Демо сканирования */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Процесс сканирования - Демо
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Прогресс сканирования</span>
                  <span className="text-sm text-muted-foreground">{scanningProgress}% завершено</span>
                </div>
                <Progress value={scanningProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Найдено 347 страниц • Проанализировано 260 • Осталось 87
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scanResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="p-4 border rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{result.category}</h4>
                      <Badge variant={
                        result.status === 'good' ? 'default' :
                        result.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {result.status === 'good' ? 'ОК' :
                         result.status === 'warning' ? 'Внимание' : 'Проблемы'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Всего проверок:</span>
                        <span>{result.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Ошибки:</span>
                        <span className="text-red-600">{result.issues}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Предупреждения:</span>
                        <span className="text-yellow-600">{result.warnings}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Основной контент */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="issues">Найденные проблемы</TabsTrigger>
              <TabsTrigger value="structure">Структура сайта</TabsTrigger>
              <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Что мы сканируем</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Все страницы сайта</h4>
                        <p className="text-sm text-muted-foreground">Автоматическое обнаружение и анализ всех доступных URL</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">SEO элементы</h4>
                        <p className="text-sm text-muted-foreground">Title, meta, headings, internal linking</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Техническое SEO</h4>
                        <p className="text-sm text-muted-foreground">Robots.txt, sitemap, canonical, redirects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика сканирования</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Общее количество страниц</span>
                        <span className="text-lg font-semibold">347</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Проиндексированные</span>
                        <span className="text-lg font-semibold text-green-600">289</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">С ошибками</span>
                        <span className="text-lg font-semibold text-red-600">28</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Требуют внимания</span>
                        <span className="text-lg font-semibold text-yellow-600">30</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="issues" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Критичные проблемы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {foundIssues.map((issue, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start justify-between p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={
                              issue.type === 'Критично' ? 'destructive' :
                              issue.type === 'Важно' ? 'secondary' : 'outline'
                            }>
                              {issue.type}
                            </Badge>
                            <h4 className="font-semibold">{issue.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{issue.description}</p>
                          <p className="text-xs text-muted-foreground">Затронуто страниц: {issue.pages}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Исправить
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="structure" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Структура и навигация</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-semibold mb-2">Глубина сайта</h4>
                        <div className="text-2xl font-bold text-primary">4</div>
                        <p className="text-xs text-muted-foreground">максимальных уровней</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-semibold mb-2">Внутренние ссылки</h4>
                        <div className="text-2xl font-bold text-primary">1,247</div>
                        <p className="text-xs text-muted-foreground">всего найдено</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-semibold mb-2">Битые ссылки</h4>
                        <div className="text-2xl font-bold text-red-600">12</div>
                        <p className="text-xs text-muted-foreground">требуют исправления</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Приоритетные рекомендации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Исправить дублированные title</h4>
                        <p className="text-sm text-muted-foreground">Влияние: Высокое • Сложность: Легко</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Добавить alt к изображениям</h4>
                        <p className="text-sm text-muted-foreground">Влияние: Среднее • Сложность: Легко</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Оптимизировать скорость загрузки</h4>
                        <p className="text-sm text-muted-foreground">Влияние: Высокое • Сложность: Средне</p>
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
              <h3 className="text-2xl font-bold mb-4">Запустите полное сканирование</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Получите детальный анализ всех страниц вашего сайта и конкретные 
                рекомендации по улучшению SEO позиций.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Начать сканирование</Link>
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

export default SiteScanning;
