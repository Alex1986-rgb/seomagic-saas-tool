
import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PositionsDistributionChartProps {
  history: PositionData[];
}

export function PositionsDistributionChart({ history }: PositionsDistributionChartProps) {
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

  const positionAnalytics = getPositionAnalytics();
  
  return (
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
            <Tooltip formatter={(value, name, props) => {
              if (props?.payload && typeof props.payload.percentage === 'number') {
                return [`${value} (${props.payload.percentage}%)`, name as string];
              }
              return [value, name as string];
            }} />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
