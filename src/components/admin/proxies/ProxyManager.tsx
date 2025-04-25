
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, Plus, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Search, Globe, Filter, Send, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMobile } from '@/hooks/use-mobile';
import PingService from './PingService';
import ProxySourcesManager from './ProxySourcesManager';

const ProxyManager: React.FC = () => {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [filteredProxies, setFilteredProxies] = useState<Proxy[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'testing'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [captchaApiKey, setCaptchaApiKey] = useState('');
  const [botableApiKey, setBotableApiKey] = useState('');
  const [importText, setImportText] = useState('');
  const [testUrlValue, setTestUrlValue] = useState('https://api.ipify.org/');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testUrlsInput, setTestUrlsInput] = useState('');
  const [useProxiesForTesting, setUseProxiesForTesting] = useState(true);
  const { toast } = useToast();
  const isMobile = useMobile();

  useEffect(() => {
    loadProxies();
    setCaptchaApiKey(proxyManager.getCaptchaApiKey());
    setBotableApiKey(proxyManager.getBotableApiKey());
  }, []);

  useEffect(() => {
    applyFilters();
  }, [proxies, filterStatus, searchTerm]);

  const loadProxies = () => {
    const allProxies = proxyManager.getAllProxies();
    setProxies(allProxies);
  };

  const applyFilters = () => {
    let filtered = [...proxies];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(proxy => proxy.status === filterStatus);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(proxy => 
        proxy.ip.toLowerCase().includes(term) ||
        proxy.id.toLowerCase().includes(term) ||
        (proxy.country && proxy.country.toLowerCase().includes(term))
      );
    }
    
    setFilteredProxies(filtered);
  };

  const handleCollectProxies = async () => {
    try {
      setIsCollecting(true);
      setProgress(0);
      setStatusMessage('Подготовка к сбору прокси...');
      
      let sourcesCount = 0;
      Object.values(proxyManager.defaultProxySources).forEach(source => {
        if (source.enabled) sourcesCount++;
      });
      
      if (sourcesCount === 0) {
        toast({
          title: "Нет активных источников",
          description: "Активируйте источники прокси во вкладке 'Источники'",
          variant: "destructive",
        });
        setIsCollecting(false);
        return;
      }
      
      let completedSources = 0;
      
      const newProxies = await proxyManager.collectProxies((source, count) => {
        if (count >= 0) {
          setStatusMessage(`Собрано ${count} прокси из источника ${source}`);
          completedSources++;
          setProgress(Math.round((completedSources / sourcesCount) * 100));
        } else {
          setStatusMessage(`Ошибка при сборе прокси из ${source}`);
        }
      });
      
      toast({
        title: "Сбор прокси завершен",
        description: `Найдено ${newProxies.length} новых прокси`,
      });
      
      loadProxies();
    } catch (error) {
      console.error("Ошибка при сборе прокси:", error);
      toast({
        title: "Ошибка сбора прокси",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsCollecting(false);
      setStatusMessage('');
    }
  };

  const handleTestProxies = async () => {
    const proxyList = filteredProxies.length > 0 ? filteredProxies : proxies;
    
    if (proxyList.length === 0) {
      toast({
        title: "Нет прокси для проверки",
        description: "Сначала соберите или импортируйте прокси",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsTesting(true);
      setProgress(0);
      setStatusMessage('Подготовка к проверке прокси...');
      
      let checkedCount = 0;
      let activeCount = 0;
      
      await proxyManager.checkProxies(proxyList, testUrlValue, (proxy) => {
        checkedCount++;
        if (proxy.status === 'active') activeCount++;
        
        setProgress(Math.round((checkedCount / proxyList.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${proxyList.length} прокси (Найдено рабочих: ${activeCount})`);
      });
      
      toast({
        title: "Проверка прокси завершена",
        description: `Проверено ${proxyList.length} прокси, найдено рабочих: ${activeCount}`,
      });
      
      loadProxies();
    } catch (error) {
      console.error("Ошибка при проверке прокси:", error);
      toast({
        title: "Ошибка проверки прокси",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
      setStatusMessage('');
    }
  };

  const handleDeleteProxy = (id: string) => {
    if (proxyManager.removeProxy(id)) {
      toast({
        title: "Прокси удален",
        description: `Прокси ${id} успешно удален`,
      });
      loadProxies();
    }
  };

  const handleImportProxies = () => {
    if (!importText.trim()) {
      toast({
        title: "Пустой список",
        description: "Введите список прокси для импорта",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const importedProxies = proxyManager.importProxies(importText);
      toast({
        title: "Импорт завершен",
        description: `Импортировано ${importedProxies.length} прокси`,
      });
      loadProxies();
      setImportText('');
    } catch (error) {
      console.error("Ошибка при импорте прокси:", error);
      toast({
        title: "Ошибка импорта",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    }
  };

  const handleExportProxies = () => {
    const proxyList = filteredProxies.length > 0 ? filteredProxies : proxies;
    
    if (proxyList.length === 0) {
      toast({
        title: "Нет прокси для экспорта",
        description: "Сначала соберите или импортируйте прокси",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const activeProxies = proxyList.filter(proxy => proxy.status === 'active');
      const exportText = activeProxies
        .map(proxy => `${proxy.protocol}://${proxy.ip}:${proxy.port}`)
        .join('\n');
      
      const blob = new Blob([exportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proxy_list_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Экспорт завершен",
        description: `Экспортировано ${activeProxies.length} активных прокси`,
      });
    } catch (error) {
      console.error("Ошибка при экспорте прокси:", error);
      toast({
        title: "Ошибка экспорта",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    }
  };

  const handleClearAllProxies = () => {
    if (window.confirm('Вы уверены, что хотите удалить все прокси?')) {
      proxyManager.clearAllProxies();
      toast({
        title: "Прокси удалены",
        description: "Все прокси успешно удалены",
      });
      loadProxies();
    }
  };

  const handleSaveCaptchaKey = () => {
    proxyManager.setCaptchaApiKey(captchaApiKey);
    toast({
      title: "API ключ сохранен",
      description: "API ключ для IPCaptchaGuru успешно сохранен",
    });
  };

  const handleSaveBotableKey = () => {
    proxyManager.setBotableApiKey(botableApiKey);
    toast({
      title: "API ключ сохранен",
      description: "API ключ для Botable успешно сохранен",
    });
  };

  const handleTestUrls = async () => {
    if (!testUrlsInput.trim()) {
      toast({
        title: "Нет URL для теста",
        description: "Введите список URL для проверки",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const urls = testUrlsInput.split('\n').map(url => url.trim()).filter(url => url);
      
      if (urls.length === 0) {
        toast({
          title: "Нет URL для теста",
          description: "Введите корректный список URL для проверки",
          variant: "destructive",
        });
        return;
      }
      
      if (useProxiesForTesting) {
        const activeProxies = proxyManager.getActiveProxies();
        if (activeProxies.length === 0) {
          toast({
            title: "Нет активных прокси",
            description: "Для использования прокси необходимо иметь активные прокси",
            variant: "destructive",
          });
          return;
        }
      }
      
      setIsTesting(true);
      setProgress(0);
      setTestResults([]);
      setStatusMessage(`Подготовка к проверке ${urls.length} URL...`);
      
      let checkedCount = 0;
      
      const results = await proxyManager.testUrls(urls, useProxiesForTesting, (url, status, proxy, errorDetails) => {
        checkedCount++;
        setProgress(Math.round((checkedCount / urls.length) * 100));
        setStatusMessage(`Проверено ${checkedCount}/${urls.length} URL`);
        
        setTestResults(prev => [...prev, { 
          url, 
          status, 
          proxy,
          errorDetails 
        }]);
      });
      
      toast({
        title: "Проверка URL завершена",
        description: `Проверено ${urls.length} URL`,
      });
    } catch (error) {
      console.error("Ошибка при тестировании URL:", error);
      toast({
        title: "Ошибка проверки URL",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
      setStatusMessage('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Активен</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Неактивен</Badge>;
      case 'testing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Тестирование</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление прокси</h2>
        <div className="flex gap-2 flex-wrap justify-end">
          {!isMobile && (
            <>
              <Button size="sm" variant="outline" onClick={handleCollectProxies} disabled={isCollecting || isTesting}>
                <Plus className="w-4 h-4 mr-2" />
                Собрать прокси
              </Button>
              <Button size="sm" variant="outline" onClick={handleTestProxies} disabled={isCollecting || isTesting}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Проверить прокси
              </Button>
            </>
          )}
          <Button size="sm" variant="destructive" onClick={handleClearAllProxies} disabled={isCollecting || isTesting}>
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить все
          </Button>
        </div>
      </div>

      {(isCollecting || isTesting) && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center">{statusMessage}</p>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={handleCollectProxies} disabled={isCollecting || isTesting} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Собрать
          </Button>
          <Button size="sm" variant="outline" onClick={handleTestProxies} disabled={isCollecting || isTesting} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Проверить
          </Button>
        </div>
      )}

      <Tabs defaultValue="list">
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="list">Список прокси</TabsTrigger>
          <TabsTrigger value="import">Импорт/Экспорт</TabsTrigger>
          <TabsTrigger value="test">Тест URL</TabsTrigger>
          <TabsTrigger value="ping">XML-RPC Пинг</TabsTrigger>
          <TabsTrigger value="sources">Источники</TabsTrigger>
          <TabsTrigger value="captcha">API ключи</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Список прокси</CardTitle>
              <CardDescription>
                Всего найдено: {proxies.length} прокси (Активных: {proxies.filter(p => p.status === 'active').length})
              </CardDescription>
              
              <div className="grid gap-4 md:grid-cols-2 mt-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по IP, стране..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                  >
                    <option value="all">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="inactive">Неактивные</option>
                    <option value="testing">Тестируемые</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredProxies.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP:Порт</TableHead>
                        <TableHead>Протокол</TableHead>
                        <TableHead>Статус</TableHead>
                        {!isMobile && <TableHead>Скорость</TableHead>}
                        {!isMobile && <TableHead>Источник</TableHead>}
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProxies.map((proxy) => (
                        <TableRow key={proxy.id}>
                          <TableCell className="font-medium">{proxy.ip}:{proxy.port}</TableCell>
                          <TableCell>{proxy.protocol}</TableCell>
                          <TableCell>{getStatusBadge(proxy.status)}</TableCell>
                          {!isMobile && (
                            <TableCell>
                              {proxy.speed ? `${proxy.speed} мс` : '-'}
                            </TableCell>
                          )}
                          {!isMobile && (
                            <TableCell>
                              {proxy.source || '-'}
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteProxy(proxy.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {proxies.length > 0 
                      ? 'Нет прокси, соответствующих фильтрам' 
                      : 'Нет доступных прокси. Воспользуйтесь функцией "Собрать прокси" или импортируйте список.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Импорт и экспорт прокси</CardTitle>
              <CardDescription>
                Импортируйте список прокси из текста или экспортируйте текущий список
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Импорт списка прокси</Label>
                  <Textarea 
                    placeholder="Введите список прокси (ip:port или protocol://ip:port в каждой строке)"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Поддерживаемые форматы: 127.0.0.1:8080, http://127.0.0.1:8080, socks5://127.0.0.1:1080
                  </p>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" onClick={() => setImportText('')}>
                      Очистить
                    </Button>
                    <Button onClick={handleImportProxies}>
                      <Upload className="h-4 w-4 mr-2" />
                      Импортировать
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label>Экспорт активных прокси</Label>
                    <Button variant="outline" onClick={handleExportProxies}>
                      <Download className="h-4 w-4 mr-2" />
                      Экспортировать
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Будут экспортированы только активные прокси в формате protocol://ip:port
                  </p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <Label>URL для проверки прокси</Label>
                  <Input 
                    placeholder="URL для проверки прокси"
                    value={testUrlValue}
                    onChange={(e) => setTestUrlValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL, который будет использоваться для проверки работоспособности прокси
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Тестирование URL</CardTitle>
              <CardDescription>
                Проверка доступности URL с использованием прокси
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Список URL для проверки</Label>
                  <Textarea 
                    placeholder="Введите список URL (по одному URL на строку)"
                    value={testUrlsInput}
                    onChange={(e) => setTestUrlsInput(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-proxies" 
                    checked={useProxiesForTesting} 
                    onCheckedChange={setUseProxiesForTesting}
                  />
                  <Label htmlFor="use-proxies">Использовать прокси для проверки</Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setTestUrlsInput('')}>
                    Очистить
                  </Button>
                  <Button onClick={handleTestUrls} disabled={isCollecting || isTesting}>
                    {isTesting ? "Идет проверка..." : "Начать проверку"}
                  </Button>
                </div>
                
                {testResults.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t">
                    <h4 className="font-medium">Результаты проверки:</h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Статус</TableHead>
                            {useProxiesForTesting && <TableHead>Прокси</TableHead>}
                            <TableHead>Детали</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                <div className="max-w-[200px] md:max-w-[300px] truncate">
                                  {result.url}
                                </div>
                              </TableCell>
                              <TableCell>
                                {result.status > 0 ? (
                                  <Badge variant="outline" className={
                                    result.status >= 200 && result.status < 300
                                      ? "bg-green-100 text-green-800"
                                      : result.status >= 300 && result.status < 400
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }>
                                    {result.status}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-100 text-red-800">
                                    Ошибка
                                  </Badge>
                                )}
                              </TableCell>
                              {useProxiesForTesting && (
                                <TableCell>{result.proxy || '-'}</TableCell>
                              )}
                              <TableCell>
                                {result.status > 0 ? 'Успешно' : result.errorDetails || 'Ошибка соединения'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ping">
          <PingService />
        </TabsContent>
        
        <TabsContent value="sources">
          <ProxySourcesManager />
        </TabsContent>

        <TabsContent value="captcha">
          <Card>
            <CardHeader>
              <CardTitle>API ключи для обхода капчи</CardTitle>
              <CardDescription>
                Настройка ключей для сервисов обхода капчи
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>IP Captcha Guru API ключ</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      placeholder="Введите API ключ IPCaptchaGuru"
                      value={captchaApiKey}
                      onChange={(e) => setCaptchaApiKey(e.target.value)}
                    />
                    <Button onClick={handleSaveCaptchaKey}>
                      Сохранить
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Используется для решения капч при проверке позиций
                  </p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <Label>Botable API ключ</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      placeholder="Введите API ключ Botable"
                      value={botableApiKey}
                      onChange={(e) => setBotableApiKey(e.target.value)}
                    />
                    <Button onClick={handleSaveBotableKey}>
                      Сохранить
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Используется для обхода защиты от ботов при проверке позиций
                  </p>
                </div>
                
                <Alert>
                  <AlertDescription>
                    API ключи будут сохранены в localStorage браузера. В будущем рекомендуется 
                    перенести их хранение в базу данных для улучшения безопасности.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProxyManager;
