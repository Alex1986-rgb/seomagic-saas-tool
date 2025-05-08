
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UrlForm from "@/components/url-form";
import AuditHero from "@/components/audit/AuditHero";
import AuditErrorAlert from "@/components/audit/AuditErrorAlert";
import SeoAuditResults from "@/components/SeoAuditResults";
import AuditAdvancedTools from "@/components/audit/AuditAdvancedTools";
import AuditErrorFallback from "./AuditErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { SectionLoader } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Download, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Zap,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatApiError } from "@/api/client/errorHandler";
import { useToast } from "@/hooks/use-toast";

interface AuditLoaderSectionProps {
  url: string;
  error: string | null;
  isLoading: boolean;
  showAdvancedTools: boolean;
  scannedUrls: string[];
  handleClearError: () => void;
  handleUrlsScanned: (urls: string[]) => void;
  setShowAdvancedTools: (b: boolean) => void;
  extractedUrl: React.MutableRefObject<boolean>;
  setTimeoutOccurred: (v: boolean) => void;
  extractUrlParam: () => void;
}

const AuditLoaderSection: React.FC<AuditLoaderSectionProps> = ({
  url,
  error,
  isLoading,
  showAdvancedTools,
  scannedUrls,
  handleClearError,
  handleUrlsScanned,
  setShowAdvancedTools,
  extractedUrl,
  setTimeoutOccurred,
  extractUrlParam
}) => {
  const [showEstimate, setShowEstimate] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showDetailedErrors, setShowDetailedErrors] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { toast } = useToast();

  // Автоматически показывать смету, если есть просканированные URL
  useEffect(() => {
    if (scannedUrls.length > 0 && url) {
      setShowEstimate(true);
    }
  }, [scannedUrls, url]);

  const handleResetErrors = () => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
  };

  const handleGenerateReport = async () => {
    try {
      // Симуляция генерации отчета
      toast({
        title: "Генерация отчетов",
        description: "Пожалуйста, подождите..."
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowReports(true);
      
      toast({
        title: "Отчеты готовы",
        description: "Вы можете скачать их в разделе отчетов"
      });
    } catch (err) {
      const formattedError = formatApiError(err);
      console.error("Ошибка генерации отчета:", formattedError.message);
      
      toast({
        title: "Ошибка генерации отчетов",
        description: formattedError.message,
        variant: "destructive"
      });
    }
  };

  // Примерная смета на основе количества просканированных страниц
  const getEstimateInfo = () => {
    const pageCount = scannedUrls.length || 10; // Если нет просканированных URL, используем 10 для демо
    const baseCost = pageCount <= 50 ? 15000 : pageCount <= 200 ? 30000 : pageCount <= 500 ? 50000 : 80000;
    const errors = Math.floor(pageCount * 0.15); // 15% страниц с ошибками
    const warnings = Math.floor(pageCount * 0.25); // 25% страниц с предупреждениями
    const errorsCost = errors * 300;
    const warningsCost = warnings * 150;
    const totalCost = baseCost + errorsCost + warningsCost;
    
    const timeToFix = pageCount <= 50 ? '3-5 дней' : 
                     pageCount <= 200 ? '7-10 дней' :
                     pageCount <= 500 ? '14-21 день' : '30+ дней';

    // Детализированные ошибки для детального анализа
    const errorTypes = [
      { name: "Отсутствие мета-тегов", count: Math.floor(errors * 0.3), impact: "Высокий", cost: Math.floor(errors * 0.3) * 300 },
      { name: "Неоптимизированные изображения", count: Math.floor(errors * 0.25), impact: "Средний", cost: Math.floor(errors * 0.25) * 250 },
      { name: "Битые ссылки", count: Math.floor(errors * 0.15), impact: "Высокий", cost: Math.floor(errors * 0.15) * 300 },
      { name: "Дубликаты контента", count: Math.floor(errors * 0.1), impact: "Высокий", cost: Math.floor(errors * 0.1) * 350 },
      { name: "Отсутствие структуры H1-H6", count: Math.floor(warnings * 0.4), impact: "Средний", cost: Math.floor(warnings * 0.4) * 150 },
      { name: "Проблемы с мобильной версией", count: Math.floor(warnings * 0.3), impact: "Высокий", cost: Math.floor(warnings * 0.3) * 200 }
    ];
    
    return { 
      pageCount, 
      baseCost, 
      errors, 
      warnings, 
      errorsCost, 
      warningsCost, 
      totalCost, 
      timeToFix,
      errorTypes 
    };
  };

  const renderAuditContent = () => {
    if (!url) return null;

    const { 
      pageCount, 
      errors, 
      warnings, 
      totalCost,
      errorTypes 
    } = getEstimateInfo();

    return (
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <span>Аудит сайта</span> 
                  <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {pageCount} страниц
                  </span>
                </CardTitle>
                <CardDescription className="mt-1 text-sm md:text-base">
                  {url}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleGenerateReport}
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" /> Сгенерировать отчеты
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                  variant={showAdvancedTools ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  {showAdvancedTools ? 'Скрыть настройки' : 'Настройки аудита'}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="mb-4 grid grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="errors">Ошибки</TabsTrigger>
                <TabsTrigger value="estimate">Смета</TabsTrigger>
                <TabsTrigger value="reports">Отчеты</TabsTrigger>
              </TabsList>

              {/* Вкладка обзора */}
              <TabsContent value="overview" className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="stat-card p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 shadow-sm border">
                    <div className="text-sm text-muted-foreground">Страниц просканировано</div>
                    <div className="text-2xl font-bold">{pageCount}</div>
                  </div>
                  <div className="stat-card p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 shadow-sm border">
                    <div className="text-sm text-muted-foreground">Найдено проблем</div>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-xs text-red-600">Критичные</div>
                        <div className="text-xl font-bold text-destructive">{errors}</div>
                      </div>
                      <div>
                        <div className="text-xs text-amber-600">Предупреждения</div>
                        <div className="text-xl font-bold text-amber-500">{warnings}</div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 shadow-sm border">
                    <div className="text-sm text-muted-foreground">Стоимость оптимизации</div>
                    <div className="text-2xl font-bold text-primary">{totalCost.toLocaleString('ru-RU')} ₽</div>
                    <div className="text-xs text-muted-foreground mt-1">Без учета дополнительных работ</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Обнаруженные проблемы</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab('errors')}
                    className="flex items-center gap-1 text-primary"
                  >
                    Подробнее <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-3 mb-6">
                  {errorTypes.slice(0, 3).map((error, index) => (
                    <div key={index} className="p-3 border rounded-lg flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        {error.impact === "Высокий" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <span>{error.name}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${error.impact === "Высокий" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`}>
                          {error.count}
                        </span>
                      </div>
                      <span className="font-medium text-sm">
                        {error.cost.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                  {errorTypes.length > 3 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-center text-muted-foreground hover:text-primary"
                      onClick={() => setActiveTab('errors')}
                    >
                      Показать все проблемы ({errorTypes.length})
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab('estimate')}>
                    Перейти к смете <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Вкладка ошибок */}
              <TabsContent value="errors" className="py-2">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Детальный анализ ошибок</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                        Критичные: {errors}
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                        Предупреждения: {warnings}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {errorTypes.map((error, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium flex items-center gap-2">
                            {error.impact === "Высокий" ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            )}
                            {error.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-sm ${error.impact === "Высокий" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`}>
                            {error.impact} приоритет
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground mb-1">Количество проблем</div>
                            <div className="text-xl font-bold">{error.count}</div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground mb-1">Стоимость исправления</div>
                            <div className="text-xl font-bold text-primary">{error.cost.toLocaleString('ru-RU')} ₽</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('overview')}>
                    Вернуться к обзору
                  </Button>
                  <Button onClick={() => setActiveTab('estimate')}>
                    Перейти к смете <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Вкладка сметы */}
              <TabsContent value="estimate" className="py-2">
                {renderEstimateContent()}
              </TabsContent>

              {/* Вкладка отчетов */}
              <TabsContent value="reports" className="py-2">
                {renderReportsContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderEstimateContent = () => {
    const { 
      pageCount, 
      baseCost, 
      errors, 
      warnings, 
      errorsCost, 
      warningsCost, 
      totalCost, 
      timeToFix 
    } = getEstimateInfo();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat-card p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 shadow-sm border">
            <div className="text-sm text-muted-foreground">Страниц просканировано</div>
            <div className="text-2xl font-bold">{pageCount}</div>
          </div>
          <div className="stat-card p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 shadow-sm border">
            <div className="text-sm text-muted-foreground">Найдено ошибок</div>
            <div className="text-2xl font-bold text-destructive">{errors}</div>
          </div>
          <div className="stat-card p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 shadow-sm border">
            <div className="text-sm text-muted-foreground">Время на исправление</div>
            <div className="text-2xl font-bold">{timeToFix}</div>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between p-3 border-b">
            <span>Базовая стоимость оптимизации</span>
            <span className="font-medium">{baseCost.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Исправление критических ошибок ({errors})</span>
            </div>
            <span className="font-medium">{errorsCost.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Исправление предупреждений ({warnings})</span>
            </div>
            <span className="font-medium">{warningsCost.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between p-4 bg-primary/10 rounded mt-4">
            <span className="font-bold">Итоговая стоимость</span>
            <span className="font-bold text-primary">{totalCost.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Что входит в стоимость?</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Исправление всех критических ошибок</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Оптимизация мета-тегов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Исправление битых ссылок</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Оптимизация контента для поисковых систем</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Настройка правильной структуры заголовков</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button variant="outline" onClick={() => setActiveTab('errors')}>
            Вернуться к анализу ошибок
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleGenerateReport}>
              Скачать смету <Download className="ml-2 h-4 w-4" />
            </Button>
            <Button>
              Заказать оптимизацию <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderReportsContent = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h3 className="text-lg font-medium mb-4">Доступные отчеты</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border rounded-lg flex flex-col items-center text-center bg-white/50 dark:bg-slate-900/50 shadow-sm">
            <div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Полный SEO отчет</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Детальный анализ всех аспектов SEO вашего сайта с рекомендациями по улучшению
            </p>
            <Button variant="outline" className="flex gap-2 items-center mt-auto">
              <Download className="h-4 w-4" /> Скачать PDF
            </Button>
          </div>
          
          <div className="p-5 border rounded-lg flex flex-col items-center text-center bg-white/50 dark:bg-slate-900/50 shadow-sm">
            <div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-primary/10">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Технический отчет об ошибках</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Список всех обнаруженных ошибок с подробными рекомендациями по их исправлению
            </p>
            <Button variant="outline" className="flex gap-2 items-center mt-auto">
              <Download className="h-4 w-4" /> Скачать Excel
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
          <Button variant="outline" onClick={() => setActiveTab('estimate')}>
            Вернуться к смете
          </Button>
          <Button variant="default" onClick={() => window.open(`mailto:?subject=SEO Аудит сайта ${url}&body=Результаты аудита сайта ${url}`, '_blank')}>
            Отправить отчет на почту
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-primary/5 to-transparent -z-10" />
      <AuditHero url={url} />
      <AuditErrorAlert error={error} onClearError={handleClearError} />

      {isLoading ? (
        <SectionLoader text="Анализ сайта..." minHeight="min-h-[300px]" />
      ) : (
        <>
          {!url && (
            <motion.div 
              className="max-w-2xl mx-auto mb-8 md:mb-16 elegant-card p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <UrlForm />
            </motion.div>
          )}
          {url && (
            <>
              <div className="mb-6 md:mb-8">
                <div className="elegant-divider-alt" />
              </div>
              <ErrorBoundary
                FallbackComponent={({ error, resetErrorBoundary }) => (
                  <AuditErrorFallback 
                    error={error} 
                    resetErrorBoundary={resetErrorBoundary}
                    extractedUrlRef={extractedUrl}
                    setTimeoutOccurred={setTimeoutOccurred}
                  />
                )}
                onReset={handleResetErrors}
                resetKeys={[url]}
              >
                <SeoAuditResults url={url} />
                {renderAuditContent()}
              </ErrorBoundary>
              
              {url && (
                <AuditAdvancedTools 
                  url={url}
                  showAdvancedTools={showAdvancedTools}
                  scannedUrls={scannedUrls}
                  onUrlsScanned={handleUrlsScanned}
                  onToggleTools={() => setShowAdvancedTools(!showAdvancedTools)}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLoaderSection;
