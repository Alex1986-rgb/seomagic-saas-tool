
import React from 'react';
import { FileSearch, FolderTree, Network, FileText, Download, Loader2, Map, Database, Search, CheckCircle } from 'lucide-react';
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

  // Определение этапа сканирования на основе прогресса
  const getScanningStage = (percent: number) => {
    if (percent < 20) return "Анализ платформы сайта";
    if (percent < 40) return "Обнаружение структуры сайта";
    if (percent < 60) return "Подсчет страниц";
    if (percent < 80) return "Создание карты сайта";
    return "Завершение сканирования";
  };

  const scanningStage = getScanningStage(percentComplete);

  // Анимированные точки для индикации процесса
  const LoadingDots = () => (
    <span className="inline-flex items-center">
      <motion.span
        className="inline-block h-1 w-1 rounded-full bg-primary mr-1"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="inline-block h-1 w-1 rounded-full bg-primary mr-1"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="inline-block h-1 w-1 rounded-full bg-primary"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </span>
  );

  return (
    <motion.div 
      className="neo-card p-6 border border-primary/20 bg-gradient-to-b from-card/70 to-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <motion.div 
            className="absolute inset-0 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileSearch className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-2">Глубокое сканирование сайта</h3>
        <p className="text-muted-foreground mb-6">Анализируем структуру сайта {url}</p>
        
        <div className="flex justify-between items-center mb-2 text-sm">
          <span>Прогресс сканирования:</span>
          <span className="font-medium">{percentComplete}%</span>
        </div>
        
        <Progress value={percentComplete} className="h-2 mb-1" />
        
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span>Обработано: {formatNumber(scanDetails.pagesScanned)}</span>
          <span>Всего: {formatNumber(scanDetails.totalPages)}</span>
        </div>
        
        <div className="flex items-center justify-center mb-4 text-sm font-medium text-primary">
          <Search className="animate-pulse h-4 w-4 mr-2" />
          {scanningStage} <LoadingDots />
        </div>
        
        {scanDetails.currentUrl && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground truncate mb-2 bg-background/40 rounded-md p-2 border border-border">
              {scanDetails.currentUrl}
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
          <div className="bg-primary/10 p-3 rounded-lg text-center border border-primary/20">
            <FolderTree className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Структура сайта</p>
            <div className="mt-2 h-1 bg-foreground/10 rounded">
              <motion.div 
                className="h-1 rounded bg-primary" 
                style={{ width: `${Math.min(percentComplete * 1.2, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-lg text-center border border-primary/20">
            <FileText className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Карта сайта</p>
            <div className="mt-2 h-1 bg-foreground/10 rounded">
              <motion.div 
                className="h-1 rounded bg-primary" 
                style={{ width: `${Math.min(percentComplete * 0.8, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { icon: <Database className="h-4 w-4" />, text: "Анализ данных", done: percentComplete >= 30 },
            { icon: <Network className="h-4 w-4" />, text: "Проверка ссылок", done: percentComplete >= 50 },
            { icon: <Map className="h-4 w-4" />, text: "Создание карты", done: percentComplete >= 70 },
            { icon: <FileSearch className="h-4 w-4" />, text: "Аудит страниц", done: percentComplete >= 90 }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${item.done ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {item.done ? <CheckCircle className="h-4 w-4" /> : item.icon}
              </div>
              <span className="text-xs mt-1 text-center">{item.text}</span>
            </div>
          ))}
        </div>
        
        {onDownloadSitemap && scanDetails.pagesScanned > scanDetails.totalPages * 0.3 && (
          <div className="mt-6">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 glassmorphic"
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
