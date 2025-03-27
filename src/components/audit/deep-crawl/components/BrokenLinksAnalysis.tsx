import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2Off, CornerDownRight, AlertTriangle, ExternalLink, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BrokenLink, Redirect, detectBrokenLinks } from '@/services/audit/siteAnalysis';
import { useToast } from "@/hooks/use-toast";

interface BrokenLinksAnalysisProps {
  domain: string;
  urls: string[];
}

const BrokenLinksAnalysis = ({ domain, urls }: BrokenLinksAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const startAnalysis = async () => {
    setLoading(true);
    setProgress(0);
    setBrokenLinks([]);
    setRedirects([]);
    
    try {
      const result = await detectBrokenLinks(domain, urls, (current, total) => {
        setProgress(Math.floor((current / total) * 100));
      });
      
      setBrokenLinks(result.brokenLinks);
      setRedirects(result.redirects);
      setShowDetails(true);
      
      toast({
        title: "Анализ завершен",
        description: `Найдено ${result.brokenLinks.length} битых ссылок и ${result.redirects.length} редиректов`,
      });
    } catch (error) {
      console.error("Ошибка при анализе ссылок:", error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить проверку ссылок",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const report = {
      brokenLinks,
      redirects,
      domain,
      date: new Date().toISOString(),
      summary: {
        totalChecked: urls.length,
        brokenCount: brokenLinks.length,
        redirectsCount: redirects.length
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `broken-links-report-${domain}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Отчет сохранен",
      description: "Отчет о битых ссылках успешно скачан",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Link2Off className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">Поиск битых ссылок и редиректов</CardTitle>
        </div>
        <CardDescription>
          Выявляет неработающие ссылки и перенаправления, помогая улучшить навигацию и пользовательский опыт
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Проверка ссылок...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            {showDetails ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-destructive">{brokenLinks.length}</div>
                    <div className="text-sm text-muted-foreground">Битых ссылок</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3 flex flex-col items-center">
                    <div className="text-2xl font-bold text-amber-500">{redirects.length}</div>
                    <div className="text-sm text-muted-foreground">Редиректов</div>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {brokenLinks.length > 0 && (
                    <AccordionItem value="broken-links">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          Битые ссылки ({brokenLinks.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="rounded-md border mt-2 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>URL</TableHead>
                                <TableHead>Код</TableHead>
                                <TableHead>Страница источник</TableHead>
                                <TableHead className="hidden md:table-cell">Текст ссылки</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {brokenLinks.slice(0, 10).map((link, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-mono text-xs break-all">{link.url}</TableCell>
                                  <TableCell>
                                    <Badge variant="destructive">{link.statusCode || 'N/A'}</Badge>
                                  </TableCell>
                                  <TableCell className="truncate max-w-[140px]">
                                    <a 
                                      href={link.fromPage} 
                                      target="_blank" 
                                      className="hover:text-primary truncate block"
                                      title={link.fromPage}
                                    >
                                      {new URL(link.fromPage).pathname || '/'}
                                    </a>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell truncate max-w-[160px]">
                                    {link.linkText || 'Без текста'}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {brokenLinks.length > 10 && (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-2">
                                    И еще {brokenLinks.length - 10} битых ссылок. Скачайте полный отчет для просмотра.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {redirects.length > 0 && (
                    <AccordionItem value="redirects">
                      <AccordionTrigger className="text-base font-medium">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-amber-500" />
                          Редиректы ({redirects.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="rounded-md border mt-2 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Исходный URL</TableHead>
                                <TableHead>Назначение</TableHead>
                                <TableHead className="hidden md:table-cell">Код</TableHead>
                                <TableHead className="hidden md:table-cell">Страница источник</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {redirects.slice(0, 10).map((redirect, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-mono text-xs truncate break-all">{redirect.url}</TableCell>
                                  <TableCell className="font-mono text-xs truncate break-all">
                                    {redirect.redirectsTo}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <Badge variant="outline">{redirect.statusCode}</Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell truncate max-w-[140px]">
                                    <a 
                                      href={redirect.fromPage} 
                                      target="_blank" 
                                      className="hover:text-primary truncate block"
                                      title={redirect.fromPage}
                                    >
                                      {new URL(redirect.fromPage).pathname || '/'}
                                    </a>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {redirects.length > 10 && (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-2">
                                    И еще {redirects.length - 10} редиректов. Скачайте полный отчет для просмотра.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-6">
                  Выявляет неработающие ссылки и перенаправления на вашем сайте, помогая улучшить пользовательский опыт и SEO
                </p>
                <Button onClick={startAnalysis} className="gap-2">
                  <Link2Off className="h-4 w-4" />
                  Начать проверку ссылок
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {showDetails && (
        <CardFooter className="flex justify-between pt-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowDetails(false)}
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

export default BrokenLinksAnalysis;
