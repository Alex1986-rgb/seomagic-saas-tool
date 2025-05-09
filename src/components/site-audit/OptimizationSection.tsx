import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Settings, FileText, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import OptimizationProgress from '@/components/seo-optimization/OptimizationProgress';
import OptimizationDemo from '@/components/audit/results/components/OptimizationDemo';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AuditData } from '@/types/audit';

interface OptimizationSectionProps {
  url: string;
  auditData: AuditData;
}

const seoPromptTemplates = [
  {
    id: 'standard',
    name: 'Стандартный',
    prompt: 'Оптимизировать мета-теги, заголовки и содержание страниц для повышения SEO-рейтинга. Исправить технические ошибки и улучшить читабельность контента.'
  },
  {
    id: 'ecommerce',
    name: 'Для интернет-магазина',
    prompt: 'Оптимизировать страницы товаров, категорий и описания для улучшения конверсии и SEO. Добавить микроразметку Schema.org и улучшить мета-теги с ориентацией на коммерческие запросы.'
  },
  {
    id: 'blog',
    name: 'Для блога',
    prompt: 'Улучшить структуру контента, заголовки, внутреннюю перелинковку и мета-теги для повышения органического трафика. Оптимизировать для ответов на вопросы.'
  },
  {
    id: 'corporate',
    name: 'Для корпоративного сайта',
    prompt: 'Оптимизировать представление услуг, кейсов и информации о компании. Улучшить авторитетность и профессиональную лексику, сохраняя строгий деловой стиль.'
  }
];

const OptimizationSection: React.FC<OptimizationSectionProps> = ({ url, auditData }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pricing");
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [seoPrompt, setSeoPrompt] = useState(seoPromptTemplates[0].prompt);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState(seoPromptTemplates[0].id);
  const [optimizationResult, setOptimizationResult] = useState<{
    beforeScore: number;
    afterScore: number;
    demoPage?: {
      title: string;
      content: string;
      optimized: {
        title: string;
        content: string;
        meta?: {
          description?: string;
          keywords?: string;
        };
      };
      meta?: {
        description?: string;
        keywords?: string;
      };
    };
  } | null>(null);
  
  // Use the optimizationItems from auditData
  const optimizationItems = auditData.optimizationItems || [];
  
  const optimizationCost = auditData?.optimizationCost || 0;
  const pageCount = auditData.pageCount || 15;
  
  // Calculate average cost per page
  const costPerPage = pageCount > 0 ? Math.round(optimizationCost / pageCount) : 0;
  
  const handlePromptTemplateChange = (value: string) => {
    setSelectedPromptTemplate(value);
    const template = seoPromptTemplates.find(t => t.id === value);
    if (template) {
      setSeoPrompt(template.prompt);
    }
  };
  
  const handleOptimize = async () => {
    try {
      setIsProcessing(true);
      
      toast({
        title: "Обработка платежа",
        description: "Пожалуйста, подождите...",
      });
      
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
    if (!seoPrompt.trim()) {
      toast({
        title: "Введите промпт",
        description: "Пожалуйста, введите промпт для оптимизации контента",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsOptimizing(true);
      setOptimizationProgress(0);
      
      toast({
        title: "Оптимизация начата",
        description: "Процесс оптимизации сайта запущен",
      });
      
      // Simulate optimization process with progress updates
      const interval = setInterval(() => {
        setOptimizationProgress(prev => {
          const newProgress = prev + (Math.random() * 2);
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Create demo optimization result when complete
            setTimeout(() => {
              setOptimizationResult({
                beforeScore: 65,
                afterScore: 92,
                demoPage: {
                  title: 'Главная страница',
                  content: 'Наша компания предлагает широкий ассортимент товаров и услуг. Мы работаем на рынке более 10 лет и имеем большой опыт в данной области. Свяжитесь с нами для получения дополнительной информации.',
                  meta: {
                    description: 'Компания предлагает товары и услуги в Москве',
                    keywords: 'товары, услуги, компания'
                  },
                  optimized: {
                    title: 'Качественные товары и профессиональные услуги | Ваш надежный партнер с 2013 года',
                    content: 'ООО "Компания" предлага��т широкий ассортимент высококачественных товаров и профессиональных услуг для бизнеса и частных лиц. За более чем 10 лет работы на рынке мы обслужили свыше 5000 клиентов и реализовали более 200 крупных проектов. Наши с��ециалисты имеют сертификаты и регулярно проходят обучение для повышения квалификации. Свяжитесь с нами сегодня через форму обратной связи или по телефону +7 (XXX) XXX-XX-XX, чтобы получить бесплатную консультацию по вашему проекту.',
                    meta: {
                      description: 'Ведущая компания по предоставлению высококачественных товаров и профессиональных услуг в Москве с 2013 года. Индивидуальный подход, выгодные цены, гарантия качества. Звоните ☎ +7 (XXX) XXX-XX-XX',
                      keywords: 'качественные товары москва, профессиональные услуги, надежная компания, опытные специалисты, индивидуальный подход, гарантия качества'
                    }
                  }
                }
              });
              
              setIsOptimized(true);
              setActiveTab("results");
              
              toast({
                title: "Оптимизация завершена",
                description: "Сайт был успешно оптимизирован для SEO",
              });
            }, 1500);
            
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
    } catch (error) {
      console.error('Optimization error:', error);
      
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось оптимизировать сайт. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadOptimizedSite = async () => {
    console.log("Downloading optimized site");
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pricing">Стоимость и оплата</TabsTrigger>
          <TabsTrigger value="content" disabled={paymentStatus !== 'success' && !isOptimized}>Оптимизация контента</TabsTrigger>
          <TabsTrigger value="results" disabled={!isOptimized}>Результаты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pricing" className="pt-4 space-y-4">
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
            <CardContent className="space-y-4">
              <div className="border border-primary/20 rounded-lg p-4 bg-card/50">
                <h3 className="text-lg font-medium mb-2">Смета работ по оптимизации</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Количество страниц</div>
                    <div className="text-xl font-semibold">{formatNumber(pageCount)}</div>
                  </div>
                  
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Стоимость за страницу</div>
                    <div className="text-xl font-semibold">{formatNumber(costPerPage)} ₽</div>
                    <div className="text-xs text-muted-foreground">(среднее значение)</div>
                  </div>
                  
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Итоговая стоимость</div>
                    <div className="text-xl font-semibold">{formatNumber(optimizationCost)} ₽</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Стоимость включает все работы по техническим и контентным улучшениям: исправление ошибок, 
                  оптимизацию мета-тегов, исправление ссылок, оптимизацию изображений, улучшение структуры 
                  контента и заголовков, оптимизацию текстов для конверсии.
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="mb-4 text-sm"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" /> Скрыть детали
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" /> Показать детали
                    </>
                  )}
                </Button>
                
                {showDetails && optimizationItems && optimizationItems.length > 0 && (
                  <div className="mt-4 mb-6 max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Страница</th>
                          <th className="text-left p-2">Задачи</th>
                          <th className="text-right p-2">Стоимость</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizationItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="p-2 align-top">
                              <div className="truncate max-w-[150px]" title={item.page}>
                                {item.page}
                              </div>
                            </td>
                            <td className="p-2">
                              <ul className="list-disc list-inside">
                                {item.tasks && item.tasks.map((task, idx) => (
                                  <li key={idx} className="truncate text-xs">{task}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-2 text-right">{formatNumber(item.cost)} ₽</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {isOptimized ? (
                    <Button 
                      onClick={handleDownloadOptimizedSite}
                      disabled={isProcessing}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Скачать оптимизированный сайт
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleOptimize}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Обработка...
                        </>
                      ) : (
                        "Заказать оптимизацию"
                      )}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    disabled={isProcessing}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Скачать PDF отчет
                  </Button>
                </div>
              </div>
              
              {paymentStatus === 'success' && !isOptimized && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
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
              
              {paymentStatus === 'error' && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка оплаты</AlertTitle>
                  <AlertDescription>
                    Не удалось провести оплату. Пожалуйста, попробуйте снова.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройка AI-оптимизации</CardTitle>
              <CardDescription>
                Выберите готовый шаблон или создайте собственные инструкции для ИИ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Шаблон для оптимизации</h3>
                  <select 
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={selectedPromptTemplate}
                    onChange={(e) => handlePromptTemplateChange(e.target.value)}
                  >
                    {seoPromptTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Инструкции для ИИ</h3>
                  <textarea
                    className="w-full min-h-[150px] p-3 border border-input rounded-md"
                    value={seoPrompt}
                    onChange={(e) => setSeoPrompt(e.target.value)}
                    placeholder="Введите инструкции для оптимизации контента..."
                  />
                </div>
                
                <Button 
                  onClick={handleStartOptimization} 
                  disabled={isOptimizing}
                  className="w-full"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Оптимизация...
                    </>
                  ) : (
                    "Начать оптимизацию контента"
                  )}
                </Button>
              </div>
              
              {isOptimizing && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Прогресс оптимизации</h3>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${optimizationProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{Math.round(optimizationProgress)}% завер��ено</span>
                    <span>Примерное время: {Math.ceil((100 - optimizationProgress) / 10)} мин</span>
                  </div>
                  
                  {optimizationProgress > 0 && optimizationProgress < 100 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">Текущие действия:</p>
                      <ul className="space-y-1 text-xs">
                        {optimizationProgress > 10 && <li className="text-green-500">✓ Анализ структуры сайта</li>}
                        {optimizationProgress > 20 && <li className="text-green-500">✓ Оптимизация мета-тегов</li>}
                        {optimizationProgress > 30 && <li className="text-green-500">✓ Исправление структуры заголовков</li>}
                        {optimizationProgress > 40 && <li className="text-green-500">✓ Оптимизация URL-структуры</li>}
                        {optimizationProgress > 50 && <li className="text-green-500">✓ Исправление перелинковки</li>}
                        {optimizationProgress > 60 && <li>{optimizationProgress > 70 ? "✓" : "⟳"} Оптимизация изображений</li>}
                        {optimizationProgress > 70 && <li>{optimizationProgress > 80 ? "✓" : "⟳"} Улучшение контента главной страницы</li>}
                        {optimizationProgress > 80 && <li>{optimizationProgress > 90 ? "✓" : "⟳"} Улучшение контента внутренних страниц</li>}
                        {optimizationProgress > 90 && <li>⟳ Финальные проверки и подготовка отчета</li>}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {isOptimized && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Оптимизация завершена</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>Контент сайта был успешно оптимизирован.</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        onClick={() => setActiveTab("results")} 
                        variant="default" 
                      >
                        Просмотреть результаты
                      </Button>
                      <Button 
                        onClick={handleDownloadOptimizedSite} 
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Скачать оптимизированный сайт
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="pt-4">
          {optimizationResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Результаты оптимизации</CardTitle>
                  <CardDescription>
                    Сравнение исходного и оптимизированного сайта
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <motion.div 
                      className="p-4 text-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-2xl font-bold">{optimizationResult.beforeScore}</div>
                      <div className="text-sm">До оптимизации</div>
                    </motion.div>
                    
                    <motion.div
                      className="text-2xl text-muted-foreground"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                    >
                      →
                    </motion.div>
                    
                    <motion.div 
                      className="p-4 text-center rounded-lg bg-green-500/20 text-green-700 dark:text-green-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="text-2xl font-bold">{optimizationResult.afterScore}</div>
                      <div className="text-sm">После оптимизации</div>
                    </motion.div>
                    
                    <motion.div 
                      className="p-4 text-center rounded-lg bg-primary/20 text-primary"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="text-2xl font-bold">+{optimizationResult.afterScore - optimizationResult.beforeScore}</div>
                      <div className="text-sm">Улучшение</div>
                    </motion.div>
                  </div>
                  
                  {optimizationResult.demoPage && (
                    <OptimizationDemo
                      beforeTitle={optimizationResult.demoPage.title}
                      afterTitle={optimizationResult.demoPage.optimized.title}
                      beforeContent={optimizationResult.demoPage.content}
                      afterContent={optimizationResult.demoPage.optimized.content}
                      beforeMeta={optimizationResult.demoPage.meta}
                      afterMeta={optimizationResult.demoPage.optimized.meta}
                      beforeScore={optimizationResult.beforeScore}
                      afterScore={optimizationResult.afterScore}
                    />
                  )}
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button onClick={handleDownloadOptimizedSite}>
                      <Download className="mr-2 h-4 w-4" />
                      Скачать оптимизированный сайт
                    </Button>
                    
                    <Button variant="outline" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Скачать PDF отчет
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Оптимизация успешно завершена</AlertTitle>
                <AlertDescription>
                  Ваш сайт был успешно оптимизирован с помощью ИИ. Показатели SEO значительно улучшены.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to format numbers with thousand separators
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

// Add these functions that were mentioned in the component but might be missing
const handleDownloadOptimizedSite = async () => {
  // Implementation here
  console.log("Downloading optimized site");
};

const handleOptimize = async () => {
  // Implementation here
  console.log("Starting optimization");
};

export default OptimizationSection;
