
import React from 'react';
import Layout from '@/components/Layout';

const ClientDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Панель клиента</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Эта функция находится в разработке. Скоро здесь появится панель управления для клиентов.
        </p>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
