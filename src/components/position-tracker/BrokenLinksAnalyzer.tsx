
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link2Off, ExternalLink, ArrowRight, Download, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { detectBrokenLinks, type BrokenLink, type Redirect } from '@/services/audit/siteAnalysis';
import * as XLSX from 'xlsx';

interface BrokenLinksAnalyzerProps {
  domain?: string;
  urls?: string[];
  className?: string;
}

export function BrokenLinksAnalyzer({ domain, urls = [], className = '' }: BrokenLinksAnalyzerProps) {
  const [domainInput, setDomainInput] = useState(domain || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  // Функция анализа битых ссылок
  const analyzeBrokenLinks = async () => {
    if (!domainInput) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите домен для анализа",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setBrokenLinks([]);
    setRedirects([]);

    try {
      // Если URLs не переданы, попробуем получить их для домена
      let pagesToCheck = urls;
      
      if (pagesToCheck.length === 0) {
        // Запрашиваем URLs с сервера или используем crawler для их получения
        const formattedDomain = domainInput.startsWith('http') ? domainInput : `https://${domainInput}`;
        
        try {
          const response = await axios.get(formattedDomain);
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.data, 'text/html');
          const links = Array.from(doc.querySelectorAll('a[href]'))
            .map(link => link.getAttribute('href'))
            .filter(Boolean) as string[];
          
          // Преобразуем относительные ссылки в абсолютные
          pagesToCheck = links.map(link => {
            if (link.startsWith('http')) return link;
            if (link.startsWith('/')) {
              return `${formattedDomain}${link}`;
            }
            return `${formattedDomain}/${link}`;
          });
          
          // Оставляем только ссылки на текущий домен
          const domainObj = new URL(formattedDomain);
          pagesToCheck = pagesToCheck.filter(url => {
            try {
              const urlObj = new URL(url);
              return urlObj.hostname === domainObj.hostname;
            } catch (e) {
              return false;
            }
          });
          
          // Берем только уникальные URL
          pagesToCheck = Array.from(new Set(pagesToCheck));
          
          toast({
            title: "Ссылки получены",
            description: `Найдено ${pagesToCheck.length} ссылок для проверки`,
          });
        } catch (error) {
          toast({
            title: "Ошибка получения ссылок",
            description: "Не удалось загрузить ссылки с сайта. Проверьте домен и доступность сайта.",
            variant: "destructive",
          });
          setIsAnalyzing(false);
          return;
        }
      }
      
      // Запускаем анализ битых ссылок
      const results = await detectBrokenLinks(
        domainInput,
        pagesToCheck,
        (current, total) => {
          const progressPercent = Math.round((current / total) * 100);
          setProgress(progressPercent);
        }
      );
      
      setBrokenLinks(results.brokenLinks);
      setRedirects(results.redirects);
      
      toast({
        title: "Анализ завершен",
        description: `Найдено ${results.brokenLinks.length} битых ссылок и ${results.redirects.length} редиректов`,
      });
    } catch (error) {
      console.error("Ошибка анализа:", error);
      toast({
        title: "Ошибка анализа",
        description: "Произошла ошибка при анализе битых ссылок",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  // Фильтрация результатов
  const filteredBrokenLinks = filter
    ? brokenLinks.filter(link => 
        link.url.toLowerCase().includes(filter.toLowerCase()) || 
        link.fromPage.toLowerCase().includes(filter.toLowerCase()) ||
        link.linkText.toLowerCase().includes(filter.toLowerCase())
      )
    : brokenLinks;

  const filteredRedirects = filter
    ? redirects.filter(redirect =>
        redirect.url.toLowerCase().includes(filter.toLowerCase()) ||
        redirect.redirectsTo.toLowerCase().includes(filter.toLowerCase()) ||
        redirect.fromPage.toLowerCase().includes(filter.toLowerCase())
      )
    : redirects;

  // Экспорт в Excel
  const exportToExcel = () => {
    try {
      const brokenLinksWorksheet = XLSX.utils.json_to_sheet(brokenLinks.map(link => ({
        URL: link.url,
        'Статус код': link.statusCode,
        'Источник': link.fromPage,
        'Текст ссылки': link.linkText
      })));
      
      const redirectsWorksheet = XLSX.utils.json_to_sheet(redirects.map(redirect => ({
        URL: redirect.url,
        'Редирект на': redirect.redirectsTo,
        'Статус код': redirect.statusCode,
        'Источник': redirect.fromPage
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, brokenLinksWorksheet, 'Битые ссылки');
      XLSX.utils.book_append_sheet(workbook, redirectsWorksheet, 'Редиректы');
      
      XLSX.writeFile(workbook, `broken_links_${domainInput.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
      
      toast({
        title: "Экспорт выполнен",
        description: "Данные успешно экспортированы в Excel",
      });
    } catch (error) {
      console.error('Ошибка экспорта в Excel:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные в Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2Off className="h-5 w-5 text-destructive" />
                <CardTitle>Анализ битых ссылок и редиректов</CardTitle>
              </div>
              {(brokenLinks.length > 0 || redirects.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={exportToExcel}
                >
                  <Download className="h-4 w-4" />
                  Экспорт в Excel
                </Button>
              )}
            </div>
            <CardDescription>
              Выявляет неработающие ссылки и перенаправления, помогая улучшить навигацию и пользовательский опыт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <Input
                  type="text"
                  placeholder="Введите домен (например, example.com)"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                onClick={analyzeBrokenLinks}
                disabled={isAnalyzing || !domainInput}
                className="gap-1"
              >
                {isAnalyzing ? 'Анализ...' : 'Проверить ссылки'}
                {!isAnalyzing && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Проверка ссылок...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {(brokenLinks.length > 0 || redirects.length > 0) && (
              <div className="mt-6">
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Фильтр результатов..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <Tabs defaultValue="broken">
                  <TabsList className="mb-4">
                    <TabsTrigger value="broken" className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Битые ссылки ({brokenLinks.length})
                    </TabsTrigger>
                    <TabsTrigger value="redirects" className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Редиректы ({redirects.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="broken">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Страница источник</TableHead>
                            <TableHead>Текст ссылки</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBrokenLinks.length > 0 ? (
                            filteredBrokenLinks.map((link, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium max-w-xs truncate">
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-destructive hover:underline flex items-center"
                                  >
                                    {link.url}
                                    <ExternalLink className="h-3 w-3 ml-1 inline" />
                                  </a>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="destructive">
                                    {link.statusCode || 'Недоступен'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  <a 
                                    href={link.fromPage}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                  >
                                    {link.fromPage}
                                  </a>
                                </TableCell>
                                <TableCell>{link.linkText || 'Нет текста'}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6">
                                {filter 
                                  ? 'Нет результатов по вашему фильтру' 
                                  : 'Битые ссылки не найдены'
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="redirects">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Редирект на</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Страница источник</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRedirects.length > 0 ? (
                            filteredRedirects.map((redirect, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium max-w-xs truncate">
                                  <a 
                                    href={redirect.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="hover:underline flex items-center"
                                  >
                                    {redirect.url}
                                    <ExternalLink className="h-3 w-3 ml-1 inline" />
                                  </a>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  <a 
                                    href={redirect.redirectsTo} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-primary hover:underline flex items-center"
                                  >
                                    {redirect.redirectsTo}
                                    <ExternalLink className="h-3 w-3 ml-1 inline" />
                                  </a>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {redirect.statusCode}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  <a 
                                    href={redirect.fromPage}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                  >
                                    {redirect.fromPage}
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6">
                                {filter 
                                  ? 'Нет результатов по вашему фильтру' 
                                  : 'Редиректы не найдены'
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!isAnalyzing && brokenLinks.length === 0 && redirects.length === 0 && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Link2Off className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-muted-foreground mb-4">
                    Введите домен и запустите проверку, чтобы найти битые ссылки и редиректы на вашем сайте
                  </p>
                  <Button 
                    variant="default" 
                    onClick={analyzeBrokenLinks}
                    disabled={!domainInput}
                  >
                    Запустить проверку
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
