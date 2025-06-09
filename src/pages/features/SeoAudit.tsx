
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Target, CheckCircle, TrendingUp, Globe, FileText, AlertCircle, Shield, Zap, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const SeoAudit: React.FC = () => {
  const [checkProgress, setCheckProgress] = useState(85);

  const auditChecks = [
    {
      category: 'Техническое SEO',
      checks: 45,
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      items: ['Robots.txt', 'Sitemap.xml', 'Canonical URL', 'HTTPS', 'Скорость загрузки']
    },
    {
      category: 'Контент и структура',
      checks: 38,
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      items: ['Title теги', 'Meta описания', 'H1-H6 заголовки', 'Alt атрибуты', 'Структура URL']
    },
    {
      category: 'Производительность',
      checks: 32,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      items: ['Core Web Vitals', 'Сжатие изображений', 'Кэширование', 'Минификация CSS/JS']
    },
    {
      category: 'Мобильная оптимизация',
      checks: 28,
      icon: Target,
      color: 'from-orange-500 to-red-500',
      items: ['Адаптивный дизайн', 'Viewport meta', 'Touch элементы', 'Скорость на мобильных']
    },
    {
      category: 'Безопасность',
      checks: 22,
      icon: Shield,
      color: 'from-gray-500 to-slate-500',
      items: ['SSL сертификат', 'Безопасные заголовки', 'Смешанный контент', 'Уязвимости']
    },
    {
      category: 'Аналитика и отслеживание',
      checks: 18,
      icon: BarChart,
      color: 'from-indigo-500 to-blue-500',
      items: ['Google Analytics', 'Search Console', 'Schema разметка', 'Open Graph']
    }
  ];

  const demoResults = [
    { issue: 'Отсутствуют title теги', priority: 'Критично', pages: 12, impact: 'Высокий' },
    { issue: 'Медленная загрузка страниц', priority: 'Высокий', pages: 8, impact: 'Высокий' },
    { issue: 'Нет alt атрибутов у изображений', priority: 'Средний', pages: 156, impact: 'Средний' },
    { issue: 'Дублированные meta описания', priority: 'Средний', pages: 23, impact: 'Средний' },
    { issue: 'Отсутствует разметка Schema', priority: 'Низкий', pages: 45, impact: 'Низкий' }
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
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <Badge variant="secondary" className="text-xs">
              200+ проверок
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SEO Аудит
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Комплексное сканирование сайта для выявления всех SEO-проблем и возможностей для улучшения. 
            Получите детальный анализ по 200+ параметрам.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Link to="/audit">Запустить аудит</Link>
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Процесс аудита - Демо
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Прогресс сканирования</span>
                  <span className="text-sm text-muted-foreground">{checkProgress}% завершено</span>
                </div>
                <Progress value={checkProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Проверено 187 из 220 параметров • Найдено 23 проблемы • Время: 2 мин 15 сек
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Категории проверок */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Что мы проверяем</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Наш аудит охватывает все аспекты SEO оптимизации вашего сайта
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditChecks.map((check, index) => {
              const IconComponent = check.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${check.color} bg-opacity-10`}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{check.category}</h3>
                          <Badge variant="outline" className="text-xs">
                            {check.checks} проверок
                          </Badge>
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {check.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="results">Результаты</TabsTrigger>
              <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
              <TabsTrigger value="automation">Автоматизация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Найденные проблемы - Демо</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoResults.map((result, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={
                              result.priority === 'Критично' ? 'destructive' :
                              result.priority === 'Высокий' ? 'secondary' : 'outline'
                            }>
                              {result.priority}
                            </Badge>
                            <h4 className="font-semibold">{result.issue}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Страниц: {result.pages}</span>
                            <span>Влияние: {result.impact}</span>
                          </div>
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
                        <h4 className="font-semibold">Добавить недостающие title теги</h4>
                        <p className="text-sm text-muted-foreground">Влияние: Критичное • Сложность: Легко • Время: 30 мин</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Оптимизировать скорость загрузки</h4>
                        <p className="text-sm text-muted-foreground">Влияние: Высокое • Сложность: Средне • Время: 2 часа</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Добавить alt атрибуты к изображениям</h4>
                        <p className="text-sm text-muted-foreground">Влияние: Среднее • Сложность: Легко • Время: 1 час</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Форматы отчетов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">PDF отчет</h4>
                      <p className="text-sm text-muted-foreground mb-3">Подробный анализ для печати</p>
                      <Button variant="outline" size="sm" className="w-full">Скачать</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">Онлайн отчет</h4>
                      <p className="text-sm text-muted-foreground mb-3">Интерактивный веб-отчет</p>
                      <Button variant="outline" size="sm" className="w-full">Открыть</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <BarChart className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-2">CSV данные</h4>
                      <p className="text-sm text-muted-foreground mb-3">Для анализа в Excel</p>
                      <Button variant="outline" size="sm" className="w-full">Экспорт</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="automation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Автоматические проверки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Еженедельный аудит</h4>
                        <p className="text-sm text-muted-foreground">Автоматическая проверка каждую неделю</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Уведомления о проблемах</h4>
                        <p className="text-sm text-muted-foreground">Email при обнаружении критичных ошибок</p>
                      </div>
                      <Badge variant="default">Включено</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Интеграция с CMS</h4>
                        <p className="text-sm text-muted-foreground">Проверки при публикации контента</p>
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
          <Card className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Начните SEO аудит прямо сейчас</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Получите детальный анализ вашего сайта за несколько минут. 
                Базовая проверка бесплатна и не требует регистрации.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Link to="/audit">Запустить бесплатный аудит</Link>
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

export default SeoAudit;
