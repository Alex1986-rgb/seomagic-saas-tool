
import React, { useState } from 'react';
import { OptimizationItem } from './components/optimization';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import CostDetailsTable from './components/optimization/CostDetailsTable';
import PaymentDialog from '@/components/audit/results/components/optimization/PaymentDialog';

interface AuditOptimizationProps {
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  url: string;
  pageCount: number;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onOptimize: () => void;
  onDownloadOptimizedSite: () => void;
  onGeneratePdfReport: () => void;
  setContentOptimizationPrompt: (prompt: string) => void;
}

const AuditOptimization: React.FC<AuditOptimizationProps> = ({
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  url,
  pageCount,
  showPrompt,
  onTogglePrompt,
  onOptimize,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
  setContentOptimizationPrompt
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!optimizationCost && !showPrompt) return null;
  
  // Calculate average cost per page
  const costPerPage = pageCount > 0 ? Math.round((optimizationCost || 0) / pageCount) : 0;
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  const handleSelectPrompt = (prompt: string) => {
    setContentOptimizationPrompt(prompt);
  };
  
  return (
    <div className="space-y-6">
      {showPrompt && (
        <div className="border border-primary/20 rounded-lg p-4 bg-card/50">
          <h3 className="text-lg font-medium mb-2">Оптимизация контента</h3>
          <textarea
            value={contentPrompt}
            onChange={(e) => setContentOptimizationPrompt(e.target.value)}
            className="w-full h-32 p-3 border rounded-md mb-3"
            placeholder="Введите инструкции для оптимизации контента..."
          />
          <div className="flex justify-between items-center">
            <button 
              onClick={onTogglePrompt}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Скрыть форму
            </button>
            <button 
              onClick={onOptimize}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Оптимизировать контент
            </button>
          </div>
        </div>
      )}
      
      {optimizationCost && (
        <div className="border border-primary/20 rounded-lg p-4 bg-card/50">
          <h3 className="text-lg font-medium mb-2">Смета работ по оптимизации</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Количество страниц</div>
              <div className="text-xl font-semibold">{formatNumber(pageCount)}</div>
            </div>
            
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
              <div className="text-xl font-semibold">{formatNumber(costPerPage)} ₽</div>
              <div className="text-xs text-muted-foreground">(среднее значение)</div>
            </div>
            
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
              <div className="text-xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Стоимость включает все работы по техническим и контентным улучшениям: исправление ошибок, 
            оптимизацию мета-тегов, исправление ссылок, оптимизацию изображений, улучшение структуры 
            контента и заголовков, оптимизацию текстов для конверсии.
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="mb-4 text-sm"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Скрыть детали
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Показать детали
              </>
            )}
          </Button>
          
          {showDetails && optimizationItems && optimizationItems.length > 0 && (
            <CostDetailsTable items={optimizationItems} />
          )}
          
          <div className="flex flex-wrap gap-2">
            {isOptimized ? (
              <button 
                onClick={onDownloadOptimizedSite}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Скачать оптимизированный сайт
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Заказать оптимизацию
                </button>
                {!showPrompt && (
                  <button
                    onClick={onTogglePrompt}
                    className="border border-primary px-4 py-2 rounded-md hover:bg-primary/10"
                  >
                    Настроить оптимизацию
                  </button>
                )}
              </>
            )}
            
            <button 
              onClick={onGeneratePdfReport}
              className="border border-primary px-4 py-2 rounded-md hover:bg-primary/10 flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Скачать PDF отчет
            </button>
          </div>
          
          <PaymentDialog
            url={url}
            optimizationCost={optimizationCost}
            onPayment={onOptimize}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onSelectPrompt={handleSelectPrompt}
          />
        </div>
      )}
    </div>
  );
};

export default AuditOptimization;
