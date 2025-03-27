
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TopKeywordsTableProps {
  history: PositionData[];
  limit?: number;
  searchTerm?: string;
  sortBy?: 'position' | 'alphabetical' | 'change';
  filterBy?: 'all' | 'top10' | 'top30' | 'notIndexed';
}

export function TopKeywordsTable({ 
  history, 
  limit = 10, 
  searchTerm = '',
  sortBy = 'position',
  filterBy = 'all'
}: TopKeywordsTableProps) {
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
    
    let keywordsArray = Object.entries(keywordStats)
      .map(([keyword, stats]) => ({ 
        keyword, 
        count: stats.count, 
        avgPosition: stats.avgPosition > 0 ? Math.round(stats.avgPosition) : 'Не найдено'
      }));
      
    // Apply search filter if provided
    if (searchTerm) {
      keywordsArray = keywordsArray.filter(item => 
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply position filter if provided
    if (filterBy !== 'all') {
      keywordsArray = keywordsArray.filter(item => {
        if (typeof item.avgPosition === 'string') return filterBy === 'notIndexed';
        
        if (filterBy === 'top10') return item.avgPosition <= 10;
        if (filterBy === 'top30') return item.avgPosition <= 30;
        return true;
      });
    }
    
    // Apply sorting
    keywordsArray.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.keyword.localeCompare(b.keyword);
      } else if (sortBy === 'position') {
        if (typeof a.avgPosition === 'string' && typeof b.avgPosition === 'string') return 0;
        if (typeof a.avgPosition === 'string') return 1;
        if (typeof b.avgPosition === 'string') return -1;
        return a.avgPosition - b.avgPosition;
      } else {
        // Default to count (most frequent)
        return b.count - a.count;
      }
    });
    
    return keywordsArray.slice(0, limit);
  };

  const topKeywords = getTopKeywords();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ-{limit} ключевых слов</CardTitle>
        <CardDescription>
          {searchTerm ? 'Отфильтрованные' : 'Наиболее часто проверяемые'} ключевые слова
        </CardDescription>
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
              {topKeywords.length > 0 ? (
                topKeywords.map((item, index) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? "Ключевые слова не найдены" : "Нет данных о ключевых словах"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
