
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database } from 'lucide-react';
import { DeepCrawlProgressDialog } from './DeepCrawlProgressDialog';
import { useToast } from "@/hooks/use-toast";

interface DeepCrawlButtonProps {
  url: string;
  onCrawlComplete?: (urls: string[]) => void;
}

const DeepCrawlButton: React.FC<DeepCrawlButtonProps> = ({ 
  url,
  onCrawlComplete
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleStartCrawl = () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "URL не указан",
        variant: "destructive"
      });
      return;
    }
    
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (pageCount?: number, urls?: string[]) => {
    setIsDialogOpen(false);
    
    if (urls && urls.length > 0 && onCrawlComplete) {
      onCrawlComplete(urls);
    }
  };

  return (
    <>
      <Button
        onClick={handleStartCrawl}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        disabled={!url}
      >
        <Database className="h-4 w-4" />
        <span>Глубокое сканирование</span>
      </Button>

      <DeepCrawlProgressDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        url={url}
        initialStage="starting"
      />
    </>
  );
};

export default DeepCrawlButton;
