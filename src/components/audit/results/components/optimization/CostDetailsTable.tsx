
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { CostDetailsTableProps } from './types';

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  // Format number to currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className={`overflow-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Оптимизация</TableHead>
            <TableHead className="text-center">Количество</TableHead>
            <TableHead className="text-right">Стоимость</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div>{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </TableCell>
              <TableCell className="text-center">{item.count}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
