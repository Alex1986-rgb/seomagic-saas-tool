
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Server, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Menu,
  Activity
} from "lucide-react";

interface SiteItem {
  id: string;
  url: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'error';
  startTime: string;
  endTime?: string;
  message?: string;
}

interface SystemResource {
  name: string;
  value: number;
  max: number;
  unit: string;
}

interface LogItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const mockSystemResources: SystemResource[] = [
  { name: 'CPU', value: 47, max: 100, unit: '%' },
  { name: 'RAM', value: 6.2, max: 16, unit: 'GB' },
  { name: 'Диск', value: 142, max: 500, unit: 'GB' },
  { name: 'Сеть', value: 28, max: 1000, unit: 'Mbps' }
];

// Создаем мок-данные для сайтов
const generateMockSites = (count: number): SiteItem[] => {
  return Array(count).fill(null).map((_, i) => {
    const status: SiteItem['status'] = 
      i % 10 === 0 ? 'error' :
      i < 3 ? 'completed' :
      i < 8 ? 'active' : 'pending';
    
    const progress = 
      status === 'completed' ? 100 :
      status === 'error' ? Math.floor(Math.random() * 90 + 5) :
      status === 'active' ? Math.floor(Math.random() * 90) :
      0;

    const startTime = new Date(Date.now() - Math.random() * 3600000 * 12).toISOString();
    const endTime = status === 'completed' || status === 'error' 
      ? new Date(new Date(startTime).getTime() + Math.random() * 3600000 * 2).toISOString()
      : undefined;
    
    const message = status === 'error' ? [
      'Ошибка соединения',
      'Превышен лимит запросов',
      'Ошибка парсинга данных',
      'Таймаут операции'
    ][Math.floor(Math.random() * 4)] : undefined;

    return {
      id: `site-${i}`,
      url: `https://example${i}.com`,
      progress,
      status,
      startTime,
      endTime,
      message
    };
  });
};

// Создаем мок-данные для логов
const generateMockLogs = (count: number): LogItem[] => {
  const messages = [
    { text: 'Запуск оптимизации сайта', type: 'info' },
    { text: 'Сайт успешно оптимизирован', type: 'success' },
    { text: 'Ошибка соединения с сайтом', type: 'error' },
    { text: 'Превышен лимит запросов к API', type: 'warning' },
    { text: 'Анализ структуры сайта', type: 'info' },
    { text: 'Оптимизация meta-тегов', type: 'info' },
    { text: 'Сжатие изображений завершено', type: 'success' },
    { text: 'Проверка скорости загрузки', type: 'info' },
    { text: 'Проблемы с доступом к robots.txt', type: 'warning' },
    { text: 'Генерация sitemap.xml', type: 'info' }
  ];

  return Array(count).fill(null).map((_, i) => {
    const messageObj = messages[Math.floor(Math.random() * messages.length)];
    return {
      id: `log-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000 * 12).toISOString(),
      message: messageObj.text,
      type: messageObj.type as 'info' | 'warning' | 'error' | 'success'
    };
  });
};

const formatDuration = (start: string, end?: string): string => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const durationMs = endDate.getTime() - startDate.getTime();
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
  return `${hours > 0 ? `${hours}ч ` : ''}${minutes}м ${seconds}с`;
};

const getStatusIcon = (status: SiteItem['status']) => {
  switch(status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'active': return <Activity className="h-4 w-4 text-blue-500" />;
    case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
    case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
};

const getLogIcon = (type: LogItem['type']) => {
  switch(type) {
    case 'info': return <Menu className="h-4 w-4 text-blue-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
};

const InteractiveTabsProcess: React.FC = () => {
  const [mockSites, setMockSites] = useState<SiteItem[]>(generateMockSites(25));
  const [mockLogs, setMockLogs] = useState<LogItem[]>(generateMockLogs(50));
  const [activeSites, setActiveSites] = useState<number>(0);
  const [completedSites, setCompletedSites] = useState<number>(0);
  const [errorSites, setErrorSites] = useState<number>(0);

  // Вычисляем общий прогресс и статистику
  const totalProgress = mockSites.reduce((acc, site) => acc + site.progress, 0) / mockSites.length;
  
  // Имитируем процесс оптимизации
  useEffect(() => {
    const updateSites = () => {
      setMockSites(prevSites => {
        return prevSites.map(site => {
          if (site.status === 'active') {
            const newProgress = Math.min(site.progress + Math.random() * 5, 100);
            
            // Если достигли 100%, меняем статус на completed
            if (newProgress >= 100) {
              return { 
                ...site, 
                progress: 100, 
                status: 'completed',
                endTime: new Date().toISOString()
              };
            }
            
            return { ...site, progress: newProgress };
          }
          
          // Если сайт в статусе pending и у нас активных менее 5, активируем его
          if (site.status === 'pending' && prevSites.filter(s => s.status === 'active').length < 5) {
            return { ...site, status: 'active' };
          }
          
          return site;
        });
      });

      // Добавляем новые логи
      if (Math.random() > 0.7) {
        setMockLogs(prevLogs => {
          const newLog: LogItem = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            message: [
              'Оптимизация структуры сайта',
              'Анализ контента',
              'Проверка meta-тегов',
              'Оптимизация изображений',
              'Исправление ошибок 404',
              'Анализ скорости загрузки',
              'Проверка мобильной версии'
            ][Math.floor(Math.random() * 7)],
            type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as LogItem['type']
          };
          return [newLog, ...prevLogs.slice(0, 49)];
        });
      }
    };

    const intervalId = setInterval(updateSites, 1500);
    return () => clearInterval(intervalId);
  }, []);

  // Обновляем счетчики сайтов
  useEffect(() => {
    setActiveSites(mockSites.filter(site => site.status === 'active').length);
    setCompletedSites(mockSites.filter(site => site.status === 'completed').length);
    setErrorSites(mockSites.filter(site => site.status === 'error').length);
  }, [mockSites]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Процесс оптимизации</h2>
          <div className="text-muted-foreground">Всего сайтов: {mockSites.length}</div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Активные: </span>
            <Badge variant="default">{activeSites}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Завершено: </span>
            <Badge variant="default">{completedSites}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Ошибки: </span>
            <Badge variant="destructive">{errorSites}</Badge>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Общий прогресс</span>
          <span className="text-sm font-medium">{Math.round(totalProgress)}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart className="h-4 w-4" /> Обзор
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Server className="h-4 w-4" /> Ресурсы системы
          </TabsTrigger>
          <TabsTrigger value="sites" className="gap-2">
            <Globe className="h-4 w-4" /> Активные сайты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Статистика оптимизации</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Всего сайтов</span>
                      <span>{mockSites.length}</span>
                    </div>
                    <Progress value={100} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>В процессе</span>
                      <span>{activeSites}</span>
                    </div>
                    <Progress value={activeSites / mockSites.length * 100} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Завершено</span>
                      <span>{completedSites}</span>
                    </div>
                    <Progress value={completedSites / mockSites.length * 100} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>С ошибками</span>
                      <span>{errorSites}</span>
                    </div>
                    <Progress value={errorSites / mockSites.length * 100} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Журнал событий</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  {mockLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="flex items-start gap-2 mb-3 text-sm">
                      <div className="mt-0.5">{getLogIcon(log.type)}</div>
                      <div>
                        <div className="font-medium">{log.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">Последние оптимизированные сайты</h3>
              <div className="space-y-4">
                {mockSites.filter(site => site.status === 'completed')
                  .slice(0, 5)
                  .map(site => (
                    <div key={site.id} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <div className="font-medium">{site.url}</div>
                        <div className="text-xs text-muted-foreground">
                          Время: {formatDuration(site.startTime, site.endTime)}
                        </div>
                      </div>
                      <Progress value={site.progress} className="w-20 h-1.5" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Использование системных ресурсов</h3>
              
              <div className="space-y-6">
                {mockSystemResources.map(resource => (
                  <div key={resource.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{resource.name}</span>
                      <span>
                        {resource.value} / {resource.max} {resource.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(resource.value / resource.max) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-4 border-t">
                <h4 className="font-medium mb-3">Информация о сервере</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Процессор</span>
                    <span>AMD EPYC 7302P 16-Core</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Память</span>
                    <span>64 GB DDR4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Диск</span>
                    <span>NVMe SSD 1TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ОС</span>
                    <span>Ubuntu Server 22.04 LTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время работы</span>
                    <span>12 дней 8 часов 42 минуты</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Регион</span>
                    <span>Европа (Франкфурт)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sites">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">Активные процессы оптимизации</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs border-b">
                      <th className="text-left py-2 px-3 font-medium">URL</th>
                      <th className="text-left py-2 px-3 font-medium">Прогресс</th>
                      <th className="text-left py-2 px-3 font-medium">Статус</th>
                      <th className="text-left py-2 px-3 font-medium">Время</th>
                      <th className="text-left py-2 px-3 font-medium">Сообщение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSites
                      .filter(site => site.status === 'active' || site.status === 'error')
                      .slice(0, 10)
                      .map(site => (
                        <tr key={site.id} className="border-b text-sm">
                          <td className="py-3 px-3">
                            <div className="font-medium">{site.url}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="w-full max-w-[150px] flex items-center gap-2">
                              <Progress value={site.progress} className="h-1.5 flex-1" />
                              <span className="text-xs">{Math.round(site.progress)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(site.status)}
                              <span>
                                {site.status === 'active' && 'Активный'}
                                {site.status === 'error' && 'Ошибка'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {formatDuration(site.startTime)}
                          </td>
                          <td className="py-3 px-3">
                            {site.message && (
                              <span className="text-red-500">{site.message}</span>
                            )}
                            {!site.message && site.status === 'active' && (
                              <span>Оптимизация...</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">В очереди</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                  {mockSites
                    .filter(site => site.status === 'pending')
                    .slice(0, 8)
                    .map(site => (
                      <div key={site.id} className="flex items-center gap-2 border-b pb-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="flex-1">{site.url}</span>
                        <Badge variant="outline">В очереди</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Завершено</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                  {mockSites
                    .filter(site => site.status === 'completed')
                    .slice(0, 8)
                    .map(site => (
                      <div key={site.id} className="flex items-center gap-2 border-b pb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="flex-1">{site.url}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(site.startTime, site.endTime)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveTabsProcess;
