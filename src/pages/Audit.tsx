
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SeoAuditResults from '@/components/SeoAuditResults';
import { useSearchParams } from 'react-router-dom';

const AuditPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || '';

  return (
    <>
      <Helmet>
        <title>SEO Аудит | Анализ сайта</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">SEO Аудит</h1>
            <p className="text-muted-foreground">
              Полный анализ и рекомендации по оптимизации сайта
            </p>
          </div>
          
          <SeoAuditResults url={url} />
        </div>
      </div>
    </>
  );
};

export default AuditPage;
