
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, FileText } from 'lucide-react';

interface EstimateTabProps {
  isCompleted: boolean;
  pagesScanned: number;
  onGenerateReport?: () => void;
  onDownloadEstimate?: () => void;
}

export const EstimateTab: React.FC<EstimateTabProps> = ({
  isCompleted,
  pagesScanned,
  onGenerateReport,
  onDownloadEstimate
}) => {
  // Расчет сметы на основе количества сканированных страниц
  const errors = Math.floor(pagesScanned * 0.15); // 15% страниц с ошибками
  const warnings = Math.floor(pagesScanned * 0.25); // 25% страниц с предупреждениями
  
  // Расчет стоимости оптимизации
  let baseCost = 0;
  if (pagesScanned <= 50) baseCost = 15000;
  else if (pagesScanned <= 200) baseCost = 30000;
  else if (pagesScanned <= 500) baseCost = 50000;
  else baseCost = 80000;
  
  const errorCost = errors * 300;
  const warningCost = warnings * 150;
  const totalCost = baseCost + errorCost + warningCost;
  
  // Расчет примерного времени на исправление
  let timeToFix = '';
  if (pagesScanned <= 50) timeToFix = '3-5 дней';
  else if (pagesScanned <= 200) timeToFix = '7-10 дней';
  else if (pagesScanned <= 500) timeToFix = '14-21 день';
  else timeToFix = '30+ дней';
  
  // Список выявленных проблем
  const issues = [
    { name: 'Отсутствующие мета-описания', count: Math.floor(errors * 0.3), severity: 'high' },
    { name: 'Проблемы с заголовками h1', count: Math.floor(errors * 0.25), severity: 'high' },
    { name: 'Неоптимизированные изображения', count: Math.floor(errors * 0.2), severity: 'medium' },
    { name: 'Отсутствующие alt-атрибуты', count: Math.floor(warnings * 0.3), severity: 'medium' },
    { name: 'Некорректные канонические URLs', count: Math.floor(warnings * 0.15), severity: 'medium' },
    { name: 'Битые ссылки', count: Math.floor(errors * 0.1), severity: 'high' },
    { name: 'Дублированный контент', count: Math.floor(warnings * 0.2), severity: 'medium' },
    { name: 'Проблемы со структурой URL', count: Math.floor(warnings * 0.15), severity: 'low' },
  ];
  
  if (!isCompleted) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Дождитесь завершения сканирования для получения сметы
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Смета на оптимизацию</h3>
        </div>
        <Badge variant="outline">{pagesScanned} страниц</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-secondary/20 p-3 rounded-md">
          <div className="text-sm text-muted-foreground">Обнаружено ошибок</div>
          <div className="text-xl font-semibold text-destructive">{errors}</div>
        </div>
        
        <div className="bg-secondary/20 p-3 rounded-md">
          <div className="text-sm text-muted-foreground">Предупреждений</div>
          <div className="text-xl font-semibold text-amber-500">{warnings}</div>
        </div>
        
        <div className="bg-secondary/20 p-3 rounded-md">
          <div className="text-sm text-muted-foreground">Время на исправление</div>
          <div className="text-xl font-semibold">{timeToFix}</div>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-40 pr-2">
        <h4 className="font-medium mb-2 text-sm">Выявленные проблемы</h4>
        <ul className="space-y-2">
          {issues.map((issue, index) => (
            <li key={index} className="flex justify-between items-center text-sm border-b border-border pb-1">
              <span>{issue.name}</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    issue.severity === 'high' ? 'destructive' : 
                    issue.severity === 'medium' ? 'default' : 'outline'
                  }
                  className="text-xs"
                >
                  {issue.count}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-primary/10 p-3 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Итоговая стоимость оптимизации</div>
            <div className="text-2xl font-bold text-primary">
              {totalCost.toLocaleString('ru-RU')} ₽
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
      
      <div className="text-xs text-muted-foreground">
        * Стоимость может быть скорректирована после детального анализа специалистом
      </div>
    </motion.div>
  );
};
