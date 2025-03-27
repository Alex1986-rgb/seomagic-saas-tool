
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CopyX, FileSearch, Download, ArrowRight, FileText, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { detectDuplicates, type DuplicatePage, type DuplicateMetaTag } from '@/services/audit/siteAnalysis';
import * as XLSX from 'xlsx';

interface DuplicatesDetectorProps {
  domain?: string;
  urls?: string[];
  className?: string;
}

export function DuplicatesDetector({ domain, urls = [], className = '' }: DuplicatesDetectorProps) {
  const [domainInput, setDomainInput] = useState(domain || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicatePages, setDuplicatePages] = useState<DuplicatePage[]>([]);
  const [duplicateMeta, setDuplicateMeta] = useState<DuplicateMetaTag[]>([]);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  // Функция анализа дубликатов
  const analyzeDuplicates = async () => {
    if (!domainInput && urls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите домен для анализа или предоставьте список URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setDuplicatePages([]);
    setDuplicateMeta([]);

    try {
      // Если URLs не переданы, используем тестовые данные для демонстрации
      let pagesToCheck = urls;
      
      if (pagesToCheck.length === 0) {
        // В реальном приложении здесь должно быть получение списка URL
        // Для демонстрации используем искусственные данные
        const domain = domainInput.startsWith('http') ? domainInput : `https://${domainInput}`;
        pagesToCheck = [
          domain,
          `${domain}/about`,
          `${domain}/products`,
          `${domain}/products/1`,
          `${domain}/products/2`,
          `${domain}/blog`,
          `${domain}/contact`,
        ];
        
        toast({
          title: "Ссылки получены",
          description: `Найдено ${pagesToCheck.length} ссылок для проверки`,
        });
      }
      
      // Запускаем анализ дубликатов
      const results = await detectDuplicates(
        pagesToCheck,
        (current, total) => {
          const progressPercent = Math.round((current / total) * 100);
          setProgress(progressPercent);
        }
      );
      
      setDuplicatePages(results.duplicatePages);
      setDuplicateMeta(results.duplicateMeta);
      
      toast({
        title: "Анализ завершен",
        description: `Найдено ${results.duplicatePages.length} дублирующихся страниц и ${results.duplicateMeta.length} дублирующихся мета-тегов`,
      });
    } catch (error) {
      console.error("Ошибка анализа:", error);
      toast({
        title: "Ошибка анализа",
        description: "Произошла ошибка при анализе дубликатов",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  // Фильтрация результатов
  const filteredDuplicatePages = filter
    ? duplicatePages.filter(page => 
        page.urls.some(url => url.toLowerCase().includes(filter.toLowerCase())) || 
        page.title.toLowerCase().includes(filter.toLowerCase())
      )
    : duplicatePages;

  const filteredDuplicateMeta = filter
    ? duplicateMeta.filter(meta => 
        meta.tag.toLowerCase().includes(filter.toLowerCase()) || 
        meta.value.toLowerCase().includes(filter.toLowerCase()) ||
        meta.pages.some(page => page.toLowerCase().includes(filter.toLowerCase()))
      )
    : duplicateMeta;

  // Экспорт в Excel
  const exportToExcel = () => {
    try {
      // Подготавливаем данные о дублирующихся страницах
      const duplicatePagesData = duplicatePages.flatMap(page => 
        page.urls.map((url, index) => ({
          'Группа': `Группа ${page.contentHash.substring(0, 6)}`,
          'URL': url,
          'Заголовок': page.title,
          'Размер контента': page.contentLength,
          'Дубликат с': index === 0 ? '' : page.urls[0]
        }))
      );
      
      // Подготавливаем данные о дублирующихся мета-тегах
      const duplicateMetaData = duplicateMeta.flatMap(meta => 
        meta.pages.map((page, index) => ({
          'Тип мета-тега': meta.tag,
          'Значение': meta.value,
          'URL': page,
          'Дубликат с': index === 0 ? '' : meta.pages[0]
        }))
      );
      
      const pagesWorksheet = XLSX.utils.json_to_sheet(duplicatePagesData);
      const metaWorksheet = XLSX.utils.json_to_sheet(duplicateMetaData);
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, pagesWorksheet, 'Дубликаты страниц');
      XLSX.utils.book_append_sheet(workbook, metaWorksheet, 'Дубликаты мета-тегов');
      
      XLSX.writeFile(workbook, `duplicates_${domainInput.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
      
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
                <CopyX className="h-5 w-5 text-amber-500" />
                <CardTitle>Обнаружение дубликатов</CardTitle>
              </div>
              {(duplicatePages.length > 0 || duplicateMeta.length > 0) && (
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
              Находит повторяющиеся страницы, мета-теги и заголовки, что способствует устранению избыточного контента
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
                onClick={analyzeDuplicates}
                disabled={isAnalyzing || (!domainInput && urls.length === 0)}
                className="gap-1"
              >
                {isAnalyzing ? 'Анализ...' : 'Найти дубликаты'}
                {!isAnalyzing && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Анализ страниц...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {(duplicatePages.length > 0 || duplicateMeta.length > 0) && (
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

                <Tabs defaultValue="pages">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pages" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Дубликаты страниц ({duplicatePages.length})
                    </TabsTrigger>
                    <TabsTrigger value="meta" className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Дубликаты мета-тегов ({duplicateMeta.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pages">
                    {filteredDuplicatePages.length > 0 ? (
                      <Accordion type="single" collapsible className="border rounded-md">
                        {filteredDuplicatePages.map((group, index) => (
                          <AccordionItem 
                            value={`item-${index}`} 
                            key={index}
                            className="border-b last:border-b-0"
                          >
                            <AccordionTrigger className="px-4 py-2 hover:bg-muted/30">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="mr-2">
                                  {group.urls.length} URL
                                </Badge>
                                <span className="font-medium truncate max-w-md">
                                  {group.title || 'Без заголовка'}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <div>Контент: {group.contentLength} символов</div>
                                  <div>ID группы: {group.contentHash.substring(0, 8)}</div>
                                </div>
                                
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <h4 className="font-medium mb-2">URL-адреса с одинаковым контентом:</h4>
                                  <ul className="space-y-2">
                                    {group.urls.map((url, urlIndex) => (
                                      <li key={urlIndex} className="flex items-start gap-2 text-sm">
                                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs mt-0.5">
                                          {urlIndex + 1}
                                        </span>
                                        <a 
                                          href={url} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="text-primary hover:underline truncate"
                                        >
                                          {url}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="text-sm mt-3">
                                  <span className="font-medium">Рекомендация: </span>
                                  Установите каноническую ссылку (rel="canonical") на основной URL или объедините страницы с похожим контентом.
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <Card className="bg-muted/50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10">
                          <FileSearch className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="text-center text-muted-foreground">
                            {filter 
                              ? 'Нет результатов по вашему фильтру' 
                              : 'Дублирующиеся страницы не найдены'
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="meta">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Мета-тег</TableHead>
                            <TableHead>Значение</TableHead>
                            <TableHead>Страницы</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDuplicateMeta.length > 0 ? (
                            filteredDuplicateMeta.map((meta, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <Badge variant="outline">
                                    {meta.tag === 'title' ? 'Заголовок (title)' : meta.tag}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  <div className="bg-muted/30 p-2 rounded text-sm">
                                    {meta.value}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1.5">
                                    {meta.pages.map((page, pageIndex) => (
                                      <a 
                                        key={pageIndex}
                                        href={page} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-sm hover:underline flex items-center truncate max-w-xs"
                                      >
                                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs mr-1.5">
                                          {pageIndex + 1}
                                        </span>
                                        {page}
                                      </a>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-6">
                                {filter 
                                  ? 'Нет результатов по вашему фильтру' 
                                  : 'Дублирующиеся мета-теги не найдены'
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

            {!isAnalyzing && duplicatePages.length === 0 && duplicateMeta.length === 0 && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CopyX className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-muted-foreground mb-4">
                    Введите домен и запустите анализ, чтобы найти дублирующиеся страницы и мета-теги на вашем сайте
                  </p>
                  <Button 
                    variant="default" 
                    onClick={analyzeDuplicates}
                    disabled={!domainInput && urls.length === 0}
                  >
                    Запустить анализ
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
