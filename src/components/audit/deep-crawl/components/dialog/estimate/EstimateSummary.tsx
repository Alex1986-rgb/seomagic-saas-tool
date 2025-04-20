
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from 'lucide-react';

interface EstimateSummaryProps {
  totalCost: number;
  onDownloadEstimate?: () => void;
}

const EstimateSummary: React.FC<EstimateSummaryProps> = ({ 
  totalCost,
  onDownloadEstimate
}) => {
  // Форматирование чисел с разделителями тысяч
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <>
      <div className="bg-primary/10 p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Итоговая стоимость оптимизации</div>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(totalCost)} ₽
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Без учета дополнительных работ и индивидуальных требований
            </div>
          </div>
          
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={onDownloadEstimate}
            >
              <Download className="mr-1 h-3 w-3" /> Скачать смету
            </Button>
            <Button 
              size="sm" 
              className="text-xs"
            >
              Заказать <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        * Стоимость может быть скорректирована после детального анализа вашего сайта специалистом
      </div>
    </>
  );
};

export default EstimateSummary;
