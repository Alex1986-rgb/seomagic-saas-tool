
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  OptimizationItem 
} from '@/features/audit/types/optimization-types';

interface CostDetailsTableProps {
  items: OptimizationItem[];
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ items }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
      <Table>
        <TableCaption>Детализация стоимости оптимизации</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Оптимизация</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead className="text-right">Количество</TableHead>
            <TableHead className="text-right">Цена</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.count}</TableCell>
              <TableCell className="text-right">{formatNumber(item.price)} ₽</TableCell>
              <TableCell className="text-right">{formatNumber(item.totalPrice)} ₽</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
