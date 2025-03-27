
import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Search, Users, Download, ArrowDown, ArrowUp, History, FileText, Webhook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPositionHistory } from '@/services/position/positionHistory';
import { exportHistoryToExcel } from '@/services/position/exportService';
import { useToast } from "@/hooks/use-toast";

const AdminPositions = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getPositionHistory();
      setHistory(data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось загрузить историю проверок позиций",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Подготовка данных для аналитики
  const getTopDomains = () => {
    const domains = {};
    history.forEach(item => {
      if (!domains[item.domain]) {
        domains[item.domain] = 0;
      }
      domains[item.domain]++;
    });
    
    return Object.entries(domains)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getSearchEngineDistribution = () => {
    const engines = { google: 0, yandex: 0, mailru: 0 };
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        engines[keyword.searchEngine]++;
        total++;
      });
    });
    
    return Object.entries(engines).map(([engine, count]) => ({
      engine: engine === 'google' ? 'Google' : engine === 'yandex' ? 'Яндекс' : 'Mail.ru',
      count,
      percentage: Math.round(count / total * 100)
    }));
  };

  const getTotalChecksByDay = () => {
    const checksByDay = {};
    
    // Группировка проверок по дням
    history.forEach(item => {
      const date = new Date(item.timestamp).toISOString().split('T')[0];
      if (!checksByDay[date]) {
        checksByDay[date] = 0;
      }
      checksByDay[date]++;
    });
    
    // Преобразование в формат для графика
    return Object.entries(checksByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Последние 10 дней
  };

  const getPositionAnalytics = () => {
    const topPositions = { top3: 0, top10: 0, top30: 0, beyond: 0, notFound: 0 };
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        total++;
        if (keyword.position === 0) {
          topPositions.notFound++;
        } else if (keyword.position <= 3) {
          topPositions.top3++;
        } else if (keyword.position <= 10) {
          topPositions.top10++;
        } else if (keyword.position <= 30) {
          topPositions.top30++;
        } else {
          topPositions.beyond++;
        }
      });
    });
    
    return [
      { name: 'ТОП 3', value: topPositions.top3, percentage: Math.round(topPositions.top3 / total * 100) },
      { name: 'ТОП 4-10', value: topPositions.top10, percentage: Math.round(topPositions.top10 / total * 100) },
      { name: 'ТОП 11-30', value: topPositions.top30, percentage: Math.round(topPositions.top30 / total * 100) },
      { name: 'Ниже 30', value: topPositions.beyond, percentage: Math.round(topPositions.beyond / total * 100) },
      { name: 'Не найдено', value: topPositions.notFound, percentage: Math.round(topPositions.notFound / total * 100) },
    ];
  };

  const handleExportAll = () => {
    try {
      exportHistoryToExcel(history, `position_history_${new Date().toISOString().split('T')[0]}`);
      toast({
        title: "Экспорт выполнен",
        description: "История проверок успешно экспортирована в Excel",
      });
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description: error.message || "Не удалось экспортировать данные",
        variant: "destructive",
      });
    }
  };

  // Получаем аналитические данные
  const topDomains = getTopDomains();
  const searchEngineData = getSearchEngineDistribution();
  const checksByDay = getTotalChecksByDay();
  const positionAnalytics = getPositionAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Аналитика проверок позиций</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExportAll}>
            <Download className="h-4 w-4" />
            Экспорт истории
          </Button>
          <Button variant="default" size="sm" className="gap-1" onClick={() => window.location.href = "/position-tracker"}>
            <Search className="h-4 w-4" />
            Проверить позиции
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего проверок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">За всё время</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Уникальных доменов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(history.map(item => item.domain)).size}
            </div>
            <p className="text-xs text-muted-foreground">Проверено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ключевых слов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {history.reduce((total, item) => total + item.keywords.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Всего проверено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В ТОП-10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {history.reduce((total, item) => 
                total + item.keywords.filter(k => k.position > 0 && k.position <= 10).length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Позиций найдено</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Проверки по дням</CardTitle>
            <CardDescription>Количество запущенных проверок</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={checksByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} проверок`, 'Количество']} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение позиций</CardTitle>
            <CardDescription>Статистика найденных позиций</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionAnalytics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, props.payload.name]} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="mb-4">
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            История проверок
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-1">
            <Webhook className="h-4 w-4" />
            Домены
          </TabsTrigger>
          <TabsTrigger value="engines" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Поисковые системы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Домен</TableHead>
                    <TableHead>Дата проверки</TableHead>
                    <TableHead>Поисковая система</TableHead>
                    <TableHead className="text-center">Запросов</TableHead>
                    <TableHead className="text-center">ТОП-10</TableHead>
                    <TableHead className="text-center">Не найдено</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : history.length > 0 ? (
                    history.slice(0, 10).map((item, index) => {
                      const totalKeywords = item.keywords.length;
                      const inTop10 = item.keywords.filter(k => k.position > 0 && k.position <= 10).length;
                      const notFound = item.keywords.filter(k => k.position === 0).length;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.domain}</TableCell>
                          <TableCell>{new Date(item.timestamp).toLocaleString('ru-RU')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {item.searchEngine === 'google' ? 'Google' : 
                               item.searchEngine === 'yandex' ? 'Яндекс' : 
                               item.searchEngine === 'mailru' ? 'Mail.ru' : 
                               item.searchEngine === 'all' ? 'Все' : item.searchEngine}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{totalKeywords}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-green-500 font-medium">{inTop10}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({Math.round(inTop10/totalKeywords*100)}%)
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-red-500 font-medium">{notFound}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({Math.round(notFound/totalKeywords*100)}%)
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Нет данных по истории проверок
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Топ доменов по количеству проверок</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Домен</TableHead>
                    <TableHead>Количество проверок</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDomains.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.domain}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => window.location.href = "/position-tracker"}>
                          <Search className="h-4 w-4" />
                          Проверить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engines">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по поисковым системам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {searchEngineData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">{item.engine}</h3>
                        <p className="text-2xl font-bold">{item.count}</p>
                        <p className="text-sm text-muted-foreground mb-4">запросов</p>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm">{item.percentage}% от общего числа</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPositions;
