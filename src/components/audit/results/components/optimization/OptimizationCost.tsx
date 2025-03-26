
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OptimizationProgress from '../OptimizationProgress';
import OptimizationDemo from '../OptimizationDemo';
import CostSummary from './CostSummary';
import CostDetailsTable, { OptimizationItem } from './CostDetailsTable';
import OptimizationActions from './OptimizationActions';

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
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);
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
  
  const isOptimizedState = isOptimized || localIsOptimized;
  
  const handlePayment = () => {
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
      
      const startProgress = (i / stages.length) * 100;
      const endProgress = ((i + 1) / stages.length) * 100;
      
      const stepDuration = i === stages.length - 1 ? 1000 : 500 + Math.random() * 1500;
      const steps = 10;
      
      for (let j = 0; j <= steps; j++) {
        const progress = startProgress + ((endProgress - startProgress) * (j / steps));
        setOptimizationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, stepDuration / steps));
      }
    }
    
    const beforeScore = Math.floor(Math.random() * 40) + 30;
    const afterScore = Math.floor(Math.random() * 20) + 80;
    
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
    setLocalIsOptimized(true);
    
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
      
      <CostSummary pageCount={pageCount} optimizationCost={optimizationCost} />
      
      <CostDetailsTable optimizationItems={optimizationItems} />
      
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
        
        <OptimizationActions 
          url={url}
          optimizationCost={optimizationCost}
          isOptimized={isOptimizedState}
          isPaymentComplete={isPaymentComplete}
          onDownloadOptimized={onDownloadOptimized}
          onGeneratePdfReport={onGeneratePdfReport}
          onStartOptimization={startOptimization}
          onPayment={handlePayment}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </motion.div>
  );
};

export default OptimizationCost;
