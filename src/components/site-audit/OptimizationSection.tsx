
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  CheckCircle, 
  CreditCard, 
  Download, 
  FileText, 
  ShoppingCart, 
  ArrowRightCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { useOptimization } from '@/features/audit/hooks/useOptimization';

interface OptimizationSectionProps {
  url: string;
  auditData: any;
}

const OptimizationSection: React.FC<OptimizationSectionProps> = ({ url, auditData }) => {
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'estimate' | 'payment' | 'confirmation' | 'completed'>('estimate');
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('issues');
  
  const {
    optimizationCost,
    optimizationItems,
    isOptimized,
    downloadOptimizedSite,
    generatePdfReportFile,
    setOptimizationCost,
    setOptimizationItems
  } = useOptimization(url);

  // Функция для вычисления количества проблем по категориям
  const countIssues = () => {
    if (!auditData || !auditData.issues) return { critical: 0, important: 0, minor: 0, opportunities: 0 };
    
    return {
      critical: auditData.issues.critical?.length || 0,
      important: auditData.issues.important?.length || 0,
      minor: auditData.issues.minor?.length || 0,
      opportunities: auditData.issues.opportunities?.length || 0
    };
  };
  
  const issueCount = countIssues();
  const totalIssues = issueCount.critical + issueCount.important + issueCount.minor + issueCount.opportunities;
  
  // Расчет стоимости оптимизации на основе количества проблем и страниц
  useEffect(() => {
    if (!optimizationCost) {
      // Базовая стоимость плюс стоимость по каждой категории проблем
      const baseCost = 5000;
      const criticalCost = issueCount.critical * 1500;
      const importantCost = issueCount.important * 800;
      const minorCost = issueCount.minor * 300;
      const opportunitiesCost = issueCount.opportunities * 500;
      
      const pageCount = auditData.pageCount || 1;
      const pageFactor = Math.min(1.5, 1 + (pageCount / 100)); // Увеличение до максимум 50% в зависимости от количества страниц
      
      const totalCost = Math.round((baseCost + criticalCost + importantCost + minorCost + opportunitiesCost) * pageFactor);
      
      setOptimizationCost(totalCost);
      
      // Создаем элементы оптимизации для отображения в таблице
      const items = [
        {
          name: "Базовая оптимизация",
          description: `Базовая SEO-оптимизация сайта`,
          count: 1,
          price: baseCost,
          pricePerUnit: baseCost,
          totalPrice: baseCost,
          type: "base"
        },
        {
          name: "Критические проблемы",
          description: `Исправление критических SEO-проблем`,
          count: issueCount.critical,
          price: 1500,
          pricePerUnit: 1500,
          totalPrice: criticalCost,
          type: "critical"
        },
        {
          name: "Важные проблемы",
          description: `Исправление важных SEO-проблем`,
          count: issueCount.important,
          price: 800,
          pricePerUnit: 800,
          totalPrice: importantCost,
          type: "important"
        },
        {
          name: "Незначительные проблемы",
          description: `Исправление незначительных SEO-проблем`,
          count: issueCount.minor,
          price: 300,
          pricePerUnit: 300,
          totalPrice: minorCost,
          type: "minor"
        },
        {
          name: "Возможности улучшения",
          description: `Реализация возможностей улучшения SEO`,
          count: issueCount.opportunities,
          price: 500,
          pricePerUnit: 500,
          totalPrice: opportunitiesCost,
          type: "opportunity"
        }
      ];
      
      setOptimizationItems(items);
    }
  }, [auditData, issueCount, setOptimizationCost, setOptimizationItems, optimizationCost]);

  // Обработчик для процесса оплаты
  const handlePayment = () => {
    setIsLoading(true);
    
    // Имитируем процесс оплаты
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStep('confirmation');
      toast({
        title: "Оплата успешно произведена",
        description: "Вы можете запустить процесс оптимизации",
      });
    }, 2000);
  };

  // Обработчик для запуска процесса оптимизации
  const handleStartOptimization = () => {
    setPaymentStep('completed');
    setIsLoading(true);
    
    // Имитируем процесс оптимизации с прогрессом
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        const newValue = prev + Math.random() * 5;
        if (newValue >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          toast({
            title: "Оптимизация завершена",
            description: "Сайт успешно оптимизирован!",
          });
          return 100;
        }
        return newValue;
      });
    }, 300);
  };

  // Форматирование цены
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };

  return (
    <div className="space-y-8">
      {paymentStep === 'estimate' && (
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Оптимизация сайта {url}</CardTitle>
              <CardDescription>
                На основе проведенного аудита мы предлагаем следующую оптимизацию:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="issues">Проблемы и стоимость</TabsTrigger>
                  <TabsTrigger value="details">Детали оптимизации</TabsTrigger>
                </TabsList>
                
                <TabsContent value="issues" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Критические проблемы</p>
                            <p className="text-2xl font-bold">{issueCount.critical}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Важные проблемы</p>
                            <p className="text-2xl font-bold">{issueCount.important}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Незначительные</p>
                            <p className="text-2xl font-bold">{issueCount.minor}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Возможности</p>
                            <p className="text-2xl font-bold">{issueCount.opportunities}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Категория</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Описание</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Количество</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Цена за шт.</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Сумма</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {optimizationItems?.map((item, index) => (
                          <tr key={index} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.count}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatCurrency(item.pricePerUnit)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                        <tr className="bg-muted/20">
                          <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">Общая стоимость:</td>
                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-primary">{formatCurrency(optimizationCost || 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Что включает оптимизация?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Исправление всех проблем</p>
                          <p className="text-sm text-muted-foreground">Мы устраним обнаруженные при аудите проблемы, влияющие на SEO-показатели сайта</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Оптимизация контента</p>
                          <p className="text-sm text-muted-foreground">Оптимизация текстов, мета-тегов и заголовков для лучшего ранжирования</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Техническая оптимизация</p>
                          <p className="text-sm text-muted-foreground">Улучшение скорости загрузки, мобильной версии и технических аспектов сайта</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Оптимизированная версия сайта</p>
                          <p className="text-sm text-muted-foreground">Вы получите полностью оптимизированную версию вашего сайта</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Детальный отчет</p>
                          <p className="text-sm text-muted-foreground">PDF-отчет с подробностями оптимизации и рекомендациями</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Ожидаемые результаты</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>SEO рейтинг</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{auditData?.score || 0}/100</span>
                            <ArrowRightCircle className="h-4 w-4 mx-2 text-primary" />
                            <span className="font-medium text-primary">{Math.min(100, Math.floor((auditData?.score || 0) * 1.4))}/100</span>
                          </div>
                        </div>
                        <Progress value={auditData?.score || 0} max={100} className="h-2 bg-muted" />
                        <Progress value={Math.min(100, Math.floor((auditData?.score || 0) * 1.4))} max={100} className="h-2 bg-primary" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-medium">Улучшение позиций</p>
                          <p className="text-3xl font-bold text-primary">↑40%</p>
                          <p className="text-sm text-muted-foreground text-center">Среднее улучшение позиций в поисковых системах</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-medium">Рост трафика</p>
                          <p className="text-3xl font-bold text-primary">↑65%</p>
                          <p className="text-sm text-muted-foreground text-center">Прогнозируемый рост органического трафика</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-medium">Конверсия</p>
                          <p className="text-3xl font-bold text-primary">↑25%</p>
                          <p className="text-sm text-muted-foreground text-center">Потенциальный рост конверсии сайта</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex justify-center">
                <Button 
                  className="w-full max-w-md text-lg py-6" 
                  onClick={() => setPaymentStep('payment')}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> 
                  Заказать оптимизацию за {formatCurrency(optimizationCost || 0)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {paymentStep === 'payment' && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Оформление заказа</CardTitle>
              <CardDescription>
                Заполните данные для оплаты оптимизации сайта {url}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Имя</label>
                    <input
                      id="name"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Имя Фамилия"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Телефон</label>
                    <input
                      id="phone"
                      type="tel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="+7 (XXX) XXX-XX-XX"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-lg font-medium mb-2">Детали оплаты</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="card" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Номер карты</label>
                      <input
                        id="card"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="expiry" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Срок действия</label>
                        <input
                          id="expiry"
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="cvv" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">CVV</label>
                        <input
                          id="cvv"
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="XXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-medium">Итого к оплате:</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(optimizationCost || 0)}</p>
                  </div>
                  
                  <Button 
                    onClick={handlePayment} 
                    disabled={isLoading} 
                    className="px-6"
                  >
                    {isLoading ? (
                      <>Обработка...</>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> 
                        Оплатить
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setPaymentStep('estimate')}
              className="mt-4"
            >
              Вернуться назад
            </Button>
          </div>
        </motion.div>
      )}
      
      {paymentStep === 'confirmation' && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Оплата успешно произведена</CardTitle>
              <CardDescription>
                Заказ на оптимизацию сайта {url} успешно оформлен и оплачен
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="border rounded-lg bg-muted/50 p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Сумма платежа</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(optimizationCost || 0)}</p>
              </div>
              
              <p className="text-muted-foreground">
                Нажмите кнопку ниже, чтобы начать процесс оптимизации вашего сайта.
                Это может занять некоторое время в зависимости от размера сайта и количества проблем.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleStartOptimization}
                className="w-full mt-4"
              >
                Начать оптимизацию
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {paymentStep === 'completed' && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              {optimizationProgress >= 100 ? (
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
              ) : (
                <div className="text-center mb-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${optimizationProgress * 2.51} 251`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
                      <span className="text-xl font-medium">{Math.round(optimizationProgress)}%</span>
                    </div>
                  </div>
                </div>
              )}
              
              <CardTitle className="text-2xl">
                {optimizationProgress >= 100 ? "Оптимизация завершена" : "Оптимизация в процессе..."}
              </CardTitle>
              
              <CardDescription>
                {optimizationProgress >= 100 
                  ? `Сайт ${url} успешно оптимизирован!` 
                  : `Пожалуйста, дождитесь завершения процесса оптимизации сайта ${url}`}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {optimizationProgress < 100 ? (
                <div className="space-y-4">
                  <Progress value={optimizationProgress} className="h-2" />
                  <p className="text-center text-muted-foreground text-sm">
                    Идёт оптимизация сайта. Этот процесс может занять несколько минут.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">До оптимизации</p>
                          <div className="flex items-baseline mt-1">
                            <span className="text-3xl font-bold">{auditData?.score || 65}</span>
                            <span className="text-sm text-muted-foreground ml-1">/100</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">После оптимизации</p>
                          <div className="flex items-baseline mt-1">
                            <span className="text-3xl font-bold text-primary">{Math.min(100, Math.floor((auditData?.score || 65) * 1.4))}</span>
                            <span className="text-sm text-muted-foreground ml-1">/100</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Улучшение SEO-оценки</p>
                        <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${Math.min(100, Math.floor((auditData?.score || 65) * 1.4))}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => downloadOptimizedSite()}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Скачать оптимизированный сайт
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => generatePdfReportFile()}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Скачать отчёт PDF
                    </Button>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-500">Оптимизация успешно выполнена!</p>
                        <p className="text-sm text-green-700 dark:text-green-400">Вы можете скачать оптимизированную версию сайта или полный отчет о проделанной работе.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default OptimizationSection;
