
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

export interface CostDetailsTableProps {
  items: Array<{
    id: string;
    name: string;
    description: string;
    pagesCount?: number;
    count?: number;
    costPerPage?: number;
    price?: number;
    totalCost?: number;
    totalPrice?: number;
  }>;
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Категория</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead className="text-right">Страниц</TableHead>
            <TableHead className="text-right">Цена/стр.</TableHead>
            <TableHead className="text-right">Стоимость</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.pagesCount || item.count || "-"}</TableCell>
              <TableCell className="text-right">
                {(item.costPerPage || item.price) ? `${item.costPerPage || item.price} ₽` : "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {(item.totalCost || item.totalPrice) ? `${item.totalCost || item.totalPrice} ₽` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
