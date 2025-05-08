
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, FileDown, Settings, Download } from 'lucide-react';
import ContentOptimizationPrompt from './ContentOptimizationPrompt';
import OptimizationPricingTable from './OptimizationPricingTable';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface AuditOptimizationProps {
  taskId?: string | null;
  optimizationItems: OptimizationItem[];
  optimizationCost: number;
  contentPrompt: string;
  isOptimized: boolean;
  currentScore?: number;
  estimatedScore?: number;
  url: string; // Added url prop
  setContentPrompt: (prompt: string) => void;
  onOptimizeSiteContent: () => Promise<any>;
  onDownloadOptimizedSite?: () => Promise<void>;
}

const AuditOptimization: React.FC<AuditOptimizationProps> = ({
  taskId,
  optimizationItems,
  optimizationCost,
  contentPrompt,
  isOptimized,
  currentScore,
  estimatedScore,
  url, // Added url prop
  setContentPrompt,
  onOptimizeSiteContent,
  onDownloadOptimizedSite
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pricing");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleOptimize = async () => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "ID задачи не найден",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set payment as successful
      setPaymentStatus('success');
      toast({
        title: "Оплата прошла успешно",
        description: "Начинаем процесс оптимизации сайта",
      });
      
      // Move to content tab after successful payment
      setActiveTab("content");
      
      // Wait a moment before starting optimization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast({
        title: "Ошибка оплаты",
        description: "Не удалось провести оплату. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleStartOptimization = async () => {
    if (!contentPrompt.trim()) {
      toast({
        title: "Введите промпт",
        description: "Пожалуйста, введите промпт для оптимизации контента",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsOptimizing(true);
      await onOptimizeSiteContent();
      
      toast({
        title: "Оптимизация завершена",
        description: "Сайт успешно оптимизирован",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось оптимизировать сайт. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleDownloadOptimizedSite = async () => {
    if (!onDownloadOptimizedSite) return;
    
    try {
      toast({
        title: "Подготовка архива",
        description: "Пожалуйста, подождите...",
      });
      
      await onDownloadOptimizedSite();
      
      toast({
        title: "Готово",
        description: "Оптимизированный сайт скачан",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось скачать оптимизированный сайт",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Оптимизация сайта AI-технологиями
          </CardTitle>
          <CardDescription>
            Автоматическое исправление SEO-проблем и улучшение контента с помощью искусственного интеллекта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pricing">Стоимость и оплата</TabsTrigger>
              <TabsTrigger value="content">Оптимизация контента</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pricing" className="pt-4">
              {optimizationItems.length > 0 ? (
                <OptimizationPricingTable 
                  items={optimizationItems}
                  totalCost={optimizationCost}
                  onOptimize={!isOptimized && paymentStatus !== 'success' ? handleOptimize : undefined}
                  currentScore={currentScore}
                  estimatedScore={estimatedScore}
                  isOptimized={isOptimized}
                  onDownload={isOptimized ? handleDownloadOptimizedSite : undefined}
                />
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Данные не загружены</AlertTitle>
                  <AlertDescription>
                    Необходимо завершить сканирование сайта для расчета стоимости оптимизации.
                  </AlertDescription>
                </Alert>
              )}
              
              {paymentStatus === 'success' && !isOptimized && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Оплата прошла успешно</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>Теперь вы можете перейти к настройке оптимизации контента.</p>
                    <Button 
                      onClick={() => setActiveTab("content")} 
                      variant="outline" 
                      className="w-full sm:w-auto mt-2"
                    >
                      Перейти к оптимизации контента
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {isOptimized && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Сайт успешно оптимизирован</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>Оптимизация сайта завершена. Вы можете скачать оптимизированную версию.</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        onClick={handleDownloadOptimizedSite} 
                        className="w-full sm:w-auto"
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Скачать оптимизированный сайт
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="content" className="pt-4">
              <div className="space-y-6">
                <Alert>
                  <AlertTitle>Настройка AI-оптимизации контента</AlertTitle>
                  <AlertDescription>
                    Укажите инструкции для AI по улучшению текстов сайта. Вы можете выбрать готовый шаблон или создать собственный промпт.
                  </AlertDescription>
                </Alert>
                
                <ContentOptimizationPrompt 
                  prompt={contentPrompt}
                  setPrompt={setContentPrompt}
                  onOptimize={paymentStatus === 'success' || isOptimized ? handleStartOptimization : undefined}
                  disabled={paymentStatus !== 'success' && !isOptimized}
                  isOptimizing={isOptimizing}
                />
                
                {isOptimized && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Оптимизация завершена</AlertTitle>
                    <AlertDescription className="flex flex-col gap-2">
                      <p>Контент сайта был успешно оптимизирован по вашему запросу.</p>
                      <Button 
                        onClick={handleDownloadOptimizedSite} 
                        variant="outline"
                        className="gap-2 w-full sm:w-auto mt-2"
                      >
                        <FileDown className="h-4 w-4" />
                        Скачать оптимизированный сайт
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                {!isOptimized && paymentStatus !== 'success' && (
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Требуется оплата</AlertTitle>
                    <AlertDescription className="flex flex-col gap-2">
                      <p>Для продолжения необходимо оплатить услуги оптимизации.</p>
                      <Button 
                        onClick={() => setActiveTab("pricing")} 
                        variant="outline" 
                        className="mt-2 w-full sm:w-auto"
                      >
                        Перейти к оплате
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditOptimization;
