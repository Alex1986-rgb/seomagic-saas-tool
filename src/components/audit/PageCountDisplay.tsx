
import React from 'react';
import { motion } from 'framer-motion';
import { Files, FileSearch, Layers, FolderTree, FileText, Map } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
    'privacy': 'Политика'
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <motion.div 
      className="p-4 border border-primary/20 rounded-lg mb-4 bg-card/50"
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
            className="hover-lift flex items-center gap-2"
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
            <div className="bg-primary/5 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <FolderTree className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">Структура страниц</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(pageStats.subpages)
                  .sort(([, a], [, b]) => b - a) // Сортировка по количеству страниц
                  .map(([type, count]) => (
                    <div key={type} className="text-xs bg-background p-2 rounded border border-border">
                      <span className="font-medium">{pageTypeTranslations[type] || type}:</span> {formatNumber(count)} стр.
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          
          {pageStats.levels && Object.keys(pageStats.levels).length > 0 && (
            <div className="bg-primary/5 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Layers className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">Глубина сайта</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(pageStats.levels)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Сортировка по уровням
                  .map(([level, count]) => (
                    <div key={level} className="text-xs bg-background p-2 rounded border border-border">
                      <span className="font-medium">Уровень {level}:</span> {formatNumber(count)} стр.
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          
          <div className="bg-primary/5 p-3 rounded-lg">
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
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            Анализ основан на структуре и глубине сайта с учетом всех обнаруженных страниц
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PageCountDisplay;
