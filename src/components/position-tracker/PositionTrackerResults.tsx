
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PositionResult {
  keyword: string;
  position: number;
  url: string;
  searchEngine: string;
}

interface PositionTrackerResultsProps {
  results?: {
    domain: string;
    keywords: string[];
    searchEngine: string;
    region: string;
    timestamp: string;
    positions: PositionResult[];
  };
}

export function PositionTrackerResults({ results }: PositionTrackerResultsProps) {
  if (!results) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Нет данных для отображения. Выполните проверку позиций.</p>
        </div>
      </Card>
    );
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getPositionClass = (position: number) => {
    if (position === 0) return 'bg-red-100 text-red-800';
    if (position <= 3) return 'bg-green-100 text-green-800';
    if (position <= 10) return 'bg-green-50 text-green-600';
    if (position <= 30) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };
  
  const getPositionText = (position: number) => {
    if (position === 0) return 'Не найдено';
    return position.toString();
  };
  
  const exportToCsv = () => {
    // Generate CSV content
    const headers = 'Keyword,Position,URL,Search Engine\n';
    const rows = results.positions.map(pos => 
      `"${pos.keyword}",${pos.position},"${pos.url}","${pos.searchEngine}"`
    ).join('\n');
    const csvContent = `${headers}${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `positions_${results.domain}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Результаты проверки позиций</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            <p>Домен: <span className="font-medium">{results.domain}</span></p>
            <p>Дата проверки: {formatDate(results.timestamp)}</p>
            <p>Проверено ключевых слов: {results.positions.length}</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Экспорт в CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ключевое слово</TableHead>
              <TableHead className="text-center">Позиция</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Поисковик</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.positions.map((pos, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{pos.keyword}</TableCell>
                <TableCell className="text-center">
                  <Badge className={getPositionClass(pos.position)}>
                    {getPositionText(pos.position)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-sm truncate">
                  {pos.position > 0 ? (
                    <a 
                      href={pos.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      {pos.url}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{pos.searchEngine}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Сохранить отчет
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
