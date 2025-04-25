
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Globe, Send, List, RefreshCw } from 'lucide-react';
import { proxyManager } from '@/services/proxy/proxyManager';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_RPC_SERVICES = [
    'http://rpc.pingomatic.com',
    'http://ping.feedburner.com',
    'http://rpc.weblogs.com/RPC2',
    'http://bing.com/webmaster/ping.aspx',
    'https://ping.blogs.yandex.ru/RPC2',
    'http://ping.blo.gs/',
    'http://blogsearch.google.com/ping/RPC2'
];

const PingService: React.FC = () => {
  const [urls, setUrls] = useState<string>('');
  const [siteTitle, setSiteTitle] = useState<string>('');
  const [feedUrl, setFeedUrl] = useState<string>('');
  const [useProxies, setUseProxies] = useState<boolean>(true);
  const [rpcServices, setRpcServices] = useState<string>(DEFAULT_RPC_SERVICES.join('\n'));
  const [pingResults, setPingResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleStartPing = async () => {
    const urlList = urls.split('\n').filter(url => url.trim());
    const rpcList = rpcServices.split('\n').filter(rpc => rpc.trim());
    
    if (urlList.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите хотя бы один URL для пинга",
        variant: "destructive",
      });
      return;
    }
    
    if (rpcList.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите хотя бы один RPC сервис",
        variant: "destructive",
      });
      return;
    }
    
    if (!siteTitle) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите название сайта",
        variant: "destructive",
      });
      return;
    }
    
    if (!feedUrl) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL RSS-ленты",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setPingResults([]);
    
    try {
      // Проверяем наличие активных прокси если требуется их использование
      if (useProxies) {
        const activeProxies = proxyManager.getActiveProxies();
        if (activeProxies.length === 0) {
          toast({
            title: "Внимание",
            description: "Нет активных прокси. Рекомендуется сначала собрать и проверить прокси.",
            variant: "default", // Changed from "warning" to "default"
          });
        }
      }
      
      // Пингуем URL-ы через RPC сервисы
      const totalOperations = urlList.length * rpcList.length;
      let completed = 0;
      
      const results = await proxyManager.pingUrlsWithRpc(urlList, siteTitle, feedUrl, rpcList);
      
      // Добавляем результаты постепенно для лучшего UX
      for (const result of results) {
        completed++;
        setProgress(Math.round((completed / totalOperations) * 100));
        
        setPingResults(prev => [...prev, result]);
        
        // Небольшая задержка для эмуляции постепенного добавления результатов
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      toast({
        title: "Операция завершена",
        description: `Обработано ${urlList.length} URL через ${rpcList.length} RPC сервисов`,
      });
    } catch (error) {
      console.error("Ошибка при пинге URL:", error);
      toast({
        title: "Ошибка операции",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };
  
  const handleClear = () => {
    setPingResults([]);
  };

  const totalSuccess = pingResults.filter(r => r.success).length;
  const totalFailed = pingResults.length - totalSuccess;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Сервис пинга через XML-RPC
        </CardTitle>
        <CardDescription>
          Уведомление поисковых систем и агрегаторов об обновлении контента
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="site-title">Название сайта</Label>
              <Input 
                id="site-title" 
                placeholder="Например: Мой бизнес-блог" 
                value={siteTitle} 
                onChange={e => setSiteTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feed-url">URL RSS-ленты</Label>
              <Input 
                id="feed-url" 
                placeholder="https://example.com/feed.xml" 
                value={feedUrl} 
                onChange={e => setFeedUrl(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urls">Список URL для пинга (по одному на строку)</Label>
            <Textarea
              id="urls"
              placeholder="https://example.com/post1&#10;https://example.com/post2&#10;https://example.com/post3"
              value={urls}
              onChange={e => setUrls(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rpc-services">Список XML-RPC сервисов (по одному на строку)</Label>
            <Textarea
              id="rpc-services"
              value={rpcServices}
              onChange={e => setRpcServices(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Сервисы для уведомления о новом контенте. Вы можете добавить свои или использовать предустановленный список.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="use-proxies"
              checked={useProxies}
              onCheckedChange={setUseProxies}
            />
            <Label htmlFor="use-proxies">Использовать прокси для пинга</Label>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleStartPing} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Пинг выполняется...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Начать пинг
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleClear} 
              disabled={isLoading || pingResults.length === 0}
            >
              <List className="mr-2 h-4 w-4" />
              Очистить результаты
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                {progress < 100 ? "Выполняем пинг..." : "Пинг выполнен!"}
              </p>
            </div>
          )}
          
          {pingResults.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="text-lg font-medium">Результаты пинга</h3>
                <div className="flex gap-2 ml-auto">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Успешно: {totalSuccess}
                  </Badge>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Ошибок: {totalFailed}
                  </Badge>
                </div>
              </div>
              
              <ScrollArea className="h-64 rounded-md border">
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>RPC-сервис</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pingResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="max-w-[200px] truncate">{result.url}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{result.rpc}</TableCell>
                          <TableCell>
                            {result.success ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Успешно</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span>Ошибка</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PingService;
