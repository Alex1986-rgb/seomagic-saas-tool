
import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { History, Download, ArrowDown, ArrowUp, LineChart as LineChartIcon, PieChart, FileBarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPositionHistory } from '@/services/position/positionHistory';
import { useToast } from "@/hooks/use-toast";
import { PositionData } from '@/services/position/positionTracker';

export function PositionTrackerAnalytics() {
  const [history, setHistory] = useState<PositionData[]>([]);
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
    const domains: Record<string, number> = {};
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
    const engines: Record<string, number> = { google: 0, yandex: 0, mailru: 0 };
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        if (typeof engines[keyword.searchEngine as keyof typeof engines] === 'number') {
          engines[keyword.searchEngine as keyof typeof engines]++;
          total++;
        }
      });
    });
    
    return Object.entries(engines).map(([engine, count]) => ({
      engine: engine === 'google' ? 'Google' : engine === 'yandex' ? 'Яндекс' : 'Mail.ru',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  };

  const getTotalChecksByDay = () => {
    const checksByDay: Record<string, number> = {};
    
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
      { name: 'ТОП 3', value: topPositions.top3, percentage: total > 0 ? Math.round((topPositions.top3 / total) * 100) : 0 },
      { name: 'ТОП 4-10', value: topPositions.top10, percentage: total > 0 ? Math.round((topPositions.top10 / total) * 100) : 0 },
      { name: 'ТОП 11-30', value: topPositions.top30, percentage: total > 0 ? Math.round((topPositions.top30 / total) * 100) : 0 },
      { name: 'Ниже 30', value: topPositions.beyond, percentage: total > 0 ? Math.round((topPositions.beyond / total) * 100) : 0 },
      { name: 'Не найдено', value: topPositions.notFound, percentage: total > 0 ? Math.round((topPositions.notFound / total) * 100) : 0 },
    ];
  };

  // Получение статистики по ключевым словам
  const getTopKeywords = () => {
    const keywordStats: Record<string, { count: number, avgPosition: number }> = {};
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        if (!keywordStats[keyword.keyword]) {
          keywordStats[keyword.keyword] = { count: 0, avgPosition: 0 };
        }
        
        keywordStats[keyword.keyword].count++;
        
        // Учитываем только найденные позиции (не равные 0)
        if (keyword.position > 0) {
          keywordStats[keyword.keyword].avgPosition = 
            (keywordStats[keyword.keyword].avgPosition * (keywordStats[keyword.keyword].count - 1) + keyword.position) / 
            keywordStats[keyword.keyword].count;
        }
      });
    });
    
    return Object.entries(keywordStats)
      .map(([keyword, stats]) => ({ 
        keyword, 
        count: stats.count, 
        avgPosition: stats.avgPosition > 0 ? Math.round(stats.avgPosition) : 'Не найдено'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Подготовка данных для графиков
  const topDomains = getTopDomains();
  const searchEngineData = getSearchEngineDistribution();
  const checksByDay = getTotalChecksByDay();
  const positionAnalytics = getPositionAnalytics();
  const topKeywords = getTopKeywords();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Аналитика позиций в поисковых системах</h2>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => window.location.href = "/position-tracker"}>
          <History className="h-4 w-4" />
          К проверке позиций
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего проверок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">За все время</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Проверено URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(history.map(item => item.domain)).size}
            </div>
            <p className="text-xs text-muted-foreground">Уникальных доменов</p>
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
            <p className="text-xs text-muted-foreground">Найдено позиций</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions">
        <TabsList className="mb-4">
          <TabsTrigger value="positions" className="flex items-center gap-1">
            <LineChartIcon className="h-4 w-4" />
            Распределение позиций
          </TabsTrigger>
          <TabsTrigger value="engines" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            Поисковые системы
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-1">
            <FileBarChart className="h-4 w-4" />
            Топ ключевых слов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Tooltip formatter={(value: unknown, name, props) => {
                      if (typeof value === 'number' && props && props.payload && typeof props.payload.percentage === 'number') {
                        return [`${value} (${props.payload.percentage}%)`, props.payload.name];
                      }
                      return [value, name];
                    }} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активность по дням</CardTitle>
                <CardDescription>Количество проверок по дням</CardDescription>
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
          </div>
        </TabsContent>

        <TabsContent value="engines">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по поисковым системам</CardTitle>
              <CardDescription>Статистика использования поисковых систем</CardDescription>
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

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Топ-10 ключевых слов</CardTitle>
              <CardDescription>Наиболее часто проверяемые ключевые слова</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Ключевое слово</th>
                      <th className="py-3 px-4 text-center">Количество проверок</th>
                      <th className="py-3 px-4 text-center">Средняя позиция</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topKeywords.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                        <td className="py-3 px-4 font-medium">{item.keyword}</td>
                        <td className="py-3 px-4 text-center">{item.count}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {typeof item.avgPosition === 'number' ? (
                              <>
                                {item.avgPosition <= 10 ? (
                                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-amber-500 mr-1" />
                                )}
                                <span className={item.avgPosition <= 10 ? "text-green-500" : "text-amber-500"}>
                                  {item.avgPosition}
                                </span>
                              </>
                            ) : (
                              <span className="text-red-500">{item.avgPosition}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
