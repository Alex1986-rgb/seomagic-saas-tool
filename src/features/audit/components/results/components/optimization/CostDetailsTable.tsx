
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
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

  // Group items by category
  const groupedItems = {
    base: items.filter(item => 
      item.name.includes('Базовая стоимость') || 
      item.description.includes('базов')
    ),
    critical: items.filter(item => 
      item.name.includes('критичес') || 
      item.description.includes('критичес')
    ),
    warnings: items.filter(item => 
      item.name.includes('предупрежден') || 
      item.description.includes('предупрежден') ||
      item.name.includes('некритич') || 
      item.description.includes('некритич')
    ),
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
      item.description.includes('карта сайта')) &&
      !item.name.includes('Базовая') &&
      !item.name.includes('критичес') &&
      !item.name.includes('предупрежден')
    ),
    content: items.filter(item => 
      (item.name.includes('контент') || 
      item.name.includes('текст') ||
      item.name.includes('заголовк') ||
      item.name.includes('читаемост') ||
      item.name.includes('структур') ||
      item.description.includes('контент') || 
      item.description.includes('текст') ||
      item.description.includes('заголовк') ||
      item.description.includes('читаемост') ||
      item.description.includes('структур')) &&
      !item.name.includes('Базовая') &&
      !item.name.includes('критичес') &&
      !item.name.includes('предупрежден')
    ),
    additional: items.filter(item => 
      item.name.includes('Гарантия') || 
      item.name.includes('Скидка') ||
      item.description.includes('гаранти') || 
      item.description.includes('скидк')
    )
  };

  // Calculate total
  const totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Render a section of items
  const renderSection = (categoryItems: OptimizationItem[], sectionTitle: string) => {
    if (!categoryItems || categoryItems.length === 0) return null;
    
    return (
      <>
        <TableRow className="bg-muted/30">
          <TableCell colSpan={5} className="font-semibold">{sectionTitle}</TableCell>
        </TableRow>
        {categoryItems.map((item, index) => (
          <TableRow key={`${sectionTitle}-${index}`}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-center">{item.count}</TableCell>
            <TableCell className="text-right">{formatNumber(item.price)} ₽</TableCell>
            <TableCell className="text-right">{formatNumber(item.totalPrice)} ₽</TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
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
          {renderSection(groupedItems.base, 'Базовая стоимость')}
          {renderSection(groupedItems.critical, 'Исправление критических ошибок')}
          {renderSection(groupedItems.warnings, 'Исправление предупреждений')}
          {renderSection(groupedItems.technical, 'Технические улучшения')}
          {renderSection(groupedItems.content, 'Контентные улучшения')}
          {renderSection(groupedItems.additional, 'Дополнительно')}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium">Итого:</TableCell>
            <TableCell className="text-right font-bold text-primary">{formatNumber(totalCost)} ₽</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CostDetailsTable;
