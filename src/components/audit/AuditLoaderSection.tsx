
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, PieChart, FileBarChart, AlertCircle } from "lucide-react";

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
  const handleResetErrors = () => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
      
      <AuditHero url={url} />
      <AuditErrorAlert error={error} onClearError={handleClearError} />

      {isLoading ? (
        <SectionLoader text="Анализ сайта..." minHeight="min-h-[300px]" />
      ) : (
        <>
          {!url && (
            <motion.div 
              className="max-w-2xl mx-auto mb-16 elegant-card p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <UrlForm />
            </motion.div>
          )}
          
          {url && (
            <>
              <div className="mb-8">
                <div className="elegant-divider-alt" />
              </div>
              
              <Card className="mb-6 shadow-lg border-primary/20">
                <CardHeader className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>SEO Аудит сайта {url}</CardTitle>
                    <div className="flex space-x-2">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center text-sm text-primary"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> 
                        Комплексный анализ
                      </motion.div>
                    </div>
                  </div>
                  <CardDescription>
                    Полный анализ и рекомендации по оптимизации сайта
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-wrap md:flex-nowrap">
                      <TabsTrigger value="general"><PieChart className="h-4 w-4 mr-2" /> Общий анализ</TabsTrigger>
                      <TabsTrigger value="technical"><AlertCircle className="h-4 w-4 mr-2" /> Технический аудит</TabsTrigger>
                      <TabsTrigger value="content"><FileBarChart className="h-4 w-4 mr-2" /> Анализ контента</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="mt-0">
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
                    </TabsContent>
                    
                    <TabsContent value="technical" className="mt-0">
                      <div className="bg-muted/30 rounded-lg p-8 text-center">
                        <h3 className="text-xl font-medium mb-2">Технический аудит</h3>
                        <p className="text-muted-foreground">
                          Подробные данные будут доступны после завершения сканирования
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="content" className="mt-0">
                      <div className="bg-muted/30 rounded-lg p-8 text-center">
                        <h3 className="text-xl font-medium mb-2">Анализ контента</h3>
                        <p className="text-muted-foreground">
                          Информация о качестве и оптимизации контента будет доступна после завершения сканирования
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
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
