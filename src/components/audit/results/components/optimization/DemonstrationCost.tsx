
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateMockOptimizationItems, calculateTotalCost, generateRandomPageCount } from './mockOptimizationData';
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import PaymentDialog from './PaymentDialog';

const DemonstrationCost: React.FC = () => {
  const { toast } = useToast();
  const [pageCount, setPageCount] = useState(0);
  const [optimizationItems, setOptimizationItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Generate random page count on initial load
    const randomPageCount = generateRandomPageCount();
    setPageCount(randomPageCount);
    
    // Generate mock optimization items based on page count
    const items = generateMockOptimizationItems(randomPageCount);
    setOptimizationItems(items);
    
    // Calculate total cost
    const cost = calculateTotalCost(items);
    setTotalCost(cost);
  }, []);

  const handlePayment = () => {
    toast({
      title: "Оплата прошла успешно",
      description: "Оптимизация сайта начнется в ближайшее время."
    });
    
    setIsOptimized(true);
    setIsDialogOpen(false);
  };

  const handleRegenerateData = () => {
    const randomPageCount = generateRandomPageCount();
    setPageCount(randomPageCount);
    
    const items = generateMockOptimizationItems(randomPageCount);
    setOptimizationItems(items);
    
    const cost = calculateTotalCost(items);
    setTotalCost(cost);
    
    setIsOptimized(false);
    
    toast({
      title: "Данные обновлены",
      description: "Сгенерированы новые демонстрационные данные."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Смета работ по оптимизации</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerateData}
            >
              Сгенерировать новые данные
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CostSummary 
            pageCount={pageCount} 
            optimizationCost={totalCost}
            discount={pageCount > 50 ? (pageCount > 200 ? 15 : pageCount > 100 ? 10 : 5) : 0}
          />
          
          <CostDetailsTable items={optimizationItems} />
          
          <div className="flex justify-end mt-4">
            {!isOptimized ? (
              <PaymentDialog
                url="example.com"
                optimizationCost={totalCost}
                onPayment={handlePayment}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            ) : (
              <Button variant="outline" disabled>Оптимизация выполнена</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemonstrationCost;
