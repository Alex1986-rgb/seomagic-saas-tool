
import React from 'react';
import Layout from '@/components/Layout';
import ClientAudits from '@/components/client/ClientAudits';
import PageSeo from '@/components/seo/PageSeo';

const AuditHistory: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="История SEO-аудитов: все проверки и отчёты по сайтам"
        description="Список запущенных проверок с датами, статусами и оценками. Откройте прошлый аудит, чтобы сравнить результаты и скачать отчёт."
        noindex
      />
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">История аудитов</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Просмотр истории и результатов ваших SEO аудитов
          </p>
          
          <ClientAudits />
        </div>
      </div>
    </Layout>
  );
};

export default AuditHistory;
