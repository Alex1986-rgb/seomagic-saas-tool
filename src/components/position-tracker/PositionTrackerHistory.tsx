
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, ChevronDown, ChevronUp, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPositionHistory } from '@/services/position/positionHistory';
import { useToast } from "@/hooks/use-toast";

export const PositionTrackerHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const { toast } = useToast();

  const domains = [...new Set(history.map(item => item.domain))];
  
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getPositionHistory();
      setHistory(data);
    } catch (error) {
      toast({
        title: "Ошибка загрузки истории",
        description: error.message || "Не удалось загрузить историю проверок",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (selectedDomain !== 'all' && item.domain !== selectedDomain) {
      return false;
    }
    
    if (selectedDate !== 'all') {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      const filterDate = new Date();
      
      if (selectedDate === 'today') {
        return itemDate === filterDate.toISOString().split('T')[0];
      } else if (selectedDate === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(filterDate.getDate() - 7);
        return new Date(item.date) >= weekAgo;
      } else if (selectedDate === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(filterDate.getMonth() - 1);
        return new Date(item.date) >= monthAgo;
      }
    }
    
    return true;
  });

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const getPositionTrend = (current, previous) => {
    if (!previous || previous === 0) return 'neutral';
    if (current === 0) return 'down';
    if (current < previous) return 'up';
    if (current > previous) return 'down';
    return 'neutral';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Подготовка данных для графика динамики позиций
  const prepareChartData = (historyRecord) => {
    if (!historyRecord || !historyRecord.previousResults) return [];
    
    // Собираем историю позиций для каждого ключевого слова
    const keywordHistory = {};
    
    // Текущие данные
    const currentDate = new Date(historyRecord.date);
    
    historyRecord.keywords.forEach(item => {
      if (!keywordHistory[item.keyword]) {
        keywordHistory[item.keyword] = [];
      }
      
      keywordHistory[item.keyword].push({
        date: currentDate,
        position: item.position
      });
    });
    
    // Добавляем предыдущие результаты
    historyRecord.previousResults.forEach(prevResult => {
      const prevDate = new Date(prevResult.date);
      
      prevResult.keywords.forEach(item => {
        if (!keywordHistory[item.keyword]) {
          keywordHistory[item.keyword] = [];
        }
        
        keywordHistory[item.keyword].push({
          date: prevDate,
          position: item.position
        });
      });
    });
    
    // Для каждого ключевого слова сортируем историю по дате
    Object.keys(keywordHistory).forEach(keyword => {
      keywordHistory[keyword].sort((a, b) => a.date - b.date);
    });
    
    // Выбираем топ-5 ключевых слов для графика
    const topKeywords = Object.keys(keywordHistory)
      .filter(keyword => {
        // Исключаем ключевые слова, для которых нет истории или все позиции равны 0
        const history = keywordHistory[keyword];
        return history.length > 1 && history.some(h => h.position > 0);
      })
      .slice(0, 5);
    
    // Формируем данные для графика
    const chartData = [];
    const allDates = new Set();
    
    // Собираем все уникальные даты
    Object.values(keywordHistory).forEach(history => {
      history.forEach(point => {
        allDates.add(point.date.toISOString().split('T')[0]);
      });
    });
    
    // Сортируем даты
    const sortedDates = Array.from(allDates).sort();
    
    // Создаем точки данных для каждой даты
    sortedDates.forEach(dateStr => {
      const dataPoint = { date: dateStr };
      
      topKeywords.forEach(keyword => {
        const historyPoints = keywordHistory[keyword];
        const point = historyPoints.find(h => h.date.toISOString().split('T')[0] === dateStr);
        
        dataPoint[keyword] = point ? point.position : null;
      });
      
      chartData.push(dataPoint);
    });
    
    return { chartData, keywords: topKeywords };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">История проверок позиций</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Выберите домен" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все домены</SelectItem>
              {domains.map(domain => (
                <SelectItem key={domain} value={domain}>{domain}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все время</SelectItem>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="week">Последняя неделя</SelectItem>
              <SelectItem value="month">Последний месяц</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={loadHistory} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      <CardTitle className="text-lg">{item.domain}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.date)}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Динамика
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Динамика позиций для {item.domain}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 h-[400px]">
                          {(() => {
                            const { chartData, keywords } = prepareChartData(item);
                            return chartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  {keywords.map((keyword, i) => (
                                    <Line
                                      key={keyword}
                                      type="monotone"
                                      dataKey={keyword}
                                      stroke={`hsl(${i * 60}, 70%, 50%)`}
                                      activeDot={{ r: 8 }}
                                      connectNulls
                                    />
                                  ))}
                                </LineChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground">
                                Недостаточно данных для построения графика
                              </div>
                            );
                          })()}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Экспорт
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(index)}
                    >
                      Детали {expandedItem === index ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Запросов</div>
                    <div className="text-xl font-semibold">{item.keywords.length}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">В ТОП-10</div>
                    <div className="text-xl font-semibold text-green-500">
                      {item.keywords.filter(k => k.position > 0 && k.position <= 10).length}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Поисковых систем</div>
                    <div className="text-xl font-semibold">
                      {new Set(item.keywords.map(k => k.searchEngine)).size}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {expandedItem === index && (
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Ключевое слово</TableHead>
                          <TableHead>Поисковик</TableHead>
                          <TableHead className="text-center">Позиция</TableHead>
                          <TableHead className="text-center">Изменение</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.keywords.map((keyword, kidx) => {
                          const prevResult = item.previousResults && item.previousResults.length > 0 
                            ? item.previousResults[0].keywords.find(k => 
                                k.keyword === keyword.keyword && k.searchEngine === keyword.searchEngine
                              )
                            : null;
                          
                          const prevPosition = prevResult ? prevResult.position : null;
                          const trend = getPositionTrend(keyword.position, prevPosition);
                          
                          return (
                            <TableRow key={kidx}>
                              <TableCell className="font-medium">{keyword.keyword}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {keyword.searchEngine === 'google' ? 'Google' : 
                                   keyword.searchEngine === 'yandex' ? 'Яндекс' : 
                                   keyword.searchEngine === 'mailru' ? 'Mail.ru' : keyword.searchEngine}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                {keyword.position > 0 ? keyword.position : '-'}
                              </TableCell>
                              <TableCell className="text-center">
                                {prevPosition !== null ? (
                                  <div className="flex items-center justify-center gap-1">
                                    {trend === 'up' && (
                                      <Badge className="bg-green-100 text-green-800">
                                        ▲ {Math.abs(keyword.position - prevPosition)}
                                      </Badge>
                                    )}
                                    {trend === 'down' && (
                                      <Badge className="bg-red-100 text-red-800">
                                        ▼ {Math.abs(keyword.position - prevPosition)}
                                      </Badge>
                                    )}
                                    {trend === 'neutral' && (
                                      <Badge className="bg-gray-100 text-gray-800">
                                        ═ 0
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">История проверок пуста</h3>
          <p className="text-muted-foreground mb-4">
            Запустите проверку позиций, чтобы начать отслеживать историю
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/position-tracker"}>
            Перейти к проверке позиций
          </Button>
        </Card>
      )}
    </div>
  );
};
