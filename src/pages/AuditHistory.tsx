
import React from 'react';
import Layout from '@/components/Layout';
import ClientAudits from '@/components/client/ClientAudits';

const AuditHistory: React.FC = () => {
  return (
    <Layout>
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
