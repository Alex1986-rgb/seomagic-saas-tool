
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

export interface CostDetailsTableProps {
  items: OptimizationItem[];
}

const CostDetailsTable: React.FC<CostDetailsTableProps> = ({ items }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (!items || !items.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Нет данных для отображения
      </div>
    );
  }

  const totalSum = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Group items by category
  const groupedItems = {
    // Base categories
    base: items.filter(item => item.category === 'base' || item.name.includes('Базовая стоимость')),
    critical: items.filter(item => item.category === 'errors' || item.name.includes('критических ошибок')),
    warnings: items.filter(item => item.category === 'warnings' || item.name.includes('предупреждений')),
    
    // Technical categories
    technical: items.filter(item => 
      item.category === 'technical' || 
      item.category === 'media' || 
      [
        'мета-тегов',
        'Карта сайта',
        'битых ссылок',
        'изображений',
        'производительности',
        'редиректов',
        'мобильных'
      ].some(name => item.name.toLowerCase().includes(name))
    ),
    
    // Content categories
    content: items.filter(item => 
      item.category === 'content' || 
      item.category === 'structure' || 
      item.category === 'seo' ||
      [
        'контент',
        'заголовк',
        'тексты',
        'читабельности',
        'структур'
      ].some(name => item.name.toLowerCase().includes(name))
    ),
    
    // Other categories
    other: items.filter(item => 
      item.category === 'other' || 
      [
        'Скидка',
        'Гарантия'
      ].some(name => item.name.includes(name))
    )
  };

  const renderTableSection = (sectionItems: OptimizationItem[], sectionTitle: string) => {
    if (!sectionItems.length) return null;
    
    return (
      <>
        <TableRow className="bg-muted">
          <TableCell colSpan={6} className="font-semibold">{sectionTitle}</TableCell>
        </TableRow>
        {sectionItems.map((item, index) => (
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
            {item.errorCount !== undefined && (
              <TableCell className="text-center">
                <span className="text-red-500 font-medium">{formatNumber(item.errorCount)}</span>
              </TableCell>
            )}
            <TableCell className="text-right">{formatNumber(item.price)} ₽</TableCell>
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
            <TableHead className="text-center">Ошибки</TableHead>
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
            <TableCell colSpan={5} className="text-right font-medium">Итого:</TableCell>
            <TableCell className="text-right font-bold text-primary">{formatNumber(totalSum)} ₽</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
