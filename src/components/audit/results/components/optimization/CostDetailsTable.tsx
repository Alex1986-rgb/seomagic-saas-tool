
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

  console.log("CostDetailsTable rendering with items:", optimizationItems?.length);

  if (!optimizationItems || !optimizationItems.length) return null;

  const totalSum = optimizationItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Group items by category
  const groupedItems = {
    base: optimizationItems.filter(item => item.name.includes('Базовая стоимость')),
    critical: optimizationItems.filter(item => item.name.includes('Исправление критических ошибок')),
    warnings: optimizationItems.filter(item => item.name.includes('Исправление предупреждений')),
    
    technical: optimizationItems.filter(item => [
      'Оптимизация мета-тегов',
      'Карта сайта',
      'Исправление битых ссылок',
      'Оптимизация изображений',
      'Улучшение производительности'
    ].some(name => item.name.includes(name)) && 
      !item.name.includes('Базовая стоимость') && 
      !item.name.includes('Исправление критических ошибок') && 
      !item.name.includes('Исправление предупреждений')),
    
    content: optimizationItems.filter(item => [
      'Оптимизация контента',
      'Структура заголовков',
      'текстов для конверсии',
      'Улучшение читабельности',
      'Оптимизация структуры'
    ].some(name => item.name.includes(name))),
    
    other: optimizationItems.filter(item => [
      'Скидка',
      'Гарантия'
    ].some(name => item.name.includes(name)))
  };

  const renderTableSection = (items: OptimizationItem[], sectionTitle: string) => {
    if (!items.length) return null;
    
    return (
      <>
        <TableRow className="bg-muted">
          <TableCell colSpan={5} className="font-semibold">{sectionTitle}</TableCell>
        </TableRow>
        {items.map((item, index) => (
          <TableRow key={`${sectionTitle}-${index}`}>
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
            <TableCell className="text-right">{formatNumber(item.pricePerUnit || item.price)} ₽</TableCell>
            <TableCell className="text-right font-medium">{formatNumber(item.totalPrice)} ₽</TableCell>
          </TableRow>
        ))}
      </>
    );
  };

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
          {renderTableSection(groupedItems.base, 'Базовая стоимость')}
          {renderTableSection(groupedItems.critical, 'Исправление критических ошибок')}
          {renderTableSection(groupedItems.warnings, 'Исправление предупреждений')}
          {renderTableSection(groupedItems.technical, 'Технические улучшения')}
          {renderTableSection(groupedItems.content, 'Контентные улучшения')}
          {renderTableSection(groupedItems.other, 'Дополнительно')}
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
