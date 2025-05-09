
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
  items: OptimizationItem[];
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ items }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (!items || !items.length) return null;

  const totalSum = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Group items by category
  const groupedItems = {
    // Base categories
    base: items.filter(item => 
      item.name.includes('Базовая стоимость') || 
      item.description.includes('базов') ||
      (item.type && item.type === 'base')
    ),
    critical: items.filter(item => 
      item.name.includes('критичес') || 
      item.description.includes('критичес') ||
      (item.type && item.type === 'critical')
    ),
    warnings: items.filter(item => 
      item.name.includes('предупрежден') || 
      item.description.includes('предупрежден') ||
      item.name.includes('некритич') || 
      item.description.includes('некритич') ||
      (item.type && item.type === 'warning')
    ),
    
    // Technical categories
    technical: items.filter(item => 
      (item.name.includes('мета-тег') || 
      item.name.includes('изображен') ||
      item.name.includes('ссыл') ||
      item.name.includes('редирект') ||
      item.name.includes('производительност') ||
      item.name.includes('карта сайта') ||
      item.description.includes('мета-тег') || 
      item.description.includes('изображен') ||
      item.description.includes('ссыл') ||
      item.description.includes('редирект') ||
      item.description.includes('производительност') ||
      item.description.includes('карта сайта') ||
      (item.type && item.type === 'technical')) &&
      !item.name.includes('Базовая') &&
      !item.name.includes('критичес') &&
      !item.name.includes('предупрежден')
    ),
    
    // Content categories
    content: items.filter(item => 
      (item.name.includes('контент') || 
      item.name.includes('текст') ||
      item.name.includes('заголовк') ||
      item.name.includes('читаемост') ||
      item.name.includes('структур') ||
      item.name.includes('уникал') ||
      item.description.includes('контент') || 
      item.description.includes('текст') ||
      item.description.includes('заголовк') ||
      item.description.includes('читаемост') ||
      item.description.includes('структур') ||
      item.description.includes('уникал') ||
      (item.type && item.type === 'content')) &&
      !item.name.includes('Базовая') &&
      !item.name.includes('критичес') &&
      !item.name.includes('предупрежден')
    ),
    
    // Additional categories
    additional: items.filter(item => 
      item.name.includes('Гарантия') || 
      item.name.includes('Скидка') ||
      item.description.includes('гаранти') || 
      item.description.includes('скидк') ||
      (item.type && item.type === 'additional')
    )
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
          {renderTableSection(groupedItems.additional, 'Дополнительно')}
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
