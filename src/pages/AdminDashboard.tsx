
import React from 'react';
import Layout from '@/components/Layout';

const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Эта функция находится в разработке. Скоро здесь появится панель управления для администраторов.
        </p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
