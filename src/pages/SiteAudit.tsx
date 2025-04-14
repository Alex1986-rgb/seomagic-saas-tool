
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import SeoAuditResults from '@/components/SeoAuditResults';
import Layout from '@/components/Layout';

const SiteAudit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      try {
        // Validate URL format
        const formattedUrl = urlParam.startsWith('http') ? urlParam : `https://${urlParam}`;
        new URL(formattedUrl); // This will throw if URL is invalid
        setUrl(urlParam);
        setError(null);
      } catch (err) {
        setError("Предоставленный URL некорректен. Пожалуйста, попробуйте снова.");
        toast({
          title: "Некорректный URL",
          description: "Предоставленный URL некорректен. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
      }
    } else {
      setUrl('example.com'); // Demo URL if parameter not provided
    }
    
    // Complete loading in any case
    setIsLoading(false);
  }, [searchParams, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">SEO Аудит сайта</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Полный анализ и рекомендации по оптимизации вашего сайта
          </p>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          ) : (
            <SeoAuditResults url={url} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SiteAudit;
