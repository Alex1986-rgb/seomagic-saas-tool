
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, CheckCircle, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import ScoreTrend from '@/components/audit/summary/ScoreTrend';

interface OptimizationPricingTableProps {
  items: OptimizationItem[];
  totalCost: number;
  onOptimize?: () => void;
  currentScore?: number;
  estimatedScore?: number;
  isOptimized?: boolean;
  onDownload?: () => void;
}

const OptimizationPricingTable: React.FC<OptimizationPricingTableProps> = ({
  items,
  totalCost,
  onOptimize,
  currentScore = 0,
  estimatedScore,
  isOptimized = false,
  onDownload
}) => {
  // Format currency in rubles
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const [showWhatIncluded, setShowWhatIncluded] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);

  // Group items by category
  const baseItems = items.filter(item => 
    item.name.includes('Базовая стоимость') || 
    item.name.includes('Исправление критических ошибок') || 
    item.name.includes('Исправление предупреждений')
  );
  
  const technicalItems = items.filter(item => 
    item.type === 'technical' || 
    item.name.includes('мета-тегов') || 
    item.name.includes('битых ссылок') || 
    item.name.includes('изображений') ||
    item.name.includes('редиректов')
  );
  
  const contentItems = items.filter(item => 
    item.type === 'content' || 
    item.name.includes('контента') || 
    item.name.includes('заголовков') || 
    item.name.includes('текстов') ||
    item.name.includes('читабельности')
  );
  
  // Items to display based on showAllItems state
  const displayItems = showAllItems 
    ? [...baseItems, ...technicalItems, ...contentItems] 
    : baseItems;
  
  console.log("OptimizationPricingTable rendering with items:", items.length);
  
  return (
    <Card className="border border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-1">
          <CardTitle>Детальная смета работ</CardTitle>
          
          {estimatedScore !== undefined && currentScore !== undefined && (
            <div className="flex items-center">
              <div className="text-sm text-muted-foreground mr-2">Текущий рейтинг: {currentScore}</div>
              <ScoreTrend 
                currentScore={estimatedScore} 
                previousScore={currentScore} 
                variant="compact"
                priceToFix={totalCost}
              />
            </div>
          )}
        </div>
        <CardDescription>
          Расчет стоимости оптимизации сайта на основе проведенного аудита
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-4 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-medium">Что входит в стоимость?</AlertTitle>
          <AlertDescription>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary mb-2" 
              onClick={() => setShowWhatIncluded(!showWhatIncluded)}
            >
              {showWhatIncluded ? "Скрыть детали" : "Показать детали"}
            </Button>
            
            {showWhatIncluded && (
              <div className="mt-2 text-sm">
                <h4 className="font-medium mb-1">Технические улучшения:</h4>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>Исправление всех критических ошибок</li>
                  <li>Оптимизация мета-тегов для поисковых систем</li>
                  <li>Исправление битых ссылок и редиректов</li>
                  <li>Оптимизация изображений и медиафайлов</li>
                </ul>
                
                <h4 className="font-medium mb-1">Контентные улучшения:</h4>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>Оптимизация контента для поисковых систем</li>
                  <li>Настройка правильной структуры заголовков</li>
                  <li>Оптимизация текстов для улучшения конверсии</li>
                  <li>Улучшение читабельности и структуры контента</li>
                </ul>
                
                <p className="mt-2 text-xs italic">Все работы выполняются квалифицированными SEO-специалистами с гарантией результата.</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Расшифровка стоимости работ</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => setShowAllItems(!showAllItems)}
          >
            {showAllItems ? (
              <>
                Скрыть подробности
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Показать все работы
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Наименование</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-right">Цена за ед.</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Base items always shown */}
            {baseItems.map((item, index) => (
              <TableRow key={`base-${index}`} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-center">{item.count}</TableCell>
                <TableCell className="text-right">{item.pricePerUnit ? formatCurrency(item.pricePerUnit) : formatCurrency(item.price)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
              </TableRow>
            ))}
            
            {/* Technical items shown conditionally */}
            {showAllItems && technicalItems.length > 0 && (
              <>
                <TableRow className="bg-muted">
                  <TableCell colSpan={5} className="font-medium">Технические улучшения</TableCell>
                </TableRow>
                {technicalItems.map((item, index) => (
                  <TableRow key={`tech-${index}`} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.count}</TableCell>
                    <TableCell className="text-right">{item.pricePerUnit ? formatCurrency(item.pricePerUnit) : formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </>
            )}
            
            {/* Content items shown conditionally */}
            {showAllItems && contentItems.length > 0 && (
              <>
                <TableRow className="bg-muted">
                  <TableCell colSpan={5} className="font-medium">Контентные улучшения</TableCell>
                </TableRow>
                {contentItems.map((item, index) => (
                  <TableRow key={`content-${index}`} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.count}</TableCell>
                    <TableCell className="text-right">{item.pricePerUnit ? formatCurrency(item.pricePerUnit) : formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Итоговая стоимость</span>
          <span className="text-xl font-bold">{formatCurrency(totalCost)}</span>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {isOptimized ? (
            <>
              {onDownload && (
                <Button variant="outline" onClick={onDownload} className="flex-1 sm:flex-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Скачать
                </Button>
              )}
              <Button className="flex-1 sm:flex-auto bg-green-600 hover:bg-green-700" disabled>
                <CheckCircle className="mr-2 h-4 w-4" />
                Оптимизировано
              </Button>
            </>
          ) : (
            <Button 
              onClick={onOptimize} 
              className="flex-1 sm:flex-auto"
              disabled={!onOptimize}
            >
              Оплатить и оптимизировать
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OptimizationPricingTable;
