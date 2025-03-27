
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { analyzeContentUniqueness, type PageContent, type ContentAnalysisResult } from '@/services/audit/siteAnalysis';
import * as XLSX from 'xlsx';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ContentUniquenessCheckerProps {
  domain?: string;
  urls?: string[];
  className?: string;
}

export function ContentUniquenessChecker({ domain, urls = [], className = '' }: ContentUniquenessCheckerProps) {
  const [domainInput, setDomainInput] = useState(domain || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ContentAnalysisResult | null>(null);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  // Функция анализа уникальности контента
  const analyzeUniqueness = async () => {
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
    setAnalysisResult(null);

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
      
      // Запускаем анализ уникальности
      const result = await analyzeContentUniqueness(
        pagesToCheck,
        (current, total) => {
          const progressPercent = Math.round((current / total) * 100);
          setProgress(progressPercent);
        }
      );
      
      setAnalysisResult(result);
      
      toast({
        title: "Анализ завершен",
        description: `Проанализировано ${result.pageContents.length} страниц, уникальность: ${result.overallUniqueness.toFixed(1)}%`,
      });
    } catch (error) {
      console.error("Ошибка анализа:", error);
      toast({
        title: "Ошибка анализа",
        description: "Произошла ошибка при анализе уникальности контента",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  // Фильтрация результатов
  const filteredPages = analysisResult?.pageContents
    ? analysisResult.pageContents.filter(page => 
        page.url.toLowerCase().includes(filter.toLowerCase()) || 
        page.title.toLowerCase().includes(filter.toLowerCase()) ||
        page.content.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  // Подготовка данных для круговой диаграммы
  const preparePieChartData = () => {
    if (!analysisResult) return [];
    
    const uniquePages = analysisResult.uniquePages;
    const duplicatePages = analysisResult.pageContents.length - uniquePages;
    
    return [
      { name: 'Уникальные страницы', value: uniquePages },
      { name: 'Страницы с дублирующимся контентом', value: duplicatePages }
    ];
  };

  // Цвета для диаграммы
  const COLORS = ['#4caf50', '#ff9800'];

  // Экспорт в Excel
  const exportToExcel = () => {
    if (!analysisResult) return;
    
    try {
      // Подготавливаем данные о страницах
      const pagesData = analysisResult.pageContents.map(page => ({
        'URL': page.url,
        'Заголовок': page.title,
        'Уникальность (%)': (page.uniquenessScore).toFixed(1),
        'Хеш контента': page.contentHash,
        'Длина контента': page.content.length
      }));
      
      // Подготавливаем данные о дубликатах
      const duplicatesData = analysisResult.duplicatePages.flatMap(group => 
        group.urls.map((url, index) => ({
          'Группа дубликатов': `Группа ${group.contentHash.substring(0, 6)}`,
          'URL': url,
          'Заголовок': group.title,
          'Длина контента': group.contentLength,
          'Дубликат с': index === 0 ? '' : group.urls[0]
        }))
      );
      
      const pagesWorksheet = XLSX.utils.json_to_sheet(pagesData);
      const duplicatesWorksheet = XLSX.utils.json_to_sheet(duplicatesData);
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, pagesWorksheet, 'Уникальность страниц');
      XLSX.utils.book_append_sheet(workbook, duplicatesWorksheet, 'Дубликаты');
      
      XLSX.writeFile(workbook, `content_uniqueness_${domainInput.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
      
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

  // Получение класса для индикатора уникальности
  const getUniquenessClass = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-lime-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  // Получение иконки для уникальности
  const getUniquenessIcon = (score: number) => {
    if (score >= 70) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-red-500" />;
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
                <FileText className="h-5 w-5 text-blue-500" />
                <CardTitle>Проверка уникальности контента</CardTitle>
              </div>
              {analysisResult && (
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
              Ищет дубликаты страниц и проверяет тексты на уникальность внутри сайта
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
                onClick={analyzeUniqueness}
                disabled={isAnalyzing || (!domainInput && urls.length === 0)}
                className="gap-1"
              >
                {isAnalyzing ? 'Анализ...' : 'Проверить уникальность'}
                {!isAnalyzing && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Анализ контента страниц...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {analysisResult && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Общая уникальность</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getUniquenessClass(analysisResult.overallUniqueness)}`}>
                        {analysisResult.overallUniqueness.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">всего контента</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Уникальные страницы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">
                        {analysisResult.uniquePages} из {analysisResult.pageContents.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {((analysisResult.uniquePages / analysisResult.pageContents.length) * 100).toFixed(1)}% страниц
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Группы дубликатов</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-500">
                        {analysisResult.duplicatePages.length}
                      </div>
                      <p className="text-xs text-muted-foreground">обнаружено</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Распределение уникальности</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={preparePieChartData()}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                >
                                  {preparePieChartData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} стр.`, 'Количество']} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Рекомендации</h3>
                          <div className="bg-muted/30 p-4 rounded-md">
                            <ul className="space-y-3 text-sm">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                <span>Используйте уникальные мета-теги для каждой страницы</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                <span>Устраните дублирующийся контент с помощью канонических URL</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                <span>Создавайте оригинальный контент для каждой страницы</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                <span>Проверьте группы дубликатов и решите, какие страницы следует объединить</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                                <span>Страницы с уникальностью ниже 70% требуют доработки</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="pages">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pages" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Уникальность страниц
                    </TabsTrigger>
                    <TabsTrigger value="duplicates" className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Группы дубликатов ({analysisResult.duplicatePages.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pages">
                    <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Фильтр по URL, заголовку или содержимому..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-md"
                      />
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Заголовок</TableHead>
                            <TableHead className="text-center">Уникальность</TableHead>
                            <TableHead>Фрагмент контента</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPages.length > 0 ? (
                            filteredPages.map((page, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium max-w-xs truncate">
                                  <a 
                                    href={page.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {page.url}
                                  </a>
                                </TableCell>
                                <TableCell>{page.title}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    {getUniquenessIcon(page.uniquenessScore)}
                                    <Badge 
                                      variant={page.uniquenessScore >= 70 ? "default" : "outline"}
                                      className={page.uniquenessScore >= 70 ? "" : "text-red-500"}
                                    >
                                      {page.uniquenessScore.toFixed(1)}%
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-sm truncate text-sm">
                                  <div className="bg-muted/30 p-2 rounded">
                                    {page.content.substring(0, 100)}...
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6">
                                {filter 
                                  ? 'Нет результатов по вашему фильтру' 
                                  : 'Нет данных об уникальности страниц'
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="duplicates">
                    {analysisResult.duplicatePages.length > 0 ? (
                      <Accordion type="single" collapsible className="border rounded-md">
                        {analysisResult.duplicatePages.map((group, index) => (
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
                                
                                <div className="text-sm">
                                  <span className="font-medium">Рекомендация: </span>
                                  Установите canonical URL для всех страниц этой группы, указывающий на основную версию, или создайте уникальный контент для каждой страницы.
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <Card className="bg-muted/50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10">
                          <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
                          <p className="text-center text-muted-foreground">
                            Дублирующиеся страницы не найдены. Весь контент уникален!
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-muted-foreground mb-4">
                    Введите домен и запустите анализ, чтобы проверить уникальность контента на вашем сайте
                  </p>
                  <Button 
                    variant="default" 
                    onClick={analyzeUniqueness}
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
