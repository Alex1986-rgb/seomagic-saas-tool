
import React from 'react';
import { Info } from 'lucide-react';

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
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Тип оптимизации</th>
            <th className="text-right p-2">Количество</th>
            <th className="text-right p-2">Цена за ед.</th>
            <th className="text-right p-2">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {optimizationItems.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 flex items-center">
                {item.type}
                <Info className="h-3 w-3 ml-1 cursor-help text-muted-foreground" title={item.description} />
              </td>
              <td className="text-right p-2">{formatNumber(item.count)}</td>
              <td className="text-right p-2">{formatNumber(item.pricePerUnit)} ₽</td>
              <td className="text-right p-2 font-medium">{formatNumber(item.totalPrice)} ₽</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CostDetailsTable;
