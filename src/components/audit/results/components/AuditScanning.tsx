
import React from 'react';
import { FileSearch, FolderTree, Network, FileText, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AuditScanningProps {
  url: string;
  scanDetails: {
    pagesScanned: number;
    totalPages: number;
    currentUrl: string;
  };
  onDownloadSitemap?: () => void;
}

const AuditScanning: React.FC<AuditScanningProps> = ({ url, scanDetails, onDownloadSitemap }) => {
  const percentComplete = scanDetails.totalPages 
    ? Math.floor((scanDetails.pagesScanned / scanDetails.totalPages) * 100) 
    : Math.min(scanDetails.pagesScanned, 100);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <motion.div 
      className="neo-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <FileSearch className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Глубокое сканирование сайта</h3>
        <p className="text-muted-foreground mb-4">Анализируем структуру сайта {url}</p>
        
        <div className="flex justify-between items-center mb-2 text-sm">
          <span>Прогресс сканирования:</span>
          <span>{formatNumber(scanDetails.pagesScanned)} / {formatNumber(scanDetails.totalPages)} страниц</span>
        </div>
        
        <Progress value={percentComplete} className="h-2 mb-4" />
        
        {scanDetails.currentUrl && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground truncate mb-2">
              Сканирование: {scanDetails.currentUrl}
            </p>
            <motion.div
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Network className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs">Исследуем структуру сайта</span>
            </motion.div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
          <div className="bg-primary/10 p-3 rounded-lg text-center">
            <FolderTree className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Структура сайта</p>
            <p className="text-xs text-muted-foreground">Анализируем иерархию страниц</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg text-center">
            <FileText className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Карта сайта</p>
            <p className="text-xs text-muted-foreground">Создаем XML Sitemap</p>
          </div>
        </div>
        
        {onDownloadSitemap && scanDetails.pagesScanned > scanDetails.totalPages * 0.3 && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              onClick={onDownloadSitemap}
              disabled={scanDetails.pagesScanned < scanDetails.totalPages * 0.3}
            >
              {scanDetails.pagesScanned < scanDetails.totalPages * 0.5 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {scanDetails.pagesScanned < scanDetails.totalPages * 0.5 
                ? "Подготовка Sitemap..." 
                : "Скачать Sitemap"}
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Сканирование больших сайтов может занять некоторое время. Пожалуйста, подождите...</p>
          <p className="mt-2 text-xs">Проверяем до {formatNumber(scanDetails.totalPages)} страниц для создания полной карты сайта</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditScanning;
