
import React from 'react';
import { motion } from 'framer-motion';
import { Files, FileSearch } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Map } from 'lucide-react';

interface PageCountHeaderProps {
  pageCount: number;
  isScanning: boolean;
  onDownloadSitemap?: () => void;
}

const PageCountHeader: React.FC<PageCountHeaderProps> = ({ 
  pageCount, 
  isScanning, 
  onDownloadSitemap 
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  return (
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
  );
};

export default PageCountHeader;
