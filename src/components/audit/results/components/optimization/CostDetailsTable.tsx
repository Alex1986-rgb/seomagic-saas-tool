
import React from 'react';
import { Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface OptimizationItem {
  type: string;
  count: number;
  pricePerUnit: number;
  totalPrice: number;
  description: string;
  name: string;
  price: number;
}

interface CostDetailsTableProps {
  optimizationItems: OptimizationItem[];
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ optimizationItems }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (!optimizationItems.length) return null;

  return (
    <div className="mb-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Тип оптимизации</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Цена за ед.</TableHead>
            <TableHead>Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimizationItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      {item.type}
                      <Info className="h-3 w-3 ml-1 cursor-help text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{formatNumber(item.count)}</TableCell>
              <TableCell>{formatNumber(item.pricePerUnit)} ₽</TableCell>
              <TableCell className="font-medium">{formatNumber(item.totalPrice)} ₽</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
