import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart2, ExternalLink, Globe, Search, TrendingUp, Users, PieChart, FileText, Clock, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Badge } from "@/components/ui/badge";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="container py-10">
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
              <p className="text-muted-foreground">Добро пожаловать в вашу панель управления SeoMarket</p>
            </div>
            <Button 
              onClick={() => navigate('/audit')}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Новый аудит
            </Button>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="w-full md:w-auto border p-1 rounded-lg">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Аналитика
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Отчеты
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Проекты
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего сканирований</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        +2
                      </Badge>
                      <p className="text-xs text-muted-foreground ml-2">
                        за последний месяц
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Средний SEO балл</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">76/100</div>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        +12
                      </Badge>
                      <p className="text-xs text-muted-foreground ml-2">
                        за последний месяц
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Отслеживаемые позиции</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        +5
                      </Badge>
                      <p className="text-xs text-muted-foreground ml-2">
                        за последний месяц
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Проекты</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        +1
                      </Badge>
                      <p className="text-xs text-muted-foreground ml-2">
                        за последний месяц
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Обзор аналитики</CardTitle>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Clock className="h-4 w-4" />
                        За месяц
                      </Button>
                    </div>
                    <CardDescription>
                      Динамика SEO показателей вашего сайта
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-md">
                      <BarChart2 className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-3 backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Последние сканирования</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
                        Все
                      </Button>
                    </div>
                    <CardDescription>
                      За последние 30 дней
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                          <div className={`w-2 h-10 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-amber-500' : 'bg-blue-500'}`} />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none flex items-center gap-2">
                              example{i+1}.com
                              <Badge variant="outline" className="text-[10px] font-normal">
                                {i === 0 ? 'Полный' : i === 1 ? 'Базовый' : 'Техн.'}
                              </Badge>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {1+i} дн. назад • Балл {78 - i * 5}/100
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Распределение проблем
                    </CardTitle>
                    <CardDescription>
                      По категориям SEO
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[180px] flex items-center justify-center">
                    <div className="h-36 w-36 bg-muted/30 rounded-full flex items-center justify-center">
                      <PieChart className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 transition-all hover:shadow-md lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Активность команды
                    </CardTitle>
                    <CardDescription>
                      Последние действия пользователей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Анна С. запустила аудит example2.com', 'Иван П. обновил настройки отслеживания', 'Петр К. экспортировал отчет по SEO'].map((activity, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {i === 0 ? <Search className="h-4 w-4" /> : i === 1 ? <SettingsIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm">{activity}</p>
                            <p className="text-xs text-muted-foreground">{i + 1} ч. назад</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
                <CardHeader>
                  <CardTitle>Аналитика</CardTitle>
                  <CardDescription>
                    Детальная аналитика ваших проектов
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Нет доступных данных</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Запустите аудит сайта для получения аналитики
                    </p>
                    <Button className="mt-4" onClick={() => navigate('/audit')}>
                      Запустить аудит
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
                <CardHeader>
                  <CardTitle>Отчеты</CardTitle>
                  <CardDescription>
                    Ваши сохраненные отчеты и аудиты
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Нет сохраненных отчетов</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ваши сохраненные отчеты будут отображаться здесь
                    </p>
                    <Button className="mt-4" onClick={() => navigate('/reports')}>
                      Просмотреть все отчеты
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Проекты</CardTitle>
                      <CardDescription>
                        Управление вашими проектами
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      Добавить проект
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['example.com', 'mysite.ru', 'business.org'].map((site, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{site}</h3>
                            <p className="text-sm text-muted-foreground">
                              Последнее сканирование: {i+1} дн. назад
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Управление
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
