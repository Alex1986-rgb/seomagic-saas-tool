
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AnalyticsSectionProps {
  url: string;
  hasResults: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ url, hasResults }) => {
  if (!url) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <h4 className="text-lg font-medium mb-2">URL не указан</h4>
        <p className="text-muted-foreground">
          Введите URL сайта для анализа данных
        </p>
      </div>
    );
  }
  
  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <h4 className="text-lg font-medium mb-2">Нет данных для анализа</h4>
        <p className="text-muted-foreground">
          Сначала выполните сканирование сайта
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Аналитика</h3>
      
      <div className="space-y-4">
        {/* Charts placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/40 border rounded-lg p-4 h-60 flex items-center justify-center">
            <span className="text-muted-foreground">График распределения страниц</span>
          </div>
          <div className="bg-muted/40 border rounded-lg p-4 h-60 flex items-center justify-center">
            <span className="text-muted-foreground">График метаданных</span>
          </div>
        </div>
        
        <div className="bg-muted/40 border rounded-lg p-4 h-60 flex items-center justify-center">
          <span className="text-muted-foreground">Временная шкала сканирования</span>
        </div>
        
        <div className="bg-muted/40 border rounded-lg p-4 h-60 flex items-center justify-center">
          <span className="text-muted-foreground">Граф структуры сайта</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
