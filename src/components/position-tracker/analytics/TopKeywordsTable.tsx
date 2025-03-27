
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TopKeywordsTableProps {
  history: PositionData[];
}

export function TopKeywordsTable({ history }: TopKeywordsTableProps) {
  const getTopKeywords = () => {
    const keywordStats: Record<string, { count: number, avgPosition: number }> = {};
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        if (!keywordStats[keyword.keyword]) {
          keywordStats[keyword.keyword] = { count: 0, avgPosition: 0 };
        }
        
        keywordStats[keyword.keyword].count++;
        
        // Учитываем только найденные позиции (не равные 0)
        if (keyword.position > 0) {
          keywordStats[keyword.keyword].avgPosition = 
            (keywordStats[keyword.keyword].avgPosition * (keywordStats[keyword.keyword].count - 1) + keyword.position) / 
            keywordStats[keyword.keyword].count;
        }
      });
    });
    
    return Object.entries(keywordStats)
      .map(([keyword, stats]) => ({ 
        keyword, 
        count: stats.count, 
        avgPosition: stats.avgPosition > 0 ? Math.round(stats.avgPosition) : 'Не найдено'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const topKeywords = getTopKeywords();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ-10 ключевых слов</CardTitle>
        <CardDescription>Наиболее часто проверяемые ключевые слова</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Ключевое слово</th>
                <th className="py-3 px-4 text-center">Количество проверок</th>
                <th className="py-3 px-4 text-center">Средняя позиция</th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="py-3 px-4 font-medium">{item.keyword}</td>
                  <td className="py-3 px-4 text-center">{item.count}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {typeof item.avgPosition === 'number' ? (
                        <>
                          {item.avgPosition <= 10 ? (
                            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-amber-500 mr-1" />
                          )}
                          <span className={item.avgPosition <= 10 ? "text-green-500" : "text-amber-500"}>
                            {item.avgPosition}
                          </span>
                        </>
                      ) : (
                        <span className="text-red-500">{item.avgPosition}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
