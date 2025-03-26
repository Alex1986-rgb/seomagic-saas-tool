
import React from 'react';
import { motion } from 'framer-motion';
import { Files, FileSearch, Layers, FolderTree, FileText, Map, BarChart3, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PageStatistics {
  totalPages: number;
  subpages?: Record<string, number>;
  levels?: Record<number, number>;
}

interface PageCountDisplayProps {
  pageCount: number;
  isScanning: boolean;
  pageStats?: PageStatistics;
  onDownloadSitemap?: () => void;
}

const PageCountDisplay: React.FC<PageCountDisplayProps> = ({ 
  pageCount, 
  isScanning, 
  pageStats,
  onDownloadSitemap 
}) => {
  // Переводы типов страниц
  const pageTypeTranslations: Record<string, string> = {
    'product': 'Товары',
    'category': 'Категории',
    'blog': 'Блог',
    'contact': 'Контакты',
    'about': 'О нас',
    'faq': 'FAQ',
    'terms': 'Условия',
    'privacy': 'Политика',
    'other': 'Прочие'
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getPercentage = (part: number, total: number) => {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  };

  return (
    <motion.div 
      className="p-4 border border-primary/20 rounded-lg mb-4 bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded-full mr-3">
            <Files className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">
              {isScanning ? 'Сканирование страниц' : 'Результат сканирования'}
            </h3>
            <div className="flex items-center mt-1">
              <FileSearch className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-sm text-muted-foreground">
                {isScanning 
                  ? `Обнаружено страниц: ${formatNumber(pageCount)}... сканирование продолжается` 
                  : `Всего страниц на сайте: ${formatNumber(pageCount)}`
                }
              </p>
            </div>
          </div>
        </div>
        
        {isScanning && (
          <div>
            <motion.div 
              className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
        
        {!isScanning && onDownloadSitemap && (
          <Button 
            size="sm" 
            variant="outline" 
            className="hover-lift flex items-center gap-2 glassmorphic"
            onClick={onDownloadSitemap}
          >
            <Map className="h-4 w-4" />
            Скачать Sitemap
          </Button>
        )}
      </div>
      
      {!isScanning && pageCount > 0 && pageStats && (
        <div className="mt-4 space-y-3">
          {pageStats.subpages && Object.keys(pageStats.subpages).length > 0 && (
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">Распределение типов страниц</h4>
              </div>
              
              <div className="space-y-2">
                {Object.entries(pageStats.subpages)
                  .filter(([, count]) => count > 0)
                  .sort(([, a], [, b]) => b - a) // Сортировка по количеству страниц
                  .map(([type, count]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">{pageTypeTranslations[type] || type}</span>
                        <span>{formatNumber(count)} стр. ({getPercentage(count, pageCount)}%)</span>
                      </div>
                      <Progress 
                        value={getPercentage(count, pageCount)} 
                        className="h-1.5" 
                        indicatorClassName={
                          type === 'product' ? "bg-primary" : 
                          type === 'category' ? "bg-blue-500" :
                          type === 'blog' ? "bg-purple-500" :
                          "bg-secondary"
                        }
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          
          {pageStats.levels && Object.keys(pageStats.levels).length > 0 && (
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center mb-2">
                <Layers className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">Глубина сайта</h4>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                {Object.entries(pageStats.levels)
                  .filter(([, count]) => count > 0)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Сортировка по уровням
                  .map(([level, count]) => (
                    <div key={level} className="flex justify-between text-xs bg-background/50 p-2 rounded border border-border">
                      <span className="font-medium">Уровень {level}:</span>
                      <span>{formatNumber(count)} стр.</span>
                    </div>
                  ))
                }
              </div>
              
              <div className="mt-2 flex items-center">
                <Globe className="h-3 w-3 text-muted-foreground mr-1" />
                <p className="text-xs text-muted-foreground">
                  Глубина сайта - количество ссылок от главной страницы до целевых страниц
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">Карта сайта</h4>
              </div>
              <p className="text-xs">
                XML Sitemap создан для {formatNumber(pageCount)} страниц сайта
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Включает все основные разделы и подстраницы сайта
              </p>
              
              {onDownloadSitemap && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDownloadSitemap}
                  className="mt-2 text-xs h-7 px-2"
                >
                  <Map className="h-3 w-3 mr-1" />
                  Скачать
                </Button>
              )}
            </div>
            
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center mb-2">
                <FolderTree className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">Структура сайта</h4>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Средняя глубина:</span>
                  <span className="font-medium">
                    {pageStats.levels 
                      ? Object.entries(pageStats.levels)
                          .reduce((avg, [level, count]) => avg + parseInt(level) * count, 0) / 
                          Object.values(pageStats.levels).reduce((sum, count) => sum + count, 0)
                          .toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span>Количество разделов:</span>
                  <span className="font-medium">
                    {pageStats.subpages && pageStats.subpages['category'] 
                      ? formatNumber(pageStats.subpages['category']) 
                      : "N/A"}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span>Максимальная глубина:</span>
                  <span className="font-medium">
                    {pageStats.levels 
                      ? Math.max(...Object.keys(pageStats.levels).map(k => parseInt(k)))
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Анализ основан на структуре и глубине сайта с учетом всех обнаруженных страниц
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PageCountDisplay;
