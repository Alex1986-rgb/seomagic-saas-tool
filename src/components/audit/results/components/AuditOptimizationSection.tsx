
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CostSummary from './optimization/CostSummary';
import CostDetailsTable from './optimization/CostDetailsTable';
import OptimizationProcessContainer from './optimization/process/OptimizationProcessContainer';
import OptimizationResults from './optimization/OptimizationResults';
import OptimizationActions from './optimization/OptimizationActions';

interface AuditOptimizationSectionProps {
  url: string;
  optimizationCost?: number;
  pageCount: number;
  optimizationItems?: any[];
  isOptimized?: boolean;
  showPrompt?: boolean;
  onTogglePrompt?: () => void;
  onOptimize?: () => void;
  onDownloadOptimizedSite?: () => void;
  onGeneratePdfReport?: () => void;
  contentPrompt?: string;
  setContentOptimizationPrompt?: (prompt: string) => void;
}

const AuditOptimizationSection: React.FC<AuditOptimizationSectionProps> = ({
  url,
  optimizationCost = 0,
  pageCount,
  optimizationItems = [],
  isOptimized = false,
  showPrompt = false,
  onTogglePrompt,
  onOptimize,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
  contentPrompt = "",
  setContentOptimizationPrompt
}) => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);

  const handlePayment = () => {
    toast({
      title: "Оплата успешно произведена",
      description: "Теперь вы можете запустить процесс оптимизации"
    });
    setIsPaymentComplete(true);
    setIsDialogOpen(false);
  };

  const startOptimization = () => {
    if (onOptimize) {
      onOptimize();
    }
    
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate optimization progress
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLocalIsOptimized(true);
          
          // Set demo result after completion
          setTimeout(() => {
            setOptimizationResult({
              beforeScore: 65,
              afterScore: 92,
            });
          }, 1000);
          
          return 100;
        }
        return prev + Math.random() * 2;
      });
    }, 200);
  };

  const handleSelectPrompt = (prompt: string) => {
    if (setContentOptimizationPrompt) {
      setContentOptimizationPrompt(prompt);
    }
    
    toast({
      title: "Шаблон выбран",
      description: "Параметры оптимизации установлены"
    });
  };

  if (!optimizationCost && !isOptimized && !showPrompt) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Оптимизация сайта</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Заказать оптимизацию сайта для улучшения его показателей в поисковых системах
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/optimization-demo">
              <Button>Посмотреть демо-версию</Button>
            </Link>
            {onGeneratePdfReport && (
              <Button onClick={onGeneratePdfReport} variant="outline">
                Скачать PDF отчёт
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Оптимизация сайта</CardTitle>
      </CardHeader>
      <CardContent>
        {showPrompt && setContentOptimizationPrompt && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={contentPrompt}
              onChange={(e) => setContentOptimizationPrompt(e.target.value)}
              className="w-full h-32 p-3 border rounded-md mb-3"
              placeholder="Введите инструкции для оптимизации контента..."
            />
          </motion.div>
        )}

        <CostSummary
          pageCount={pageCount}
          optimizationCost={optimizationCost}
        />
        
        <div className="my-4">
          <CostDetailsTable items={optimizationItems} />
        </div>
        
        {isOptimizing && !localIsOptimized && (
          <OptimizationProcessContainer 
            url={url} 
            progress={optimizationProgress} 
            setOptimizationResult={setOptimizationResult}
            setLocalIsOptimized={setLocalIsOptimized}
          />
        )}
        
        {optimizationResult && (
          <OptimizationResults
            url={url}
            optimizationResult={optimizationResult}
            onDownloadOptimized={onDownloadOptimizedSite}
            onGeneratePdfReport={onGeneratePdfReport}
          />
        )}
        
        <div className="flex justify-end mt-4">
          <OptimizationActions
            url={url}
            optimizationCost={optimizationCost}
            isOptimized={localIsOptimized || isOptimized}
            isPaymentComplete={isPaymentComplete}
            onDownloadOptimized={onDownloadOptimizedSite}
            onGeneratePdfReport={onGeneratePdfReport}
            onStartOptimization={startOptimization}
            onPayment={handlePayment}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onSelectPrompt={handleSelectPrompt}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditOptimizationSection;
