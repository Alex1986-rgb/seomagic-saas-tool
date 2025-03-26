
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, CreditCard, Package, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OptimizationCostProps {
  optimizationCost?: number;
  pageCount: number;
  url: string;
  onDownloadOptimized?: () => void;
  isOptimized?: boolean;
  className?: string;
}

const OptimizationCost: React.FC<OptimizationCostProps> = ({
  optimizationCost,
  pageCount,
  url,
  onDownloadOptimized,
  isOptimized = false,
  className
}) => {
  const { toast } = useToast();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  const handlePayment = () => {
    // В реальном приложении здесь будет интеграция с платежной системой
    toast({
      title: "Оплата успешно произведена",
      description: "Начинаем создание оптимизированной копии сайта",
    });
    
    setTimeout(() => {
      setIsPaymentComplete(true);
      setIsDialogOpen(false);
    }, 1500);
  };
  
  if (!optimizationCost) return null;
  
  return (
    <motion.div 
      className={`border border-primary/20 rounded-lg p-4 bg-card/50 ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <CreditCard className="h-5 w-5 mr-2 text-primary" />
        Стоимость оптимизации
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Количество страниц</div>
          <div className="text-xl font-semibold">{formatNumber(pageCount)}</div>
        </div>
        
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
          <div className="text-xl font-semibold">{formatNumber(Math.round(optimizationCost / pageCount))} ₽</div>
        </div>
        
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
          <div className="text-xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Полная оптимизация SEO для {url} включает исправление всех ошибок
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Включает оптимизацию мета-тегов, заголовков, изображений, 
                  скорости загрузки и всех других SEO-параметров
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {isOptimized || isPaymentComplete ? (
          <Button 
            onClick={onDownloadOptimized}
            className="min-w-32 gap-2"
            variant="default"
          >
            <Download className="h-4 w-4" />
            Скачать оптимизированный сайт
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="min-w-32">Оплатить и оптимизировать</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Оплата оптимизации</DialogTitle>
                <DialogDescription>
                  Оптимизация сайта {url} будет выполнена после оплаты
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="rounded-lg bg-primary/10 p-4">
                  <h4 className="font-medium mb-2">Что включено:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Оптимизация всех мета-тегов
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Исправление проблем с изображениями
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Оптимизация контента для SEO
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Улучшение скорости загрузки
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Исправление технических проблем
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <span className="font-medium">Итого к оплате:</span>
                  <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handlePayment} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Оплатить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
};

export default OptimizationCost;
