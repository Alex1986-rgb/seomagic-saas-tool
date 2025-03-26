
import React from 'react';
import { motion } from 'framer-motion';
import { Files, FileSearch } from 'lucide-react';

interface PageCountDisplayProps {
  pageCount: number;
  isScanning: boolean;
}

const PageCountDisplay: React.FC<PageCountDisplayProps> = ({ pageCount, isScanning }) => {
  return (
    <motion.div 
      className="p-4 border border-primary/20 rounded-lg mb-4 bg-card/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
                ? `Обнаружено страниц: ${pageCount}... сканирование продолжается` 
                : `Всего страниц на сайте: ${pageCount}`
              }
            </p>
          </div>
        </div>
        
        {isScanning && (
          <div className="ml-auto">
            <motion.div 
              className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
      
      {!isScanning && pageCount > 0 && (
        <div className="mt-3 text-sm">
          <p className="text-muted-foreground">
            Ценообразование формируется на основе количества страниц на сайте
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PageCountDisplay;
