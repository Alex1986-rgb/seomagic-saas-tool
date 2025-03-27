
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface KeywordPositionTrendProps {
  history: PositionData[];
  keyword?: string;
  limit?: number;
}

export function KeywordPositionTrend({ history, keyword, limit = 10 }: KeywordPositionTrendProps) {
  const getTrendData = () => {
    if (!history.length) return [];
    
    // If no specific keyword is provided, get the first keyword from the latest check
    const targetKeyword = keyword || (history[0].keywords[0]?.keyword || '');
    if (!targetKeyword) return [];
    
    // Find this keyword in all history entries
    const trendData = history
      .filter(item => item.keywords.some(k => k.keyword === targetKeyword))
      .map(item => {
        const keywordData = item.keywords.find(k => k.keyword === targetKeyword);
        return {
          date: new Date(item.timestamp).toLocaleDateString(),
          position: keywordData?.position || 0,
          formattedDate: new Date(item.timestamp).toLocaleDateString('ru-RU', {
            day: '2-digit', 
            month: '2-digit'
          })
        };
      })
      .filter(item => item.position > 0) // Filter out not found positions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-limit); // Get only the latest entries
    
    return trendData;
  };
  
  const trendData = getTrendData();
  const keywordForDisplay = keyword || (history.length > 0 && history[0].keywords.length > 0 ? history[0].keywords[0].keyword : 'Нет данных');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Тренд позиций</CardTitle>
        <CardDescription>
          Динамика изменения позиций для "{keywordForDisplay}"
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {trendData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                tickMargin={10}
              />
              <YAxis 
                reversed 
                domain={[1, 'dataMax']} 
                label={{ 
                  value: 'Позиция', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip 
                formatter={(value) => [`Позиция: ${value}`, 'Позиция']}
                labelFormatter={(label) => `Дата: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="position" 
                stroke="#8884d8" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Недостаточно данных для отображения тренда
          </div>
        )}
      </CardContent>
    </Card>
  );
}
