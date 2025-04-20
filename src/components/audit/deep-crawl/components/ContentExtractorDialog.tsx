
import React, { useState } from 'react';
import { Database, Download, FileText, Package, X, Check, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ContentExtractor, 
  ExtractedContent, 
  ExtractionOptions 
} from "@/services/audit/contentExtractor/contentExtractor";

interface ContentExtractorDialogProps {
  open: boolean;
  onClose: () => void;
  urls: string[];
  domain: string;
}

export const ContentExtractorDialog: React.FC<ContentExtractorDialogProps> = ({
  open,
  onClose,
  urls,
  domain
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [extractedContent, setExtractedContent] = useState<Map<string, ExtractedContent>>(new Map());
  const [contentExtractor] = useState(() => new ContentExtractor());
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ExtractionOptions>({
    extractText: true,
    extractImages: true,
    extractLinks: true,
    extractMeta: true,
    maxPages: 500,
    timeout: 15000,
    retryCount: 3,
    retryDelay: 2000
  });
  
  const { toast } = useToast();

  const handleStartExtraction = async () => {
    if (urls.length === 0) {
      toast({
        title: "Нет URL для обработки",
        description: "Пожалуйста, выполните сканирование сайта",
        variant: "destructive"
      });
      return;
    }
    
    setIsExtracting(true);
    setIsComplete(false);
    setProgress(0);
    setProcessedCount(0);
    setTotalCount(Math.min(urls.length, options.maxPages || 500));
    setError(null);
    
    try {
      const result = await contentExtractor.extractFromUrls(
        urls,
        (processed, total, url) => {
          const progressPercent = (processed / total) * 100;
          setProgress(progressPercent);
          setProcessedCount(processed);
          setCurrentUrl(url);
        }
      );
      
      setExtractedContent(result);
      setIsComplete(true);
      
      toast({
        title: "Экстракция завершена",
        description: `Обработано ${result.size} страниц из ${urls.length}`,
      });
    } catch (err) {
      console.error("Error during content extraction:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      
      toast({
        title: "Ошибка при экстракции",
        description: "Произошла ошибка при извлечении контента",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(100);
    }
  };

  const handleDownloadAll = async () => {
    try {
      await contentExtractor.downloadAll(`${domain.replace(/[^a-z0-9]/gi, '-')}-content.zip`);
      
      toast({
        title: "Экспорт завершен",
        description: "Сайт с контентом успешно экспортирован",
      });
    } catch (err) {
      console.error("Error downloading content:", err);
      
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось скачать контент",
        variant: "destructive"
      });
    }
  };

  const handleOptionChange = (key: keyof ExtractionOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleOption = (key: keyof ExtractionOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !isExtracting) onClose();
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Извлечение контента сайта
          </DialogTitle>
          <DialogDescription>
            {domain}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          {!isExtracting && !isComplete && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extract-text">Извлекать текст</Label>
                    <Switch
                      id="extract-text"
                      checked={options.extractText}
                      onCheckedChange={() => toggleOption('extractText')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extract-images">Извлекать изображения</Label>
                    <Switch
                      id="extract-images"
                      checked={options.extractImages}
                      onCheckedChange={() => toggleOption('extractImages')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extract-links">Извлекать ссылки</Label>
                    <Switch
                      id="extract-links"
                      checked={options.extractLinks}
                      onCheckedChange={() => toggleOption('extractLinks')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extract-meta">Извлекать метаданные</Label>
                    <Switch
                      id="extract-meta"
                      checked={options.extractMeta}
                      onCheckedChange={() => toggleOption('extractMeta')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-pages">Максимальное количество страниц</Label>
                <Input
                  id="max-pages"
                  type="number"
                  value={options.maxPages || 500}
                  onChange={(e) => handleOptionChange('maxPages', parseInt(e.target.value) || 500)}
                  min={1}
                  max={10000}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Доступно {urls.length} URL. Будет обработано не более {options.maxPages} страниц.
              </div>
            </div>
          )}
          
          {(isExtracting || isComplete) && (
            <>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Обработано:</div>
                  <div className="font-medium">{processedCount} из {totalCount}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Статус:</div>
                  <div className="font-medium">{isExtracting ? "Обработка..." : "Завершено"}</div>
                </div>
              </div>
              
              {currentUrl && isExtracting && (
                <div className="text-xs text-muted-foreground truncate p-2 border border-border rounded-md bg-muted/50">
                  Текущий URL: {currentUrl}
                </div>
              )}
              
              {isComplete && extractedContent.size > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 rounded-md text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Извлечено {extractedContent.size} страниц. Теперь вы можете скачать все данные.
                </div>
              )}
            </>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!isExtracting && !isComplete && (
            <Button 
              onClick={handleStartExtraction}
              className="w-full sm:w-auto"
              disabled={urls.length === 0}
            >
              <Database className="h-4 w-4 mr-2" />
              Начать извлечение
            </Button>
          )}
          
          {isExtracting && (
            <Button variant="outline" disabled className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Извлечение...
            </Button>
          )}
          
          {isComplete && (
            <>
              <Button 
                onClick={handleDownloadAll}
                variant="default"
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Скачать весь контент
              </Button>
              
              <Button 
                onClick={handleStartExtraction}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Повторить извлечение
              </Button>
            </>
          )}
          
          <Button 
            onClick={onClose}
            variant="ghost"
            className="w-full sm:w-auto"
            disabled={isExtracting}
          >
            <X className="h-4 w-4 mr-2" />
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
