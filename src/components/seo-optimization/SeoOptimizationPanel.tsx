
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CrawlOptions } from '@/services/api/crawlerService';
import { OptimizationOptions } from '@/services/api/openaiService';
import { HostingCredentials } from '@/services/api/hostingService';
import { seoOptimizationController } from '@/services/api/seoOptimizationController';
import { openaiService } from '@/services/api/openaiService';
import { Loader2, Download, Upload, CheckCircle, XCircle, Settings, Wand2, Globe, Server } from 'lucide-react';

const SeoOptimizationPanel: React.FC = () => {
  const { toast } = useToast();
  
  // URL and API Key states
  const [url, setUrl] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  
  // Crawl options
  const [crawlOptions, setCrawlOptions] = useState<CrawlOptions>({
    maxPages: 100,
    maxDepth: 5,
    followExternalLinks: false,
    checkImages: true,
    checkPerformance: true
  });
  
  // Optimization options
  const [optimizationOptions, setOptimizationOptions] = useState<OptimizationOptions>({
    optimizeMetaTags: true,
    optimizeHeadings: true,
    optimizeContent: true,
    language: 'ru',
    prompt: ''
  });
  
  // Hosting options
  const [hostingProvider, setHostingProvider] = useState<'ftp' | 'beget' | 'cpanel'>('ftp');
  const [hostingCredentials, setHostingCredentials] = useState<Omit<HostingCredentials, 'provider'>>({
    host: '',
    username: '',
    password: '',
    port: 21,
    path: '/'
  });
  
  // Task state
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle crawl option changes
  const handleCrawlOptionChange = (key: keyof CrawlOptions, value: any) => {
    setCrawlOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle optimization option changes
  const handleOptimizationOptionChange = (key: keyof OptimizationOptions, value: any) => {
    setOptimizationOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle hosting credential changes
  const handleHostingCredentialChange = (key: string, value: any) => {
    setHostingCredentials(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Start the optimization process
  const handleStartOptimization = async () => {
    if (!url) {
      toast({
        title: "URL обязателен",
        description: "Пожалуйста, введите URL сайта для анализа и оптимизации",
        variant: "destructive"
      });
      return;
    }
    
    if (!openaiKey) {
      toast({
        title: "API ключ OpenAI обязателен",
        description: "Пожалуйста, введите ваш API ключ OpenAI для оптимизации контента",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setIsCompleted(false);
      setError(null);
      setProgress(0);
      setTaskStatus('Инициализация...');
      
      // Set the OpenAI API key
      openaiService.setApiKey(openaiKey);
      
      // Start the optimization process
      const newTaskId = await seoOptimizationController.startOptimization(
        url,
        crawlOptions,
        optimizationOptions
      );
      
      setTaskId(newTaskId);
      
      // Start polling for updates
      const intervalId = setInterval(async () => {
        const taskStatus = seoOptimizationController.getTaskStatus(newTaskId);
        
        if (taskStatus) {
          setProgress(taskStatus.progress);
          
          switch (taskStatus.status) {
            case 'crawling':
              setTaskStatus(`Сканирование... (${taskStatus.pagesProcessed}/${taskStatus.totalPages || '?'} страниц)`);
              break;
            case 'optimizing':
              setTaskStatus(`Оптимизация... (${taskStatus.pagesProcessed}/${taskStatus.totalPages} страниц)`);
              break;
            case 'generating':
              setTaskStatus('Генерация оптимизированного сайта...');
              break;
            case 'deploying':
              setTaskStatus('Публикация оптимизированного сайта...');
              break;
            case 'completed':
              setTaskStatus('Оптимизация завершена');
              setIsProcessing(false);
              setIsCompleted(true);
              clearInterval(intervalId);
              
              toast({
                title: "Оптимизация завершена",
                description: `Сайт ${url} успешно оптимизирован!`,
              });
              break;
            case 'failed':
              setTaskStatus('Ошибка оптимизации');
              setIsProcessing(false);
              setError(taskStatus.error || 'Неизвестная ошибка');
              clearInterval(intervalId);
              
              toast({
                title: "Ошибка оптимизации",
                description: taskStatus.error || 'Произошла ошибка при оптимизации сайта',
                variant: "destructive"
              });
              break;
          }
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    } catch (error) {
      setIsProcessing(false);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      
      toast({
        title: "Ошибка оптимизации",
        description: error instanceof Error ? error.message : 'Произошла ошибка при оптимизации сайта',
        variant: "destructive"
      });
    }
  };
  
  // Download the optimized site
  const handleDownloadSite = async () => {
    if (!taskId) return;
    
    try {
      await seoOptimizationController.downloadOptimizedSite(taskId);
      
      toast({
        title: "Сайт загружен",
        description: "Оптимизированный сайт успешно загружен"
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : 'Произошла ошибка при загрузке оптимизированного сайта',
        variant: "destructive"
      });
    }
  };
  
  // Deploy the optimized site
  const handleDeploySite = async () => {
    if (!taskId) return;
    
    try {
      setIsProcessing(true);
      setTaskStatus('Публикация оптимизированного сайта...');
      
      const credentials: HostingCredentials = {
        provider: hostingProvider,
        ...hostingCredentials
      };
      
      const result = await seoOptimizationController.deploySite(taskId, credentials);
      
      setIsProcessing(false);
      
      if (result.success) {
        toast({
          title: "Сайт опубликован",
          description: `Оптимизированный сайт успешно опубликован: ${result.url}`
        });
      } else {
        setError(result.error || 'Неизвестная ошибка');
        
        toast({
          title: "Ошибка публикации",
          description: result.error || 'Произошла ошибка при публикации оптимизированного сайта',
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsProcessing(false);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      
      toast({
        title: "Ошибка публикации",
        description: error instanceof Error ? error.message : 'Произошла ошибка при публикации оптимизированного сайта',
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm mb-6">
        <CardHeader>
          <CardTitle>SEO аудит и оптимизация сайта</CardTitle>
          <CardDescription>
            Автоматическое сканирование, анализ и оптимизация сайта для улучшения SEO показателей
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* URL and API Key */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website-url">URL сайта</Label>
                  <Input
                    id="website-url"
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API ключ</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
            
            {/* Options Tabs */}
            <Tabs defaultValue="crawl">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="crawl" disabled={isProcessing}>
                  <Settings className="h-4 w-4 mr-2" />
                  Сканирование
                </TabsTrigger>
                <TabsTrigger value="optimization" disabled={isProcessing}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Оптимизация
                </TabsTrigger>
                <TabsTrigger value="hosting" disabled={isProcessing}>
                  <Server className="h-4 w-4 mr-2" />
                  Публикация
                </TabsTrigger>
              </TabsList>
              
              {/* Crawl Options */}
              <TabsContent value="crawl" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Максимальное количество страниц</Label>
                      <div className="text-sm text-muted-foreground">
                        {crawlOptions.maxPages} страниц
                      </div>
                    </div>
                    <div className="w-[180px]">
                      <Slider
                        value={[crawlOptions.maxPages]}
                        min={10}
                        max={500}
                        step={10}
                        onValueChange={(value) => handleCrawlOptionChange('maxPages', value[0])}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Максимальная глубина</Label>
                      <div className="text-sm text-muted-foreground">
                        {crawlOptions.maxDepth} уровней
                      </div>
                    </div>
                    <div className="w-[180px]">
                      <Slider
                        value={[crawlOptions.maxDepth]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => handleCrawlOptionChange('maxDepth', value[0])}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="follow-external"
                      checked={crawlOptions.followExternalLinks}
                      onCheckedChange={(checked) => handleCrawlOptionChange('followExternalLinks', checked)}
                      disabled={isProcessing}
                    />
                    <Label htmlFor="follow-external">Следовать по внешним ссылкам</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="check-images"
                      checked={crawlOptions.checkImages}
                      onCheckedChange={(checked) => handleCrawlOptionChange('checkImages', checked)}
                      disabled={isProcessing}
                    />
                    <Label htmlFor="check-images">Проверять изображения</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="check-performance"
                      checked={crawlOptions.checkPerformance}
                      onCheckedChange={(checked) => handleCrawlOptionChange('checkPerformance', checked)}
                      disabled={isProcessing}
                    />
                    <Label htmlFor="check-performance">Анализировать производительность</Label>
                  </div>
                </div>
              </TabsContent>
              
              {/* Optimization Options */}
              <TabsContent value="optimization" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="optimize-meta"
                      checked={optimizationOptions.optimizeMetaTags}
                      onCheckedChange={(checked) => handleOptimizationOptionChange('optimizeMetaTags', checked)}
                      disabled={isProcessing}
                    />
                    <Label htmlFor="optimize-meta">Оптимизировать мета-теги</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="optimize-headings"
                      checked={optimizationOptions.optimizeHeadings}
                      onCheckedChange={(checked) => handleOptimizationOptionChange('optimizeHeadings', checked)}
                      disabled={isProcessing}
                    />
                    <Label htmlFor="optimize-headings">Оптимизировать заголовки</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="optimize-content"
                      checked={optimizationOptions.optimizeContent}
                      onCheckedChange={(checked) => handleOptimizationOptionChange('optimizeContent', checked)}
                      disabled={isProcessing}
                    />
                    <Label htmlFor="optimize-content">Оптимизировать контент</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Язык оптимизации</Label>
                    <select
                      id="language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={optimizationOptions.language}
                      onChange={(e) => handleOptimizationOptionChange('language', e.target.value)}
                      disabled={isProcessing}
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Дополнительные инструкции для ИИ</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Например: Фокусироваться на ключевых словах для мебельной индустрии, использовать официальный тон и т.д."
                      value={optimizationOptions.prompt}
                      onChange={(e) => handleOptimizationOptionChange('prompt', e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Hosting Options */}
              <TabsContent value="hosting" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hosting-provider">Хостинг-провайдер</Label>
                    <select
                      id="hosting-provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={hostingProvider}
                      onChange={(e) => setHostingProvider(e.target.value as any)}
                      disabled={isProcessing}
                    >
                      <option value="ftp">FTP</option>
                      <option value="beget">Beget</option>
                      <option value="cpanel">cPanel</option>
                    </select>
                  </div>
                  
                  {hostingProvider === 'ftp' && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ftp-host">Хост</Label>
                          <Input
                            id="ftp-host"
                            placeholder="ftp.example.com"
                            value={hostingCredentials.host}
                            onChange={(e) => handleHostingCredentialChange('host', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ftp-username">Имя пользователя</Label>
                          <Input
                            id="ftp-username"
                            placeholder="user"
                            value={hostingCredentials.username}
                            onChange={(e) => handleHostingCredentialChange('username', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ftp-password">Пароль</Label>
                          <Input
                            id="ftp-password"
                            type="password"
                            placeholder="********"
                            value={hostingCredentials.password}
                            onChange={(e) => handleHostingCredentialChange('password', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ftp-port">Порт</Label>
                          <Input
                            id="ftp-port"
                            type="number"
                            placeholder="21"
                            value={hostingCredentials.port?.toString() || '21'}
                            onChange={(e) => handleHostingCredentialChange('port', parseInt(e.target.value) || 21)}
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ftp-path">Путь</Label>
                          <Input
                            id="ftp-path"
                            placeholder="/public_html"
                            value={hostingCredentials.path}
                            onChange={(e) => handleHostingCredentialChange('path', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {hostingProvider === 'beget' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beget-username">Логин</Label>
                        <Input
                          id="beget-username"
                          placeholder="username"
                          value={hostingCredentials.username}
                          onChange={(e) => handleHostingCredentialChange('username', e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="beget-password">Пароль</Label>
                        <Input
                          id="beget-password"
                          type="password"
                          placeholder="********"
                          value={hostingCredentials.password}
                          onChange={(e) => handleHostingCredentialChange('password', e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  )}
                  
                  {hostingProvider === 'cpanel' && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cpanel-host">Хост</Label>
                          <Input
                            id="cpanel-host"
                            placeholder="example.com"
                            value={hostingCredentials.host}
                            onChange={(e) => handleHostingCredentialChange('host', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cpanel-username">Имя пользователя</Label>
                          <Input
                            id="cpanel-username"
                            placeholder="user"
                            value={hostingCredentials.username}
                            onChange={(e) => handleHostingCredentialChange('username', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cpanel-password">Пароль</Label>
                          <Input
                            id="cpanel-password"
                            type="password"
                            placeholder="********"
                            value={hostingCredentials.password}
                            onChange={(e) => handleHostingCredentialChange('password', e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cpanel-path">Путь</Label>
                        <Input
                          id="cpanel-path"
                          placeholder="/public_html"
                          value={hostingCredentials.path}
                          onChange={(e) => handleHostingCredentialChange('path', e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Progress and Status */}
            {(isProcessing || isCompleted || error) && (
              <div className="space-y-4 mt-4">
                {isProcessing && (
                  <>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {taskStatus}
                    </div>
                  </>
                )}
                
                {isCompleted && !isProcessing && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Оптимизация успешно завершена
                  </div>
                )}
                
                {error && !isProcessing && (
                  <div className="flex items-center text-sm text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleStartOptimization}
                disabled={isProcessing || !url || !openaiKey}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Оптимизация...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Начать оптимизацию
                  </>
                )}
              </Button>
              
              {isCompleted && (
                <>
                  <Button
                    onClick={handleDownloadSite}
                    disabled={isProcessing || !isCompleted}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать оптимизированный сайт
                  </Button>
                  
                  <Button
                    onClick={handleDeploySite}
                    disabled={isProcessing || !isCompleted}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Опубликовать на хостинге
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoOptimizationPanel;
