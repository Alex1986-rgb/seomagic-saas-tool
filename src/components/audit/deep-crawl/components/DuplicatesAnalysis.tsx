
import React, { useState } from 'react';
import { Copy, FileSearch, Download, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { detectDuplicates, DuplicatePage, DuplicateMetaTag } from '@/services/audit/siteAnalysis';
import { useToast } from "@/hooks/use-toast";

interface DuplicatesAnalysisProps {
  domain: string;
  urls: string[];
}

const DuplicatesAnalysis = ({ domain, urls }: DuplicatesAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicatePages, setDuplicatePages] = useState<DuplicatePage[]>([]);
  const [duplicateMeta, setDuplicateMeta] = useState<DuplicateMetaTag[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setLoading(true);
    setProgress(0);
    setDuplicatePages([]);
    setDuplicateMeta([]);
    
    try {
      const results = await detectDuplicates(urls, (current, total) => {
        setProgress(Math.floor((current / total) * 100));
      });
      
      setDuplicatePages(results.duplicatePages);
      setDuplicateMeta(results.duplicateMeta);
      setShowResults(true);
      
      toast({
        title: "Анализ завершен",
        description: `Найдено ${results.duplicatePages.length} дубликатов страниц и ${results.duplicateMeta.length} повторяющихся мета-тегов`,
      });
    } catch (error) {
      console.error("Ошибка при поиске дубликатов:", error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить поиск дубликатов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const report = {
      domain,
      date: new Date().toISOString(),
      duplicatePages,
      duplicateMeta,
      summary: {
        totalPages: urls.length,
        duplicatePagesCount: duplicatePages.length,
        duplicateMetaCount: duplicateMeta.length,
        uniquePages: urls.length - duplicatePages.reduce((sum, item) => sum + item.urls.length, 0),
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duplicates-report-${domain}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Отчет сохранен",
      description: "Отчет о дубликатах успешно скачан",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Copy className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Обнаружение дубликатов</CardTitle>
        </div>
        <CardDescription>
          Находит повторяющиеся страницы, мета-теги и заголовки, что способствует устранению избыточного контента
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Поиск дубликатов...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            {showResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-amber-500">{duplicatePages.length}</div>
                    <div className="text-sm text-muted-foreground">Групп дубликатов страниц</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-amber-500">{duplicateMeta.length}</div>
                    <div className="text-sm text-muted-foreground">Повторяющихся мета-тегов</div>
                  </div>
                </div>
                
                <Tabs defaultValue="pages">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="pages">Дубликаты страниц</TabsTrigger>
                    <TabsTrigger value="meta">Повторяющиеся мета</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pages" className="mt-4">
                    {duplicatePages.length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Заголовок</TableHead>
                              <TableHead className="hidden md:table-cell">Размер</TableHead>
                              <TableHead>Кол-во URL</TableHead>
                              <TableHead>URL-адреса</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {duplicatePages.slice(0, 5).map((duplicate, index) => (
                              <TableRow key={index}>
                                <TableCell className="truncate max-w-[200px]" title={duplicate.title}>
                                  {duplicate.title || 'Без заголовка'}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {Math.round(duplicate.contentLength / 1024)} KB
                                </TableCell>
                                <TableCell>{duplicate.urls.length}</TableCell>
                                <TableCell className="truncate max-w-[200px]">
                                  <div className="truncate">
                                    {duplicate.urls[0]}
                                    {duplicate.urls.length > 1 && 
                                      <span className="text-muted-foreground ml-1">
                                        и еще {duplicate.urls.length - 1}
                                      </span>
                                    }
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {duplicatePages.length > 5 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-2">
                                  И еще {duplicatePages.length - 5} групп дубликатов. Скачайте полный отчет для просмотра.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Дубликаты страниц не найдены</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="meta" className="mt-4">
                    {duplicateMeta.length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Тип</TableHead>
                              <TableHead>Содержимое</TableHead>
                              <TableHead>Кол-во страниц</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {duplicateMeta.slice(0, 5).map((meta, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {meta.tag === 'title' ? 'Заголовок' : 'Описание'}
                                </TableCell>
                                <TableCell className="truncate max-w-[300px]" title={meta.value}>
                                  {meta.value}
                                </TableCell>
                                <TableCell>{meta.pages.length}</TableCell>
                              </TableRow>
                            ))}
                            {duplicateMeta.length > 5 && (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-2">
                                  И еще {duplicateMeta.length - 5} дубликатов мета-тегов. Скачайте полный отчет для просмотра.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Повторяющиеся мета-теги не найдены</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-6">
                  Находит повторяющиеся страницы, мета-теги и заголовки для улучшения контентной стратегии и SEO
                </p>
                <Button onClick={runAnalysis} className="gap-2">
                  <FileSearch className="h-4 w-4" />
                  Начать поиск дубликатов
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {showResults && (
        <CardFooter className="flex justify-between pt-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowResults(false)}
          >
            Скрыть результаты
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadReport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать отчет
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DuplicatesAnalysis;
