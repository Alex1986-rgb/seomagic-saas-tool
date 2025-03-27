
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, Database, Map, FileSearch, 
  CheckCircle, AlertCircle 
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
    <div className="py-4 px-2">
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span>{info}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        
        <Progress value={progress} className="h-2"/>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Обработано: {pagesScanned.toLocaleString('ru-RU')}</span>
          <span>Оценка: ~{estimatedPages.toLocaleString('ru-RU')}</span>
        </div>
      </div>
      
      {currentUrl && (
        <div className="mt-3 overflow-hidden">
          <p className="text-xs text-muted-foreground mb-1">Текущая страница:</p>
          <div className="bg-muted/30 rounded p-1.5 text-xs truncate overflow-hidden">
            {currentUrl}
          </div>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { icon: <Database className="h-4 w-4" />, text: "Анализ данных", done: progress >= 25 },
          { icon: <Map className="h-4 w-4" />, text: "Сбор ссылок", done: progress >= 50 },
          { icon: <FileSearch className="h-4 w-4" />, text: "Индексация", done: progress >= 75 },
          { icon: <CheckCircle className="h-4 w-4" />, text: "Завершение", done: progress >= 100 }
        ].map((stage, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`p-2 rounded-full ${stage.done ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {stage.done ? <CheckCircle className="h-4 w-4" /> : stage.icon}
            </div>
            <span className="text-xs mt-1 text-center">{stage.text}</span>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Ошибка сканирования</p>
              <p className="text-xs mt-1 text-destructive/80">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrawlProgressView;
