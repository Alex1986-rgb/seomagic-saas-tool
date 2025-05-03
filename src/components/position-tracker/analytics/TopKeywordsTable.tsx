import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PositionData, KeywordPosition } from '@/services/position/positionTracker';

interface TopKeywordsTableProps {
  history: PositionData[];
  limit?: number;
  searchTerm?: string;
  sortBy?: 'position' | 'alphabetical' | 'change';
  filterBy?: 'all' | 'top10' | 'top30' | 'notIndexed';
}

export const TopKeywordsTable: React.FC<TopKeywordsTableProps> = ({
  history,
  limit,
  searchTerm = '',
  sortBy = 'position',
  filterBy = 'all'
}) => {
  const [search, setSearch] = useState(searchTerm);

  const filteredKeywords = useMemo(() => {
    let keywords: KeywordPosition[] = [];

    history.forEach(item => {
      keywords = keywords.concat(item.keywords.map(keyword => ({
        ...keyword,
        date: item.timestamp || item.date,
        searchEngine: item.searchEngine
      })));
    });

    // Apply search filter
    if (search) {
      keywords = keywords.filter(keyword =>
        keyword.keyword.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply position filter
    if (filterBy === 'top10') {
      keywords = keywords.filter(keyword => keyword.position > 0 && keyword.position <= 10);
    } else if (filterBy === 'top30') {
      keywords = keywords.filter(keyword => keyword.position > 0 && keyword.position <= 30);
    } else if (filterBy === 'notIndexed') {
      keywords = keywords.filter(keyword => keyword.position === 0);
    }

    // Apply sorting
    if (sortBy === 'position') {
      keywords.sort((a, b) => a.position - b.position);
    } else if (sortBy === 'alphabetical') {
      keywords.sort((a, b) => a.keyword.localeCompare(b.keyword));
    } else if (sortBy === 'change') {
      keywords.sort((a, b) => {
        const changeA = (a.previousPosition || 999) - a.position;
        const changeB = (b.previousPosition || 999) - b.position;
        return changeB - changeA;
      });
    }

    return keywords;
  }, [history, search, sortBy, filterBy]);

  // Определяем тренд позиции
  const getPositionTrend = (position: number, prevPosition?: number) => {
    if (!prevPosition || position === 0) return null;
    
    if (position < prevPosition) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (position > prevPosition) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Форматируем изменение позиции для отображения
  const formatPositionChange = (position: number, prevPosition?: number) => {
    if (!prevPosition || position === 0) return null;
    
    const change = prevPosition - position;
    if (change > 0) {
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">+{change}</Badge>;
    } else if (change < 0) {
      return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">{change}</Badge>;
    } else {
      return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">0</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ключевое слово</TableHead>
          <TableHead className="text-right">Позиция</TableHead>
          <TableHead className="text-center">Предыдущая</TableHead>
          <TableHead className="text-right">Изменение</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredKeywords.slice(0, limit).map((keyword, index) => (
          <TableRow key={index}>
            <TableCell>{keyword.keyword}</TableCell>
            <TableCell className="text-right">
              {keyword.position === 0 ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Не найдено
                </Badge>
              ) : (
                <Badge variant={keyword.position <= 10 ? "default" : "secondary"}>
                  {keyword.position}
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-center">{keyword.previousPosition || '-'}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {getPositionTrend(keyword.position, keyword.previousPosition)}
                {formatPositionChange(keyword.position, keyword.previousPosition)}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {filteredKeywords.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              Нет данных для отображения
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
