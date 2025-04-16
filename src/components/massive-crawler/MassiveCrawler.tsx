
import React, { useState } from 'react';
import { MassiveCrawlConfig } from './MassiveCrawlConfig';
import { MassiveCrawlStatus } from './MassiveCrawlStatus';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

interface MassiveCrawlerProps {
  projectId: string;
  url: string;
  onComplete?: (pagesScanned: number) => void;
}

export const MassiveCrawler: React.FC<MassiveCrawlerProps> = ({
  projectId,
  url,
  onComplete
}) => {
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleStartCrawl = (newTaskId: string) => {
    setTaskId(newTaskId);
  };

  const handleComplete = (pagesScanned: number) => {
    toast({
      title: "Сканирование завершено",
      description: `Успешно просканировано ${pagesScanned.toLocaleString('ru-RU')} страниц`,
    });
    
    if (onComplete) {
      onComplete(pagesScanned);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Масштабный аудит сайта</h2>
        <Badge variant="outline" className="px-3 py-1">
          Масштабное сканирование
        </Badge>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800">
            Масштабное сканирование требует значительных ресурсов и может занять продолжительное время.
            Для сайтов с более чем 100 000 страниц рекомендуется использовать профессиональный API сервис.
          </p>
        </div>
      </div>
      
      {!taskId ? (
        <MassiveCrawlConfig 
          projectId={projectId}
          url={url}
          onStartCrawl={handleStartCrawl}
        />
      ) : (
        <MassiveCrawlStatus 
          taskId={taskId}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default MassiveCrawler;
