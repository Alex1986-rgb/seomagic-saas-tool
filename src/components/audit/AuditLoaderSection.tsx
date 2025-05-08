
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
import { Download, FileText, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    
    return { pageCount, baseCost, errors, warnings, errorsCost, warningsCost, totalCost, timeToFix };
  };

  const renderEstimateSection = () => {
    if (!showEstimate) return null;
    
    const { pageCount, baseCost, errors, warnings, errorsCost, warningsCost, totalCost, timeToFix } = getEstimateInfo();

    return (
      <motion.div
        className="mb-8 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="elegant-card">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Смета на оптимизацию сайта</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Страниц просканировано</div>
                <div className="text-2xl font-bold">{pageCount}</div>
              </div>
              <div className="stat-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Найдено ошибок</div>
                <div className="text-2xl font-bold text-destructive">{errors}</div>
              </div>
              <div className="stat-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Время на исправление</div>
                <div className="text-2xl font-bold">{timeToFix}</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between p-2 border-b">
                <span>Базовая стоимость оптимизации</span>
                <span className="font-medium">{baseCost.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span>Исправление критических ошибок ({errors})</span>
                <span className="font-medium">{errorsCost.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span>Исправление предупреждений ({warnings})</span>
                <span className="font-medium">{warningsCost.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between p-3 bg-primary/10 rounded mt-4">
                <span className="font-bold">Итоговая стоимость</span>
                <span className="font-bold text-primary">{totalCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowEstimate(false)}>
                Скрыть смету
              </Button>
              <Button>
                Заказать оптимизацию
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderReportsSection = () => {
    if (!showReports) return null;
    
    return (
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="elegant-card">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Доступные отчеты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 border rounded-lg flex flex-col items-center text-center">
                <FileText className="h-12 w-12 text-primary mb-3" />
                <h3 className="text-lg font-medium mb-2">Полный SEO отчет</h3>
                <p className="text-muted-foreground mb-4">Детальный анализ всех аспектов SEO вашего сайта</p>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Download className="h-4 w-4" /> Скачать PDF
                </Button>
              </div>
              <div className="p-4 border rounded-lg flex flex-col items-center text-center">
                <BarChart className="h-12 w-12 text-primary mb-3" />
                <h3 className="text-lg font-medium mb-2">Отчет об ошибках</h3>
                <p className="text-muted-foreground mb-4">Список всех обнаруженных ошибок и рекомендации</p>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Download className="h-4 w-4" /> Скачать Excel
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowReports(false)}>
                Скрыть отчеты
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderDetailedErrorsSection = () => {
    if (!showDetailedErrors) return null;
    
    // Примерные данные для типов ошибок
    const errorTypes = [
      { name: "Отсутствие мета-тегов", count: 12, impact: "Высокий", cost: 3600 },
      { name: "Неоптимизированные изображения", count: 25, impact: "Средний", cost: 3750 },
      { name: "Битые ссылки", count: 8, impact: "Высокий", cost: 2400 },
      { name: "Дубликаты контента", count: 5, impact: "Высокий", cost: 1500 },
      { name: "Отсутствие структуры H1-H6", count: 17, impact: "Средний", cost: 2550 },
      { name: "Проблемы с мобильной версией", count: 10, impact: "Высокий", cost: 3000 }
    ];
    
    return (
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="elegant-card">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Детальный анализ ошибок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errorTypes.map((error, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{error.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-sm ${error.impact === "Высокий" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {error.impact} приоритет
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Количество: <strong>{error.count}</strong></span>
                    <span>Стоимость исправления: <strong>{error.cost.toLocaleString('ru-RU')} ₽</strong></span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowDetailedErrors(false)}>
                Скрыть детали
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderActionButtons = () => {
    // Показываем кнопки действий даже без просканированных URL для демонстрации функциональности
    const shouldShowButtons = Boolean(url) || scannedUrls.length > 0;
    
    if (!shouldShowButtons) return null;
    
    return (
      <motion.div
        className="mb-8 elegant-card p-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {!showEstimate && (
            <Button 
              variant="secondary" 
              onClick={() => setShowEstimate(true)}
              className="flex gap-2 items-center"
            >
              <FileText className="h-4 w-4" /> Показать смету
            </Button>
          )}
          {!showReports && (
            <Button 
              variant="secondary" 
              onClick={handleGenerateReport}
              className="flex gap-2 items-center"
            >
              <BarChart className="h-4 w-4" /> Сгенерировать отчеты
            </Button>
          )}
          {!showDetailedErrors && (
            <Button 
              variant="secondary" 
              onClick={() => setShowDetailedErrors(true)}
              className="flex gap-2 items-center"
            >
              <BarChart className="h-4 w-4" /> Показать детальный анализ
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className="flex gap-2 items-center"
          >
            {showAdvancedTools ? 'Скрыть' : 'Показать'} расширенные инструменты
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
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
              </ErrorBoundary>
              
              {renderActionButtons()}
              {renderEstimateSection()}
              {renderDetailedErrorsSection()}
              {renderReportsSection()}
            </>
          )}
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
    </div>
  );
};

export default AuditLoaderSection;
