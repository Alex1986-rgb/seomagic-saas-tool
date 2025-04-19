
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { seoOptimizationController } from "@/services/api/seoOptimizationController";
import { openaiService } from "@/services/api/openaiService";
import { CheckCircle2, ExternalLink, Globe, Key, Loader2, RefreshCw, Search } from "lucide-react";
import OptimizationProgress from "./OptimizationProgress";
import DeploymentPanel from "./DeploymentPanel";

const SeoOptimizationPanel: React.FC = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [openaiKey, setOpenaiKey] = useState("");
  const [task, setTask] = useState<any>(null);
  const [advancedOptions, setAdvancedOptions] = useState({
    maxPages: 10000,
    followExternalLinks: false,
    analyzeMobile: true,
    optimizeImages: true,
    optimizeHeadings: true,
    optimizeMetaTags: true,
    optimizeContent: true,
    dynamicRendering: false,
  });
  const [activeTab, setActiveTab] = useState("crawler");
  
  // Validate URL format
  const validateUrl = (input: string) => {
    try {
      const urlObject = new URL(input.startsWith('http') ? input : `https://${input}`);
      setIsValid(true);
      return urlObject.toString();
    } catch (e) {
      setIsValid(false);
      return false;
    }
  };
  
  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };
  
  // Handle OpenAI API key input change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOpenaiKey(value);
    // Store in the service
    if (value.startsWith("sk-")) {
      openaiService.setApiKey(value);
    }
  };
  
  // Toggle advanced option
  const toggleOption = (option: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }));
  };
  
  // Handle form submission to start optimization
  const handleStartOptimization = async () => {
    const formattedUrl = validateUrl(url);
    if (!formattedUrl) {
      toast({
        title: "Некорректный URL",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }
    
    if (!openaiKey || !openaiKey.startsWith("sk-")) {
      toast({
        title: "Требуется API ключ OpenAI",
        description: "Пожалуйста, введите корректный API ключ OpenAI",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Store API key in the service
      openaiService.setApiKey(openaiKey);
      
      // Start the optimization task
      const newTaskId = await seoOptimizationController.startOptimization(
        formattedUrl,
        {
          maxPages: advancedOptions.maxPages,
          followExternalLinks: advancedOptions.followExternalLinks,
          userAgent: advancedOptions.analyzeMobile ? 
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' : 
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          renderJavaScript: advancedOptions.dynamicRendering,
        },
        {
          optimizeMetaTags: advancedOptions.optimizeMetaTags,
          optimizeHeadings: advancedOptions.optimizeHeadings,
          optimizeContent: advancedOptions.optimizeContent,
          optimizeImages: advancedOptions.optimizeImages,
          temperature: 0.7,
          language: 'ru', // Default language, could be made configurable
          model: 'gpt-4o', // Using GPT-4o for best results
        }
      );
      
      setTaskId(newTaskId);
      setActiveTab("progress");
      
      toast({
        title: "Оптимизация запущена",
        description: "Начинаем сканирование и оптимизацию сайта",
      });
      
      // Start polling for task status
      startPolling(newTaskId);
    } catch (error) {
      toast({
        title: "Ошибка запуска оптимизации",
        description: error instanceof Error ? error.message : "Не удалось запустить оптимизацию",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Poll for task status
  const startPolling = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const taskStatus = seoOptimizationController.getTaskStatus(taskId);
        
        if (taskStatus) {
          setTask(taskStatus);
          
          // If task is completed or failed, stop polling
          if (taskStatus.status === 'completed' || taskStatus.status === 'failed') {
            clearInterval(interval);
            
            if (taskStatus.status === 'completed') {
              toast({
                title: "Оптимизация завершена",
                description: "Сайт успешно оптимизирован и готов к публикации",
              });
              setActiveTab("deployment");
            } else {
              toast({
                title: "Ошибка оптимизации",
                description: taskStatus.error || "Произошла ошибка при оптимизации сайта",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error polling task status:", error);
      }
    }, 2000);
    
    // Store interval ID to clear it when component unmounts
    return () => clearInterval(interval);
  };
  
  // Extract domain from URL
  const getDomain = (url: string) => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="crawler">
            <Search className="mr-2 h-4 w-4" />
            Сканирование
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={!taskId}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Прогресс
          </TabsTrigger>
          <TabsTrigger value="deployment" disabled={!taskId || !task || task.status !== 'completed'}>
            <Globe className="mr-2 h-4 w-4" />
            Публикация
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="crawler">
          <Card>
            <CardHeader>
              <CardTitle>Сканирование и оптимизация сайта</CardTitle>
              <CardDescription>
                Введите URL сайта и API ключ OpenAI для начала процесса SEO оптимизации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL сайта</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="url" 
                    placeholder="example.com" 
                    value={url} 
                    onChange={handleUrlChange}
                  />
                  {isValid && url && (
                    <Button variant="outline" asChild>
                      <a 
                        href={url.startsWith('http') ? url : `https://${url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                {url && !isValid && (
                  <p className="text-sm text-destructive">Пожалуйста, введите корректный URL</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center">
                  <Key className="mr-2 h-4 w-4" />
                  API ключ OpenAI
                </Label>
                <Input 
                  id="apiKey" 
                  type="password" 
                  placeholder="sk-..." 
                  value={openaiKey} 
                  onChange={handleApiKeyChange}
                />
                {openaiKey && !openaiKey.startsWith("sk-") && (
                  <p className="text-sm text-destructive">API ключ должен начинаться с "sk-"</p>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Настройки оптимизации</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxPages" className="flex-1">Максимальное количество страниц</Label>
                    <Input 
                      id="maxPages" 
                      type="number" 
                      className="w-24" 
                      value={advancedOptions.maxPages} 
                      onChange={(e) => setAdvancedOptions(prev => ({ ...prev, maxPages: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="dynamicRendering" 
                      checked={advancedOptions.dynamicRendering} 
                      onCheckedChange={() => toggleOption('dynamicRendering')}
                    />
                    <Label htmlFor="dynamicRendering">Обрабатывать JavaScript контент</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="followExternalLinks" 
                      checked={advancedOptions.followExternalLinks} 
                      onCheckedChange={() => toggleOption('followExternalLinks')}
                    />
                    <Label htmlFor="followExternalLinks">Следовать по внешним ссылкам</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="analyzeMobile" 
                      checked={advancedOptions.analyzeMobile} 
                      onCheckedChange={() => toggleOption('analyzeMobile')}
                    />
                    <Label htmlFor="analyzeMobile">Анализировать мобильную версию</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="optimizeImages" 
                      checked={advancedOptions.optimizeImages} 
                      onCheckedChange={() => toggleOption('optimizeImages')}
                    />
                    <Label htmlFor="optimizeImages">Оптимизировать изображения</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="optimizeHeadings" 
                      checked={advancedOptions.optimizeHeadings} 
                      onCheckedChange={() => toggleOption('optimizeHeadings')}
                    />
                    <Label htmlFor="optimizeHeadings">Оптимизировать заголовки</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="optimizeMetaTags" 
                      checked={advancedOptions.optimizeMetaTags} 
                      onCheckedChange={() => toggleOption('optimizeMetaTags')}
                    />
                    <Label htmlFor="optimizeMetaTags">Оптимизировать мета-теги</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="optimizeContent" 
                      checked={advancedOptions.optimizeContent} 
                      onCheckedChange={() => toggleOption('optimizeContent')}
                    />
                    <Label htmlFor="optimizeContent">Оптимизировать контент</Label>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleStartOptimization} 
                disabled={!isValid || !openaiKey || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Запуск...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Начать оптимизацию
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          {taskId && task && (
            <OptimizationProgress 
              task={task} 
              onComplete={() => setActiveTab("deployment")} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="deployment">
          {taskId && task && task.status === 'completed' && (
            <DeploymentPanel 
              taskId={taskId} 
              domain={getDomain(url)} 
              isCompleted={task.status === 'completed'} 
            />
          )}
        </TabsContent>
      </Tabs>
      
      {taskId && task && task.status === 'completed' && (
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50">
          <CardContent className="pt-6 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="font-medium text-green-800 dark:text-green-400">
              Сайт успешно оптимизирован! Теперь вы можете скачать или опубликовать его.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeoOptimizationPanel;
