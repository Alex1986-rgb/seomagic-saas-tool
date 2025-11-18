import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, RefreshCw } from 'lucide-react';
import { useScanContext } from '@/contexts/ScanContext';
import { useToast } from '@/hooks/use-toast';

interface ManualAuditStarterProps {
  url: string;
  onStarted?: () => void;
}

/**
 * Fallback component for manually starting an audit
 * Shows when auto-start fails or times out
 */
export const ManualAuditStarter: React.FC<ManualAuditStarterProps> = ({ url, onStarted }) => {
  const [isStarting, setIsStarting] = React.useState(false);
  const { startScan, taskId } = useScanContext();
  const { toast } = useToast();

  const handleStartAudit = async () => {
    console.log('🎯 Manual audit start triggered for:', url);
    setIsStarting(true);
    
    try {
      const newTaskId = await startScan(false);
      
      if (newTaskId) {
        console.log('✅ Manual audit started with task ID:', newTaskId);
        toast({
          title: "Аудит запущен",
          description: "Начинаем анализ вашего сайта...",
        });
        onStarted?.();
      } else {
        throw new Error('Failed to get task ID');
      }
    } catch (error) {
      console.error('❌ Error starting manual audit:', error);
      toast({
        title: "Ошибка запуска аудита",
        description: error instanceof Error ? error.message : 'Не удалось запустить аудит',
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  // If we already have a taskId, don't show the button
  if (taskId) {
    console.log('🔍 ManualAuditStarter: taskId exists, hiding button');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-border/50 bg-muted/30">
      <div className="flex flex-col items-center gap-2 text-center">
        <PlayCircle className="h-12 w-12 text-primary" />
        <h3 className="text-lg font-semibold">Готовы начать аудит?</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Нажмите кнопку ниже, чтобы начать быстрый анализ вашего сайта
        </p>
      </div>
      
      <Button 
        onClick={handleStartAudit}
        disabled={isStarting}
        size="lg"
        className="gap-2"
      >
        {isStarting ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Запуск...
          </>
        ) : (
          <>
            <PlayCircle className="h-4 w-4" />
            Начать аудит
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Анализируем: <span className="font-mono">{url}</span>
      </p>
    </div>
  );
};
