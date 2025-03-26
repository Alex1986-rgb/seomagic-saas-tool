
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, CreditCard, Package, Info, FileText, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OptimizationProgress from './OptimizationProgress';
import OptimizationDemo from './OptimizationDemo';

export interface OptimizationItem {
  type: string;
  count: number;
  pricePerUnit: number;
  totalPrice: number;
  description: string;
}

interface OptimizationCostProps {
  optimizationCost?: number;
  pageCount: number;
  url: string;
  onDownloadOptimized?: () => void;
  isOptimized?: boolean;
  className?: string;
  optimizationItems?: OptimizationItem[];
  onGeneratePdfReport?: () => void;
}

const OptimizationCost: React.FC<OptimizationCostProps> = ({
  optimizationCost,
  pageCount,
  url,
  onDownloadOptimized,
  isOptimized = false,
  className,
  optimizationItems = [],
  onGeneratePdfReport
}) => {
  const { toast } = useToast();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationStage, setOptimizationStage] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<{
    beforeScore: number;
    afterScore: number;
    demoPage?: {
      title: string;
      content: string;
      meta?: {
        description?: string;
        keywords?: string;
      };
      optimized?: {
        content: string;
        meta?: {
          description?: string;
          keywords?: string;
        };
      };
    };
  } | null>(null);
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  const handlePayment = () => {
    // В реальном приложении здесь будет интеграция с платежной системой
    toast({
      title: "Оплата успешно произведена",
      description: "Теперь вы можете запустить процесс оптимизации",
    });
    
    setIsPaymentComplete(true);
    setIsDialogOpen(false);
  };
  
  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setOptimizationStage('Начало процесса оптимизации...');
    
    // Симулируем процесс оптимизации
    const stages = [
      'Анализ структуры сайта...',
      'Оптимизация мета-тегов...',
      'Улучшение структуры контента...',
      'Оптимизация изображений...',
      'Исправление проблем с URL...',
      'Устранение дублей контента...',
      'Улучшение семантической структуры...',
      'Оптимизация ключевых слов...',
      'Применение SEO-рекомендаций...',
      'Финальная проверка...',
      'Создание оптимизированной версии...'
    ];
    
    for (let i = 0; i < stages.length; i++) {
      setOptimizationStage(stages[i]);
      
      // Обновляем прогресс
      const startProgress = (i / stages.length) * 100;
      const endProgress = ((i + 1) / stages.length) * 100;
      
      // Анимируем прогресс
      const stepDuration = i === stages.length - 1 ? 1000 : 500 + Math.random() * 1500;
      const steps = 10;
      
      for (let j = 0; j <= steps; j++) {
        const progress = startProgress + ((endProgress - startProgress) * (j / steps));
        setOptimizationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, stepDuration / steps));
      }
    }
    
    // Генерируем результаты оптимизации
    const beforeScore = Math.floor(Math.random() * 40) + 30; // 30-70
    const afterScore = Math.floor(Math.random() * 20) + 80; // 80-100
    
    // Демо-страница
    const demoPage = {
      title: `${url} - Главная страница`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna malesuada maximus. 
                
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lorem ut nunc fermentum laoreet.

Praesent nec nisi sed metus sollicitudin tincidunt vel nec arcu. Nullam tincidunt, dolor at posuere elementum, neque felis volutpat felis, vitae elementum turpis sem quis risus.`,
      meta: {
        description: 'Это описание страницы без ключевых слов',
        keywords: 'сайт, страница'
      },
      optimized: {
        content: `<h2>Великолепные возможности ${url}</h2>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna malesuada maximus.

<h3>Наши преимущества</h3>

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lorem ut nunc fermentum laoreet.

<h3>Инновационные решения</h3>

Praesent nec nisi sed metus sollicitudin tincidunt vel nec arcu. Nullam tincidunt, dolor at posuere elementum, neque felis volutpat felis, vitae elementum turpis sem quis risus.

<ul>
  <li>Высокое качество услуг: Мы предлагаем только лучшие решения для наших клиентов</li>
  <li>Инновационный подход: Используем современные технологии для достижения результатов</li>
  <li>Индивидуальные решения: Разрабатываем уникальные стратегии для каждого клиента</li>
  <li>Поддержка 24/7: Наша команда всегда готова помочь вам с любыми вопросами</li>
</ul>`,
        meta: {
          description: `${url} - ведущий сервис по предоставлению инновационных решений для бизнеса. Наша компания специализируется на разработке индивидуальных стратегий оптимизации и роста для клиентов по всему миру.`,
          keywords: 'оптимизация, инновации, качество, услуги, решения, поддержка, стратегия, бизнес, развитие, технологии'
        }
      }
    };
    
    setOptimizationResult({
      beforeScore,
      afterScore,
      demoPage
    });
    
    setIsOptimizing(false);
    setIsOptimized(true);
    
    toast({
      title: "Оптимизация завершена",
      description: `Сайт успешно оптимизирован! Оценка SEO повышена с ${beforeScore} до ${afterScore} баллов.`,
    });
  };
  
  if (!optimizationCost) return null;
  
  return (
    <motion.div 
      className={`border border-primary/20 rounded-lg p-4 bg-card/50 ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <CreditCard className="h-5 w-5 mr-2 text-primary" />
        Стоимость оптимизации
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Количество страниц</div>
          <div className="text-xl font-semibold">{formatNumber(pageCount)}</div>
        </div>
        
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
          <div className="text-xl font-semibold">{formatNumber(Math.round(optimizationCost / pageCount))} ₽</div>
        </div>
        
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
          <div className="text-xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
        </div>
      </div>
      
      {optimizationItems.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Тип оптимизации</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Цена за ед.</TableHead>
                <TableHead>Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimizationItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          {item.type}
                          <Info className="h-3 w-3 ml-1 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{formatNumber(item.count)}</TableCell>
                  <TableCell>{formatNumber(item.pricePerUnit)} ₽</TableCell>
                  <TableCell className="font-medium">{formatNumber(item.totalPrice)} ₽</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {isOptimizing ? (
        <OptimizationProgress 
          progress={optimizationProgress} 
          stage={optimizationStage} 
          className="mt-4 mb-4"
        />
      ) : null}
      
      {optimizationResult && (
        <OptimizationDemo
          beforeTitle={optimizationResult.demoPage?.title || ''}
          afterTitle={optimizationResult.demoPage?.title || ''}
          beforeContent={optimizationResult.demoPage?.content || ''}
          afterContent={optimizationResult.demoPage?.optimized?.content || ''}
          beforeMeta={optimizationResult.demoPage?.meta}
          afterMeta={optimizationResult.demoPage?.optimized?.meta}
          beforeScore={optimizationResult.beforeScore}
          afterScore={optimizationResult.afterScore}
          className="mt-6 mb-4"
        />
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Полная оптимизация SEO для {url} включает исправление всех ошибок
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Включает оптимизацию мета-тегов, заголовков, изображений, 
                  исправление дублей, оптимизацию URL, создание SEO-описаний
                  и переписывание контента согласно SEO-правилам
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-2">
          {onGeneratePdfReport && (
            <Button 
              onClick={onGeneratePdfReport}
              className="gap-2"
              variant="outline"
            >
              <FileText className="h-4 w-4" />
              Скачать PDF отчет
            </Button>
          )}
          
          {isOptimized || optimizationResult ? (
            <Button 
              onClick={onDownloadOptimized}
              className="gap-2"
              variant="default"
            >
              <Download className="h-4 w-4" />
              Скачать оптимизированный сайт
            </Button>
          ) : isPaymentComplete ? (
            <Button 
              onClick={startOptimization}
              className="gap-2"
              variant="default"
            >
              <Play className="h-4 w-4" />
              Запустить оптимизацию
            </Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">Оплатить и оптимизировать</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Оплата оптимизации</DialogTitle>
                  <DialogDescription>
                    Оптимизация сайта {url} будет выполнена после оплаты
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="rounded-lg bg-primary/10 p-4">
                    <h4 className="font-medium mb-2">Что включено:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Оптимизация всех мета-тегов
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Исправление проблем с изображениями
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Оптимизация контента для SEO
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Улучшение скорости загрузки
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Исправление технических проблем
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Удаление дублей и создание уникального контента
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Исправление URL (замена подчеркиваний на дефисы)
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <span className="font-medium">Итого к оплате:</span>
                    <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handlePayment} className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Оплатить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OptimizationCost;
