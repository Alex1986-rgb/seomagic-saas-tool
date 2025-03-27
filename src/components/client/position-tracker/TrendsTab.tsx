
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/position-tracker/analytics/StatCard';
import { KeywordPositionTrend } from '@/components/position-tracker/analytics';
import { BarChart, TrendingUp, Calendar } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendsTabProps {
  history: PositionData[];
}

const TrendsTab: React.FC<TrendsTabProps> = ({ history }) => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  // Подготовка данных для графика тренда позиций
  const prepareTrendData = () => {
    if (history.length === 0) return [];
    
    const trendData: any[] = [];
    const dateMap = new Map<string, any>();
    
    // Получить все уникальные ключевые слова
    const allKeywords = history.length > 0 
      ? Array.from(new Set(history[0].keywords.map(k => k.keyword)))
      : [];
    
    // Если нет выбранных ключевых слов, выберем первые 5
    const keysToShow = selectedKeywords.length > 0 
      ? selectedKeywords 
      : allKeywords.slice(0, 5);
    
    // Собираем данные для каждой даты
    history.forEach(entry => {
      const date = new Date(entry.date || entry.timestamp).toISOString().split('T')[0];
      
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      
      const dateEntry = dateMap.get(date);
      
      keysToShow.forEach(keyword => {
        const keywordData = entry.keywords.find(k => k.keyword === keyword && k.searchEngine === 'google');
        if (keywordData) {
          dateEntry[keyword] = keywordData.position > 0 ? keywordData.position : null;
        }
      });
    });
    
    // Преобразуем Map в массив и сортируем по дате
    Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(entry => trendData.push(entry));
    
    return trendData;
  };
  
  const trendData = prepareTrendData();
  
  const getColorForIndex = (index: number) => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400'];
    return colors[index % colors.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Тренды позиций</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 дней</SelectItem>
              <SelectItem value="30days">30 дней</SelectItem>
              <SelectItem value="90days">90 дней</SelectItem>
              <SelectItem value="all">Все время</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Выбрать даты</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Изменение за 30 дней"
          value="+8.3"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 12, isUp: true }}
        />
        <StatCard
          title="Топ растущие ключи"
          value="7"
          icon={<BarChart className="h-5 w-5" />}
          trend={{ value: 2, isUp: true }}
        />
        <StatCard
          title="Снижающиеся ключи"
          value="3"
          icon={<BarChart className="h-5 w-5" />}
          trend={{ value: 1, isUp: false }}
        />
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Динамика позиций ключевых слов</h3>
        <div className="h-[400px]">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 'dataMax']} reversed />
                <Tooltip 
                  formatter={(value) => [`Позиция: ${value}`, ""]}
                  labelFormatter={(label) => `Дата: ${new Date(label).toLocaleDateString('ru-RU')}`}
                />
                <Legend />
                {Object.keys(trendData[0] || {})
                  .filter(key => key !== 'date')
                  .map((keyword, index) => (
                    <Line
                      key={keyword}
                      type="monotone"
                      dataKey={keyword}
                      name={keyword}
                      stroke={getColorForIndex(index)}
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
          )}
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Тренд ключевого слова</h3>
        <KeywordPositionTrend history={history} />
      </Card>
    </div>
  );
};

export default TrendsTab;
