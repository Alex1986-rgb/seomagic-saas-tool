
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CrawlProgressViewProps {
  progress: number;
  pagesScanned: number;
  estimatedPages: number;
  currentUrl: string;
  error: string | null;
  info: string;
}

const CrawlProgressView: React.FC<CrawlProgressViewProps> = ({
  progress,
  pagesScanned,
  estimatedPages,
  currentUrl,
  error,
  info
}) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Прогресс сканирования:</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Просканировано страниц</div>
          <div className="text-2xl font-semibold mt-1">{pagesScanned.toLocaleString('ru-RU')}</div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Примерно всего страниц</div>
          <div className="text-2xl font-semibold mt-1">{estimatedPages.toLocaleString('ru-RU')}</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Текущий URL:</div>
        <div className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto whitespace-nowrap">
          {currentUrl || 'Подготовка к сканированию...'}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {info}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
};

export default CrawlProgressView;
