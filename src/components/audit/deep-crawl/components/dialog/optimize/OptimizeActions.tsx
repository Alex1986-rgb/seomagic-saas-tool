
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Loader2, DownloadCloud } from 'lucide-react';

interface OptimizeActionsProps {
  seoPrompt: string;
  isOptimizing: boolean;
  isCompleted: boolean;
  onOptimize: () => void;
  onDownloadOptimized: () => void;
}

const OptimizeActions: React.FC<OptimizeActionsProps> = ({
  seoPrompt,
  isOptimizing,
  isCompleted,
  onOptimize,
  onDownloadOptimized
}) => {
  return (
    <div className="space-y-3">
      <Button 
        onClick={onOptimize}
        disabled={!seoPrompt.trim() || isOptimizing}
        className="w-full gap-2"
      >
        {isOptimizing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Оптимизация...
          </>
        ) : (
          <>
            <Bot className="h-4 w-4" />
            Оптимизировать сайт с помощью ИИ
          </>
        )}
      </Button>
      
      {isOptimizing && (
        <div className="text-xs text-muted-foreground text-center animate-pulse">
          Оптимизация сайта с помощью ИИ. Это может занять несколько минут...
        </div>
      )}
      
      <Button 
        onClick={onDownloadOptimized}
        disabled={isOptimizing || !isCompleted}
        variant="outline"
        className="w-full gap-2"
      >
        <DownloadCloud className="h-4 w-4" />
        Скачать оптимизированную версию сайта
      </Button>
    </div>
  );
};

export default OptimizeActions;
