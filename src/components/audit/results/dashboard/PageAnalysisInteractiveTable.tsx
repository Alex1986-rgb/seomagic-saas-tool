import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PageAnalysisRow } from './types';

interface PageAnalysisInteractiveTableProps {
  pages: PageAnalysisRow[];
  onPageClick: (page: PageAnalysisRow) => void;
}

const PageAnalysisInteractiveTable: React.FC<PageAnalysisInteractiveTableProps> = ({
  pages,
  onPageClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof PageAnalysisRow>('issuesCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedPages = useMemo(() => {
    let result = [...pages];

    // Filter
    if (searchQuery) {
      result = result.filter(page =>
        page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    return result;
  }, [pages, searchQuery, sortField, sortDirection]);

  const paginatedPages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPages.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPages, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPages.length / itemsPerPage);

  const handleSort = (field: keyof PageAnalysisRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge className="bg-success/20 text-success hover:bg-success/30 border-success/30">{statusCode}</Badge>;
    }
    if (statusCode >= 300 && statusCode < 400) {
      return <Badge className="bg-warning/20 text-warning hover:bg-warning/30 border-warning/30">{statusCode}</Badge>;
    }
    return <Badge variant="destructive">{statusCode}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Анализ страниц</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('url')}>
                      URL <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('statusCode')}>
                      Статус <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('score')}>
                      Score <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('issuesCount')}>
                      Проблемы <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('loadTime')}>
                      Время <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPages.map((page, index) => (
                  <TableRow
                    key={page.url}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onPageClick(page)}
                  >
                    <TableCell className="max-w-md truncate">
                      <div className="font-medium truncate">{page.title || 'Без названия'}</div>
                      <div className="text-xs text-muted-foreground truncate">{page.url}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(page.statusCode)}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(page.score)}`}>
                        {page.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          page.issuesCount > 5 
                            ? '' 
                            : page.issuesCount > 0 
                              ? 'bg-warning/20 text-warning hover:bg-warning/30 border-warning/30'
                              : 'bg-success/20 text-success hover:bg-success/30 border-success/30'
                        }
                        variant={page.issuesCount > 5 ? 'destructive' : 'outline'}
                      >
                        {page.issuesCount}
                      </Badge>
                    </TableCell>
                    <TableCell>{page.loadTime.toFixed(2)}s</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(page.url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages} ({filteredAndSortedPages.length} результатов)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PageAnalysisInteractiveTable;
