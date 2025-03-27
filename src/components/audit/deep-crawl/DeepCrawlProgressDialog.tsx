
import React, { useState, useEffect } from 'react';
import { FileSearch, X, DownloadCloud, Loader2, BarChart4 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CrawlResults from './CrawlResults';
import CrawlProgressView from './components/CrawlProgressView';
import { useCrawlProgress } from './hooks/useCrawlProgress';
import { getStageTitleAndInfo } from './utils/crawlStageUtils';

interface DeepCrawlProgressDialogProps {
  open: boolean;
  onClose: (pageCount?: number) => void;
  url: string;
}

export const DeepCrawlProgressDialog: React.FC<DeepCrawlProgressDialogProps> = ({ 
  open, 
  onClose, 
  url 
}) => {
  const [showResults, setShowResults] = useState(false);
  const {
    progress,
    currentUrl,
    pagesScanned,
    estimatedPages,
    sitemap,
    crawlStage,
    isCompleted,
    error,
    domain,
    scannedUrls,
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport
  } = useCrawlProgress(url);

  useEffect(() => {
    if (open) {
      startCrawling();
    }
  }, [open]);

  const handleClose = () => {
    if (isCompleted) {
      onClose(pagesScanned);
    } else {
      // Ask for confirmation
      if (window.confirm("Вы уверены, что хотите прервать сканирование?")) {
        onClose();
      }
    }
  };
  
  const toggleResults = () => {
    setShowResults(!showResults);
  };

  // Get stage information
  const { title, info } = getStageTitleAndInfo(crawlStage, error, pagesScanned);

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className={`${showResults ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        {!showResults && (
          <CrawlProgressView
            progress={progress}
            pagesScanned={pagesScanned}
            estimatedPages={estimatedPages}
            currentUrl={currentUrl}
            error={error}
            info={info}
          />
        )}
        
        {showResults && isCompleted && !error && (
          <CrawlResults 
            pageCount={pagesScanned}
            domain={domain}
            urls={scannedUrls}
            onDownloadSitemap={downloadSitemap}
            onDownloadReport={downloadReport}
            onDownloadAllData={downloadAllData}
          />
        )}
        
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          {isCompleted ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Закрыть
              </Button>
              
              <div className="flex items-center gap-2">
                {!error && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleResults}
                  >
                    {showResults ? (
                      <>
                        <BarChart4 className="h-4 w-4 mr-1.5" />
                        Скрыть детали
                      </>
                    ) : (
                      <>
                        <BarChart4 className="h-4 w-4 mr-1.5" />
                        Показать детали
                      </>
                    )}
                  </Button>
                )}
                
                {sitemap && !showResults && (
                  <Button
                    onClick={downloadSitemap}
                    size="sm"
                    className="gap-2"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Скачать Sitemap
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Прервать
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Сканирование...</span>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
