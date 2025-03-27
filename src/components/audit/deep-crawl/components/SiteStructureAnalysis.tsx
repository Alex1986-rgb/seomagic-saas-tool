import React, { useState, useRef, useEffect } from 'react';
import { BarChart, FileSearch, Download, Clock, ScrollText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageNode, SiteStructure, analyzeSiteStructure } from '@/services/audit/siteAnalysis';
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer } from 'recharts';

interface SiteStructureAnalysisProps {
  domain: string;
  urls: string[];
}

const SiteStructureAnalysis = ({ domain, urls }: SiteStructureAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [siteStructure, setSiteStructure] = useState<SiteStructure | null>(null);
  const [showResults, setShowResults] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setLoading(true);
    setProgress(0);
    setSiteStructure(null);
    
    try {
      const structure = await analyzeSiteStructure(domain, urls, (current, total) => {
        setProgress(Math.floor((current / total) * 100));
      });
      
      setSiteStructure(structure);
      setShowResults(true);
      
      toast({
        title: "Анализ завершен",
        description: `Проанализировано ${structure.nodes.length} страниц и ${structure.links.length} связей`,
      });
    } catch (error) {
      console.error("Ошибка при анализе структуры:", error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ структуры сайта",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showResults && siteStructure && graphRef.current) {
      console.log('Рисуем граф структуры сайта:', siteStructure);
    }
  }, [showResults, siteStructure]);

  const downloadReport = () => {
    if (!siteStructure) return;
    
    const report = {
      domain,
      date: new Date().toISOString(),
      siteStructure,
      summary: {
        totalPages: siteStructure.nodes.length,
        totalLinks: siteStructure.links.length,
        averagePageRank: siteStructure.nodes.reduce((sum, node) => sum + node.pageRank, 0) / siteStructure.nodes.length
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-structure-${domain}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Отчет сохранен",
      description: "Отчет о структуре сайта успешно скачан",
    });
  };

  const generateSitemap = () => {
    if (!siteStructure) return;
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const node of siteStructure.nodes) {
      sitemap += `  <url>\n    <loc>${node.url}</loc>\n`;
      const priority = Math.max(0.1, Math.min(1.0, node.pageRank / 100)).toFixed(1);
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
    }
    
    sitemap += '</urlset>';
    
    const blob = new Blob([sitemap], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${domain}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sitemap создан",
      description: "XML-файл карты сайта успешно скачан",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Анализ структуры сайта</CardTitle>
        </div>
        <CardDescription>
          Визуализация структуры сайта и расчет внутреннего PageRank для каждой страницы
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Анализ структуры...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            {showResults && siteStructure ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-primary">{siteStructure.nodes.length}</div>
                    <div className="text-sm text-muted-foreground">Проанализировано страниц</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-primary">{siteStructure.links.length}</div>
                    <div className="text-sm text-muted-foreground">Внутренних ссылок</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-primary">
                      {(siteStructure.links.length / Math.max(1, siteStructure.nodes.length)).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Среднее кол-во ссылок</div>
                  </div>
                </div>
                
                <Tabs defaultValue="graph">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="graph">Структура сайта</TabsTrigger>
                    <TabsTrigger value="pagerank">PageRank страниц</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="graph" className="mt-4">
                    <div className="rounded-lg border bg-card p-4 aspect-video">
                      <div ref={graphRef} className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Clock className="h-10 w-10 mx-auto mb-2 animate-pulse" />
                          <p>Визуализация структуры сайта</p>
                          <p className="text-sm">Для просмотра интерактивного графа скачайте полный отчет</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pagerank" className="mt-4">
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left font-medium">URL</th>
                            <th className="p-2 text-left font-medium w-24">PageRank</th>
                            <th className="p-2 text-left font-medium w-24 hidden md:table-cell">Входящие</th>
                            <th className="p-2 text-left font-medium w-24 hidden md:table-cell">Исходящие</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...siteStructure.nodes]
                            .sort((a, b) => b.pageRank - a.pageRank)
                            .slice(0, 10)
                            .map((node, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 truncate max-w-[200px]" title={node.url}>
                                  {new URL(node.url).pathname || '/'}
                                </td>
                                <td className="p-2">
                                  <Badge variant="outline" className="font-mono">
                                    {node.pageRank.toFixed(1)}
                                  </Badge>
                                </td>
                                <td className="p-2 hidden md:table-cell">{node.incomingLinks}</td>
                                <td className="p-2 hidden md:table-cell">{node.outgoingLinks}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Показаны 10 страниц с наивысшим значением PageRank
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-6">
                  Анализирует структуру сайта, строит граф связей и рассчитывает внутренний PageRank
                </p>
                <Button onClick={runAnalysis} className="gap-2">
                  <BarChart className="h-4 w-4" />
                  Анализировать структуру сайта
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {showResults && siteStructure && (
        <CardFooter className="flex flex-wrap gap-2 justify-between pt-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowResults(false)}
          >
            Скрыть результаты
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateSitemap}
              className="gap-2"
            >
              <ScrollText className="h-4 w-4" />
              Скачать Sitemap
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
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default SiteStructureAnalysis;
