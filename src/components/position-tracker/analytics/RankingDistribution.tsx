
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface RankingDistributionProps {
  history: PositionData[];
}

export function RankingDistribution({ history }: RankingDistributionProps) {
  const calculatePositionGroups = () => {
    const groups = {
      top3: 0,
      top10: 0,
      top30: 0,
      top50: 0,
      top100: 0,
      beyond100: 0,
      notFound: 0
    };
    
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        total++;
        
        if (keyword.position === 0) {
          groups.notFound++;
        } else if (keyword.position <= 3) {
          groups.top3++;
        } else if (keyword.position <= 10) {
          groups.top10++;
        } else if (keyword.position <= 30) {
          groups.top30++;
        } else if (keyword.position <= 50) {
          groups.top50++;
        } else if (keyword.position <= 100) {
          groups.top100++;
        } else {
          groups.beyond100++;
        }
      });
    });
    
    return { groups, total };
  };
  
  const { groups, total } = calculatePositionGroups();
  
  // Форматирование процентов
  const formatPercent = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение позиций</CardTitle>
        <CardDescription>Детальный анализ распределения позиций по диапазонам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">ТОП 3</Badge>
              <span className="text-sm font-medium">{groups.top3} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.top3)}%</span>
          </div>
          <Progress value={formatPercent(groups.top3)} className="h-2 bg-muted" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">ТОП 4-10</Badge>
              <span className="text-sm font-medium">{groups.top10} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.top10)}%</span>
          </div>
          <Progress value={formatPercent(groups.top10)} className="h-2 bg-muted" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">ТОП 11-30</Badge>
              <span className="text-sm font-medium">{groups.top30} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.top30)}%</span>
          </div>
          <Progress value={formatPercent(groups.top30)} className="h-2 bg-muted" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">ТОП 31-50</Badge>
              <span className="text-sm font-medium">{groups.top50} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.top50)}%</span>
          </div>
          <Progress value={formatPercent(groups.top50)} className="h-2 bg-muted" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">ТОП 51-100</Badge>
              <span className="text-sm font-medium">{groups.top100} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.top100)}%</span>
          </div>
          <Progress value={formatPercent(groups.top100)} className="h-2 bg-muted" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Ниже 100</Badge>
              <span className="text-sm font-medium">{groups.beyond100} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.beyond100)}%</span>
          </div>
          <Progress value={formatPercent(groups.beyond100)} className="h-2 bg-muted" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Не найдено</Badge>
              <span className="text-sm font-medium">{groups.notFound} запросов</span>
            </div>
            <span className="text-sm font-medium">{formatPercent(groups.notFound)}%</span>
          </div>
          <Progress value={formatPercent(groups.notFound)} className="h-2 bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
