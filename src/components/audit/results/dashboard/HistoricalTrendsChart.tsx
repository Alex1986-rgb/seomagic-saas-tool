import React from 'react';
import { 
  LineChart, Line, CartesianGrid, 
  Tooltip, XAxis, YAxis, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricalTrend } from '@/services/audit/historyService';

interface HistoricalTrendsChartProps {
  data: HistoricalTrend[];
}

const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Исторические тренды</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Недостаточно исторических данных для отображения трендов. 
            Проведите больше аудитов для отслеживания динамики.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика оценок за период</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              className="text-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]} 
              className="text-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="globalScore" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Общий балл"
              dot={{ fill: 'hsl(var(--primary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="seoScore" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="SEO"
              dot={{ fill: '#8884d8' }}
            />
            <Line 
              type="monotone" 
              dataKey="technicalScore" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Технические"
              dot={{ fill: '#82ca9d' }}
            />
            <Line 
              type="monotone" 
              dataKey="contentScore" 
              stroke="#ffc658" 
              strokeWidth={2}
              name="Контент"
              dot={{ fill: '#ffc658' }}
            />
            <Line 
              type="monotone" 
              dataKey="performanceScore" 
              stroke="#ff8042" 
              strokeWidth={2}
              name="Производительность"
              dot={{ fill: '#ff8042' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HistoricalTrendsChart;
