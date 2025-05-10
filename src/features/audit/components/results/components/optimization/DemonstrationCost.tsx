
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Info } from 'lucide-react';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import { calculateDiscount } from '@/services/audit/optimization/discountCalculator';
import { createDemonstrationOptimizationItems, calculateTotalCost } from './mockOptimizationData';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DemonstrationCost: React.FC = () => {
  const [url, setUrl] = useState('https://example.com');
  const [pageCount, setPageCount] = useState(20);
  const [showDetails, setShowDetails] = useState(false);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>(
    createDemonstrationOptimizationItems()
  );
  
  // Calculate total cost
  const rawTotalCost = calculateTotalCost(optimizationItems);
  
  // Calculate discount based on page count
  const { discountPercentage, finalTotal } = calculateDiscount(rawTotalCost, pageCount);
  
  // Handle page count change
  const handlePageCountChange = (value: number[]) => {
    const newPageCount = value[0];
    setPageCount(newPageCount);
    
    // Adjust items based on new page count
    const updatedItems = optimizationItems.map(item => {
      let newCount = item.count;
      
      // Adjust meta tags count based on page count
      if (item.id === "meta_tags") {
        newCount = Math.min(newPageCount, 50);
      }
      // Adjust image optimization count (assume ~2-3 images per page)
      else if (item.id === "image_optimization") {
        newCount = Math.min(Math.round(newPageCount * 2.5), 100);
      }
      
      return {
        ...item,
        count: newCount,
        totalPrice: item.price * newCount,
        cost: item.price * newCount
      };
    });
    
    setOptimizationItems(updatedItems);
  };
  
  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Демонстрация расчета стоимости оптимизации</CardTitle>
          <CardDescription>
            Интерактивный калькулятор стоимости работ по оптимизации. Вы можете настроить количество страниц
            и увидеть, как это влияет на итоговую цену и применяемые скидки.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="url">URL сайта</Label>
                <Input id="url" value={url} onChange={handleUrlChange} placeholder="Введите URL сайта" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Количество страниц на сайте</Label>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handlePageCountChange([Math.max(1, pageCount - 10)])}
                      className="text-primary h-6 w-6 rounded-full flex items-center justify-center hover:bg-primary/10"
                    >
                      <MinusCircle size={16} />
                    </button>
                    <span className="w-10 text-center">{pageCount}</span>
                    <button 
                      type="button" 
                      onClick={() => handlePageCountChange([Math.min(1000, pageCount + 10)])}
                      className="text-primary h-6 w-6 rounded-full flex items-center justify-center hover:bg-primary/10"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </div>
                <Slider 
                  value={[pageCount]} 
                  min={1} 
                  max={1000} 
                  step={1} 
                  onValueChange={handlePageCountChange} 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <div className="space-x-4">
                    <span>50</span>
                    <span>500</span>
                    <span>1000</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 items-center pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p>Применяемые скидки:</p>
                        <ul className="text-xs">
                          <li>До 3 страниц - без скидки</li>
                          <li>До 50 страниц - 20% скидка</li>
                          <li>До 500 страниц - 50% скидка</li>
                          <li>От 1000 страниц - 80% скидка</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm">
                  {pageCount > 500 && 'Корпоративный тариф, скидка 80%'}
                  {pageCount > 50 && pageCount <= 500 && 'Стандартный тариф, скидка 50%'}
                  {pageCount > 3 && pageCount <= 50 && 'Базовый тариф, скидка 20%'}
                  {pageCount <= 3 && 'Начальный тариф, без скидки'}
                </span>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">О скидках на оптимизацию</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Стоимость оптимизации зависит от количества страниц на сайте. 
                Чем больше страниц, тем выше скидка, которая применяется ко всем работам.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>До 3 страниц</span>
                  <span className="font-medium">0% скидка</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>От 4 до 50 страниц</span>
                  <span className="font-medium text-green-600">20% скидка</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>От 51 до 500 страниц</span>
                  <span className="font-medium text-green-600">50% скидка</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>От 501 страницы</span>
                  <span className="font-medium text-green-600">80% скидка</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex justify-between items-center mb-2">
              <OptimizationHeading />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <>
                    <MinusCircle className="h-3.5 w-3.5" />
                    Скрыть детали
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-3.5 w-3.5" />
                    Показать детали
                  </>
                )}
              </Button>
            </div>
            
            <OptimizationSummary url={url} />
            
            <CostSummary
              pageCount={pageCount}
              optimizationCost={finalTotal}
              discount={discountPercentage}
            />
            
            {showDetails && (
              <CostDetailsTable items={optimizationItems} />
            )}
          </div>
          
          <div className="flex justify-center">
            <Button className="w-full md:w-auto">
              Заказать оптимизацию
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemonstrationCost;
