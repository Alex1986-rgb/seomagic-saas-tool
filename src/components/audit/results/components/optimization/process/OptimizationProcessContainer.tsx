
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, Check, AlertCircle, Zap, Code, Server, Database, LineChart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface OptimizationProcessStage {
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface OptimizationProcessContainerProps {
  url: string;
  progress: number;
  setOptimizationResult: (result: any) => void;
  setLocalIsOptimized: (isOptimized: boolean) => void;
}

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  progress,
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  const [currentStage, setCurrentStage] = useState<string>('Анализ страниц');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [stages, setStages] = useState<OptimizationProcessStage[]>([
    { name: 'Анализ страниц', description: 'Сканирование структуры сайта, анализ контента и мета-тегов', status: 'pending' },
    { name: 'Оптимизация мета-тегов', description: 'Улучшение title, description и других мета-тегов', status: 'pending' },
    { name: 'Улучшение контента', description: 'Оптимизация текстов, заголовков и ключевых слов', status: 'pending' },
    { name: 'Оптимизация изображений', description: 'Сжатие и переименование изображений, добавление alt-тегов', status: 'pending' },
    { name: 'Применение изменений', description: 'Компиляция оптимизированной версии сайта', status: 'pending' }
  ]);
  const [serverResources, setServerResources] = useState({
    cpu: { usage: Math.floor(70 + Math.random() * 20), available: 100, threads: 32 },
    memory: { usage: Math.floor(50 + Math.random() * 30), available: 64, unit: 'GB' },
    storage: { usage: Math.floor(40 + Math.random() * 20), available: 500, unit: 'GB' },
    network: { speed: Math.floor(800 + Math.random() * 200), unit: 'Mbps' }
  });
  const [activeSites, setActiveSites] = useState([
    { domain: 'example1.com', progress: 78, stage: 'Улучшение контента' },
    { domain: 'example2.com', progress: 32, stage: 'Оптимизация мета-тегов' },
    { domain: 'example3.com', progress: 91, stage: 'Применение изменений' },
  ]);
  const { toast } = useToast();
  
  // Update the server resources periodically to simulate real-time monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setServerResources(prev => ({
        cpu: { 
          ...prev.cpu, 
          usage: Math.min(Math.max(prev.cpu.usage + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5, 60), 95) 
        },
        memory: { 
          ...prev.memory, 
          usage: Math.min(Math.max(prev.memory.usage + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 3, 40), 85) 
        },
        storage: { ...prev.storage },
        network: { 
          ...prev.network, 
          speed: Math.min(Math.max(prev.network.speed + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 50, 700), 1000) 
        }
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update the current stage and stage statuses based on progress
  useEffect(() => {
    let activeStageIndex = 0;
    
    if (progress < 20) {
      activeStageIndex = 0;
      setCurrentStage('Анализ страниц');
    } else if (progress < 40) {
      activeStageIndex = 1;
      setCurrentStage('Оптимизация мета-тегов');
    } else if (progress < 60) {
      activeStageIndex = 2;
      setCurrentStage('Улучшение контента');
    } else if (progress < 80) {
      activeStageIndex = 3;
      setCurrentStage('Оптимизация изображений');
    } else {
      activeStageIndex = 4;
      setCurrentStage('Применение изменений');
    }
    
    // Update stage statuses based on active stage
    setStages(prevStages => 
      prevStages.map((stage, index) => ({
        ...stage,
        status: index < activeStageIndex 
          ? 'completed' 
          : index === activeStageIndex 
            ? 'active' 
            : 'pending'
      }))
    );
    
    // Notify about stage changes
    if (progress > 0 && progress <= 100 && activeStageIndex > 0 && stages[activeStageIndex].status !== 'active') {
      toast({
        title: `Этап завершен: ${stages[activeStageIndex-1].name}`,
        description: `Переходим к этапу: ${stages[activeStageIndex].name}`,
        variant: "default",
      });
    }
    
  }, [progress, toast, stages]);
  
  // Update active sites progress to simulate real-time optimization of multiple sites
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSites(prev => 
        prev.map(site => {
          // Increase progress randomly
          const newProgress = Math.min(site.progress + Math.random() * 2, 100);
          
          // Update stage based on progress
          let newStage = site.stage;
          if (newProgress < 20) newStage = 'Анализ страниц';
          else if (newProgress < 40) newStage = 'Оптимизация мета-тегов';
          else if (newProgress < 60) newStage = 'Улучшение контента';
          else if (newProgress < 80) newStage = 'Оптимизация изображений';
          else newStage = 'Применение изменений';
          
          return { ...site, progress: newProgress, stage: newStage };
        })
      );
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStageIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Loader2 className="animate-spin h-4 w-4 text-primary" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border border-muted-foreground/30"></div>;
    }
  };
  
  return (
    <div className="my-6 p-6 border border-primary/20 rounded-lg bg-background/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5 text-primary" />
          <h3 className="font-medium text-lg">Оптимизация сайта {url}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Server className="h-4 w-4" />
          <span>Процессов: 28/32</span>
          <span>•</span>
          <span>RAM: {serverResources.memory.usage}/{serverResources.memory.available}GB</span>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="system">Ресурсы системы</TabsTrigger>
          <TabsTrigger value="active-sites">Активные сайты ({activeSites.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="relative mb-2">
            <Progress value={progress} className="h-3 mb-2" />
            <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1 pointer-events-none">
              {stages.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-3 w-0.5 ${index === 0 || index === stages.length - 1 ? 'opacity-0' : 'bg-background/30'}`}
                  style={{ left: `${(index + 1) * (100 / stages.length)}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm mb-4">
            <span className="font-medium text-primary">{currentStage}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          
          <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
            {stages.map((stage, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-md transition-colors ${
                  stage.status === 'active' ? 'border-primary/50 bg-primary/5' : 
                  stage.status === 'completed' ? 'border-green-500/20 bg-green-500/5' : 'border-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStageIcon(stage.status)}
                  <h4 className={`font-medium ${stage.status === 'active' ? 'text-primary' : ''}`}>{stage.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">{stage.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-3 w-3" />
            Пожалуйста, не закрывайте страницу во время оптимизации. 
            Процесс может занять до 5 минут в зависимости от размера сайта.
          </div>
          
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-muted-foreground">Начало: {new Date().toLocaleTimeString()}</span>
            <span className="text-muted-foreground">
              Ожидаемое время окончания: {new Date(Date.now() + (100 - progress) * 3000).toLocaleTimeString()}
            </span>
          </div>
        </TabsContent>
        
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Использование CPU
                </h4>
                <span className="text-sm font-bold">{serverResources.cpu.usage}%</span>
              </div>
              <Progress value={serverResources.cpu.usage} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground mt-1">
                Активно {Math.ceil(serverResources.cpu.usage / 100 * serverResources.cpu.threads)} из {serverResources.cpu.threads} потоков
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Database className="h-4 w-4 text-blue-500" />
                  Использование RAM
                </h4>
                <span className="text-sm font-bold">{serverResources.memory.usage}/{serverResources.memory.available} {serverResources.memory.unit}</span>
              </div>
              <Progress value={(serverResources.memory.usage / serverResources.memory.available) * 100} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground mt-1">
                Доступно {serverResources.memory.available - serverResources.memory.usage} {serverResources.memory.unit} свободной памяти
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Server className="h-4 w-4 text-indigo-500" />
                  Дисковое пространство
                </h4>
                <span className="text-sm font-bold">{serverResources.storage.usage}/{serverResources.storage.available} {serverResources.storage.unit}</span>
              </div>
              <Progress value={(serverResources.storage.usage / serverResources.storage.available) * 100} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground mt-1">
                Доступно {serverResources.storage.available - serverResources.storage.usage} {serverResources.storage.unit} свободного места
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <LineChart className="h-4 w-4 text-emerald-500" />
                  Сетевая активность
                </h4>
                <span className="text-sm font-bold">{Math.round(serverResources.network.speed)} {serverResources.network.unit}</span>
              </div>
              <Progress value={(serverResources.network.speed / 1000) * 100} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground mt-1">
                Пропускная способность 1 Gbps, текущая загрузка {Math.round((serverResources.network.speed / 1000) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="mt-4 border rounded-lg p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium mb-3">
              <Code className="h-4 w-4 text-violet-500" />
              Логи оптимизации
            </h4>
            <div className="bg-black/90 text-green-400 p-3 rounded text-xs font-mono h-32 overflow-y-auto">
              <div>[{new Date(Date.now() - 25000).toLocaleTimeString()}] Инициализация процесса оптимизации для {url}</div>
              <div>[{new Date(Date.now() - 20000).toLocaleTimeString()}] Выделено 4 потока CPU, 2GB RAM для задачи</div>
              <div>[{new Date(Date.now() - 18000).toLocaleTimeString()}] Начато сканирование структуры сайта</div>
              <div>[{new Date(Date.now() - 15000).toLocaleTimeString()}] Обнаружено 142 страницы для оптимизации</div>
              <div>[{new Date(Date.now() - 12000).toLocaleTimeString()}] Анализ мета-тегов: найдено 37 страниц с неоптимальными тегами</div>
              <div>[{new Date(Date.now() - 10000).toLocaleTimeString()}] Загрузка ресурсов сайта для оптимизации: 75 изображений, 23 JS файла</div>
              <div>[{new Date(Date.now() - 8000).toLocaleTimeString()}] Создание оптимизированной структуры сайта</div>
              <div>[{new Date(Date.now() - 5000).toLocaleTimeString()}] Запуск многопоточной оптимизации контента</div>
              <div>[{new Date(Date.now() - 2000).toLocaleTimeString()}] Применение SEO-оптимизаций для улучшения рейтинга</div>
              <div>[{new Date().toLocaleTimeString()}] Текущий прогресс: {Math.round(progress)}%, этап: {currentStage}</div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="active-sites">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Всего активных сайтов</span>
                </div>
                <span className="font-bold">{activeSites.length}</span>
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Доступные слоты</span>
                </div>
                <span className="font-bold">{32 - activeSites.length}</span>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {activeSites.map((site, index) => (
                <AccordionItem key={index} value={`site-${index}`}>
                  <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-muted/20 rounded-t-md">
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="font-medium">{site.domain}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{site.stage}</span>
                        <Progress value={site.progress} className="w-24 h-2" />
                        <span className="text-xs font-medium">{Math.round(site.progress)}%</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2 bg-muted/10 rounded-b-md">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Текущий этап:</span>
                        <span>{site.stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Выделено ресурсов:</span>
                        <span>{Math.floor(2 + Math.random() * 2)} потоков, {Math.floor(1 + Math.random() * 1.5).toFixed(1)}GB RAM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Начало оптимизации:</span>
                        <span>{new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ожидаемое завершение:</span>
                        <span>{new Date(Date.now() + (100 - site.progress) * 2000).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationProcessContainer;
