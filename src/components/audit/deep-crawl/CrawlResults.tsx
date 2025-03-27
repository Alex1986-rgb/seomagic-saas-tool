
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, FileText, Download, ClipboardCopy, CheckCircle, Server, FilePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ExportDeepCrawlPdf from './ExportDeepCrawlPdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CrawlResultsProps {
  pageCount: number;
  domain: string;
  urls: string[];
  onDownloadSitemap?: () => void;
  onDownloadReport?: () => void;
  onDownloadAllData?: () => void;
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
}

export const CrawlResults: React.FC<CrawlResultsProps> = ({
  pageCount,
  domain,
  urls,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData,
  pageTypes = {},
  depthData = [],
  brokenLinks = [],
  duplicatePages = []
}) => {
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Calculate some basic SEO metrics
  const topLevelPages = urls.filter(u => (u.match(/\//g) || []).length <= 3).length;
  const deepPages = urls.filter(u => (u.match(/\//g) || []).length > 3).length;
  const potentialProductPages = urls.filter(u => 
    u.includes('product') || 
    u.includes('tovar') || 
    u.includes('item') || 
    u.includes('catalog/')
  ).length;

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    
    toast({
      title: "URL скопирован",
      description: "URL успешно скопирован в буфер обмена",
    });
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Результаты сканирования</h2>
        </div>
        
        <Badge variant="outline" className="font-normal">
          {pageCount} страниц
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card className="bg-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Страницы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Вложенность до 3 уровней</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topLevelPages}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Потенциальные товары</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{potentialProductPages}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="urls" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="urls">URL (до 100)</TabsTrigger>
          <TabsTrigger value="seo">SEO Рекомендации</TabsTrigger>
        </TabsList>
        
        <TabsContent value="urls" className="space-y-4">
          <div className="h-60 overflow-y-auto border rounded-md p-2 bg-background/50">
            {urls.slice(0, 100).map((url, index) => (
              <div key={index} className="flex justify-between text-xs truncate p-1 hover:bg-muted rounded group">
                <div className="truncate">{url}</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 opacity-0 group-hover:opacity-100"
                  onClick={() => handleCopyUrl(url)}
                >
                  {copiedUrl === url ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <ClipboardCopy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
            {urls.length > 100 && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                Показано первые 100 URL из {urls.length}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Автоматические рекомендации</CardTitle>
              <CardDescription>
                На основе структуры найденных URL
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>✅ Обнаружено {pageCount} уникальных URL</p>
              <p>{topLevelPages > pageCount * 0.3 ? '✅' : '⚠️'} {topLevelPages} страниц имеют оптимальную вложенность</p>
              <p>{deepPages > pageCount * 0.7 ? '⚠️' : '✅'} {deepPages} страниц имеют глубокую вложенность</p>
              <p>{potentialProductPages > 0 ? '✅' : '⚠️'} Найдено {potentialProductPages} потенциальных товарных страниц</p>
              <p>💡 Рекомендуется проверить карту сайта вручную и убедиться, что все важные страницы присутствуют</p>
              <p>💡 На основе результатов сканирования создайте sitemap.xml и добавьте его в Google Search Console</p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Для полного SEO аудита запустите глубокое сканирование контента
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-wrap justify-end space-x-2 mt-4">
        {onDownloadSitemap && (
          <Button 
            onClick={onDownloadSitemap}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Скачать Sitemap
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FilePlus className="h-4 w-4" />
              <span>PDF отчет</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <div className="cursor-pointer">
                <ExportDeepCrawlPdf
                  domain={domain}
                  urls={urls}
                  pageCount={pageCount}
                  pageTypes={pageTypes}
                  depthData={depthData}
                  brokenLinks={brokenLinks}
                  duplicatePages={duplicatePages}
                  enhancedStyling={false}
                  includeFullDetails={false}
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="cursor-pointer">
                <ExportDeepCrawlPdf
                  domain={domain}
                  urls={urls}
                  pageCount={pageCount}
                  pageTypes={pageTypes}
                  depthData={depthData}
                  brokenLinks={brokenLinks}
                  duplicatePages={duplicatePages}
                  enhancedStyling={true}
                  includeFullDetails={true}
                  variant="ghost"
                  className="w-full justify-start px-2"
                >
                  <span>Расширенный PDF отчет</span>
                </ExportDeepCrawlPdf>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {onDownloadReport && (
          <Button 
            onClick={onDownloadReport}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать отчет
          </Button>
        )}
        
        {onDownloadAllData && (
          <Button 
            onClick={onDownloadAllData}
            size="sm"
            className="gap-2"
          >
            <Server className="h-4 w-4" />
            Скачать все данные
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default CrawlResults;
