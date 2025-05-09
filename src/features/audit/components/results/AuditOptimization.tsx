
import React from 'react';
import { OptimizationItem } from './components/optimization';

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
  if (!optimizationCost && !showPrompt) return null;
  
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
          <h3 className="text-lg font-medium mb-2">Стоимость оптимизации</h3>
          <p className="mb-4">Стоимость оптимизации для сайта {url}: {optimizationCost} ₽</p>
          <p className="text-sm text-muted-foreground mb-4">
            Включает исправление всех обнаруженных проблем для {pageCount} страниц и оптимизацию контента.
          </p>
          
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
                  onClick={onOptimize}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Оптимизировать сайт
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
              className="border border-primary px-4 py-2 rounded-md hover:bg-primary/10"
            >
              Скачать PDF отчет
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditOptimization;
