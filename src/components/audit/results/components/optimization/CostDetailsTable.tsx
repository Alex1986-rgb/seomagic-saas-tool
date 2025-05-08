
import React from 'react';
import { Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface CostDetailsTableProps {
  optimizationItems: OptimizationItem[];
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ optimizationItems }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (!optimizationItems.length) return null;

  const totalSum = optimizationItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="mb-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Наименование</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead className="text-center">Количество</TableHead>
            <TableHead className="text-right">Цена за ед.</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimizationItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center cursor-help">
                      {item.name}
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                {item.description}
              </TableCell>
              <TableCell className="text-center">{formatNumber(item.count)}</TableCell>
              <TableCell className="text-right">{formatNumber(item.pricePerUnit)} ₽</TableCell>
              <TableCell className="text-right font-medium">{formatNumber(item.totalPrice)} ₽</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium">Итого:</TableCell>
            <TableCell className="text-right font-bold text-primary">{formatNumber(totalSum)} ₽</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
