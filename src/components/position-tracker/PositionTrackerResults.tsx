
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, FileDown, AlertCircle, Bookmark, TrendingUp, TrendingDown, ArrowRight, Minus } from "lucide-react";
import { PositionData, KeywordPosition } from "@/services/position/positionTracker";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { saveAs } from 'file-saver';

interface PositionTrackerResultsProps {
  results: PositionData | null;
}

export function PositionTrackerResults({ results }: PositionTrackerResultsProps) {
  if (!results) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Нет данных для отображения</AlertDescription>
      </Alert>
    );
  }

  const { domain, keywords, searchEngine, timestamp, depth } = results;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Подсчитываем метрики для отображения
  const totalKeywords = keywords.length;
  const inTop10 = keywords.filter(k => k.position > 0 && k.position <= 10).length;
  const inTop30 = keywords.filter(k => k.position > 0 && k.position <= 30).length;
  const notFound = keywords.filter(k => k.position === 0).length;
  
  // Создаем данные для графика
  const chartData = [
    { name: 'ТОП-10', value: inTop10 },
    { name: 'ТОП-30', value: inTop30 - inTop10 },
    { name: 'ТОП-100', value: totalKeywords - inTop30 - notFound },
    { name: 'Не найдены', value: notFound },
  ];
  
  // Функция для экспорта результатов в CSV
  const exportCsv = () => {
    let csv = 'Keyword,Position,PreviousPosition,Change,URL\n';
    
    keywords.forEach(keyword => {
      const change = keyword.previousPosition && keyword.position > 0
        ? keyword.previousPosition - keyword.position
        : 'N/A';
        
      const formattedChange = typeof change === 'number' 
        ? (change > 0 ? `+${change}` : change) 
        : change;
        
      csv += `"${keyword.keyword}",${keyword.position},${keyword.previousPosition || 'N/A'},${formattedChange},"${keyword.url || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const fileName = `positions_${domain}_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  };
  
  // Определяем тренд позиции
  const getPositionTrend = (position: number, prevPosition?: number) => {
    if (!prevPosition || position === 0) return null;
    
    if (position < prevPosition) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (position > prevPosition) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Форматируем изменение позиции для отображения
  const formatPositionChange = (position: number, prevPosition?: number) => {
    if (!prevPosition || position === 0) return null;
    
    const change = prevPosition - position;
    if (change > 0) {
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">+{change}</Badge>;
    } else if (change < 0) {
      return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">{change}</Badge>;
    } else {
      return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">0</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Результаты проверки позиций</h2>
          <p className="text-muted-foreground">
            {formatDate(timestamp)} • Домен: {domain} • Поисковая система: {searchEngine !== 'all' ? searchEngine : 'все'}
          </p>
        </div>
        
        <Button variant="outline" onClick={exportCsv}>
          <FileDown className="mr-2 h-4 w-4" />
          Экспорт в CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Всего ключевых слов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeywords}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">В ТОП-10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inTop10}</div>
            <p className="text-xs text-muted-foreground">{Math.round((inTop10 / totalKeywords) * 100)}% от общего числа</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">В ТОП-30</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inTop30}</div>
            <p className="text-xs text-muted-foreground">{Math.round((inTop30 / totalKeywords) * 100)}% от общего числа</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Не найдено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{notFound}</div>
            <p className="text-xs text-muted-foreground">{Math.round((notFound / totalKeywords) * 100)}% от общего числа</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Таблица позиций
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            График распределения
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Позиции ключевых слов</CardTitle>
              <CardDescription>
                Список ключевых слов и их текущие позиции в поисковых системах
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Ключевое слово</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Текущая позиция</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Предыдущая</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Изменение</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="p-3">{keyword.keyword}</td>
                        <td className="p-3 text-center">
                          {keyword.position === 0 ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Не найдено
                            </Badge>
                          ) : (
                            <Badge variant={keyword.position <= 10 ? "default" : "secondary"}>
                              {keyword.position}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {keyword.previousPosition || '-'}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getPositionTrend(keyword.position, keyword.previousPosition)}
                            {formatPositionChange(keyword.position, keyword.previousPosition)}
                          </div>
                        </td>
                        <td className="p-3 truncate max-w-[200px]">
                          {keyword.url ? (
                            <a 
                              href={keyword.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline truncate block"
                            >
                              {keyword.url}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Распределение позиций</CardTitle>
              <CardDescription>
                Визуальное представление распределения ключевых слов по позициям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} ключевых слов`, 'Количество']} />
                    <Legend />
                    <Bar dataKey="value" name="Количество ключевых слов" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
