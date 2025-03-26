
import React from 'react';
import { FileSearch, FolderTree, Network } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditScanningProps {
  url: string;
  scanDetails: {
    pagesScanned: number;
    totalPages: number;
    currentUrl: string;
  };
}

const AuditScanning: React.FC<AuditScanningProps> = ({ url, scanDetails }) => {
  return (
    <div className="neo-card p-6">
      <div className="text-center mb-6">
        <FileSearch className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Глубокое сканирование сайта</h3>
        <p className="text-muted-foreground mb-4">Анализируем страницы сайта {url}</p>
        
        <div className="flex justify-between items-center mb-2 text-sm">
          <span>Прогресс сканирования:</span>
          <span>{scanDetails.pagesScanned} / {scanDetails.totalPages || '?'} страниц</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ 
              width: scanDetails.totalPages ? 
                `${(scanDetails.pagesScanned / scanDetails.totalPages) * 100}%` : 
                `${Math.min(scanDetails.pagesScanned, 100)}%` 
            }}
          ></div>
        </div>
        
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
            <FileSearch className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Подстраницы</p>
            <p className="text-xs text-muted-foreground">Находим все разделы сайта</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditScanning;
