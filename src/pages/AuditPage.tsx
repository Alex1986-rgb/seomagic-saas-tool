
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuditHero from '@/components/audit/AuditHero';
import UrlForm from '@/components/url-form';
import AuditResultsContainer from '@/components/audit/results/AuditResultsContainer';
import { useAuditDataProvider } from '@/components/audit/results/hooks/useAuditDataProvider';

const AuditPage: React.FC = () => {
  const auditData = useAuditDataProvider(""); // Providing empty string as default URL
  
  return (
    <>
      <Helmet>
        <title>SEO Аудит сайта | SeoMarket</title>
        <meta name="description" content="Профессиональный SEO аудит сайта с рекомендациями по оптимизации" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <AuditHero url="" /> {/* Providing empty string for URL */}
        <div className="mt-8">
          <UrlForm />
        </div>
        <div className="mt-8">
          <AuditResultsContainer url="" />
        </div>
      </div>
    </>
  );
};

export default AuditPage;
