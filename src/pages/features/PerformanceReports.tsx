
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Target, CheckCircle, TrendingUp, BarChart3, Download, Calendar, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const PerformanceReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('comprehensive');

  const reportTypes = [
    {
      id: 'comprehensive',
      name: 'Комплексный отчет',
      description: 'Полный анализ всех аспектов SEO',
      pages: 15,
      sections: 8,
      charts: 12
    },
    {
      id: 'technical',
      name: 'Технический аудит',
      description: 'Фокус на технических аспектах',
      pages: 8,
      sections: 5,
      charts: 6
    },
    {
      id: 'content',
      name: 'Контент-аудит',
      description: 'Анализ контента и ключевых слов',
      pages: 6,
      sections: 4,
      charts: 5
    },
    {
      id: 'competitor',
      name: 'Анализ конкурентов',
      description: 'Сравнение с топ конкурентами',
      pages: 10,
      sections: 6,
      charts: 8
    }
  ];

  const reportFeatures = [
    {
      title: 'Исполнительное резюме',
      description: 'Краткий обзор для руководства',
      icon: FileText
    },
    {
      title: 'Детальный анализ',
      description: 'Подробные данные и рекомендации',
      icon: BarChart3
    },
    {
      title: 'Визуализация данных',
      description: 'Графики и диаграммы для наглядности',
      icon: TrendingUp
    },
    {
      title: 'План действий',
      description: 'Пошаговые рекомендации по улучшению',
      icon: Target
    }
  ];

  const exportFormats = [
    { format: 'PDF', description: 'Для презентаций и печати', size: '2.5 MB' },
    { format: 'DOCX', description: 'Для редактирования в Word', size: '1.8 MB' },
    { format: 'XLSX', description: 'Данные для анализа в Excel', size: '856 KB' },
    { format: 'HTML', description: 'Интерактивный веб-отчет', size: '1.2 MB' }
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
              Отчетность
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Отчеты о производительности</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Детальные отчеты о производительности и рейтинге вашего сайта с экспортом в PDF, Excel и другие форматы.
          </p>
        </motion.div>

        {/* Типы отчетов */}
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
                Типы отчетов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {reportTypes.map((report) => (
                  <motion.div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport === report.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="font-semibold mb-2">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold">{report.pages}</div>
                        <div className="text-muted-foreground">страниц</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{report.sections}</div>
                        <div className="text-muted-foreground">разделов</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{report.charts}</div>
                        <div className="text-muted-foreground">графиков</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedReport && (
                <motion.div
                  key={selectedReport}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Превью: {reportTypes.find(r => r.id === selectedReport)?.name}
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Скачать образец
                      </Button>
                      <Button size="sm">
                        Сгенерировать отчет
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
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
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Возможности</TabsTrigger>
              <TabsTrigger value="formats">Форматы экспорта</TabsTrigger>
              <TabsTrigger value="automation">Автоматизация</TabsTrigger>
              <TabsTrigger value="customization">Кастомизация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportFeatures.map((feature, index) => (
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Содержание отчетов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-3">Технический анализ</h5>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Индексация и краулинг
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Скорость загрузки
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Мобильная оптимизация
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Структурированные данные
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-3">SEO анализ</h5>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Анализ ключевых слов
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Оптимизация контента
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Внутренняя перелинковка
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Анализ конкурентов
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="formats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Доступные форматы экспорта</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exportFormats.map((format, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{format.format}</h4>
                          <Badge variant="outline">{format.size}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{format.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Скачать в {format.format}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="automation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Автоматическая отправка отчетов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">Еженедельные отчеты</h4>
                          <p className="text-sm text-muted-foreground">Каждый понедельник в 9:00</p>
                        </div>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">Ежемесячные сводки</h4>
                          <p className="text-sm text-muted-foreground">1 числа каждого месяца</p>
                        </div>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">Отчеты по изменениям</h4>
                          <p className="text-sm text-muted-foreground">При значительных изменениях</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Настроить</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Настройка получателей</h5>
                    <p className="text-sm text-blue-700 mb-3">
                      Добавьте email адреса сотрудников для автоматической отправки отчетов
                    </p>
                    <Button variant="outline" size="sm">Управление подписками</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройка отчетов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-semibold mb-3">Брендинг отчетов</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h6 className="font-medium mb-2">Логотип компании</h6>
                          <p className="text-sm text-muted-foreground mb-2">Добавьте свой логотип в отчеты</p>
                          <Button variant="outline" size="sm">Загрузить логотип</Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h6 className="font-medium mb-2">Цветовая схема</h6>
                          <p className="text-sm text-muted-foreground mb-2">Настройте корпоративные цвета</p>
                          <Button variant="outline" size="sm">Выбрать цвета</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-3">Настройка содержания</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <span className="text-sm">Исполнительное резюме</span>
                          <Badge variant="default">Включено</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <span className="text-sm">Технический анализ</span>
                          <Badge variant="default">Включено</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <span className="text-sm">Анализ конкурентов</span>
                          <Badge variant="secondary">Опционально</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <span className="text-sm">Детальные метрики</span>
                          <Badge variant="secondary">Опционально</Badge>
                        </div>
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
              <h3 className="text-2xl font-bold mb-4">Получите профессиональные отчеты</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Создавайте детальные отчеты о производительности вашего сайта 
                для презентации результатов клиентам и руководству.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Создать отчет</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Демо отчета</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PerformanceReports;
