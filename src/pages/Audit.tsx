
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SeoAuditResults from '@/components/SeoAuditResults';
import UrlForm from '@/components/url-form';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Rocket, Target, AlertTriangle, Microscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  SimpleSitemapCreatorTool,
  AdvancedAnalysisTools
} from '@/components/audit/deep-crawl';

const Audit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Безопасно извлекаем URL из параметров
  const extractUrlParam = useCallback(() => {
    setIsLoading(true);
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      try {
        // Валидируем URL
        const formattedUrl = urlParam.startsWith('http') ? urlParam : `https://${urlParam}`;
        new URL(formattedUrl);
        setUrl(urlParam);
        setError(null);
      } catch (err) {
        setError("Предоставленный URL некорректен. Пожалуйста, попробуйте снова.");
        toast({
          title: "Некорректный URL",
          description: "Предоставленный URL некорректен. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
        setUrl('');
      }
    } else {
      setUrl('');
    }
    
    setIsLoading(false);
  }, [searchParams, toast]);

  useEffect(() => {
    // Задержка для предотвращения мгновенного рендеринга
    const timer = setTimeout(() => {
      extractUrlParam();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [extractUrlParam]);

  const handleClearError = () => {
    setError(null);
  };

  // Функция для обновления списка URL после сканирования
  const handleUrlsScanned = (urls: string[]) => {
    setScannedUrls(urls);
    if (urls.length > 0) {
      toast({
        title: "Сканирование завершено",
        description: `Обнаружено ${urls.length} URL на сайте`,
      });
      setShowAdvancedTools(true);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
      
      <motion.div 
        className="mb-12 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center px-4 py-2 rounded-sm bg-secondary text-primary font-medium mb-4">
          {url ? <Target className="w-4 h-4 mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
          {url ? 'SEO Анализ' : 'SEO Аудит'}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
          {url ? 'Результаты SEO аудита' : 'Начните SEO аудит'}
        </h1>
        
        <p className="text-lg text-muted-foreground">
          {url 
            ? `Комплексный анализ ${url}`
            : 'Введите URL вашего сайта для получения детального SEO анализа'
          }
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">{error}</AlertDescription>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearError}
              className="ml-auto"
            >
              Закрыть
            </Button>
          </Alert>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
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
              <SeoAuditResults url={url} />
            </>
          )}
          
          {url && (
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Продвинутый технический анализ</h2>
                </div>
                <Button 
                  variant={showAdvancedTools ? "default" : "outline"} 
                  onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                >
                  {showAdvancedTools ? 'Скрыть' : 'Показать'}
                </Button>
              </div>
              
              {showAdvancedTools && (
                <div className="space-y-6">
                  {scannedUrls.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <SimpleSitemapCreatorTool 
                        initialUrl={url} 
                        onUrlsScanned={handleUrlsScanned} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AdvancedAnalysisTools 
                        domain={url.replace(/^https?:\/\//, '')} 
                        urls={scannedUrls} 
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Audit;
