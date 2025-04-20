
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageCountDisplay from '../../page-count';
import { DeepCrawlButton } from '../../deep-crawl';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

interface AuditPageInfoProps {
  pageCount?: number;
  pageStats: any;
  url: string;
  onUpdatePageCount: (count: number) => void;
  onDownloadSitemap?: () => void;
}

const AuditPageInfo: React.FC<AuditPageInfoProps> = ({
  pageCount,
  pageStats,
  url,
  onUpdatePageCount,
  onDownloadSitemap
}) => {
  const [showEstimate, setShowEstimate] = useState(false);
  const [estimateData, setEstimateData] = useState<{
    pageCount: number;
    errors: number;
    warnings: number;
    estimatedCost: number;
    timeToFix: string;
  } | null>(null);

  const handleCrawlComplete = (urls: string[]) => {
    // Обновляем количество страниц с количеством найденных URL
    const count = urls.length;
    onUpdatePageCount(count);
    
    // Генерируем примерную смету на основе количества страниц
    const errors = Math.floor(count * 0.15); // примерно 15% страниц с ошибками
    const warnings = Math.floor(count * 0.25); // примерно 25% страниц с предупреждениями
    
    // Рассчитываем примерную стоимость оптимизации
    let baseCost = 0;
    if (count <= 50) baseCost = 15000;
    else if (count <= 200) baseCost = 30000;
    else if (count <= 500) baseCost = 50000;
    else baseCost = 80000;
    
    // Добавляем стоимость за ошибки и предупреждения
    const errorCost = errors * 300;
    const warningCost = warnings * 150;
    const totalCost = baseCost + errorCost + warningCost;
    
    // Рассчитываем примерное время на исправление
    let timeToFix = '';
    if (count <= 50) timeToFix = '3-5 дней';
    else if (count <= 200) timeToFix = '7-10 дней';
    else if (count <= 500) timeToFix = '14-21 день';
    else timeToFix = '30+ дней';
    
    // Сохраняем данные сметы
    setEstimateData({
      pageCount: count,
      errors,
      warnings,
      estimatedCost: totalCost,
      timeToFix
    });
    
    setShowEstimate(true);
  };

  if (!pageCount) return null;

  return (
    <div className="relative space-y-4">
      <PageCountDisplay 
        pageCount={pageCount} 
        isScanning={false}
        pageStats={pageStats}
        onDownloadSitemap={onDownloadSitemap}
      />
      
      <div className="absolute top-4 right-4">
        <DeepCrawlButton 
          url={url} 
          onCrawlComplete={handleCrawlComplete} 
        />
      </div>
      
      {showEstimate && estimateData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <Card className="p-4 border-primary/30 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Смета по результатам глубокого анализа</h3>
              <Badge variant="outline" className="text-xs">
                {estimateData.pageCount} страниц
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-background/60 p-3 rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Обнаружено ошибок</div>
                <div className="text-xl font-semibold text-destructive">{estimateData.errors}</div>
              </div>
              
              <div className="bg-background/60 p-3 rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Предупреждений</div>
                <div className="text-xl font-semibold text-amber-500">{estimateData.warnings}</div>
              </div>
              
              <div className="bg-background/60 p-3 rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Время на исправление</div>
                <div className="text-xl font-semibold">{estimateData.timeToFix}</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center bg-primary/10 p-3 rounded-md">
              <div>
                <div className="text-sm text-muted-foreground">Ориентировочная стоимость оптимизации</div>
                <div className="text-2xl font-bold text-primary">
                  {estimateData.estimatedCost.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              
              <button className="mt-3 sm:mt-0 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                Заказать оптимизацию <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AuditPageInfo;
