
import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyActivityChartProps {
  history: PositionData[];
}

export function DailyActivityChart({ history }: DailyActivityChartProps) {
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

  const checksByDay = getTotalChecksByDay();
  
  return (
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
  );
}
