
import React, { useState } from 'react';
import { 
  BarChart as BarChartIcon, 
  Download, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown, 
  Share2 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { exportToExcel } from '@/services/position/exportService';
import { useToast } from "@/hooks/use-toast";

export const PositionTrackerResults = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('position');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchEngineFilter, setSearchEngineFilter] = useState('all');
  const { toast } = useToast();
  
  // Фильтрация и сортировка результатов
  const filteredResults = results?.keywords?.filter(item => {
    // Фильтрация по поисковой системе
    if (searchEngineFilter !== 'all' && item.searchEngine !== searchEngineFilter) {
      return false;
    }
    
    // Фильтрация по поисковому запросу
    if (searchTerm && !item.keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Сортировка по выбранному полю
    if (sortField === 'position') {
      return sortDirection === 'asc' 
        ? (a.position === 0 ? 101 : a.position) - (b.position === 0 ? 101 : b.position)
        : (b.position === 0 ? 101 : b.position) - (a.position === 0 ? 101 : a.position);
    } else if (sortField === 'keyword') {
      return sortDirection === 'asc'
        ? a.keyword.localeCompare(b.keyword)
        : b.keyword.localeCompare(a.keyword);
    }
    return 0;
  }) || [];

  // Данные для графиков
  const chartData = filteredResults.filter(item => item.position > 0).slice(0, 20).map(item => ({
    name: item.keyword.length > 20 ? item.keyword.slice(0, 20) + '...' : item.keyword,
    position: item.position
  }));

  // Функция для экспорта результатов
  const handleExport = () => {
    try {
      exportToExcel(results, `positions_${results.domain}_${new Date().toISOString().split('T')[0]}`);
      toast({
        title: "Экспорт выполнен",
        description: "Данные успешно экспортированы в Excel",
      });
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description: error.message || "Не удалось экспортировать данные",
        variant: "destructive",
      });
    }
  };

  // Переключение сортировки
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Функция определения статуса позиции
  const getPositionStatus = (position) => {
    if (position === 0) return { label: 'Не найдено', color: 'gray' };
    if (position <= 3) return { label: 'ТОП 3', color: 'green' };
    if (position <= 10) return { label: 'ТОП 10', color: 'blue' };
    if (position <= 30) return { label: 'ТОП 30', color: 'orange' };
    return { label: 'Низкая', color: 'red' };
  };

  if (!results) {
    return (
      <div className="text-center py-12">
        <BarChartIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">Нет данных для отображения</h3>
        <p className="text-muted-foreground">
          Запустите проверку позиций, чтобы увидеть результаты
        </p>
      </div>
    );
  }

  // Расчет статистики
  const totalKeywords = filteredResults.length;
  const inTop10 = filteredResults.filter(item => item.position > 0 && item.position <= 10).length;
  const inTop30 = filteredResults.filter(item => item.position > 0 && item.position <= 30).length;
  const notFound = filteredResults.filter(item => item.position === 0).length;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          {results.domain}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Поделиться
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего запросов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeywords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В ТОП-10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {inTop10} <span className="text-sm text-muted-foreground">({Math.round(inTop10/totalKeywords*100)}%)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В ТОП-30</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {inTop30} <span className="text-sm text-muted-foreground">({Math.round(inTop30/totalKeywords*100)}%)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Не найдено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {notFound} <span className="text-sm text-muted-foreground">({Math.round(notFound/totalKeywords*100)}%)</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="table">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="table">Таблица</TabsTrigger>
            <TabsTrigger value="chart">График</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Поиск по ключевым словам"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select 
              value={searchEngineFilter} 
              onValueChange={setSearchEngineFilter}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Поисковая система" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все поисковики</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="yandex">Яндекс</SelectItem>
                <SelectItem value="mailru">Mail.ru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="table" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[200px]">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => toggleSort('keyword')}
                    >
                      Ключевое слово
                      {sortField === 'keyword' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Поисковая система</TableHead>
                  <TableHead className="text-center">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => toggleSort('position')}
                    >
                      Позиция
                      {sortField === 'position' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, index) => {
                    const status = getPositionStatus(item.position);
                    return (
                      <TableRow key={`${item.keyword}-${item.searchEngine}`}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.keyword}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.searchEngine === 'google' ? 'Google' : 
                              item.searchEngine === 'yandex' ? 'Яндекс' : 
                              item.searchEngine === 'mailru' ? 'Mail.ru' : item.searchEngine}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {item.position > 0 ? item.position : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`
                              ${status.color === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                              ${status.color === 'blue' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                              ${status.color === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : ''}
                              ${status.color === 'red' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                              ${status.color === 'gray' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : ''}
                            `}
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                              {item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Нет данных, соответствующих критериям поиска
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="chart" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Топ 20 ключевых слов по позициям</CardTitle>
              <CardDescription>
                Чем ниже столбец, тем лучше позиция в выдаче
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax']} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`Позиция: ${value}`, 'Ключевое слово']} />
                    <Bar dataKey="position" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
