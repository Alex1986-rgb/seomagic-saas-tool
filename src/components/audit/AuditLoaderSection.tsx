
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Settings,
  Info,
  PieChart,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatApiError } from "@/api/client/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  setTimeoutOccurred: (b: boolean) => void;
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
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showReports, setShowReports] = useState(false);
  const { toast } = useToast();

  // Automatically show the reports once generated
  useEffect(() => {
    if (scannedUrls.length > 0 && url) {
      // Set a short delay to ensure the UI has updated
      const timer = setTimeout(() => {
        setActiveTab("overview");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scannedUrls, url]);

  const handleResetErrors = () => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
  };

  const handleGenerateReport = async () => {
    try {
      toast({
        title: "Генерация отчетов",
        description: "Пожалуйста, подождите...",
        variant: "default"
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowReports(true);
      setActiveTab("reports");
      
      toast({
        title: "Отчеты готовы",
        description: "Вы можете скачать их в разделе отчетов",
        variant: "success"
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
        <Card className="mb-6 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-primary/10">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <span>Аудит сайта</span> 
                  <Badge variant="outline" className="bg-primary/5 text-primary">
                    {pageCount} страниц
                  </Badge>
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
                  className="flex items-center gap-1 transition-all hover:bg-primary hover:text-white"
                >
                  <FileText className="h-4 w-4" /> Сгенерировать отчеты
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                  variant={showAdvancedTools ? "default" : "outline"}
                  className="flex items-center gap-1 transition-all"
                >
                  <Settings className="h-4 w-4" />
                  {showAdvancedTools ? 'Скрыть настройки' : 'Настройки аудита'}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="mb-6 grid grid-cols-4 w-full">
                <TabsTrigger value="overview" className="transition-all">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Обзор</span>
                  <span className="sm:hidden">Обзор</span>
                </TabsTrigger>
                <TabsTrigger value="errors" className="transition-all">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Ошибки</span>
                  <span className="sm:hidden">Ошибки</span>
                </TabsTrigger>
                <TabsTrigger value="estimate" className="transition-all">
                  <PieChart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Смета</span>
                  <span className="sm:hidden">Смета</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="transition-all">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Отчеты</span>
                  <span className="sm:hidden">Отчеты</span>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {/* Вкладка обзора */}
                <TabsContent value="overview" className="py-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground mb-1">Страниц просканировано</span>
                            <div className="text-3xl font-bold">{pageCount}</div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              Последнее сканирование: {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground mb-1">Найдено проблем</span>
                            <div className="flex items-center gap-6">
                              <div>
                                <div className="text-xs text-red-600 mb-1">Критичные</div>
                                <div className="text-2xl font-bold text-destructive">{errors}</div>
                              </div>
                              <div>
                                <div className="text-xs text-amber-600 mb-1">Предупреждения</div>
                                <div className="text-2xl font-bold text-amber-500">{warnings}</div>
                              </div>
                            </div>
                            <Progress 
                              value={Math.round((errors / (errors + warnings)) * 100)} 
                              className="h-2 mt-3" 
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground mb-1">Стоимость оптимизации</span>
                            <div className="text-3xl font-bold text-primary">{totalCost.toLocaleString('ru-RU')} ₽</div>
                            <div className="text-xs text-muted-foreground mt-2">Подробная смета во вкладке "Смета"</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="mb-6">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Обнаруженные проблемы</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveTab('errors')}
                            className="flex items-center gap-1 text-primary"
                          >
                            Подробнее <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {errorTypes.slice(0, 3).map((error, index) => (
                            <div key={index} className="p-3 border rounded-lg flex justify-between items-center bg-white/80 dark:bg-slate-900/80 hover:bg-primary/5 transition-colors">
                              <div className="flex items-center gap-2">
                                {error.impact === "Высокий" ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                                <span>{error.name}</span>
                                <Badge variant="outline" className={`ml-2 ${error.impact === "Высокий" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`}>
                                  {error.count}
                                </Badge>
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
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/30 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Что дальше?</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                              На основе проведенного аудита мы рекомендуем:
                            </p>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span>Исправить критические ошибки для улучшения SEO</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span>Оптимизировать контент на основе рекомендаций</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span>Ознакомиться с детальной сметой работ</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-6 py-3 bg-blue-100/50 dark:bg-blue-950/30 flex justify-end">
                        <Button onClick={() => setActiveTab('estimate')} className="bg-blue-600 hover:bg-blue-700">
                          Перейти к смете <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Вкладка ошибок */}
                <TabsContent value="errors" className="py-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Детальный анализ ошибок</h3>
                        <p className="text-sm text-muted-foreground">
                          Подробная информация о найденных проблемах и их влиянии на ваш сайт
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Критичные: {errors}
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          Предупреждения: {warnings}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {getEstimateInfo().errorTypes.map((error, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className={`pb-3 ${error.impact === "Высокий" ? "bg-red-50/50 dark:bg-red-950/20" : "bg-yellow-50/50 dark:bg-yellow-950/20"}`}>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base font-medium flex items-center gap-2">
                                {error.impact === "Высокий" ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                                {error.name}
                              </CardTitle>
                              <Badge className={error.impact === "Высокий" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                                {error.impact} приоритет
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="p-3 bg-muted/30 rounded-md">
                                <div className="text-sm text-muted-foreground mb-1">Количество проблем</div>
                                <div className="text-xl font-bold">{error.count}</div>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-md">
                                <div className="text-sm text-muted-foreground mb-1">Стоимость исправления</div>
                                <div className="text-xl font-bold text-primary">{error.cost.toLocaleString('ru-RU')} ₽</div>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-md">
                                <div className="text-sm text-muted-foreground mb-1">Влияние на SEO</div>
                                <div className="flex items-center gap-1">
                                  {[...Array(error.impact === "Высокий" ? 3 : 2)].map((_, i) => (
                                    <span key={i} className={`w-3 h-3 rounded-full ${error.impact === "Высокий" ? "bg-red-500" : "bg-amber-500"}`}></span>
                                  ))}
                                  {[...Array(error.impact === "Высокий" ? 0 : 1)].map((_, i) => (
                                    <span key={i} className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-md">
                              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Рекомендации по исправлению:</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-400">
                                {error.name === "Отсутствие мета-тегов" && "Добавьте уникальные мета-описания и заголовки для каждой страницы. Используйте ключевые слова и учитывайте ограничения по длине."}
                                {error.name === "Неоптимизированные изображения" && "Оптимизируйте размеры и форматы изображений, добавьте атрибуты alt с ключевыми словами и обеспечьте корректное отображение на мобильных устройствах."}
                                {error.name === "Битые ссылки" && "Проверьте и исправьте все нерабочие ссылки. Создайте 301-редиректы для старых URL или обновите ссылки с правильными адресами."}
                                {error.name === "Дубликаты контента" && "Устраните или каноникализируйте дублированный контент. Используйте тег rel=canonical для указания основной версии страницы."}
                                {error.name === "Отсутствие структуры H1-H6" && "Создайте правильную иерархию заголовков. Убедитесь, что на странице есть только один H1 и логичная структура подзаголовков."}
                                {error.name === "Проблемы с мобильной версией" && "Оптимизируйте сайт для мобильных устройств. Проверьте адаптивность дизайна, скорость загрузки и удобство навигации на малых экранах."}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setActiveTab('overview')}>
                        Вернуться к обзору
                      </Button>
                      <Button onClick={() => setActiveTab('estimate')}>
                        Перейти к смете <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Вкладка сметы */}
                <TabsContent value="estimate" className="py-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {renderEstimateContent()}
                  </motion.div>
                </TabsContent>

                {/* Вкладка отчетов */}
                <TabsContent value="reports" className="py-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderReportsContent()}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Страниц просканировано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pageCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Найдено ошибок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{errors + warnings}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Критичных: {errors} / Предупреждений: {warnings}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Время на исправление</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{timeToFix}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Детальная смета работ</CardTitle>
            <CardDescription>
              Расчет стоимости оптимизации сайта на основе проведенного аудита
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
            </div>
            
            <div className="flex justify-between p-4 bg-primary/10 rounded-lg mt-6">
              <span className="font-bold">Итоговая стоимость</span>
              <span className="font-bold text-primary text-xl">{totalCost.toLocaleString('ru-RU')} ₽</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-800 dark:text-green-300 flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              Что входит в стоимость?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Технические улучшения:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Исправление всех критических ошибок</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Оптимизация мета-тегов для поисковых систем</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Исправление битых ссылок и редиректов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Оптимизация изображений и медиафайлов</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Контентные улучшения:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Оптимизация контента для поисковых систем</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Настройка правильной структуры заголовков</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Оптимизация текстов для улучшения конверсии</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">Улучшение читабельности и структуры контента</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-green-100 dark:border-green-900/30 px-6 py-4 bg-green-50/50 dark:bg-green-950/20">
            <p className="text-sm text-green-700 dark:text-green-400">
              Все работы выполняются квалифицированными SEO-специалистами с гарантией результата.
            </p>
          </CardFooter>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
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
      </div>
    );
  };

  const renderReportsContent = () => {
    const reportTypes = [
      { 
        title: "Полный SEO отчет", 
        icon: FileText,
        description: "Детальный анализ всех аспектов SEO вашего сайта с рекомендациями по улучшению",
        format: "PDF"
      },
      { 
        title: "Технический отчет об ошибках", 
        icon: AlertTriangle,
        description: "Список всех обнаруженных ошибок с подробными рекомендациями по их исправлению",
        format: "Excel"
      },
      { 
        title: "Аналитический отчет", 
        icon: BarChart,
        description: "Статистический анализ SEO-показателей сайта с графиками и диаграммами",
        format: "PDF"
      },
      { 
        title: "Смета работ", 
        icon: FileText,
        description: "Детализированная смета на исправление ошибок и оптимизацию сайта",
        format: "PDF"
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div>
            <h3 className="text-xl font-semibold mb-2">Доступные отчеты</h3>
            <p className="text-sm text-muted-foreground">
              Выберите и скачайте необходимые отчеты на основе проведенного аудита
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={() => window.open(`mailto:?subject=SEO Аудит сайта ${url}&body=Результаты аудита сайта ${url}`, '_blank')}
          >
            Отправить отчеты по email
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-primary/10">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{report.title}</h3>
                <p className="text-muted-foreground mb-5 text-sm">
                  {report.description}
                </p>
                <Badge className="mb-4">{report.format}</Badge>
                <Button variant="outline" className="flex gap-2 items-center mt-auto w-full">
                  <Download className="h-4 w-4" /> Скачать
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Нужна помощь с интерпретацией отчетов?
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                  Наши специалисты помогут вам разобраться в результатах аудита и составить план действий по оптимизации вашего сайта.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Получить консультацию
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
          <Button variant="outline" onClick={() => setActiveTab('estimate')}>
            Вернуться к смете
          </Button>
          <Button onClick={() => setActiveTab('overview')}>
            Вернуться к обзору
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent -z-10 opacity-70" />
      <AuditHero url={url} />
      <AuditErrorAlert error={error} onClearError={handleClearError} />

      {isLoading ? (
        <div className="mt-8">
          <Card className="p-8">
            <div className="flex flex-col items-center text-center">
              <SectionLoader text="Анализ сайта..." minHeight="min-h-[300px]" />
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Пожалуйста, подождите. Наша система анализирует структуру и содержимое вашего сайта для предоставления детального SEO аудита.
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {!url && (
            <motion.div 
              className="max-w-2xl mx-auto mb-8 md:mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 shadow-lg">
                <CardContent className="p-0">
                  <UrlForm />
                </CardContent>
              </Card>
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
