
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, CheckCircle, TrendingUp, BarChart3, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const CompetitorAnalysis: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState('competitor1');

  const competitors = [
    {
      id: 'competitor1',
      name: 'seo-expert.ru',
      domain: 'seo-expert.ru',
      visibility: 85,
      keywords: 1247,
      traffic: 15600,
      change: +12
    },
    {
      id: 'competitor2',
      name: 'megagroup.ru',
      domain: 'megagroup.ru',
      visibility: 73,
      keywords: 892,
      traffic: 12100,
      change: -3
    },
    {
      id: 'competitor3',
      name: 'seoprofy.ua',
      domain: 'seoprofy.ua',
      visibility: 68,
      keywords: 756,
      traffic: 9800,
      change: +7
    }
  ];

  const competitorKeywords = [
    {
      keyword: 'seo оптимизация',
      yourPosition: 8,
      competitorPosition: 3,
      volume: 15000,
      difficulty: 'Высоко'
    },
    {
      keyword: 'продвижение сайта',
      yourPosition: 12,
      competitorPosition: 5,
      volume: 8900,
      difficulty: 'Средне'
    },
    {
      keyword: 'аудит сайта бесплатно',
      yourPosition: 4,
      competitorPosition: 7,
      volume: 3200,
      difficulty: 'Легко'
    },
    {
      keyword: 'поисковая оптимизация',
      yourPosition: 15,
      competitorPosition: 2,
      volume: 6700,
      difficulty: 'Высоко'
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
              <Users className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Конкурентный анализ
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Анализ конкурентов</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Сравнение ваших позиций с конкурентами для определения оптимальной SEO-стратегии.
          </p>
        </motion.div>

        {/* Сравнение конкурентов */}
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
                Анализ топ конкурентов - Демо
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {competitors.map((competitor) => (
                  <motion.div
                    key={competitor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCompetitor === competitor.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCompetitor(competitor.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm">{competitor.name}</h4>
                      <Badge variant={competitor.change > 0 ? 'default' : 'destructive'}>
                        {competitor.change > 0 ? '+' : ''}{competitor.change}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Видимость</span>
                        <span className="text-sm font-semibold">{competitor.visibility}%</span>
                      </div>
                      <Progress value={competitor.visibility} className="h-2" />
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Ключевые слова:</span>
                        <span>{competitor.keywords}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Трафик:</span>
                        <span>{competitor.traffic.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedCompetitor && (
                <motion.div
                  key={selectedCompetitor}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <h4 className="font-semibold mb-2">
                    Детальная информация: {competitors.find(c => c.id === selectedCompetitor)?.domain}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Видимость в поиске:</span>
                      <div className="font-semibold">{competitors.find(c => c.id === selectedCompetitor)?.visibility}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Общие ключевые слова:</span>
                      <div className="font-semibold">247</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Средняя позиция:</span>
                      <div className="font-semibold">12.3</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Динамика месяц:</span>
                      <div className="font-semibold text-green-600">+15 позиций</div>
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
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="keywords">Ключевые слова</TabsTrigger>
              <TabsTrigger value="backlinks">Обратные ссылки</TabsTrigger>
              <TabsTrigger value="content">Контент-анализ</TabsTrigger>
              <TabsTrigger value="strategy">Стратегия</TabsTrigger>
            </TabsList>
            
            <TabsContent value="keywords" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Сравнение по ключевым словам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitorKeywords.map((item, index) => (
                      <motion.div
                        key={index}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.keyword}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Объем: {item.volume.toLocaleString()}/мес</span>
                              <Badge variant="outline">{item.difficulty}</Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Ваша позиция</div>
                              <div className={`text-lg font-bold ${
                                item.yourPosition < item.competitorPosition ? 'text-green-600' : 'text-red-600'
                              }`}>
                                #{item.yourPosition}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Конкурент</div>
                              <div className={`text-lg font-bold ${
                                item.competitorPosition < item.yourPosition ? 'text-green-600' : 'text-red-600'
                              }`}>
                                #{item.competitorPosition}
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm">
                              Анализ
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="backlinks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Профиль обратных ссылок</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ваш сайт</span>
                      <span className="font-semibold">1,247 ссылок</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Топ конкурент</span>
                      <span className="font-semibold">3,891 ссылок</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Разрыв</span>
                      <span className="font-semibold text-red-600">-2,644 ссылок</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Качество ссылок</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Средний DA</span>
                        <div className="flex items-center gap-2">
                          <Progress value={65} className="w-20 h-2" />
                          <span className="text-sm font-semibold">65</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Nofollow ссылки</span>
                        <span className="text-sm">23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Уникальные домены</span>
                        <span className="text-sm">456</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Анализ контент-стратегии</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-semibold mb-2">Частота публикаций</h4>
                      <div className="text-2xl font-bold text-primary">2.3</div>
                      <p className="text-xs text-muted-foreground">статьи в неделю</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-semibold mb-2">Средняя длина</h4>
                      <div className="text-2xl font-bold text-primary">1,850</div>
                      <p className="text-xs text-muted-foreground">слов в статье</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-semibold mb-2">Социальные сигналы</h4>
                      <div className="text-2xl font-bold text-primary">89</div>
                      <p className="text-xs text-muted-foreground">среднее на статью</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="strategy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Рекомендации по стратегии</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Целевые ключевые слова</h4>
                        <p className="text-sm text-muted-foreground">Сосредоточьтесь на 15 ключевых словах, где конкуренты слабее</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Zap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Быстрые победы</h4>
                        <p className="text-sm text-muted-foreground">7 ключевых слов на позициях 11-15, легко поднять в ТОП-10</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Eye className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Контент-пробелы</h4>
                        <p className="text-sm text-muted-foreground">23 темы, которые активно развивают конкуренты</p>
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
              <h3 className="text-2xl font-bold mb-4">Проанализируйте конкурентов</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Получите детальный анализ стратегий ваших конкурентов и найдите 
                возможности для опережения в поисковой выдаче.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/audit">Анализ конкурентов</Link>
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

export default CompetitorAnalysis;
