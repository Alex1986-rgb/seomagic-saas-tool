import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Code, Zap, TrendingUp, Clock } from 'lucide-react';
import SafeContent from '@/components/shared/SafeContent';

interface OptimizationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  beforeCode?: string;
  afterCode?: string;
  impact: 'low' | 'medium' | 'high';
  estimatedTime: number;
}

const mockOptimizationSteps: OptimizationStep[] = [
  {
    id: '1',
    title: 'Минификация CSS',
    description: 'Уменьшение размера CSS файлов для ускорения загрузки страницы.',
    status: 'pending',
    progress: 0,
    beforeCode: `<link rel="stylesheet" href="styles.css">`,
    afterCode: `<link rel="stylesheet" href="styles.min.css">`,
    impact: 'medium',
    estimatedTime: 30
  },
  {
    id: '2',
    title: 'Оптимизация изображений',
    description: 'Сжатие изображений без потери качества для уменьшения времени загрузки.',
    status: 'running',
    progress: 50,
    beforeCode: `<img src="image.png" alt="Image">`,
    afterCode: `<img src="image.webp" alt="Image">`,
    impact: 'high',
    estimatedTime: 60
  },
  {
    id: '3',
    title: 'Отложенная загрузка JavaScript',
    description: 'Загрузка JavaScript файлов после основной загрузки контента.',
    status: 'completed',
    progress: 100,
    beforeCode: `<script src="script.js"></script>`,
    afterCode: `<script src="script.js" defer></script>`,
    impact: 'high',
    estimatedTime: 45
  },
  {
    id: '4',
    title: 'Включение сжатия Gzip',
    description: 'Сжатие передаваемых файлов для уменьшения трафика.',
    status: 'error',
    progress: 0,
    beforeCode: ``,
    afterCode: ``,
    impact: 'medium',
    estimatedTime: 20
  },
  {
    id: '5',
    title: 'Кеширование браузера',
    description: 'Настройка кеширования для статических ресурсов.',
    status: 'pending',
    progress: 0,
    beforeCode: ``,
    afterCode: ``,
    impact: 'low',
    estimatedTime: 15
  }
];

const OptimizationDemo: React.FC = () => {
  const [steps, setSteps] = useState<OptimizationStep[]>(mockOptimizationSteps);
  const [activeStep, setActiveStep] = useState<OptimizationStep | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Имитация выбора первого шага при монтировании компонента
    if (steps.length > 0 && !activeStep) {
      setActiveStep(steps[0]);
    }
  }, [steps, activeStep]);

  useEffect(() => {
    // Обновление общего прогресса
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const totalSteps = steps.length;
    const newProgress = (completedSteps / totalSteps) * 100;
    setProgress(newProgress);
  }, [steps]);

  const startOptimization = () => {
    if (activeStep) {
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === activeStep.id ? { ...step, status: 'running', progress: 20 } : step
        )
      );

      // Имитация выполнения шага
      setTimeout(() => {
        setSteps(prevSteps =>
          prevSteps.map(step =>
            step.id === activeStep.id ? { ...step, status: 'completed', progress: 100 } : step
          )
        );
      }, 2000);
    }
  };

  const markAsError = () => {
    if (activeStep) {
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === activeStep.id ? { ...step, status: 'error', progress: 0 } : step
        )
      );
    }
  };

  const resetStep = () => {
    if (activeStep) {
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === activeStep.id ? { ...step, status: 'pending', progress: 0 } : step
        )
      );
    }
  };

  const nextStep = () => {
    if (activeStep) {
      const currentIndex = steps.findIndex(step => step.id === activeStep.id);
      if (currentIndex < steps.length - 1) {
        setActiveStep(steps[currentIndex + 1]);
      }
    }
  };

  const renderCodeBlock = (code: string, title: string) => {
    // Safely render code without XSS vulnerabilities
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="bg-muted p-4 rounded-md font-mono text-sm">
          <SafeContent 
            content={code}
            allowedTags={['pre', 'code', 'span']}
            allowedAttributes={['class']}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Оптимизация производительности
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Общий прогресс</h3>
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {progress.toFixed(1)}% завершено
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-md font-medium">Шаги оптимизации</h4>
          <ul className="space-y-2">
            {steps.map(step => (
              <li key={step.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {step.status === 'running' && (
                    <Clock className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  {step.status === 'pending' && (
                    <Code className="h-4 w-4 text-gray-400" />
                  )}
                  
                  <span>{step.title}</span>
                </div>
                
                <div>
                  {activeStep?.id === step.id && (
                    <Badge variant="secondary">Текущий шаг</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {activeStep && (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="text-md font-medium">{activeStep.title}</h4>
            <p className="text-sm text-muted-foreground">{activeStep.description}</p>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Влияние: {activeStep.impact}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                Время выполнения: {activeStep.estimatedTime} секунд
              </span>
            </div>
            
            <Progress value={activeStep.progress} />
            
            <div className="flex justify-between">
              {activeStep.status === 'pending' && (
                <Button onClick={startOptimization}>Начать оптимизацию</Button>
              )}
              
              {activeStep.status === 'running' && (
                <Button disabled>В процессе...</Button>
              )}
              
              {activeStep.status === 'completed' && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={nextStep}>Следующий шаг</Button>
                </div>
              )}
              
              {activeStep.status === 'error' && (
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={resetStep}>Повторить</Button>
                </div>
              )}
              
              {activeStep.status !== 'completed' && activeStep.status !== 'running' && (
                <Button variant="destructive" onClick={markAsError}>
                  Отметить как ошибку
                </Button>
              )}
            </div>
          </div>
        )}
        
        {activeStep && activeStep.beforeCode && activeStep.afterCode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {renderCodeBlock(activeStep.beforeCode, "До оптимизации")}
            {renderCodeBlock(activeStep.afterCode, "После оптимизации")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationDemo;
