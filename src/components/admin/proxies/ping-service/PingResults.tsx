
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle, List, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export interface PingResult {
  url: string;
  rpc: string;
  success: boolean;
  message?: string;
  proxy?: string;     // Прокси, через который был выполнен запрос
  time?: number;      // Время выполнения запроса
  error?: string;     // Информация об ошибке
}

interface PingResultsProps {
  results: PingResult[];
  onClear: () => void;
  isLoading: boolean;
}

const PingResults: React.FC<PingResultsProps> = ({ results, onClear, isLoading }) => {
  if (results.length === 0) {
    return null;
  }

  const totalSuccess = results.filter(r => r.success).length;
  const totalFailed = results.length - totalSuccess;

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex gap-2 items-center mb-4">
        <h3 className="text-lg font-medium">Результаты пинга</h3>
        <div className="flex gap-2 ml-auto">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Успешно: {totalSuccess}
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Ошибок: {totalFailed}
          </Badge>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onClear} 
        disabled={isLoading}
        className="mb-4"
      >
        <List className="mr-2 h-4 w-4" />
        Очистить результаты
      </Button>
      
      <ScrollArea className="h-64 rounded-md border">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>RPC-сервис</TableHead>
                <TableHead>Статус</TableHead>
                {results.some(r => r.proxy) && <TableHead>Прокси</TableHead>}
                <TableHead>Детали</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="max-w-[200px] truncate">{result.url}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{result.rpc}</TableCell>
                  <TableCell>
                    {result.success ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Успешно</span>
                      </div>
                    ) : result.message?.includes('таймаут') || result.message?.includes('timeout') ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-yellow-500" />
                        <span>Таймаут</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Ошибка</span>
                      </div>
                    )}
                  </TableCell>
                  {results.some(r => r.proxy) && <TableCell>{result.proxy || '-'}</TableCell>}
                  <TableCell>{result.message || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PingResults;
