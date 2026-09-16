import React from "react";
import { motion } from "framer-motion";
import UrlForm from "@/components/url-form";
import AuditHero from "@/components/audit/AuditHero";
import AuditErrorAlert from "@/components/audit/AuditErrorAlert";
import SeoAuditResults from "@/components/SeoAuditResults";
import AuditAdvancedTools from "@/components/audit/AuditAdvancedTools";
import AuditErrorFallback from "./AuditErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { SectionLoader } from "@/components/ui/loading";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Экран аудита сайта.
 *
 * Раньше поверх настоящих результатов выводился второй, выдуманный аудит:
 * число ошибок бралось как 15 % от количества страниц, предупреждений — 25 %,
 * смета считалась от числа страниц (15 000 ₽ за сайт до пятидесяти страниц,
 * 80 000 ₽ за крупный), а разбивка «отсутствие мета-тегов», «битые ссылки»,
 * «дубликаты контента» распределялась долями от этого же числа. Никакого
 * отношения к сайту пользователя эти цифры не имели — как и «время на
 * исправление: 3–5 дней». Кнопка «Сгенерировать отчёты» ждала полторы секунды
 * и объявляла отчёты готовыми, хотя ничего не готовила.
 *
 * Всё это убрано. Результаты показывает `SeoAuditResults` — он берёт их из
 * настоящего аудита, а смета считается на сервере по найденным замечаниям.
 */

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
  extractUrlParam,
}) => {
  const handleResetErrors = () => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
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
                Идёт обход страниц сайта. Это занимает от нескольких секунд до пары минут —
                в зависимости от того, сколько страниц нужно проверить.
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
              </ErrorBoundary>

              <AuditAdvancedTools
                url={url}
                showAdvancedTools={showAdvancedTools}
                scannedUrls={scannedUrls}
                onUrlsScanned={handleUrlsScanned}
                onToggleTools={() => setShowAdvancedTools(!showAdvancedTools)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLoaderSection;
