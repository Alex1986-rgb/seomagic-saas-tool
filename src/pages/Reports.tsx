
import React from 'react';
import Layout from '@/components/Layout';
import ClientReports from '@/components/client/ClientReports';

const Reports: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Отчеты и документы</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Управление отчетами и документами по SEO аудиту
          </p>
          
          <ClientReports />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
