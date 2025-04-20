
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { FileText, Download, FileJson, FileCode, Package, Layers, Image } from 'lucide-react';
import { useContentExtractor } from '../hooks/useContentExtractor';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  const {
    isExtracting,
    extractedSite,
    progress,
    extractContent,
    exportContent
  } = useContentExtractor();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (open && urls.length > 0) {
      // Start extraction when dialog opens
      extractContent(urls, domain, {
        includeHtml: true,
        includeText: true,
        includeHeadings: true,
        includeLinks: true,
        includeImages: true
      });
    }
  }, [open, urls, domain]);
  
  const handleExport = (format: 'json' | 'html' | 'markdown' | 'sitemap' | 'all') => {
    exportContent(format);
  };
  
  // Preview stats
  const pagesWithImagesCount = extractedSite?.pages.filter(page => page.images.length > 0).length || 0;
  const totalImagesCount = extractedSite?.pages.reduce((sum, page) => sum + page.images.length, 0) || 0;
  const totalInternalLinks = extractedSite?.pages.reduce((sum, page) => sum + page.links.internal.length, 0) || 0;
  const totalExternalLinks = extractedSite?.pages.reduce((sum, page) => sum + page.links.external.length, 0) || 0;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Экстракция контента сайта
            <Badge variant={isExtracting ? "default" : "secondary"}>
              {isExtracting ? "Извлечение..." : "Готово"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {isExtracting && (
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Обработано: {progress.completed} из {progress.total}</span>
                <span>{Math.round((progress.completed / Math.max(progress.total, 1)) * 100)}%</span>
              </div>
              <Progress value={(progress.completed / Math.max(progress.total, 1)) * 100} />
              {progress.currentUrl && (
                <div className="text-xs text-muted-foreground truncate">
                  Текущий URL: {progress.currentUrl}
                </div>
              )}
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="pages">Страницы ({extractedSite?.pages.length || 0})</TabsTrigger>
              <TabsTrigger value="images">Изображения ({totalImagesCount})</TabsTrigger>
              <TabsTrigger value="links">Ссылки ({totalInternalLinks + totalExternalLinks})</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <TabsContent value="overview" className="m-0">
                {extractedSite ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Страницы</div>
                        <div className="text-2xl font-bold">{extractedSite.pages.length}</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Изображения</div>
                        <div className="text-2xl font-bold">{totalImagesCount}</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Внутренние ссылки</div>
                        <div className="text-2xl font-bold">{totalInternalLinks}</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Внешние ссылки</div>
                        <div className="text-2xl font-bold">{totalExternalLinks}</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Метаданные сайта</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Домен:</span> {extractedSite.domain}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Извлечено:</span> {new Date(extractedSite.extractedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Экспорт данных</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        <Button onClick={() => handleExport('json')} variant="outline" className="gap-2">
                          <FileJson className="h-4 w-4" /> JSON
                        </Button>
                        <Button onClick={() => handleExport('html')} variant="outline" className="gap-2">
                          <FileCode className="h-4 w-4" /> HTML
                        </Button>
                        <Button onClick={() => handleExport('markdown')} variant="outline" className="gap-2">
                          <FileText className="h-4 w-4" /> Markdown
                        </Button>
                        <Button onClick={() => handleExport('sitemap')} variant="outline" className="gap-2">
                          <Layers className="h-4 w-4" /> Sitemap XML
                        </Button>
                        <Button onClick={() => handleExport('all')} variant="default" className="gap-2">
                          <Package className="h-4 w-4" /> Все форматы (ZIP)
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isExtracting ? "Извлечение данных..." : "Нет данных для отображения"}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pages" className="m-0">
                {extractedSite?.pages.length ? (
                  <div className="space-y-4">
                    {extractedSite.pages.map((page, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <h3 className="font-medium">
                          <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {page.title || page.url}
                          </a>
                        </h3>
                        <div className="text-sm text-muted-foreground mt-1">{page.url}</div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Заголовки:</span> H1 ({page.headings.h1.length}), 
                            H2 ({page.headings.h2.length}), H3 ({page.headings.h3.length})
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ссылки:</span> {page.links.internal.length + page.links.external.length}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Изображения:</span> {page.images.length}
                          </div>
                        </div>
                        {page.meta.description && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Описание:</span> {page.meta.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isExtracting ? "Загрузка страниц..." : "Нет страниц для отображения"}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="images" className="m-0">
                {totalImagesCount > 0 ? (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">
                        Найдено {totalImagesCount} изображений на {pagesWithImagesCount} страницах
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {extractedSite?.pages.flatMap(page => 
                        page.images.map((image, imgIndex) => (
                          <div key={`${page.url}-${imgIndex}`} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/50 aspect-square flex items-center justify-center">
                              <img 
                                src={image.url} 
                                alt={image.alt || ''}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  // Replace broken image with placeholder
                                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                            <div className="p-2 text-xs">
                              <div className="truncate">{image.alt || 'Без alt-атрибута'}</div>
                              <div className="text-muted-foreground truncate">
                                {new URL(image.url).pathname.split('/').pop()}
                              </div>
                            </div>
                          </div>
                        ))
                      ).slice(0, 50)}
                      
                      {totalImagesCount > 50 && (
                        <div className="border rounded-lg flex items-center justify-center p-4 col-span-full text-sm text-muted-foreground">
                          И еще {totalImagesCount - 50} изображений (доступны в экспортированных файлах)
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isExtracting ? "Загрузка изображений..." : "Нет изображений для отображения"}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="links" className="m-0">
                {(totalInternalLinks + totalExternalLinks) > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Внутренние ссылки ({totalInternalLinks})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {extractedSite?.pages.flatMap(page => 
                          page.links.internal.slice(0, 5).map((link, linkIndex) => (
                            <a 
                              key={`${page.url}-internal-${linkIndex}`}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate hover:underline"
                            >
                              {link}
                            </a>
                          ))
                        ).slice(0, 50)}
                        
                        {totalInternalLinks > 50 && (
                          <div className="col-span-full text-muted-foreground">
                            И еще {totalInternalLinks - 50} внутренних ссылок...
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Внешние ссылки ({totalExternalLinks})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {extractedSite?.pages.flatMap(page => 
                          page.links.external.slice(0, 5).map((link, linkIndex) => (
                            <a 
                              key={`${page.url}-external-${linkIndex}`}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate hover:underline"
                            >
                              {link}
                            </a>
                          ))
                        ).slice(0, 50)}
                        
                        {totalExternalLinks > 50 && (
                          <div className="col-span-full text-muted-foreground">
                            И еще {totalExternalLinks - 50} внешних ссылок...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isExtracting ? "Загрузка ссылок..." : "Нет ссылок для отображения"}
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
