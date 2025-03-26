
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SeoAuditResults from '@/components/SeoAuditResults';
import UrlForm from '@/components/UrlForm';
import { useToast } from "@/hooks/use-toast";

const Audit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      try {
        // Validate URL format
        new URL(urlParam);
        setUrl(urlParam);
      } catch (err) {
        toast({
          title: "Некорректный URL",
          description: "Предоставленный URL некорректен. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
        setUrl('');
      }
    }
  }, [searchParams, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {url ? 'Результаты SEO аудита' : 'Начните SEO аудит'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {url 
              ? `Комплексный анализ ${url}`
              : 'Введите URL вашего сайта для получения детального SEO анализа'
            }
          </p>
        </div>

        {!url && (
          <div className="max-w-2xl mx-auto mb-16">
            <UrlForm />
          </div>
        )}

        {url && <SeoAuditResults url={url} />}
      </div>
    </Layout>
  );
};

export default Audit;
