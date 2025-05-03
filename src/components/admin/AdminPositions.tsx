import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Search, Users, Download, ArrowDown, ArrowUp, History, FileText, Webhook, Link2Off, CopyX, FolderTree } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BrokenLinksAnalyzer, 
  DuplicatesDetector,
  SiteStructureVisualization,
  ContentUniquenessChecker
} from '@/components/position-tracker';
import { PositionData, checkPositions } from '@/services/position/positionTracker';
import { getPositionHistory, getHistoricalData } from '@/services/position/positionHistory';
import { exportHistoryToExcel } from '@/services/position/exportService';
import { useProxyManager } from '@/hooks/use-proxy-manager';

const AdminPositions: React.FC = () => {
  const [history, setHistory] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isCheckingPositions, setIsCheckingPositions] = useState(false);
  const [domainToCheck, setDomainToCheck] = useState('');
  const [keywords, setKeywords] = useState<string[]>(['seo', 'позиции сайта', 'проверка позиций']);
  const [bulkKeywordsInput, setBulkKeywordsInput] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);
  const { toast } = useToast();
  const { getRandomActiveProxy, activeProxies, isLoading: isProxyLoading } = useProxyManager();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getPositionHistory();
      setHistory(data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось загрузить историю проверок позиций",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Функция проверки позиций
  const handleCheckPositions = async () => {
    if (!domainToCheck) {
      toast({
        title: "Введите домен",
        description: "Для проверки позиций необходимо указать домен",
        variant: "destructive"
      });
      return;
    }

    if (keywords.length === 0) {
      toast({
        title: "Добавьте ключевые слова",
        description: "Для проверки позиций необходимо указать хотя бы одно ключевое слово",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCheckingPositions(true);

      // Check if we have active proxies
      const hasActiveProxies = activeProxies.length > 0;
      if (!hasActiveProxies) {
        toast({
          title: "Внимание",
          description: "Нет активных прокси. Проверка может быть мене�� точной или заблокирована поисковыми системами.",
          variant: "default",
        });
      }

      console.log(`Начало проверки позиций для домена ${domainToCheck} с ${keywords.length} ключевыми словами`);
      console.log(`Использование прокси: ${hasActiveProxies ? 'Да' : 'Нет'}`);

      const results = await checkPositions({
        domain: domainToCheck,
        keywords,
        searchEngine: 'all', // Check all search engines
        depth: 100,
        scanFrequency: 'daily',
        useProxy: hasActiveProxies
      });

      console.log(`Проверка позиций завершена. Получены результаты для ${results.keywords.length} ключевых слов`);

      toast({
        title: "Проверка завершена",
        description: `Проверено ${keywords.length} ключевых слов для домена ${domainToCheck}`,
      });

      // Refresh history to show new results
      loadHistory();
      
    } catch (error) {
      console.error('Ошибка при проверке позиций:', error);
      toast({
        title: "Ошибка проверки позиций",
        description: error instanceof Error ? error.message : "Не удалось выполнить проверку позиций",
        variant: "destructive",
      });
    } finally {
      setIsCheckingPositions(false);
    }
  };

  const getTopDomains = () => {
    const domains: Record<string, number> = {};
    history.forEach(item => {
      if (!domains[item.domain]) {
        domains[item.domain] = 0;
      }
      domains[item.domain]++;
    });
    
    return Object.entries(domains)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getSearchEngineDistribution = () => {
    const engines: Record<string, number> = { google: 0, yandex: 0, mailru: 0 };
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        if (typeof engines[keyword.searchEngine as keyof typeof engines] === 'number') {
          engines[keyword.searchEngine as keyof typeof engines]++;
          total++;
        }
      });
    });
    
    return Object.entries(engines).map(([engine, count]) => ({
      engine: engine === 'google' ? 'Google' : engine === 'yandex' ? 'Яндекс' : 'Mail.ru',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  };

  const getTotalChecksByDay = () => {
    const checksByDay: Record<string, number> = {};
    
    history.forEach(item => {
      const date = new Date(item.timestamp).toISOString().split('T')[0];
      if (!checksByDay[date]) {
        checksByDay[date] = 0;
      }
      checksByDay[date]++;
    });
    
    return Object.entries(checksByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);
  };

  const getPositionAnalytics = () => {
    const topPositions = { top3: 0, top10: 0, top30: 0, beyond: 0, notFound: 0 };
    let total = 0;
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        total++;
        if (keyword.position === 0) {
          topPositions.notFound++;
        } else if (keyword.position <= 3) {
          topPositions.top3++;
        } else if (keyword.position <= 10) {
          topPositions.top10++;
        } else if (keyword.position <= 30) {
          topPositions.top30++;
        } else {
          topPositions.beyond++;
        }
      });
    });
    
    return [
      { name: 'ТОП 3', value: topPositions.top3, percentage: total > 0 ? Math.round((topPositions.top3 / total) * 100) : 0 },
      { name: 'ТОП 4-10', value: topPositions.top10, percentage: total > 0 ? Math.round((topPositions.top10 / total) * 100) : 0 },
      { name: 'ТОП 11-30', value: topPositions.top30, percentage: total > 0 ? Math.round((topPositions.top30 / total) * 100) : 0 },
      { name: 'Ниже 30', value: topPositions.beyond, percentage: total > 0 ? Math.round((topPositions.beyond / total) * 100) : 0 },
      { name: 'Не найдено', value: topPositions.notFound, percentage: total > 0 ? Math.round((topPositions.notFound / total) * 100) : 0 },
    ];
  };

  const handleExportAll = () => {
    try {
      exportHistoryToExcel(history, `position_history_${new Date().toISOString().split('T')[0]}`);
      toast({
        title: "Экспорт выполнен",
        description: "История проверок успешно экспортирована в Excel",
      });
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      toast({
        title: "Ошибка экспорта",
        description: error instanceof Error ? error.message : "Не удалось экспортировать данные",
        variant: "destructive",
      });
    }
  };
  
  const handleCheckDomain = (domain: string) => {
    setDomainToCheck(domain);
    setSelectedDomain(domain);
    setActiveTab('positions');
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleBulkKeywordsAdd = () => {
    if (!bulkKeywordsInput.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ключевые слова",
        variant: "destructive",
      });
      return;
    }

    const lines = bulkKeywordsInput
      .split(/[\n,;]+/)
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    if (lines.length === 0) {
      toast({
        title: "Ошибка",
        description: "Не найдено ключевых слов для добавления",
        variant: "destructive",
      });
      return;
    }

    const uniqueKeywords = lines.filter(keyword => !keywords.includes(keyword));
    
    if (uniqueKeywords.length > 0) {
      setKeywords([...keywords, ...uniqueKeywords]);
      setBulkKeywordsInput("");
      toast({
        title: "Добавлено",
        description: `Добавлено ${uniqueKeywords.length} ключевых слов`,
      });
      setShowBulkInput(false);
    } else {
      toast({
        title: "Внимание",
        description: "Все указанные ключевые слова уже добавлены",
        variant: "default",
      });
    }
  };

  const topDomains = getTopDomains();
  const searchEngineData = getSearchEngineDistribution();
  const checksByDay = getTotalChecksByDay();
  const positionAnalytics = getPositionAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Аналитика проверок позиций</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExportAll}>
            <Download className="h-4 w-4" />
            Экспорт истории
          </Button>
          <Button variant="default" size="sm" className="gap-1" onClick={() => window.location.href = "/position-tracker"}>
            <Search className="h-4 w-4" />
            Проверить позиции
          </Button>
        </div>
      </div>

      {/* Proxy Status Alert */}
      {!isProxyLoading && activeProxies.length === 0 && (
        <Alert className="mb-4">
          <AlertDescription>
            Для более точной проверки позиций рекомендуется настроить прокси в разделе 
            <a href="/admin/proxies" className="text-primary hover:underline ml-1">
              управления прокси
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Position Check Panel */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Проверка позиций сайта</CardTitle>
          <CardDescription>
            Проверьте позиции вашего сайта в Google, Яндекс и Mail.ru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="domain-input">Домен для проверки</Label>
              <Input 
                id="domain-input"
                value={domainToCheck}
                onChange={(e) => setDomainToCheck(e.target.value)}
                placeholder="example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Ключевые слова</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowBulkInput(!showBulkInput)}
                  className="text-xs"
                >
                  {showBulkInput ? "Добавить по одному" : "Добавить списком"}
                </Button>
              </div>
              
              {!showBulkInput ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Добавить ключевое слово"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        addKeyword(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Добавить ключевое слово"]') as HTMLInputElement;
                      if (input && input.value) {
                        addKeyword(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Добавить
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Введите ключевые слова списком (разделяйте запятыми, точкой с запятой или новой строкой)"
                    value={bulkKeywordsInput}
                    onChange={(e) => setBulkKeywordsInput(e.target.value)}
                    rows={4}
                    className="min-h-[100px]"
                  />
                  <Button 
                    type="button" 
                    onClick={handleBulkKeywordsAdd}
                    className="w-full"
                  >
                    Добавить список ключевых слов
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="p-2">
                {keyword}
                <button 
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => removeKeyword(index)}
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
          
          <Button 
            className="mt-4 w-full" 
            onClick={handleCheckPositions}
            disabled={isCheckingPositions}
          >
            {isCheckingPositions ? 
              'Проверка позиций...' : 
              `Проверить позиции в поисковых системах ${activeProxies.length > 0 ? '(с использованием прокси)' : ''}`
            }
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего проверок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">За всё время</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Уникальных доменов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(history.map(item => item.domain)).size}
            </div>
            <p className="text-xs text-muted-foreground">Проверено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ключевых слов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {history.reduce((total, item) => total + item.keywords.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Всего проверено</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В ТОП-10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {history.reduce((total, item) => 
                total + item.keywords.filter(k => k.position > 0 && k.position <= 10).length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Позиций найдено</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Проверки по дням</CardTitle>
            <CardDescription>Количество запущенных проверок</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={checksByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} проверок`, 'Количество']} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение позиций</CardTitle>
            <CardDescription>Статистика найденных позиций</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionAnalytics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const payload = props?.payload;
                    if (payload && typeof payload.percentage === 'number') {
                      return [`${value} (${payload.percentage}%)`, payload.name as string];
                    }
                    return [value, name];
                  }} 
                />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            История проверок
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-1">
            <Webhook className="h-4 w-4" />
            Домены
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Позиции
          </TabsTrigger>
          <TabsTrigger value="linkAnalysis" className="flex items-center gap-1">
            <Link2Off className="h-4 w-4" />
            Анализ ссылок
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-1">
            <CopyX className="h-4 w-4" />
            Дубликаты
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center gap-1">
            <FolderTree className="h-4 w-4" />
            Структура сайта
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Домен</TableHead>
                    <TableHead>Дата проверки</TableHead>
                    <TableHead>Поисковая система</TableHead>
                    <TableHead className="text-center">Запросов</TableHead>
                    <TableHead className="text-center">ТОП-10</TableHead>
                    <TableHead className="text-center">Не найдено</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : history.length > 0 ? (
                    history.slice(0, 10).map((item, index) => {
                      const totalKeywords = item.keywords.length;
                      const inTop10 = item.keywords.filter(k => k.position > 0 && k.position <= 10).length;
                      const notFound = item.keywords.filter(k => k.position === 0).length;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.domain}</TableCell>
                          <TableCell>{new Date(item.timestamp).toLocaleString('ru-RU')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {item.searchEngine === 'google' ? 'Google' : 
                               item.searchEngine === 'yandex' ? 'Яндекс' : 
                               item.searchEngine === 'mailru' ? 'Mail.ru' : 
                               item.searchEngine === 'all' ? 'Все' : item.searchEngine}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{totalKeywords}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-green-500 font-medium">{inTop10}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({totalKeywords > 0 ? Math.round(inTop10/totalKeywords*100) : 0}%)
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-red-500 font-medium">{notFound}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({totalKeywords > 0 ? Math.round(notFound/totalKeywords*100) : 0}%)
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Нет данных по истории проверок
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Топ доменов по количеству проверок</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Домен</TableHead>
                    <TableHead>Количество проверок</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDomains.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.domain}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1" 
                            onClick={() => window.location.href = "/position-tracker"}
                          >
                            <Search className="h-4 w-4" />
                            Проверить
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleCheckDomain(item.domain)}
                          >
                            <Link2Off className="h-4 w-4" />
                            Анализ
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <ContentUniquenessChecker 
            domain={selectedDomain || ''} 
          />
        </TabsContent>

        <TabsContent value="linkAnalysis">
          <BrokenLinksAnalyzer 
            domain={selectedDomain || ''} 
          />
        </TabsContent>

        <TabsContent value="duplicates">
          <DuplicatesDetector
            domain={selectedDomain || ''}
          />
        </TabsContent>

        <TabsContent value="sitemap">
          {selectedDomain ? (
            <SiteStructureVisualization 
              domain={selectedDomain}
              className="mt-4"
            />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <FolderTree className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Выберите домен для визуализации структуры сайта
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {topDomains.slice(0, 5).map((item, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCheckDomain(item.domain)}
                    >
                      {item.domain}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPositions;
