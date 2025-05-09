
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Download, AlertCircle } from 'lucide-react';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationPricingTableProps {
  items: OptimizationItem[];
  totalCost: number;
  onOptimize?: () => void;
  currentScore?: number;
  estimatedScore?: number;
  isOptimized?: boolean;
  onDownload?: () => void;
  totalErrors?: number;
}

const OptimizationPricingTable: React.FC<OptimizationPricingTableProps> = ({
  items,
  totalCost,
  onOptimize,
  currentScore,
  estimatedScore,
  isOptimized = false,
  onDownload,
  totalErrors = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Formatting function
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  // Calculate improvement percentage
  const calculateImprovement = () => {
    if (currentScore !== undefined && estimatedScore !== undefined && currentScore > 0) {
      return Math.round(((estimatedScore - currentScore) / currentScore) * 100);
    }
    return 0;
  };
  
  const improvement = calculateImprovement();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentScore !== undefined && (
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="text-sm text-muted-foreground">Текущий SEO рейтинг</div>
            <div className="text-3xl font-bold mt-1">{currentScore}</div>
          </div>
        )}
        
        {estimatedScore !== undefined && (
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground">Ожидаемый рейтинг</div>
            <div className="text-3xl font-bold mt-1 text-primary">{estimatedScore}</div>
            {improvement > 0 && (
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> +{improvement}% улучшение
              </div>
            )}
          </div>
        )}
        
        <div className={`p-4 rounded-lg border ${totalErrors > 0 ? 'bg-red-50 border-red-200' : 'bg-muted/50'}`}>
          <div className="text-sm text-muted-foreground">Ошибки SEO</div>
          <div className="text-3xl font-bold mt-1 flex items-center">
            {totalErrors}
            {totalErrors > 0 && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
          </div>
          {totalErrors > 0 && (
            <div className="text-xs text-red-600 mt-1">Требуется оптимизация</div>
          )}
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-4 flex justify-between items-center">
          <h3 className="font-medium">Стоимость оптимизации</h3>
          <div className="font-bold text-xl">{formatNumber(totalCost)} ₽</div>
        </div>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-muted/10 hover:bg-muted/20 transition-colors py-2 text-sm border-t border-b flex justify-center items-center"
        >
          {showDetails ? 'Скрыть детали' : 'Показать детали'}
        </button>
        
        {showDetails && items.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className="p-2 text-left">Тип оптимизации</th>
                  <th className="p-2 text-center">Количество</th>
                  <th className="p-2 text-right">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || `item-${index}`} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                      {item.page && (
                        <div className="text-xs text-blue-600 mt-1 truncate max-w-[240px]">
                          {item.page}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.errorCount !== undefined && item.errorCount > 0 ? (
                        <span className="inline-flex items-center text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {item.errorCount}
                        </span>
                      ) : (
                        item.count || 1
                      )}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatNumber(item.cost || item.totalPrice)} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/20 font-medium">
                <tr>
                  <td className="p-3">Итого</td>
                  <td className="p-3"></td>
                  <td className="p-3 text-right">{formatNumber(totalCost)} ₽</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        
        {showDetails && items.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            Нет данных о страницах для отображения
          </div>
        )}
        
        <div className="p-4 flex flex-wrap gap-3 justify-end">
          {isOptimized && onDownload ? (
            <Button onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Скачать оптимизированный сайт
            </Button>
          ) : onOptimize ? (
            <Button onClick={onOptimize}>
              Оплатить и оптимизировать
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OptimizationPricingTable;
