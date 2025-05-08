
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import SeoAuditForm from '@/components/seo-audit/SeoAuditForm';
import SeoAuditResults from '@/components/SeoAuditResults';
import { withMemo } from '@/components/shared/performance';

const SeoAuditPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditUrl, setAuditUrl] = useState<string | null>(null);

  const handleStartAudit = async (url: string) => {
    setIsLoading(true);
    setAuditUrl(url);
    
    // In a real implementation, we would call an API here
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Layout>
      <Helmet>
        <title>SEO Аудит | Проверка и оптимизация сайта</title>
        <meta name="description" content="Получите детальный SEO аудит вашего сайта с рекомендациями по оптимизации." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!auditUrl || isLoading ? (
            <SeoAuditForm onStartAudit={handleStartAudit} isLoading={isLoading} />
          ) : (
            <SeoAuditResults url={auditUrl} />
          )}
        </div>
      </div>
    </Layout>
  );
};

// Use memoization to prevent unnecessary re-renders
export default withMemo(SeoAuditPage);
