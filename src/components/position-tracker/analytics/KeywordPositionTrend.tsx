
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KeywordPositionTrendProps {
  history: PositionData[];
  selectedKeyword?: string;
}

export function KeywordPositionTrend({ history, selectedKeyword }: KeywordPositionTrendProps) {
  // Функция для получения истории позиций для конкретного ключевого слова
  const getKeywordTrend = () => {
    if (!selectedKeyword) {
      // Если ключевое слово не выбрано, возьмем первое из истории
      const allKeywords = new Set<string>();
      history.forEach(item => {
        item.keywords.forEach(kw => allKeywords.add(kw.keyword));
      });
      
      const popularKeywords = Array.from(allKeywords).slice(0, 5);
      
      // Получаем историю позиций для топ-5 ключевых слов
      return popularKeywords.map(keyword => {
        const trend = history
          .slice()
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map(item => {
            const keywordData = item.keywords.find(k => k.keyword === keyword);
            return {
              date: new Date(item.timestamp).toLocaleDateString(),
              position: keywordData ? keywordData.position : null,
              keyword
            };
          })
          .filter(item => item.position !== null);
        
        return { keyword, data: trend };
      });
    }
    
    // Получаем историю позиций для выбранного ключевого слова
    return [{
      keyword: selectedKeyword,
      data: history
        .slice()
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(item => {
          const keywordData = item.keywords.find(k => k.keyword === selectedKeyword);
          return {
            date: new Date(item.timestamp).toLocaleDateString(),
            position: keywordData ? keywordData.position : null
          };
        })
        .filter(item => item.position !== null)
    }];
  };
  
  const keywordTrends = getKeywordTrend();
  
  // Если нет данных для отображения
  if (keywordTrends.length === 0 || keywordTrends[0].data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Тренд позиций по ключевым словам</CardTitle>
          <CardDescription>История изменения позиций для выбранных ключевых слов</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground text-center">
            Недостаточно данных для отображения тренда позиций
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Получаем среднее изменение позиции
  const calculateTrend = (data: Array<{ position: number | null }>) => {
    if (data.length < 2) return 0;
    
    const validPositions = data.filter(item => item.position !== null && item.position > 0)
      .map(item => item.position as number);
    
    if (validPositions.length < 2) return 0;
    
    return validPositions[0] - validPositions[validPositions.length - 1];
  };
  
  const trend = calculateTrend(keywordTrends[0].data);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Тренд позиций по ключевым словам</CardTitle>
            <CardDescription>История изменения позиций для выбранных ключевых слов</CardDescription>
          </div>
          {trend !== 0 && (
            <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              <span className="font-bold">{Math.abs(trend)} {trend > 0 ? 'улучшение' : 'ухудшение'}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              allowDuplicatedCategory={false}
              label={{ value: 'Дата', position: 'bottom', offset: 0 }}
            />
            <YAxis 
              domain={[0, 'dataMax']} 
              reversed 
              label={{ value: 'Позиция', angle: -90, position: 'left' }}
            />
            <Tooltip 
              formatter={(value) => [value === 0 ? 'Не найдено' : `${value}`, 'Позиция']}
              labelFormatter={(label) => `Дата: ${label}`}
            />
            <Legend />
            
            {keywordTrends.map((series, index) => (
              <Line 
                key={series.keyword}
                data={series.data}
                type="monotone" 
                dataKey="position" 
                name={series.keyword} 
                stroke={`hsl(${index * 40}, 70%, 50%)`} 
                activeDot={{ r: 8 }} 
                connectNulls 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
