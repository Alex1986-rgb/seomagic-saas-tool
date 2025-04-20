
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

  // Normalize URL - make sure it has http/https prefix
  const normalizeUrl = (inputUrl: string): string => {
    if (!inputUrl) return '';
    
    // Remove any trailing slashes
    let normalizedUrl = inputUrl.trim();
    while (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    // Add https:// if no protocol specified
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    // Check if URL is lovable domain and warn, but allow it to continue if explicitly requested
    const isLovableDomain = normalizedUrl.includes('lovableproject.com') || normalizedUrl.includes('lovable.app');
    if (isLovableDomain) {
      console.warn("Attempting to scan Lovable project domain, this may not be intended");
      toast({
        title: "Предупреждение",
        description: "Вы пытаетесь сканировать домен Lovable. Возможно, это не то, что вы хотели.",
        variant: "warning"
      });
    }
    
    return normalizedUrl;
  };

  const handleStartCrawl = () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "URL не указан",
        variant: "destructive"
      });
      return;
    }
    
    const normalizedUrl = normalizeUrl(url);
    console.log(`Starting deep scan for: ${normalizedUrl}`);
    
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
        url={normalizeUrl(url)}
        initialStage="starting"
      />
    </>
  );
};

export default DeepCrawlButton;
