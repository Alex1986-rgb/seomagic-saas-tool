
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';
import { MassiveSiteCrawlDialog } from './components/MassiveSiteCrawlDialog';
import { useToast } from "@/hooks/use-toast";

interface MassiveCrawlButtonProps {
  url: string;
  onCrawlComplete?: (urls: string[]) => void;
}

const MassiveCrawlButton: React.FC<MassiveCrawlButtonProps> = ({ 
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleStartCrawl}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border-0"
        disabled={!url}
      >
        <Shield className="h-4 w-4" />
        <span>Профессиональный аудит</span>
      </Button>

      <MassiveSiteCrawlDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        url={url}
        onCrawlComplete={onCrawlComplete}
      />
    </>
  );
};

export default MassiveCrawlButton;
