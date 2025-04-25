
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, AlertTriangle } from 'lucide-react';
import { checkPositions, PositionData } from '@/services/position/positionTracker';
import { useProxyManager } from '@/hooks/use-proxy-manager';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';

interface PositionMonitorProps {
  domain: string;
  keywords: string[];
  searchEngine?: string;
  region?: string;
  initialData?: PositionData;
  scanInterval?: number; // в минутах
}

export const PositionMonitor: React.FC<PositionMonitorProps> = ({
  domain,
  keywords,
  searchEngine = 'google',
  region = 'ru',
  initialData,
  scanInterval = 60
}) => {
  const [data, setData] = useState<PositionData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [nextScanTime, setNextScanTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { activeProxies, proxyManager } = useProxyManager();
  const { toast } = useToast();
  const isMobile = useMobile();
  
  // Загружаем настройки при монтировании
  useEffect(() => {
    const savedSettings = localStorage.getItem('position_tracker_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const interval = settings.checkInterval || 60;
        scanInterval = interval;
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    }
  }, []);
  
  // Эффект для авто-обновления
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoRefresh && nextScanTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = nextScanTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          clearInterval(timer);
          checkPositionsData();
          return;
        }
        
        // Форматирование оставшегося времени
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}м ${seconds}с`);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh, nextScanTime]);
  
  // Функция проверки позиций
  const checkPositionsData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const useProxy = activeProxies.length > 0;
      
      const results = await checkPositions({
        domain,
        keywords,
        searchEngine,
        region,
        depth: 100,
        scanFrequency: 'once',
        useProxy
      });
      
      setData(results);
      
      // Если включено авто-обновление, устанавливаем время следующего сканирования
      if (autoRefresh) {
        const nextTime = new Date();
        nextTime.setMinutes(nextTime.getMinutes() + scanInterval);
        setNextScanTime(nextTime);
        
        toast({
          title: "Позиции обновлены",
          description: `Следующее обновление в ${nextTime.toLocaleTimeString()}`,
        });
      } else {
        toast({
          title: "Позиции обновлены",
          description: `Проверено ${keywords.length} ключевых слов`,
        });
      }
    } catch (error) {
      console.error('Ошибка проверки позиций:', error);
      toast({
        title: "Ошибка проверки позиций",
        description: error instanceof Error ? error.message : "Произошла ошибка при проверке позиций",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Включение/выключение авто-обновления
  const toggleAutoRefresh = () => {
    if (!autoRefresh) {
      // Включаем авто-обновление
      const nextTime = new Date();
      nextTime.setMinutes(nextTime.getMinutes() + scanInterval);
      setNextScanTime(nextTime);
      setAutoRefresh(true);
      
      toast({
        title: "Автоматическое обновление включено",
        description: `Следующее обновление в ${nextTime.toLocaleTimeString()}`,
      });
    } else {
      // Выключаем авто-обновление
      setAutoRefresh(false);
      setNextScanTime(null);
      setTimeRemaining('');
      
      toast({
        title: "Автоматическое обновление выключено",
        description: "Обновление позиций остановлено",
      });
    }
  };
  
  // Получение списка ключевых слов, отсортированных по позиции
  const getSortedKeywords = () => {
    if (!data) return [];
    return [...data.keywords].sort((a, b) => a.position - b.position);
  };
  
  // Получение количества запросов в топ-10, топ-30 и т.д.
  const getPositionStats = () => {
    if (!data) return { top10: 0, top30: 0, top100: 0, notFound: 0 };
    
    let top10 = 0;
    let top30 = 0;
    let top100 = 0;
    let notFound = 0;
    
    data.keywords.forEach(kw => {
      if (kw.position === 0) {
        notFound++;
      } else if (kw.position <= 10) {
        top10++;
        top30++;
        top100++;
      } else if (kw.position <= 30) {
        top30++;
        top100++;
      } else if (kw.position <= 100) {
        top100++;
      }
    });
    
    return { top10, top30, top100, notFound };
  };
  
  const stats = getPositionStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{domain}</h3>
          <p className="text-sm text-muted-foreground">{data?.searchEngine} • {data?.region || region}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeProxies.length > 0 ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
              <Shield className="h-3 w-3" /> 
              {isMobile ? '' : 'Прокси: '}
              {activeProxies.length}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Нет прокси
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size={isMobile ? "icon" : "default"}
            onClick={toggleAutoRefresh}
          >
            <Bell className={`h-4 w-4 ${autoRefresh ? 'text-primary' : ''} ${!isMobile && 'mr-2'}`} />
            {!isMobile && (autoRefresh ? 'Авто: Вкл' : 'Авто: Выкл')}
          </Button>
          
          <Button 
            onClick={checkPositionsData} 
            disabled={isLoading}
            size={isMobile ? "sm" : "default"}
          >
            {isLoading ? "Проверка..." : "Обновить"}
          </Button>
        </div>
      </div>
      
      {autoRefresh && nextScanTime && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span>Следующее обновление через: {timeRemaining}</span>
            <span>{new Date().toLocaleTimeString()} → {nextScanTime.toLocaleTimeString()}</span>
          </div>
          <Progress 
            value={((scanInterval * 60) - (nextScanTime.getTime() - new Date().getTime()) / 1000) / (scanInterval * 60 / 100)} 
          />
        </div>
      )}
      
      {isLoading && !data && (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Проверка позиций сайта...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {data && (
        <Tabs defaultValue="positions">
          <TabsList className="mb-4">
            <TabsTrigger value="positions">Позиции</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positions">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Проверенные ключевые слова</CardTitle>
                <CardDescription>
                  {data.keywords.length} ключевых слов проверено
                  {data.proxyUsed && ` с использованием прокси`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ключевое слово</TableHead>
                      <TableHead className="text-center">Позиция</TableHead>
                      {!isMobile && <TableHead>URL</TableHead>}
                      {!isMobile && <TableHead>Поисковик</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedKeywords().map((kw, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell className="text-center">
                          {kw.position > 0 ? (
                            <Badge 
                              variant="outline" 
                              className={
                                kw.position <= 3
                                  ? "bg-green-100 text-green-800"
                                  : kw.position <= 10
                                    ? "bg-green-50 text-green-700"
                                    : kw.position <= 30
                                      ? "bg-yellow-50 text-yellow-700"
                                      : "bg-gray-50 text-gray-700"
                              }
                            >
                              {kw.position}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              не найден
                            </Badge>
                          )}
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {kw.url || '-'}
                            </div>
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell>{kw.searchEngine}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ТОП-10</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.top10}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.keywords.length > 0 && `${Math.round(stats.top10/data.keywords.length*100)}%`}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ТОП-30</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.top30}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.keywords.length > 0 && `${Math.round(stats.top30/data.keywords.length*100)}%`}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ТОП-100</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.top100}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.keywords.length > 0 && `${Math.round(stats.top100/data.keywords.length*100)}%`}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Не найдено</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.notFound}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.keywords.length > 0 && `${Math.round(stats.notFound/data.keywords.length*100)}%`}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Информация о проверке</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Дата проверки</div>
                    <div>{new Date(data.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Использование прокси</div>
                    <div>{data.useProxy ? 'Да' : 'Нет'}</div>
                  </div>
                  {data.useProxy && data.proxyUsed && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Использованный прокси</div>
                      <div>{data.proxyUsed}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Поисковая система</div>
                    <div>{data.searchEngine}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Регион</div>
                    <div>{data.region || region}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Глубина проверки</div>
                    <div>{data.depth} позиций</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PositionMonitor;
