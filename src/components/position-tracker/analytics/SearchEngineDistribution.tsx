
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchEngineDistributionProps {
  history: PositionData[];
}

export function SearchEngineDistribution({ history }: SearchEngineDistributionProps) {
  const getSearchEngineDistribution = () => {
    const engines: Record<string, number> = { google: 0, yandex: 0, mailru: 0 };
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        if (typeof engines[keyword.searchEngine as keyof typeof engines] === 'number') {
          engines[keyword.searchEngine as keyof typeof engines]++;
          total++;
        }
      });
    });
    
    return Object.entries(engines).map(([engine, count]) => ({
      engine: engine === 'google' ? 'Google' : engine === 'yandex' ? 'Яндекс' : 'Mail.ru',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  };

  const searchEngineData = getSearchEngineDistribution();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение по поисковым системам</CardTitle>
        <CardDescription>Статистика использования поисковых систем</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchEngineData.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">{item.engine}</h3>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-sm text-muted-foreground mb-4">запросов</p>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm">{item.percentage}% от общего числа</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
