
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCrawlProgress } from './hooks/useCrawlProgress';
import { getStageTitleAndInfo } from './utils/crawlStageUtils';
import { useToast } from "@/hooks/use-toast";
import { promptTemplates } from './components/dialog/PromptTemplates';
import { 
  ProgressTab, 
  ResultsTab, 
  OptimizeTab,
  DialogHeader,
  DialogFooter,
  EstimateTab
} from './components/dialog';

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
  const [activeTab, setActiveTab] = useState<string>("progress");
  const [seoPrompt, setSeoPrompt] = useState<string>("");
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>("");
  const [isCrawlInitiated, setIsCrawlInitiated] = useState(false);
  const { toast } = useToast();
  
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
    downloadReport,
    optimizeSite,
    downloadOptimizedSite,
    isOptimizing
  } = useCrawlProgress(url);

  useEffect(() => {
    if (open && !isCrawlInitiated) {
      // Добавляем небольшую задержку перед запуском
      const timer = setTimeout(() => {
        startCrawling();
        setIsCrawlInitiated(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    if (!open) {
      setIsCrawlInitiated(false);
    }
  }, [open, isCrawlInitiated, startCrawling]);

  const handleClose = () => {
    if (isCompleted) {
      onClose(pagesScanned);
    } else {
      // Запрашиваем подтверждение
      if (window.confirm("Вы уверены, что хотите прервать сканирование?")) {
        onClose();
      }
    }
  };
  
  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const handlePromptTemplateChange = (value: string) => {
    setSelectedPromptTemplate(value);
    const template = promptTemplates.find(t => t.id === value);
    if (template) {
      setSeoPrompt(template.prompt);
    }
  };

  const handleOptimizeSite = () => {
    if (seoPrompt.trim()) {
      optimizeSite(seoPrompt);
    }
  };

  const handleDownloadEstimate = () => {
    toast({
      title: "Смета скачана",
      description: "Файл со сметой загружен успешно",
    });
  };

  // Получаем информацию о текущем этапе
  const { title, info } = getStageTitleAndInfo(crawlStage, error, pagesScanned);

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader title={title} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="results" disabled={!isCompleted}>Результаты</TabsTrigger>
            <TabsTrigger value="estimate" disabled={!isCompleted}>Смета</TabsTrigger>
            <TabsTrigger value="optimize" disabled={!isCompleted}>Оптимизация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <ProgressTab 
              progress={progress}
              pagesScanned={pagesScanned}
              estimatedPages={estimatedPages}
              currentUrl={currentUrl}
              error={error}
              info={info}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsTab 
              isCompleted={isCompleted}
              error={error}
              pagesScanned={pagesScanned}
              domain={domain}
              scannedUrls={scannedUrls}
              onDownloadSitemap={downloadSitemap}
              onDownloadReport={downloadReport}
              onDownloadAllData={downloadAllData}
            />
          </TabsContent>
          
          <TabsContent value="estimate">
            <EstimateTab 
              isCompleted={isCompleted}
              pagesScanned={pagesScanned}
              onGenerateReport={downloadReport}
              onDownloadEstimate={handleDownloadEstimate}
            />
          </TabsContent>
          
          <TabsContent value="optimize">
            <OptimizeTab 
              seoPrompt={seoPrompt}
              selectedPromptTemplate={selectedPromptTemplate}
              promptTemplates={promptTemplates}
              isOptimizing={isOptimizing}
              isCompleted={isCompleted}
              onSeoPromptChange={setSeoPrompt}
              onPromptTemplateChange={handlePromptTemplateChange}
              onOptimize={handleOptimizeSite}
              onDownloadOptimized={downloadOptimizedSite}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter 
          isCompleted={isCompleted}
          activeTab={activeTab}
          onClose={handleClose}
          onTabChange={setActiveTab}
        />
      </DialogContent>
    </Dialog>
  );
};
