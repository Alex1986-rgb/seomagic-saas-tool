
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SeoAuditResults from '@/components/SeoAuditResults';
import UrlForm from '@/components/url-form';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AuditHero from '@/components/audit/AuditHero';
import AuditErrorAlert from '@/components/audit/AuditErrorAlert';
import AuditAdvancedTools from '@/components/audit/AuditAdvancedTools';

const Audit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const extractUrlParam = useCallback(() => {
    setIsLoading(true);
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      try {
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
    const timer = setTimeout(() => {
      extractUrlParam();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [extractUrlParam]);

  const handleClearError = () => {
    setError(null);
  };

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
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
        
        <AuditHero url={url} />
        
        <AuditErrorAlert 
          error={error} 
          onClearError={handleClearError} 
        />

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
    </Layout>
  );
};

export default Audit;
