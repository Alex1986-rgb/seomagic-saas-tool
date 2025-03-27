
import React, { useState, useCallback } from 'react';
import { Rocket } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DeepCrawlProgressDialog } from './DeepCrawlProgressDialog';
import { useToast } from "@/hooks/use-toast";

interface DeepCrawlButtonProps {
  url: string;
  onCrawlComplete: (pageCount: number) => void;
}

const DeepCrawlButton: React.FC<DeepCrawlButtonProps> = ({ url, onCrawlComplete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const startDeepCrawl = useCallback(() => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    // Добавляем небольшую задержку для предотвращения двойных кликов
    setTimeout(() => {
      setIsDialogOpen(true);
      setIsProcessing(false);
    }, 300);
  }, [isProcessing]);

  const handleCloseDialog = useCallback((pageCount?: number) => {
    setIsDialogOpen(false);
    
    if (pageCount && pageCount > 0) {
      onCrawlComplete(pageCount);
      toast({
        title: "Глубокое сканирование завершено",
        description: `Обнаружено ${pageCount.toLocaleString('ru-RU')} страниц на сайте ${url}`,
      });
    }
  }, [url, onCrawlComplete, toast]);

  return (
    <>
      <Button
        onClick={startDeepCrawl}
        variant="glassmorphic"
        size="sm"
        className="flex items-center gap-2 hover-lift"
        disabled={isProcessing}
      >
        <Rocket className="h-4 w-4" />
        <span>Глубокое сканирование</span>
      </Button>

      <DeepCrawlProgressDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        url={url}
      />
    </>
  );
};

export default DeepCrawlButton;
