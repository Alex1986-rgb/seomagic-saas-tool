
import React from 'react';
import { motion } from 'framer-motion';
import EstimateHeader from './estimate/EstimateHeader';
import EstimateStats from './estimate/EstimateStats';
import EstimateIssuesList from './estimate/EstimateIssuesList';
import EstimateSummary from './estimate/EstimateSummary';

interface EstimateTabProps {
  isCompleted: boolean;
  pagesScanned: number;
  onGenerateReport?: () => void;
  onDownloadEstimate?: () => void;
}

const EstimateTab: React.FC<EstimateTabProps> = ({
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
    { name: 'Отсутствующие мета-описания', count: Math.floor(errors * 0.3), severity: 'high' as const },
    { name: 'Проблемы с заголовками h1', count: Math.floor(errors * 0.25), severity: 'high' as const },
    { name: 'Неоптимизированные изображения', count: Math.floor(errors * 0.2), severity: 'medium' as const },
    { name: 'Отсутствующие alt-атрибуты', count: Math.floor(warnings * 0.3), severity: 'medium' as const },
    { name: 'Некорректные канонические URLs', count: Math.floor(warnings * 0.15), severity: 'medium' as const },
    { name: 'Битые ссылки', count: Math.floor(errors * 0.1), severity: 'high' as const },
    { name: 'Дублированный контент', count: Math.floor(warnings * 0.2), severity: 'medium' as const },
    { name: 'Проблемы со структурой URL', count: Math.floor(warnings * 0.15), severity: 'low' as const },
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
      <EstimateHeader pagesScanned={pagesScanned} />
      
      <EstimateStats 
        errors={errors} 
        warnings={warnings} 
        timeToFix={timeToFix} 
      />
      
      <EstimateIssuesList issues={issues} />
      
      <EstimateSummary 
        totalCost={totalCost} 
        onDownloadEstimate={onDownloadEstimate} 
      />
    </motion.div>
  );
};

export default EstimateTab;
