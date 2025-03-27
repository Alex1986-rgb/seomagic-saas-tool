
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, FileSearch, Map, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeepCrawlProgressDialog } from './DeepCrawlProgressDialog';
import { useToast } from "@/hooks/use-toast";

interface DeepCrawlButtonProps {
  url: string;
  onCrawlComplete: (pageCount: number) => void;
}

export const DeepCrawlButton: React.FC<DeepCrawlButtonProps> = ({ url, onCrawlComplete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [estimatedPages, setEstimatedPages] = useState(0);
  const { toast } = useToast();

  const startDeepCrawl = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (pageCount?: number) => {
    setIsDialogOpen(false);
    if (pageCount && pageCount > 0) {
      onCrawlComplete(pageCount);
      toast({
        title: "Глубокое сканирование завершено",
        description: `Обнаружено ${pageCount.toLocaleString('ru-RU')} страниц на сайте ${url}`,
      });
    }
  };

  return (
    <>
      <Button
        onClick={startDeepCrawl}
        variant="glassmorphic"
        size="sm"
        className="flex items-center gap-2 hover-lift"
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
