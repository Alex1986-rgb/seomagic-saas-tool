
import React from 'react';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface CostDetailsTableProps {
  items: OptimizationItem[];
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ items }) => {
  // Format number with spaces as thousand separators (Russian format)
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Тип работы
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Кол-во
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Цена за ед.
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Стоимость
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                {item.errorCount ? (
                  <div className="flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-destructive mr-1" />
                    <span>{item.errorCount} / {item.count}</span>
                  </div>
                ) : (
                  <span>{item.count}</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                {formatNumber(item.price)} ₽
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                {formatNumber(item.totalPrice)} ₽
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-muted/30">
          <tr>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
              Итого
            </td>
            <td colSpan={2} className="px-4 py-2 whitespace-nowrap text-center text-sm">
              {items.reduce((total, item) => total + item.count, 0)} позиций
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-bold">
              {formatNumber(items.reduce((total, item) => total + item.totalPrice, 0))} ₽
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CostDetailsTable;
