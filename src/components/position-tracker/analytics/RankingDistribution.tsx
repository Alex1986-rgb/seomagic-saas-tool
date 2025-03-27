
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RankingDistributionProps {
  history: PositionData[];
}

export function RankingDistribution({ history }: RankingDistributionProps) {
  const getRankingDistribution = () => {
    if (!history.length) return [];
    
    const distribution = {
      top3: 0,
      top10: 0,
      top30: 0,
      top100: 0,
      notFound: 0
    };
    
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        total++;
        if (keyword.position === 0) {
          distribution.notFound++;
        } else if (keyword.position <= 3) {
          distribution.top3++;
        } else if (keyword.position <= 10) {
          distribution.top10++;
        } else if (keyword.position <= 30) {
          distribution.top30++;
        } else {
          distribution.top100++;
        }
      });
    });
    
    const data = [
      { name: 'ТОП 3', value: distribution.top3, color: '#4CAF50' },
      { name: 'ТОП 4-10', value: distribution.top10, color: '#2196F3' },
      { name: 'ТОП 11-30', value: distribution.top30, color: '#FFC107' },
      { name: 'ТОП 31-100', value: distribution.top100, color: '#FF9800' },
      { name: 'Не найдено', value: distribution.notFound, color: '#F44336' }
    ];
    
    return data.filter(item => item.value > 0); // Remove empty segments
  };
  
  const distributionData = getRankingDistribution();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение позиций</CardTitle>
        <CardDescription>
          Распределение ключевых слов по позициям в поисковой выдаче
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {distributionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} ключевых слов`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Нет данных для отображения
          </div>
        )}
      </CardContent>
    </Card>
  );
}
