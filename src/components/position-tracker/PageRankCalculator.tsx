import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, Download, Network, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PageRankCalculatorProps {
  domain?: string;
  className?: string;
}

interface PageData {
  url: string;
  title: string;
  pageRank: number;
  incomingLinks: number;
  outgoingLinks: number;
}

export function PageRankCalculator({ domain, className = '' }: PageRankCalculatorProps) {
  const [domainInput, setDomainInput] = useState(domain || '');
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageRankData, setPageRankData] = useState<PageData[]>([]);
  const [dampingFactor, setDampingFactor] = useState(0.85);
  const [iterations, setIterations] = useState(10);
  const { toast } = useToast();

  // Функция расчета PageRank
  const calculatePageRank = async () => {
    if (!domainInput) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите домен для анализа",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    setProgress(0);
    setPageRankData([]);

    try {
      // В реальном приложении здесь был бы вызов API для расчета PageRank
      // Для демонстрации генерируем искусственные данные
      await simulatePageRankCalculation();
      
      toast({
        title: "Расчет завершен",
        description: "PageRank успешно рассчитан для всех страниц",
      });
    } catch (error) {
      console.error("Ошибка расчета:", error);
      toast({
        title: "Ошибка расчета",
        description: "Произошла ошибка при расчете PageRank",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
      setProgress(100);
    }
  };

  // Симуляция расчета для демонстрации
  const simulatePageRankCalculation = async () => {
    const pageTypes = ['home', 'about', 'services', 'products', 'blog', 'contact', 'support'];
    const pageData: PageData[] = [];
    const totalPages = 20;
    
    for (let i = 0; i < totalPages; i++) {
      setProgress(Math.min(100, Math.round((i / totalPages) * 100)));
      
      // Обработка каждые 5% для визуализации прогресса
      if (i % Math.max(1, Math.round(totalPages * 0.05)) === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const pageType = pageTypes[Math.floor(Math.random() * pageTypes.length)];
      const isHomepage = i === 0;
      const url = isHomepage 
        ? `https://${domainInput}/` 
        : `https://${domainInput}/${pageType}/${i}/`;
      
      const incomingLinks = isHomepage 
        ? Math.floor(Math.random() * 15) + 10 
        : Math.floor(Math.random() * 8) + 1;
      
      const outgoingLinks = Math.floor(Math.random() * 10) + 1;
      
      // Начальное значение PageRank
      let pageRank = isHomepage ? 10 : 1;
      
      // Симуляция итер��ционного расчета PageRank
      for (let iter = 0; iter < iterations; iter++) {
        // Формула PageRank: PR(A) = (1-d) + d * (PR(T1)/C(T1) + ... + PR(Tn)/C(Tn))
        const contributingFactor = incomingLinks ? (outgoingLinks / incomingLinks) : 0;
        pageRank = (1 - dampingFactor) + dampingFactor * contributingFactor * pageRank;
      }
      
      // Normalize PageRank для визуализации
      pageRank = Math.max(1, Math.min(100, pageRank * 10));
      
      pageData.push({
        url,
        title: isHomepage 
          ? `${domainInput} - Главная страница` 
          : `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} ${i} - ${domainInput}`,
        pageRank,
        incomingLinks,
        outgoingLinks
      });
    }
    
    // Сортируем по PageRank
    pageData.sort((a, b) => b.pageRank - a.pageRank);
    setPageRankData(pageData);
  };

  // Экспорт в Excel
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(pageRankData.map(page => ({
        URL: page.url,
        'Заголовок': page.title,
        'PageRank': page.pageRank.toFixed(2),
        'Входящие ссылки': page.incomingLinks,
        'Исходящие ссылки': page.outgoingLinks
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'PageRank');
      
      XLSX.writeFile(workbook, `pagerank_${domainInput.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
      
      toast({
        title: "Экспорт выполнен",
        description: "Данные PageRank успешно экспортированы в Excel",
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

  // Подготовка данных для графика
  const prepareChartData = () => {
    return pageRankData.slice(0, 10).map(page => ({
      name: page.url.replace(`https://${domainInput}/`, '/').replace(`https://${domainInput}`, '/'),
      pageRank: page.pageRank,
      incomingLinks: page.incomingLinks,
      outgoingLinks: page.outgoingLinks
    }));
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
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Расчет внутреннего PageRank</CardTitle>
              </div>
              {pageRankData.length > 0 && (
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
              Вычисляет внутренний вес страниц, помогая определить их значимость внутри сайта
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
                  disabled={isCalculating}
                />
              </div>
              <Button 
                onClick={calculatePageRank}
                disabled={isCalculating || !domainInput}
                className="gap-1"
              >
                {isCalculating ? 'Расчет...' : 'Рассчитать PageRank'}
                {!isCalculating && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {!isCalculating && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">Коэффициент затухания: {dampingFactor.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[dampingFactor * 100]}
                    min={10}
                    max={99}
                    step={1}
                    onValueChange={(values) => setDampingFactor(values[0] / 100)}
                    disabled={isCalculating}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Определяет вероятность перехода пользователя по ссылке (обычно 0.85)
                  </p>
                </div>
                
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">Количество итераций: {iterations}</span>
                  </div>
                  <Slider
                    value={[iterations]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(values) => setIterations(values[0])}
                    disabled={isCalculating}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Количество прогонов алгоритма для достижения сходимости
                  </p>
                </div>
              </div>
            )}

            {isCalculating && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Расчет PageRank...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {pageRankData.length > 0 && (
              <div className="mt-6">
                <Tabs defaultValue="chart">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart" className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      График PageRank
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-1">
                      <Network className="h-4 w-4" />
                      Таблица страниц
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2">Топ 10 страниц по PageRank</h3>
                          <p className="text-sm text-muted-foreground">
                            Страницы с высоким PageRank имеют большее количество входящих ссылок и большую важность для сайта.
                          </p>
                        </div>
                        
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={prepareChartData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                height={70}
                                tick={{ fontSize: 10 }}
                              />
                              <YAxis label={{ value: 'PageRank', angle: -90, position: 'insideLeft' }} />
                              <Tooltip 
                                formatter={(value, name, props) => {
                                  if (name === 'pageRank' && typeof value === 'number') {
                                    return [`${value.toFixed(2)}`, 'PageRank'];
                                  }
                                  return [value, name];
                                }}
                                wrapperStyle={{ zIndex: 1000 }}
                              />
                              <Bar dataKey="pageRank" fill="#8884d8" name="PageRank" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 bg-muted/30 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Информация о расчете:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Коэффициент затухания: {dampingFactor.toFixed(2)}</li>
                            <li>• Количество итераций: {iterations}</li>
                            <li>• Количество проанализированных страниц: {pageRankData.length}</li>
                            <li>• Средний PageRank: {(pageRankData.reduce((sum, page) => sum + page.pageRank, 0) / pageRankData.length).toFixed(2)}</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="table">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Заголовок</TableHead>
                            <TableHead className="text-center">PageRank</TableHead>
                            <TableHead className="text-center">Вх. ссылки</TableHead>
                            <TableHead className="text-center">Исх. ссылки</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageRankData.map((page, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium max-w-xs truncate">
                                <a 
                                  href={page.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="hover:underline text-primary"
                                >
                                  {page.url}
                                </a>
                              </TableCell>
                              <TableCell>{page.title}</TableCell>
                              <TableCell className="text-center font-medium">
                                {page.pageRank.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">{page.incomingLinks}</TableCell>
                              <TableCell className="text-center">{page.outgoingLinks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!isCalculating && pageRankData.length === 0 && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-muted-foreground mb-4">
                    Введите домен и запустите расчет, чтобы определить PageRank страниц вашего сайта
                  </p>
                  <Button 
                    variant="default" 
                    onClick={calculatePageRank}
                    disabled={!domainInput}
                  >
                    Запустить расчет
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
