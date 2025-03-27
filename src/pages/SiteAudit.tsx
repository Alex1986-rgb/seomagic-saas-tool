
import React from 'react';
import SeoAuditResults from '@/components/SeoAuditResults';

const SiteAudit: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">SEO Аудит сайта</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Полный анализ и рекомендации по оптимизации вашего сайта
        </p>
        
        <SeoAuditResults url="example.com" />
      </div>
    </div>
  );
};

export default SiteAudit;
