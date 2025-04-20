
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageAnalysisData } from '@/hooks/use-page-analysis';
import { ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageAnalysisTableProps {
  data: PageAnalysisData[];
  isLoading: boolean;
}

const PageAnalysisTable: React.FC<PageAnalysisTableProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Заголовок</TableHead>
            <TableHead className="text-center">H1</TableHead>
            <TableHead className="text-center">Изображения</TableHead>
            <TableHead className="text-center">Слова</TableHead>
            <TableHead className="text-center">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((page, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[200px]">{page.url}</span>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={page.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <span className="truncate max-w-[200px] block">
                  {page.title || 'Нет заголовка'}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {page.h1Count === 1 ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">{page.imageCount}</TableCell>
              <TableCell className="text-center">{page.wordCount}</TableCell>
              <TableCell className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  page.statusCode === 200 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {page.statusCode || 'N/A'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PageAnalysisTable;
