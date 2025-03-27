
import React, { useState } from 'react';
import { FileText, Search, Download, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { analyzeContentUniqueness, ContentAnalysisResult, DuplicatePage } from '@/services/audit/siteAnalysis';
import { useToast } from "@/hooks/use-toast";

interface ContentUniquenessAnalysisProps {
  domain: string;
  urls: string[];
}

const ContentUniquenessAnalysis = ({ domain, urls }: ContentUniquenessAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ContentAnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setLoading(true);
    setProgress(0);
    setResult(null);
    
    try {
      const analysisResult = await analyzeContentUniqueness(urls, (current, total) => {
        setProgress(Math.floor((current / total) * 100));
      });
      
      setResult(analysisResult);
      setShowResults(true);
      
      toast({
        title: "Анализ завершен",
        description: `Уникальность контента: ${analysisResult.overallUniqueness.toFixed(1)}%. Найдено ${analysisResult.duplicatePages.length} групп дубликатов.`,
      });
    } catch (error) {
      console.error("Ошибка при анализе уникальности контента:", error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ уникальности контента",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    
    const report = {
      domain,
      date: new Date().toISOString(),
      overallUniqueness: result.overallUniqueness,
      uniquePages: result.uniquePages,
      totalPages: result.pageContents.length,
      duplicateGroups: result.duplicatePages.length,
      duplicatePages: result.duplicatePages
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-uniqueness-${domain}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Отчет сохранен",
      description: "Отчет об уникальности контента успешно скачан",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Проверка уникальности контента</CardTitle>
        </div>
        <CardDescription>
          Выявляет дубликаты контента и оценивает уникальность текстов на страницах сайта
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Анализ контента...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            {showResults && result ? (
              <div className="space-y-4">
                <div className="relative h-24 w-full rounded-lg border bg-card p-2">
                  <div className="absolute inset-0 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 opacity-20"
                      style={{ width: `${result.overallUniqueness}%` }}
                    />
                  </div>
                  <div className="relative flex h-full flex-col items-center justify-center">
                    <span className="text-3xl font-bold">
                      {result.overallUniqueness.toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Общая уникальность контента
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-green-500">{result.uniquePages}</div>
                    <div className="text-sm text-muted-foreground">Уникальных страниц</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-amber-500">
                      {result.pageContents.length - result.uniquePages}
                    </div>
                    <div className="text-sm text-muted-foreground">Неуникальных страниц</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {result.duplicatePages.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Групп дубликатов</div>
                  </div>
                </div>
                
                {result.duplicatePages.length > 0 && (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Заголовок</th>
                          <th className="p-2 text-left font-medium">Кол-во URL</th>
                          <th className="p-2 text-left font-medium hidden md:table-cell">Размер</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.duplicatePages.slice(0, 5).map((duplicate, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 truncate max-w-[300px]" title={duplicate.title}>
                              {duplicate.title || 'Без заголовка'}
                            </td>
                            <td className="p-2">{duplicate.urls.length}</td>
                            <td className="p-2 hidden md:table-cell">
                              {Math.round(duplicate.contentLength / 1024)} KB
                            </td>
                          </tr>
                        ))}
                        {result.duplicatePages.length > 5 && (
                          <tr>
                            <td colSpan={3} className="p-2 text-center text-sm text-muted-foreground">
                              И еще {result.duplicatePages.length - 5} групп дубликатов. Скачайте полный отчет для просмотра.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-6">
                  Анализирует уникальность контента на страницах сайта и выявляет дубликаты
                </p>
                <Button onClick={runAnalysis} className="gap-2">
                  <Search className="h-4 w-4" />
                  Проверить уникальность контента
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {showResults && result && (
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

export default ContentUniquenessAnalysis;
