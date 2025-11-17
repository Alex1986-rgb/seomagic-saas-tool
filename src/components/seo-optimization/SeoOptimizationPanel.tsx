
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Globe, Loader2, CheckCircle2 } from "lucide-react";
import OptimizationProgress from "./OptimizationProgress";
import DeploymentPanel from "./DeploymentPanel";
import { useSeoOptimization } from "@/hooks/useSeoOptimization";
import UrlInput from "./components/UrlInput";
import ApiKeyInput from "./components/ApiKeyInput";
import AdvancedOptionsPanel from "./components/AdvancedOptionsPanel";

const SeoOptimizationPanel: React.FC = () => {
  const {
    url,
    taskId,
    isLoading,
    isValid,
    task,
    advancedOptions,
    handleUrlChange,
    toggleOption,
    startOptimization,
    setAdvancedOptions,
  } = useSeoOptimization();

  const [activeTab, setActiveTab] = useState("crawler");

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
                Введите URL сайта и проверьте настройки нейросети для начала процесса SEO оптимизации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UrlInput url={url} isValid={isValid} onChange={handleUrlChange} />
              <ApiKeyInput />
              <AdvancedOptionsPanel 
                options={advancedOptions}
                onToggle={toggleOption}
                onMaxPagesChange={(value) => setAdvancedOptions(prev => ({ ...prev, maxPages: value }))}
              />
              <Button 
                onClick={startOptimization} 
                disabled={!isValid || isLoading}
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
