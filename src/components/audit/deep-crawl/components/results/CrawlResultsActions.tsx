
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, FileDown, BookOpen, Settings } from 'lucide-react';
import MassiveCrawler from '@/components/massive-crawler/MassiveCrawler';

interface CrawlResultsActionsProps {
  domain: string;
  pageCount: number;
  urls: string[];
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
  onDownloadSitemap?: () => void;
  onDownloadReport?: () => void;
  onDownloadAllData?: () => void;
}

export const CrawlResultsActions: React.FC<CrawlResultsActionsProps> = ({
  domain,
  pageCount,
  urls,
  pageTypes,
  depthData,
  brokenLinks,
  duplicatePages,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData
}) => {
  const { toast } = useToast();
  const [showMassiveCrawlDialog, setShowMassiveCrawlDialog] = useState(false);

  const handleMassiveCrawlComplete = (pagesScanned: number) => {
    toast({
      title: "Масштабное сканирование завершено",
      description: `Просканировано ${pagesScanned.toLocaleString('ru-RU')} страниц сайта ${domain}`,
    });
    setShowMassiveCrawlDialog(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" size="sm" className="gap-2" onClick={onDownloadSitemap}>
          <FileDown className="h-4 w-4" />
          <span>Скачать Sitemap</span>
        </Button>
        
        <Button variant="outline" size="sm" className="gap-2" onClick={onDownloadReport}>
          <BookOpen className="h-4 w-4" />
          <span>Отчет о сканировании</span>
        </Button>
        
        <Button variant="outline" size="sm" className="gap-2" onClick={onDownloadAllData}>
          <Download className="h-4 w-4" />
          <span>Экспорт данных</span>
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="gap-2 ml-auto" 
          onClick={() => setShowMassiveCrawlDialog(true)}
        >
          <Settings className="h-4 w-4" />
          <span>Масштабное сканирование</span>
        </Button>
      </div>

      <Dialog open={showMassiveCrawlDialog} onOpenChange={setShowMassiveCrawlDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Масштабное сканирование</DialogTitle>
          </DialogHeader>
          
          <MassiveCrawler 
            projectId={"00000000-0000-0000-0000-000000000000"} // Здесь должен быть фактический ID проекта
            url={`https://${domain}`}
            onComplete={handleMassiveCrawlComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
