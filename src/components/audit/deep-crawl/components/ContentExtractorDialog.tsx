
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, FileText, DownloadCloud, Package, Save, Check } from 'lucide-react';
import { useContentExtractor } from '../hooks/useContentExtractor';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [maxPages, setMaxPages] = useState(100);
  const [options, setOptions] = useState({
    includeHtml: true,
    includeText: true,
    includeMetaTags: true,
    includeHeadings: true,
    includeLinks: true,
    includeImages: true
  });

  const {
    isExtracting,
    extractedSite,
    progress,
    extractContent,
    exportContent
  } = useContentExtractor();

  const handleExtract = async () => {
    await extractContent(urls, domain, {
      ...options,
      maxPages,
    });
  };

  const handleExport = (format: 'json' | 'html' | 'markdown' | 'sitemap' | 'all') => {
    exportContent(format);
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const completedPercent = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> 
            Извлечение контента сайта
          </DialogTitle>
          <DialogDescription>
            Извлечение контента с {domain} для создания карты сайта
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="extract">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="extract">Настройки</TabsTrigger>
            <TabsTrigger value="progress" disabled={!isExtracting && !extractedSite}>Прогресс</TabsTrigger>
            <TabsTrigger value="results" disabled={!extractedSite}>Результаты</TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Настройки экстракции</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeHtml" 
                      checked={options.includeHtml}
                      onCheckedChange={(checked) => handleOptionChange('includeHtml', !!checked)}
                    />
                    <Label htmlFor="includeHtml">Включить HTML</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeText" 
                      checked={options.includeText}
                      onCheckedChange={(checked) => handleOptionChange('includeText', !!checked)}
                    />
                    <Label htmlFor="includeText">Включить текст</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeMetaTags" 
                      checked={options.includeMetaTags}
                      onCheckedChange={(checked) => handleOptionChange('includeMetaTags', !!checked)}
                    />
                    <Label htmlFor="includeMetaTags">Мета-теги</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeHeadings" 
                      checked={options.includeHeadings}
                      onCheckedChange={(checked) => handleOptionChange('includeHeadings', !!checked)}
                    />
                    <Label htmlFor="includeHeadings">Заголовки (H1-H3)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeLinks" 
                      checked={options.includeLinks}
                      onCheckedChange={(checked) => handleOptionChange('includeLinks', !!checked)}
                    />
                    <Label htmlFor="includeLinks">Ссылки</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeImages" 
                      checked={options.includeImages}
                      onCheckedChange={(checked) => handleOptionChange('includeImages', !!checked)}
                    />
                    <Label htmlFor="includeImages">Изображения</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Лимит и сводка</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPages">Максимум страниц для обработки</Label>
                    <Input 
                      id="maxPages" 
                      type="number" 
                      min={1} 
                      max={5000} 
                      value={maxPages} 
                      onChange={(e) => setMaxPages(parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Найдено URLs: {urls.length}. Рекомендуется ограничить количество страниц для больших сайтов.
                    </p>
                  </div>
                  
                  <div className="space-y-1 mt-4">
                    <p className="text-sm">Домен: <span className="font-medium">{domain}</span></p>
                    <p className="text-sm">Обнаружено URLs: <span className="font-medium">{urls.length}</span></p>
                    <p className="text-sm">Будет обработано: <span className="font-medium">{Math.min(maxPages, urls.length)}</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={handleExtract}
                disabled={isExtracting || urls.length === 0}
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                {isExtracting ? "Извлечение..." : "Начать извлечение контента"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Прогресс извлечения:</span>
                  <span className="text-sm font-medium">{completedPercent}%</span>
                </div>
                <Progress value={completedPercent} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Обработано:</span>
                  <span className="font-medium ml-2">{progress.completed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Всего:</span>
                  <span className="font-medium ml-2">{progress.total}</span>
                </div>
              </div>
              
              {progress.currentUrl && (
                <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded-md">
                  <p className="truncate">Текущий URL: {progress.currentUrl}</p>
                </div>
              )}
              
              {progress.isComplete && (
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
                  <Check className="h-4 w-4" />
                  <span>Извлечение завершено! Теперь вы можете экспортировать данные.</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="py-4">
            {extractedSite ? (
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Извлеченный контент</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Домен:</span>
                      <span className="font-medium ml-2">{extractedSite.domain}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Страниц:</span>
                      <span className="font-medium ml-2">{extractedSite.pageCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Извлечено:</span>
                      <span className="font-medium ml-2">{new Date(extractedSite.extractedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Экспорт данных</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => handleExport('json')}
                    >
                      <FileText className="h-4 w-4" />
                      JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => handleExport('html')}
                    >
                      <FileText className="h-4 w-4" />
                      HTML
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => handleExport('markdown')}
                    >
                      <FileText className="h-4 w-4" />
                      Markdown
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => handleExport('sitemap')}
                    >
                      <FileText className="h-4 w-4" />
                      Sitemap XML
                    </Button>
                    <Button 
                      variant="default" 
                      className="gap-2 sm:col-span-2 md:col-span-2" 
                      onClick={() => handleExport('all')}
                    >
                      <DownloadCloud className="h-4 w-4" />
                      Скачать все форматы (ZIP)
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Пример извлеченных данных</h3>
                  <div className="max-h-60 overflow-y-auto p-3 bg-muted rounded-md text-xs">
                    <pre>{JSON.stringify(extractedSite.pages[0], null, 2)}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>Нет данных. Сначала выполните извлечение контента.</span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
