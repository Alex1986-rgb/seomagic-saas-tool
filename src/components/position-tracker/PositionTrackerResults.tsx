
import React from 'react';
import { 
  BarChart, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { PositionData, KeywordPosition } from '@/services/position/positionTracker';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, Minus, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { positionTrackingService } from '@/services/positionTrackingService';

interface PositionTrackerResultsProps {
  data: PositionData | null;
}

export const PositionTrackerResults: React.FC<PositionTrackerResultsProps> = ({ data }) => {
  const isMobile = useMobile();
  
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Нет данных для отображения. Выполните проверку позиций.</p>
      </div>
    );
  }

  const getPositionChangeIcon = (current: number, previous?: number) => {
    if (!previous || current === 0 || previous === 0) {
      return null;
    }
    
    if (current < previous) {
      // Улучшение (позиция стала ниже численно, но выше в выдаче)
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (current > previous) {
      // Ухудшение (позиция стала выше численно, но ниже в выдаче)
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      // Без изменений
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPositionClass = (position: number) => {
    if (position === 0) {
      return "bg-gray-100 text-gray-700";
    } else if (position <= 3) {
      return "bg-green-100 text-green-800";
    } else if (position <= 10) {
      return "bg-green-50 text-green-700";
    } else if (position <= 30) {
      return "bg-yellow-50 text-yellow-700";
    } else {
      return "bg-red-50 text-red-700";
    }
  };

  const handleExport = () => {
    positionTrackingService.exportResultsAsCsv({
      domain: data.domain,
      keywords: data.keywords.map(k => k.keyword), // Convert KeywordPosition[] to string[]
      searchEngine: data.searchEngine,
      region: data.region,
      positions: data.keywords.map(k => ({
        keyword: k.keyword,
        position: k.position,
        previousPosition: k.previousPosition,
        url: k.url || '',
        date: new Date().toISOString()
      })),
      scanDate: data.timestamp
    });
  };

  const getPositionDistributionData = () => {
    const distribution = {
      top3: 0,
      top10: 0,
      top30: 0,
      top100: 0,
      notFound: 0
    };

    data.keywords.forEach(keyword => {
      const position = keyword.position;
      if (position === 0) {
        distribution.notFound++;
      } else if (position <= 3) {
        distribution.top3++;
      } else if (position <= 10) {
        distribution.top10++;
      } else if (position <= 30) {
        distribution.top30++;
      } else {
        distribution.top100++;
      }
    });

    return [
      { name: 'ТОП 3', value: distribution.top3 },
      { name: 'ТОП 4-10', value: distribution.top10 },
      { name: 'ТОП 11-30', value: distribution.top30 },
      { name: 'ТОП 31-100', value: distribution.top100 },
      { name: 'Не найдено', value: distribution.notFound }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Результаты проверки позиций</h3>
          <p className="text-sm text-muted-foreground">
            Домен: {data.domain} • 
            {data.searchEngine === 'all' ? ' Все поисковые системы' : 
             data.searchEngine === 'google' ? ' Google' : 
             data.searchEngine === 'yandex' ? ' Яндекс' : ' Mail.ru'} • 
            {data.region ? ` Регион: ${data.region}` : ''} • 
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> 
            {!isMobile && "Экспорт CSV"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" /> 
            {!isMobile && "Поделиться"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Всего запросов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.keywords.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ТОП-10</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {data.keywords.filter(k => k.position > 0 && k.position <= 10).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ТОП-30</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">
              {data.keywords.filter(k => k.position > 0 && k.position <= 30).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Не найдено</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-500">
              {data.keywords.filter(k => k.position === 0).length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="table">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Таблица</TabsTrigger>
          <TabsTrigger value="chart">График</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ключевое слово</TableHead>
                  <TableHead className="text-center">Позиция</TableHead>
                  {!isMobile && <TableHead>Изменение</TableHead>}
                  {!isMobile && <TableHead>URL</TableHead>}
                  {!isMobile && <TableHead>Поисковик</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.keywords.sort((a, b) => a.position === 0 ? 1000 : a.position - (b.position === 0 ? 1000 : b.position)).map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={getPositionClass(keyword.position)}
                      >
                        {keyword.position > 0 ? keyword.position : 'не найден'}
                      </Badge>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPositionChangeIcon(keyword.position, keyword.previousPosition)}
                          {keyword.previousPosition && keyword.position > 0 && keyword.previousPosition > 0 && (
                            <span className={
                              keyword.position < keyword.previousPosition ? "text-green-600" :
                              keyword.position > keyword.previousPosition ? "text-red-600" : ""
                            }>
                              {Math.abs(keyword.previousPosition - keyword.position)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell className="max-w-[200px] truncate">
                        {keyword.url || '-'}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        {keyword.searchEngine === 'google' ? 'Google' :
                         keyword.searchEngine === 'yandex' ? 'Яндекс' :
                         keyword.searchEngine === 'mailru' ? 'Mail.ru' : keyword.searchEngine}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Распределение позиций</CardTitle>
              <CardDescription>
                Количество ключевых слов в различных диапазонах позиций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getPositionDistributionData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Количество запросов" fill="#8884d8" />
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
